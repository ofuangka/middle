(function wrapper(angular) {
    'use strict';
    angular.module('Middle')
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
        .provider('User', function UserProvider() {
            return {
                $get: ['$resource', function UserServiceFactory($resource) {
                    var User = $resource('/api/users/:id');
                    return angular.extend({
                        self: User.get({id: 'self'})
                    }, User);
                }]
            };
        });
}(window.angular));