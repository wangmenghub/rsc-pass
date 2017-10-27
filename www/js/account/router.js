angular.module('rsc.account.router', ['ionic'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('login_guide', {
                url: '/login_guide',
                templateUrl: 'js/account/template/login_guide.html',
                controller: 'login_in_ctrl as vm',
                resolve: {
                    auth: ["$q", "AuthenticationService", "$log", "jwtHelper", function ($q, AuthenticationService, $log, jwtHelper) {
                        var userInfo = AuthenticationService.getUserInfo();
                        // 如果本地有token且token有效则不通过
                        if (userInfo && !jwtHelper.isTokenExpired(userInfo.token)) {
                            return $q.reject({
                                msg: 'logined',
                                data: userInfo
                            });
                        } else {
                            return $q.when({});
                        }
                    }]
                }
            })
            // 登录
            .state('login', {
                url: '/login',
                templateUrl: 'js/account/template/login.html',
                controller: 'login_in_ctrl as vm',
                resolve: {
                    auth: ["$q", "AuthenticationService", "$log", "jwtHelper", function ($q, AuthenticationService, $log, jwtHelper) {
                        var userInfo = AuthenticationService.getUserInfo();
                        // 如果本地有token且token有效则不通过
                        if (userInfo && !jwtHelper.isTokenExpired(userInfo.token)) {
                            return $q.reject({
                                msg: 'logined',
                                data: userInfo
                            });
                        } else {
                            return $q.when({});
                        }
                    }]
                }
            })

            //注册
            .state('register', {
                url: '/register',
                templateUrl: 'js/account/template/register.html',
                controller: 'register_ctrl as vm'
            })


            //设置运输
            .state('reg_buy', {
                url: '/reg_buy?new',
                templateUrl: 'js/account/template/reg_buy.html',
                controller: 'reg_buy_ctrl as vm',
            })


            // 用户协议
            .state('reg_agreement', {
                url: '/reg_agreement',
                templateUrl: 'js/account/template/reg_agreement.html',
            })
    })
