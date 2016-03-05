(function wrapper(angular) {
    'use strict';
    angular.module('loadingButton', [])
        .directive('loadingButton', function loadingButtonDirective() {
            return {
                restrict: 'EA',
                scope: {
                    label: '=loadingButton',
                    isLoading: '=',
                    useEllipses: '@'
                },
                template: '<span ng-switch="isLoading">' +
                '<i class="glyphicon glyphicon-refresh glyphicon-spin" ng-switch-when="true"></i>' +
                '<span ng-switch-default>{{ label }}</span></span>'
            };
        });
}(window.angular));
(function wrapper(angular) {
    'use strict';
    angular.module('Middle', ['ngAnimate', 'ngTouch', 'ui.router', 'ui.bootstrap', 'angular-clipboard', 'spinner', 'loadingButton'])
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
                            if (groupMember.active) {
                                bounds.extend(new google.maps.Marker({
                                    position: {
                                        lat: groupMember.latitude,
                                        lng: groupMember.longitude
                                    },
                                    map: map,
                                    label: groupMember.name,
                                    title: groupMember.name
                                }).getPosition());
                            }
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
        .provider('centerService', function centerServiceProvider() {
            return {
                $get: [function $get() {
                    return {
                        center: function (groupMembers, algorithm) {
                            var i, lat = 0, lng = 0, numActive = 0;
                            switch (algorithm) {
                                default:
                                    for (i = 0; i < groupMembers.length; i++) {
                                        if (groupMembers[i].active) {
                                            lat += groupMembers[i].latitude;
                                            lng += groupMembers[i].longitude;
                                            numActive++;
                                        }
                                    }
                                    lat /= numActive;
                                    lng /= numActive;
                                    break;
                            }
                            return [lat, lng, 15];
                        }
                    };
                }]
            };
        })
        .controller('UserMenuController', ['$scope', '$uibModal', function UserMenuController($scope, $uibModal) {
            $scope.my = {
                username: 'ofuangka',
                logoutUrl: '.'
            };
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
        .controller('GroupListController', ['$scope', '$uibModal', function GroupListController($scope, $uibModal) {
            $scope.showCreateGroup = function showCreateGroup() {
                $uibModal.open({
                    templateUrl: 'partials/create-group.html',
                    controller: 'CreateGroupController',
                    scope: $scope
                });
            };
            $scope.groups = [
                {id: '0-ref', name: 'Dooty', numMembers: 4, ts: (new Date()).getTime()},
                {id: '1-ref', name: 'Booger', numMembers: 6, ts: (new Date()).getTime()}
            ];
        }])
        .controller('CreateGroupController', ['$scope', function CreateGroupController($scope) {
            $scope.userDidCreateGroup = function userDidCreateGroup() {
                $scope.isCreatingGroup = true;
                $scope.$close();
            };
        }])
        .controller('GroupDetailsController', ['$scope', '$window', '$timeout', '$stateParams', '$uibModal', function GroupDetailsController($scope, $window, $timeout, $stateParams, $uibModal) {
            function didRetrievePosition(position) {
                /* TODO: send the user's position */
                /* TODO: once the request is successful, add/replace the user's position in the member list */
            }

            function sendPosition() {
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

            $scope.isActive = function isActive(member) {
                return member.active;
            };
            $scope.toggle = function toggle(member) {
                member.active = !member.active;
            };
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
            $scope.copyUrl = 'http://middle-me.appspot.com/ui/#/groups/' + $stateParams.groupId;
            $scope.members = [
                {
                    id: '0-ref',
                    name: 'ofuangka',
                    latitude: 40.0442507,
                    longitude: -75.3882961,
                    ts: (new Date()).getTime(),
                    active: true
                },
                {
                    id: '1-ref',
                    name: 'tracylvalenzuela',
                    latitude: 40.0065617,
                    longitude: -75.2649071,
                    ts: (new Date()).getTime(),
                    active: true
                },
                {
                    id: '2-ref',
                    name: 'forrestjacobs',
                    latitude: 40.079362,
                    longitude: -75.3039367,
                    ts: (new Date()).getTime(),
                    active: true
                }
            ];
            $scope.algorithms = [
                {name: 'simple', link: 'https://en.wikipedia.org/wiki/Center_of_mass'},
                {name: 'trossian', link: 'http://stackoverflow.com/a/17225597'}
            ];
            $scope.selectedAlgorithm = $scope.algorithms[0];

            /* TODO: if the user has not yet sent their position, send it */
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
}(window.angular));
(function wrapper(angular) {
    'use strict';
    angular.module('spinner', [])
        .directive('spinner', function spinnerDirective() {
            return {
                restrict: 'E',
                template: '<p class="text-center"><i class="glyphicon glyphicon-refresh glyphicon-spin"></i></p>'
            };
        })
}(window.angular));