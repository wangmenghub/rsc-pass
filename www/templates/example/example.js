angular.module('rsc.example', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })

        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }
            }
        })

        .state('app.browse', {
                url: '/browse',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/browse.html'
                    }
                }
            })
            .state('app.lab', {
                url: '/lab',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/lab.html'
                    }
                }
            })
            .state('app.playlists', {
                url: '/playlists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlists.html',
                        controller: 'PlaylistsCtrl'
                    }
                }
            })

        .state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlaylistCtrl'
                    }
                }
            })
            // ///////////////////////5.0.0///////////////////////////
            .state('app.lineList', {
                url: '/lineList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/example/lineList.html',
                        //  controller: 'PlaylistsCtrl'
                    }
                }
            }) //物流列表
            .state('app.publishLine', {
                url: '/publishLine',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/example/publishLine.html',
                        //  controller: 'PlaylistsCtrl'
                    }
                }
            }) //发布线路
            .state('app.transportList', {
                url: '/transportList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/example/transportList.html',
                        //  controller: 'PlaylistsCtrl'
                    }
                }
            }) //运输列表
            .state('app.replenish', {
                url: '/replenish',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/example/replenish.html',
                        //  controller: 'PlaylistsCtrl'
                    }
                }
            }) // 补货
            .state('app.car_detail', {
                url: '/car_detail',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/example/car_detail.html',
                        //  controller: 'PlaylistsCtrl'
                    }
                }
            }) // 司机车辆详情
            // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });