(function wrapper(angular, io) {
    'use strict';
    angular.module('Middle', ['ngResource', 'ngAnimate', 'ngTouch', 'ui.router', 'ui.bootstrap', 'angular-clipboard', 'spinner', 'loadingButton'])
        .config(['$stateProvider', '$urlRouterProvider', function configFn($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/groups');
            $stateProvider.state('groupList', {
                url: '/groups',
                templateUrl: 'partials/group-list.html'
            });
            $stateProvider.state('groupDetails', {
                url: '/groups/:groupId',
                templateUrl: 'partials/group-details.html'
            });
        }])
        .filter('members', ['$filter', function membersFilterFactory($filter) {
            return function membersFilter(data) {
                var ret = data;
                if (angular.isNumber(data)) {
                    ret += ' member';
                    if (data === 0 || data > 1) {
                        ret += 's';
                    }
                }
                return ret;
            };
        }])
        .filter('groupListDate', ['$filter', function groupListDateFilterFactory($filter) {
            return function groupListDate(data) {
                var midnight = new Date(),
                    date;
                midnight.setHours(0, 0, 0, 0);
                if (angular.isDate(data)) {
                    date = data;
                } else if (angular.isNumber(data)) {
                    date = new Date(data);
                } else if (angular.isString(data)) {
                    date = Date.parse(data);
                } else {
                    return $filter('date')(data);
                }
                if (date >= midnight) {
                    return $filter('date')(data, 'mediumTime');
                } else {
                    return $filter('date')(data, 'shortDate');
                }
            };
        }])
        .filter('capitalize', function capitalizeFilterFactory() {
            return function capitalize(data) {
                if (angular.isString(data) && data.length > 0) {
                    return data.charAt(0).toUpperCase() + data.slice(1);
                }
                return data;
            };
        })
        .directive('middleMap', ['$filter', 'centerService', function middleMapFactory($filter, centerService) {
            return {
                restrict: 'EA',
                link: function linkFn(scope, element, attrs) {
                    function parametersDidChange() {
                        var center = centerService.center(scope.groupMembers, scope.algorithm.name),
                            map,
                            bounds = new google.maps.LatLngBounds(),
                            centerPin,
                            infoWindow;

                        /* create the map, centered around the center pin */
                        map = new google.maps.Map(element[0], {
                            center: {
                                lat: center[0],
                                lng: center[1]
                            },
                            zoom: center[2]
                        });

                        /* drop pins for each group member */
                        angular.forEach(scope.groupMembers, function iterator(groupMember) {
                            bounds.extend(new google.maps.Marker({
                                position: {
                                    lat: groupMember.lat,
                                    lng: groupMember.lng
                                },
                                map: map,
                                label: groupMember.username,
                                title: groupMember.username
                            }).getPosition());
                        });

                        /* drop the center pin */
                        centerPin = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: {
                                lat: center[0],
                                lng: center[1]
                            },
                            map: map
                        });

                        /* zoom the map to the area that the pins fall */
                        map.fitBounds(bounds);

                        /* create the info window */
                        infoWindow = new google.maps.InfoWindow({
                            content: '<h4>/middle/</h4><p>' +
                            $filter('number')(center[0]) + ', ' +
                            $filter('number')(center[1]) +
                            '</p><p><a href="https://www.google.com/maps/?q=restaurants&sll=' +
                            center[0] + ',' + center[1] +
                            '" target="_blank">Search nearby this location...</a></a></p>'
                        });
                        centerPin.addListener('click', function userDidClickCenterPin() {
                            infoWindow.open(map, centerPin);
                        });

                        /* open the info window */
                        infoWindow.open(map, centerPin);
                    }

                    scope.$watch('[groupMembers, algorithm]', parametersDidChange, true);
                },
                scope: {
                    groupMembers: '=middleMap',
                    algorithm: '='
                }
            };
        }])
        .controller('UserMenuController', ['$scope', '$uibModal', 'User', function UserMenuController($scope, $uibModal, User) {
            $scope.my = User.self;
            $scope.showAboutMiddle = function showAboutMiddle() {
                $uibModal.open({
                    templateUrl: 'partials/about-middle.html',
                    controller: 'AboutController',
                    scope: $scope
                });
            };
            $scope.showWhatsNew = function showWhatsNew() {
                $uibModal.open({
                    templateUrl: 'partials/whats-new.html',
                    controller: 'WhatsNewController',
                    scope: $scope
                });
            };
        }])
        .controller('GroupListController', ['$scope', '$uibModal', 'Group', function GroupListController($scope, $uibModal, Group) {
            $scope.showCreateGroup = function showCreateGroup() {
                $scope.newGroup = {};
                $uibModal.open({
                    templateUrl: 'partials/create-group.html',
                    controller: 'CreateGroupController',
                    scope: $scope
                });
            };
            $scope.groups = Group.own;
            $scope.isLoadingGroups = function isLoadingGroups() {
                return Group.own.$promise.$$state.status === 0;
            };
        }])
        .controller('CreateGroupController', ['$scope', '$q', '$state', 'Group', function CreateGroupController($scope, $q, $state, Group) {
            $scope.userDidCreateGroup = function userDidCreateGroup() {
                $scope.isCreatingGroup = true;
                $q.all([Group.save($scope.newGroup).$promise, Group.own.$promise])
                    .then(function promiseDidResolve(results) {
                        results[1].push(results[0]);
                        $state.go('groupDetails', {
                            groupId: results[0].id
                        });
                        $scope.$close();
                        $scope.isCreatingGroup = false;
                    });
            };
        }])
        .controller('GroupDetailsController', ['$scope', '$window', '$timeout', '$location', '$q', '$interval', '$state', '$stateParams', '$uibModal', 'User', 'Group', 'Member', function GroupDetailsController($scope, $window, $timeout, $location, $q, $interval, $state, $stateParams, $uibModal, User, Group, Member) {

            function didRetrievePosition(position) {
                Member.save({
                    groupId: $scope.selectedGroup.id
                }, {
                    groupId: $scope.selectedGroup.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }).$promise.then(function promiseDidResolve(result) {

                    /* send the update to the websocket */
                    ws.send(JSON.stringify(result));
                    $scope.isLoadingPosition = false;
                });
            }

            function sendPosition() {
                $scope.isLoadingPosition = true;
                if ($window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(didRetrievePosition);
                } else {
                    $uibModal.open({
                        templateUrl: 'partials/message.html',
                        controller: 'NoGeolocationMessageController',
                        scope: $scope,
                        size: 'sm'
                    });
                }
            }

            function isUserInGroup() {
                var i, len;
                for (i = 0, len = $scope.selectedGroup.members.length; i < len; i++) {
                    if (User.self.id === $scope.selectedGroup.members[i].userId) {
                        return true;
                    }
                }
                return false;
            }

            var ws = new WebSocket('ws://middle-ws.herokuapp.com');
            ws.onmessage = function serverDidSendMessage(message) {
                var member = JSON.parse(message.data);

                /* replace the member if it already exists */
                var i, len, members = $scope.selectedGroup.members, memberExists;
                for (i = 0, len = members.length; i < len; i++) {
                    if (members[i].id === member.id) {
                        members.splice(i, 1, member);
                        memberExists = true;
                        break;
                    }
                }
                if (!memberExists) {
                    $scope.selectedGroup.members.push(member);
                }
                $scope.$digest();
            };
            var stop = $interval(function pingWebSocket() {
                ws.send('"ping"');
            }, 30000);
            $scope.$on('destroy', function onDestroy() {
                $interval.cancel(stop);
            });

            $scope.openNew = function openNew(url) {
                $window.open(url, '_blank');
            };
            $scope.copyDidSucceed = function copyDidSucceed() {
                $scope.showCopySuccessTooltip = true;
                $timeout(function hideTooltip() {
                    $scope.showCopySuccessTooltip = false;
                }, 1000);
            };
            $scope.copyDidFail = function copyDidFail(err) {
                $uibModal.open({
                    templateUrl: 'partials/message.html',
                    controller: 'CopyFailedMessageController',
                    scope: $scope,
                    size: 'sm'
                });
            };
            $scope.selectAlgorithm = function selectAlgorithm(algorithm) {
                $scope.selectedAlgorithm = algorithm;
            };
            $scope.resendPosition = sendPosition;
            $scope.copyUrl = $location.absUrl();
            $scope.algorithms = [
                {name: 'simple', link: 'https://en.wikipedia.org/wiki/Center_of_mass'},
                {name: 'trossian', link: 'http://stackoverflow.com/a/17225597'}
            ];
            $scope.selectedAlgorithm = $scope.algorithms[0];
            $scope.isLoadingMembers = true;
            $q.all([Group.own.$promise, User.self.$promise]).then(function promiseDidResolve(results) {
                var i, len, group;

                /* check that this group exists in the user's own list */
                $scope.selectedGroup = null;
                for (i = 0, len = Group.own.length; i < len; i++) {
                    group = Group.own[i];
                    if (group.id === $stateParams.groupId) {
                        $scope.selectedGroup = group;
                        $scope.isLoadingMembers = false;
                        break;
                    }
                }

                /* if the group doesn't exist, send them back to the list screen */
                if ($scope.selectedGroup === null) {
                    $state.go('groupList');
                } else {

                    /* if the user doesn't appear in the group yet, try to send the location */
                    if (!isUserInGroup()) {
                        sendPosition();
                    }
                }
            });
            $scope.isSelf = function isSelf(member) {
                return User.self.id === member.userId;
            };
        }])
        .controller('AboutController', ['$scope', function AboutController($scope) {
            $scope.activeSlide = 0;
        }])
        .controller('WhatsNewController', ['$scope', function WhatsNewController($scope) {
            $scope.updates = [
                {
                    ts: (new Date()).getTime(),
                    descriptions: [
                        'Initial application creation.',
                        'Integrated with Google Maps.',
                        'Group List view',
                        'Group Details view'
                    ]
                }
            ];
        }])
        .controller('NoGeolocationMessageController', ['$scope', function NoGeolocationMessageController($scope) {
            $scope.title = 'Unable to retrieve your location';
            $scope.message = 'We couldn\'t determine your location for some reason. Feel free to try again.';
        }])
        .controller('CopyFailedMessageController', ['$scope', function CopyFailedMessageController($scope) {
            $scope.title = 'Could not copy URL';
            $scope.message = 'We couldn\'t copy the URL for some reason. You may have to do it the old fashioned way.';
        }]);
}(window.angular, window.io));