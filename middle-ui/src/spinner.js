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