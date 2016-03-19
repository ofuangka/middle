(function wrapper(angular) {
    'use strict';
    angular.module('Middle')
        .provider('centerService', function centerServiceProvider() {
            return {
                $get: [function $get() {
                    return {
                        center: function (groupMembers, algorithm) {
                            var i, lat = 51.5287352, lng = -0.3817794, numActive = 0;
                            if (groupMembers) {
                                lat = 0;
                                lng = 0;
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
        })
        .provider('Group', function GroupProvider() {
            return {
                $get: ['$resource', function GroupServiceFactory($resource) {
                    var Group = $resource('/api/groups/:id');
                    return angular.extend({
                        own: Group.query({own: true})
                    }, Group);
                }]
            };
        });
}(window.angular));