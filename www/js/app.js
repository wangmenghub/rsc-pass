// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'starter.controllers',
    'restangular',
    'ngCordova',
    'timer',
    'ionic-toast',
    'ionic-timepicker',
    'ionic-datepicker',
    'ngMessages',
    'angular-image-404',
    'atlasProgress',
    'rsc.common.services.public',
    'rsc.service.common.bak',
    // 'ionic-datePicker',

    'rsc.development.config', //内网
    // 'rsc.development.config.test',//外网测试
//    'rsc.production.config',//外网正式
    // 'rsc.production.config.test',//演示

    // 要改部分！！！

    'rsc.service.common',
    'rsc.service.phone',
    'rsc.service.rest',
    'rsc.app.common.account',
    'rsc.areas',
    'rsc.pass', //物流
    'rsc.example',
    'rsc.manager.page'//IM
])

    .value('AppVersion', '2.0.2')

    .run(function ($ionicPlatform, $rootScope, $timeout, $log, Storage, $ionicHistory, $ionicConfig, $filter, $state, $cordovaDevice, $q, $cordovaStatusbar, AccountInformation, ionicToast, EventRegister, Jpush, MsgServiceAngular, $location, $cordovaAppVersion, $ionicViewSwitcher, $cordovaInAppBrowser, AccountSev, iAlert, $cordovaBarcodeScanner, $cordovaBadge, TrafficWebIMService, TrafficContactService, PassSellService, GlobalService, $interval) {

        $ionicPlatform.ready(function () {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
                // cordova.plugins.yimPlugin.receiveMessageCallback(function (e) { alert(e); console.log(e); });
            }
            $rootScope.shareAppKey = 'pass';
            switch ($rootScope.shareAppKey) {
                case 'rsc':
                    $rootScope.rscAppName = 'com.rsc.tradecenter';
                    break;
                case 'zgy':
                    $rootScope.rscAppName = 'com.zgy365.zgy';
                    break;
                case 'pass':
                    $rootScope.rscAppName = 'com.rsc.dispatcenter';
                    break;
                default:
                    $rootScope.rscAppName = 'com.zgy365.zgy';
                    break;
            }
            //用于判断平台
            $rootScope.rscPlatform = 'isapp';
            $rootScope.rscScan = function () {
                $cordovaBarcodeScanner.scan({
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: true, // iOS and Android
                    showTorchButton: true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    prompt: "扫一扫", // Android
                    resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                    orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations: true, // iOS
                    disableSuccessBeep: false // iOS
                }).then(function (result) {
                    if (result.text != '') {
                        $rootScope.scan_data = result.text.split("&")
                        if (!$rootScope.scan_data[1]) {
                            $rootScope.scan_data[1] = 'TRAFFIC_DRIVER_PRIVATE'
                        }
                        $rootScope.rootGoDetail($rootScope.scan_data[1], $rootScope.scan_data[0])
                    }

                }, function (error) {
                    alert("请重新扫描");
                })
            }


            // ThreeDeeTouch.configureQuickActions([

            // ])
            //3D trouch
            document.addEventListener('deviceready', function () {
                ThreeDeeTouch.onHomeIconPressed = function (payload) {
                    console.log("Icon pressed. Type: " + payload.type + ". Title: " + payload.title + ".");
                    if ($rootScope.currentUser.user.role != 'TRAFFIC_ADMIN') {
                        if (payload.type == 'publish') {
                            $state.go('trade.common_publish_type')
                        } else if (payload.type == 'grab') {
                            if ($rootScope.currentUser.user.role == 'TRADE_SALE') {
                                $state.go('trade.sale_grab')
                            } else if ($rootScope.currentUser.user.role == 'TRADE_PURCHASE') {
                                $state.go('trade.buy_offer')
                            } else {
                                $state.go('trade.sale_grab')
                            }

                        } else if (payload.type == 'code') {
                            $state.go('trade.my_code')
                        } else if (payload.type == 'accout') {
                            $state.go('trade.finance_survey')
                        } else if (payload.type == 'scan') {
                            $rootScope.rscScan();
                        } else {
                            // hook up any other icons you may have and do something awesome (e.g. launch the Camera UI, then share the image to Twitter)
                            console.log(JSON.stringify(payload));
                        }
                    }

                }
            }, false);

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
                // $cordovaStatusbar.overlaysWebView(false);
                // $cordovaStatusbar.style(1);
                // StatusBar.styleLightContent();
            }

            if (ionic.Platform.isWebView()) {
                $rootScope.rscPlatform = 'isapp';

                $rootScope.device_uuid = $cordovaDevice.getUUID();
                //初始化推送插件
                Jpush.init({
                    debug: false,
                    onSetTagsWithAlias: function () {
                        $log.debug('app.onSetTagsWithAlias', arguments)
                    },
                    onOpenNotificationInAndroidCallback: function (data) {
                        // window.alert(JSON.stringify(data))
                        $log.debug('app.onOpenNotificationInAndroidCallback', JSON.stringify(data));
                        // alert(JSON.stringify(data))
                        if (data.extras.url) {
                            $state.go(data.extras.url, JSON.parse(data.extras.params));
                        }
                    },
                    onGetRegistrationID: function (result) {
                        $rootScope.uuid = result;
                        $log.debug('app.onGetRegistrationID', result)
                    },
                    onOpenNotification: function (data) {
                        $log.debug('app.onOpenNotification', JSON.stringify(data))
                        if (data.url) {
                            $state.go(data.url, data.params)
                        }
                    }
                });
            } else {
//                $rootScope.rscPlatform = 'isweb';
                  $rootScope.rscPlatform = 'isapp';
            }

        });
        // $ionicConfig.views.swipeBackEnabled(false);
        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($state.current.name == "login" || $rootScope.backButtonPressedOnceToExit) {
                navigator.app.exitApp(); //<-- remove this line to disable the exit
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
                navigator.app.backHistory();
            }
        }, 100);

        var loadState = null
        var toLoadState = null
        var param = null

        $rootScope.$state = $state;
        $rootScope.rootState = null
        $rootScope.Platform = ionic.Platform;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, roParams, fromState, fromParams) {
            $log.debug('$stateChangeSuccess', arguments);
            loadState = $rootScope.loadState = fromState
            toLoadState = toState
            param = fromParams;

            //更新消息提示小红点
            GlobalService.getMsgCout().then(function (result) {
                if (result.data != undefined) {
                    $rootScope.msgCout = result.data;
                }
            });
        });

        $rootScope.$on('$stateChangeError', function (event, toState, roParams, fromState, fromParams, error) {
            $log.error('$stateChangeError', error);
            switch (error.msg) {
                case 'no_login':
                    //未登录
                    $state.go('login_guide', {});
                    // $state.go('login', {}, {
                    //     notify: false
                    // });
                    break;
                case 'logined':
                    //已经登录，根据角色跳转对应的页面
                    console.log(error.data.user.role)
                    switch (error.data.user.role) {
                        case "TRAFFIC_ADMIN":
                            $state.go('rsc.center_goods') // 物流
                        default:
                            $log.error('未知类型')
                    }
                    break;
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, roParams, fromState, fromParams) {
            $log.debug('$stateChangeStart', arguments);
        });

        $rootScope.$on('upload_RegistrationID', function () {
            $ionicPlatform.ready(function () {
                if (ionic.Platform.isWebView()) {
                    $cordovaAppVersion.getPackageName().then(function (package) {
                        var appPackage = package;
                        if (!$rootScope.uuid) {
                            Jpush.getRegistrationID(function (uuid) {
                                var all = MsgServiceAngular.allUrl('push/add');
                                all.post({
                                    uuid: uuid,
                                    package_name: appPackage
                                }).then(function (result) {
                                    $log.debug('发送uuid到服务端' + uuid, JSON.stringify(result))
                                    if (result.status == "success") {
                                        $log.debug('发送uuid成功', JSON.stringify(result))
                                    } else {
                                        $log.error('发送uuid失败', JSON.stringify(result))
                                    }
                                })
                            })
                        } else {
                            $log.debug('有rootuuid', $rootScope.uuid)
                            var all = MsgServiceAngular.allUrl('push/add');
                            all.post({
                                uuid: $rootScope.uuid,
                                package_name: appPackage
                            }).then(function (result) {
                                if (result.status == "success") {
                                    $log.debug('发送uuid成功', JSON.stringify(result))
                                } else {
                                    $log.error('发送uuid失败', JSON.stringify(result))
                                }
                            })
                        }

                    });

                    var versionSetUp = !Storage.get('VersionSetUp')
                    if (ionic.Platform.isAndroid() && versionSetUp) {
                        $cordovaAppVersion.getVersionNumber().then(function (version) {
                            // window.alert($scope.version)
                            AccountSev.getAppVersionNumber(version).then(function (result) {
                                console.log(result)
                                var options = {
                                    location: 'no',
                                    clearcache: 'yes',
                                    toolbar: 'yes'
                                };
                                if (result.status == 'success' && result.data.version != version) {
                                    if ($rootScope.currentUser.user.role != 'TRAFFIC_ADMIN') {
                                        var version_dec = result.data.rsc_version_dec
                                        var link = result.data.rsc
                                    } else {
                                        var version_dec = result.data.traffic_version_dec
                                        var link = result.data.traffic
                                    }
                                    if (result.data.is_forced == 1) { // 0 不强制更新  1 强制更新
                                        var ver = result.data.version
                                        iAlert.confirm('', '最新版本:' + ver + '<br>' + '更新内容:' + '<br>' + version_dec, function () {
                                            window.open(link, "_system", "location=yes,enableViewportScale=yes,hidden=no")
                                        }, function () {
                                            navigator.app.exitApp();
                                        })
                                    } else {
                                        if (result.data == false) {

                                        } else {
                                            var ver = result.data.version
                                            iAlert.confirm('是否更新', '最新版本:' + ver + '<br>' + '更新内容:' + '<br>' + version_dec, function (res) {
                                                if (res) {
                                                    window.open(link, "_system", "location=yes,enableViewportScale=yes,hidden=no")
                                                }
                                            }, function () {
                                                Storage.set('VersionSetUp', true)
                                            })
                                        }
                                    }
                                } else {
                                    iAlert.log(result);
                                }
                            })
                        })
                    }
                }
            })
        });

        EventRegister.init();

        $rootScope.$on('initUserInfo', function () {
            var userInfo = Storage.get('userInfo');
            if (userInfo) {
                //当前登陆用户的信息
                $rootScope.currentUser = userInfo;
                //当前公司信息
                $rootScope.currentCompanyInfo = userInfo.company;
                $rootScope.$emit('upload_RegistrationID');
            }
        });

        var userInfo = Storage.get('userInfo');
        if (userInfo) {

            //当前登陆用户的信息
            $rootScope.currentUser = userInfo;
            AccountInformation.update_token().then(function (res) {
                if (res.status == 'err') {
                    ionicToast.show(res.msg, 'middle', false, 2500);
                    // $state.go('login', {}, {
                    //     notify: false
                    // });
                    $state.go('login_guide', {}, {
                        // notify: false
                    });
                }
            })
            //当前公司信息
            $rootScope.currentCompanyInfo = userInfo.company;
            $rootScope.$emit('upload_RegistrationID');
        }
        $rootScope.rscBadge = 0;
        var timer = $interval(function () {
            $rootScope.currentUser = Storage.get('userInfo');
            if ($rootScope.currentUser) {

                PassSellService.getBadgeCount().then(function (result) {
                    if (result.status == 'success') {
                        if ($rootScope.unreadMsg) {
                            $rootScope.rscBadge = result.data.all_total + $rootScope.unreadMsg;
                        } else {
                            $rootScope.rscBadge = result.data.all_total;
                        }
                        $cordovaBadge.set($rootScope.rscBadge).then(function () {
                            // You have permission, badge set.
                        }, function (err) {
                            // You do not have permission.
                        });
                    } else {
                        $log.error('获取物流推送个数', result)
                    }
                })
            }

        }, 600000);   //间隔10分钟定时执行
        $rootScope.$on('destroy', function () {
            $interval.cancel(timer);
        })  //在控制器里，添加$on函数


        $rootScope.rootGoBack = function () {
            $log.debug('rootGoBack', $ionicHistory)
            $ionicHistory.goBack();
        }

        $rootScope.changeType = function () {
            var toState = toLoadState
            var state = loadState
            if (toState.name.slice(0, 3) != state.name.slice(0, 3)) {
                return false
            } else {
                return true
            }
        }

        $rootScope.goMenuClose = function (state, params, params1) {
            if (!arguments[0]) {
                state = loadState
            }
            if (!arguments[1]) {
                params = param
            }
            console.log(params)
            if (!state) {
                $rootScope.rootGoBack()
            }
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableAnimate: false
            });

            $rootScope.rootState = null
            console.log(state, $rootScope.rootState)
            $state.go(state, params, params1);
            $ionicViewSwitcher.nextDirection("back")
        }

        $rootScope.rootGoDetail = function (type, id) {
            console.log(type, id)
            if (type == 'TRADE' || type == 'PURCHASE' || type == 'SALE'||type == 'TRAFFIC') {
                $state.go('rsc.company_page', {
                    id: id,
                    type:type
                })
            }  else if (type == 'TRADE_ADMIN' || type == 'TRADE_PURCHASE' || type == 'TRADE_SALE' || type == 'TRAFFIC_ADMIN' || type == 'TRAFFIC_DRIVER_PRIVATE'||type == 'TRADE_STORAGE'||type == 'TRAFFIC_DRIVER_PUBLISH') {
                if($location.path!='person_page'){
                    $state.go('rsc.person_page', {
                        id: id,
                        type: type
                    })
                }

            }
        }


        $rootScope.rootAddMap = function (province, city, addr, district) {

            $state.go('rsc.traffic_add_map', {
                province: province,
                city: city,
                addr: addr,
                district: district
            })
        }

        $rootScope.$on('updataMsgCount', function (event, args) {
            //更新消息提示小红点
            GlobalService.getMsgCout().then(function (result) {
                if (result.data != undefined) {
                    $rootScope.msgCout = result.data;
                }
            });
        })


    })
    .config(function ($provide, $stateProvider, $urlRouterProvider, RestangularProvider, ENV, $httpProvider, $ionicConfigProvider, ionicTimePickerProvider, ionicDatePickerProvider) {



        $ionicConfigProvider.scrolling.jsScrolling(true);
        /*$provide.decorator('ionicToast', function ($delegate) {
            $delegate.goMenuClose = function (state, params, params1) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });

                this.go(state, params, params1);
            };
            return $delegate;
        });*/

        // $provide.decorator('$state', function ($delegate) {
        //     $delegate.goMenuClose = function (state, params, params1) {
        //         $ionicHistory.nextViewOptions({
        //             historyRoot: true,
        //             disableAnimate: true
        //         });

        //         this.go(state, params, params1);
        //     };
        //     return $delegate;
        // });

        RestangularProvider.setBaseUrl(ENV.api.account);

        $httpProvider.interceptors.push('AuthInterceptor');

        $httpProvider.interceptors.push(function ($q, $rootScope) {
            var ruquestInfo = '';
            return {
                request: function (config) {
                    ruquestInfo = {
                        thaturl: config.url,
                        thatparam: config.data
                    }
                    return config;//放行
                },
                response: function (res) {
                    //拦截几个请求，当该请求执行的时候，则更新消息
                    var urlArr = [
                        'plan_c/get_list',
                        'demand_c/find',
                        'order_c/get_list',
                        'driver_demand_c/get_list',
                        'driver_order_c/get_list'
                    ];
                    var thaturl = ruquestInfo.thaturl;
                    var thatparam = ruquestInfo.thatparam;
                    for (var i = 0; i < urlArr.length; i++) {
                        if (thaturl.indexOf(urlArr[i]) != -1 && thatparam.is_refresh) {
                            $rootScope.$emit('updataMsgCount')
                        }
                    }
                    return res;
                }
            }
        });

        // android 导航底部配置
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('ios');


        var timePickerObj = {
            inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
            format: 12,
            step: 15,
            setLabel: 'Set',
            closeLabel: 'Close'
        };
        ionicTimePickerProvider.configTimePicker(timePickerObj);


        var datePickerObj = {
            inputDate: new Date(),
            setLabel: '确定',
            todayLabel: '今天',
            closeLabel: '关闭',
            mondayFirst: false,
            weeksList: ["日", "一", "二", "三", "四", "五", "六"],
            monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
            templateType: 'popup',
            from: new Date(2012, 8, 1),
            to: new Date(2018, 8, 1),
            showTodayButton: true,
            dateFormat: 'yyyy年 MM月 dd日',
            closeOnSelect: false,
            disableWeekdays: [],
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
        // $ionicConfigProvider.views.swipeBackEnabled(false);
        //网页版时将此打开
//        if(!ionic.Platform.isWebView()){
//        $ionicConfigProvider.views.transition('none');
//        }
        //全局禁用页面缓存
        $ionicConfigProvider.views.maxCache(0);
        // android 导航底部配置结束
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login_guide');

    });
