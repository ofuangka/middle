(function wrapper(angular) {
    'use strict';
    angular.module('Middle', ['ui.router', 'ui.bootstrap'])
        .config(['$stateProvider', '$urlRouterProvider', function configFn($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('groupList', {
                url: '/',
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
        .controller('UserMenuController', ['$scope', '$uibModal', function UserMenuController($scope, $uibModal) {
            $scope.my = {
                username: 'ofuangka',
                logoutUrl: '.'
            };
            $scope.showAboutMiddle = function showAboutMiddle() {
                $uibModal.open({
                    templateUrl: 'partials/about-middle.html'
                });
            };
            $scope.showWhatsNew = function showWhatsNew() {
                $uibModal.open({
                    templateUrl: 'partials/whats-new.html'
                });
            };
            $scope.showPreferences = function showPreferences() {
                $uibModal.open({
                    templateUrl: 'partials/preferences.html',
                    controller: 'PreferencesController',
                    scope: $scope
                });
            }
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
                {id: '0-ref', name: 'Dooty', numMembers: 4, ts: (new Date()).getTime() },
                {id: '1-ref', name: 'Booger', numMembers: 6, ts: (new Date()).getTime() }
            ];
        }])
        .controller('CreateGroupController', ['$scope', function CreateGroupController($scope) {

        }])
        .controller('PreferencesController', ['$scope', function PreferencesController($scope) {

        }])
        .controller('GroupDetailsController', ['$scope', '$stateParams', function GroupDetailsController($scope, $stateParams) {
            var disabledMembers = {};
            $scope.isActive = function isActive(member) {
                return !disabledMembers[member.id];
            };
            $scope.toggle = function toggle(member) {
                disabledMembers[member.id] = !disabledMembers[member.id];
            };
            $scope.copyUrl = 'http://middle-me.appspot.com/ui/#/groups/' + $stateParams.groupId;
            $scope.members = [
                { id: '0-ref', name: 'ofuangka', latitude: 50.02, longitude: 30.30 }
            ];
        }]);
}(window.angular));