(function () {
    "use strict"
    angular.module('rsc.controller.traffic_join_company', [])
        .controller('traffic_join_company_ctrl', ['$scope', '$state', '$stateParams', '$interval', '$ionicHistory', 'iAlert', 'ionicToast', 'TrafficCompanyModify', 'AccountSev', 'Storage','$ionicLoading','$timeout',
            function ($scope, $state, $stateParams, $interval, $ionicHistory, iAlert, ionicToast, TrafficCompanyModify, AccountSev, Storage,$ionicLoading,$timeout) {
                var vm = $scope.vm = this
                var currentName = $stateParams.name
                var timer = null
                vm.init = function () {
                    vm.search_list = Storage.get('companyList') || [] // 搜索公司列表
                    vm.name = ''
                    vm.exist = true
                    vm.page = 1
                    console.log(vm.search_list)
                    Storage.remove('companyList');
                }

                vm.search = function (name) {
                    name = name.replace(/(^\s+)|(\s+$)/g, "")
                    if (name) {
                        TrafficCompanyModify.verifyCompany(name).then(function (res) {
                            console.log(res.data)
                            if (res.status == 'success') {
                                if( page == 1){
                                    vm.search_list = res.data.list
                                }else{
                                    vm.search_list = vm.search_list.concat(res.data.list)
                                }
                            }

                        })
                    } else {
                        return false
                    }
                }

                vm.loadMore = function () {
                    $ionicLoading.show({
                        template: "正在加载数据中..."
                    })
                    !!vm.name ? vm.name : vm.name = currentName
                    vm.page++;
                    vm.search(vm.name, vm.page)
                    //停止事件广播
                    timer = $timeout(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $ionicLoading.hide();
                    }, 2000);
                };

                $scope.$on("$destroy", function () {
                    //clearTimeout(timer.$$timeoutId);
                    $timeout.cancel(timer);
                    //清除配置,不然scroll会重复请求
                });

                // // 角色弹出框
                // function get_role(id, callback) {
                //     $scope.popup_lists = [{
                //         chn: '同事-采购',
                //         eng: 'TRADE_PURCHASE'
                //     }, {
                //         chn: '同事-销售',
                //         eng: 'TRADE_SALE'
                //     }, {
                //         chn: '同事-超管',
                //         eng: 'TRADE_ADMIN'
                //     }
                //     ];
                //     var object = {
                //         templateUrl: 'js/common/template/popupRadio.html',
                //         title: '选择加入角色'
                //     };
                //     var objmsg = {
                //         type: 'radio'
                //     };
                //     iAlert.tPopup($scope, object, objmsg, function (res) {
                //         if (res) {
                //             console.log(res)
                //             var _data = {
                //                 company_id: id,
                //                 role: res.subtype.eng
                //             };
                //             callback(_data)
                //         }
                //     })
                // };

                vm.joinCompany = function (id, verify_phase) {

                    if(verify_phase != 'SUCCESS'){
                        ionicToast.show('该企业未认证！需等待认证成功后方可加入', 'middle', false, 3000);
                        return false
                    }

                    var _data = {
                        company_id: id
                    };
                    // get_role(id, function (data) {
                    TrafficCompanyModify.joinCompany(_data).then(function (res) {
                        console.log(res)
                        if (res.status == 'success') {
                            vm.userInfo = Storage.get('userInfo');

                            AccountSev.companyInfo().then(function (res) {
                                if (res.status == 'success') {
                                    vm.userInfo.company = res.data
                                }
                                Storage.set('userInfo', vm.userInfo);
                            })
                        }
                        var n = 3
                        $interval(function () {
                            n--
                            if (n == 0) {
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true,
                                    disableAnimate: false
                                });
                                $state.go('rsc.center_goods')
                            }
                        }, 1000)
                        ionicToast.show('等待审核', 'middle', false, 3000);
                    })
                }
            }
        ])
        .controller('traffic_verify_company_ctrl', ['$scope', '$rootScope', '$state', 'ionicToast', 'Storage', '$stateParams', 'iAlert', 'AuthenticationService', 'TrafficCompanySettingService', 'TrafficCompanyModify',
            function ($scope, $rootScope, $state, ionicToast, Storage, $stateParams, iAlert, AuthenticationService, TrafficCompanySettingService, TrafficCompanyModify) {
                var vm = $scope.vm = this

                vm.init = function () {
                    AuthenticationService.checkToken().then(function (user) {
                        TrafficCompanySettingService.companyInfo().then(function (res) {
                            console.log('公司信息', res);
                            if (res.status == 'success') {
                                user.company = res.data
                                Storage.set('userInfo', user)
                                // $rootScope.currentCompanyInfo = res.data
                                // $rootScope.currentUser.company = $rootScope.currentCompanyInfo
                                vm.verify = res.data.verify_phase
                            } else {
                                vm.verify = 'NO'
                            }

                        })

                    }, function () {
                        ionicToast.show('获取个人信息失败，请重新登录', 'middle', false, 2500)
                        $state.go('login_guide');
                    })
                }

                function search_company(callback) {
                    var object = {
                        templateUrl: 'js/common/template/companyNickname.html',
                        title: '请输入公司名称'
                    };
                    var objmsg = {
                        type: 'post'
                    };
                    iAlert.tPopup($scope, object, objmsg, function (res) {
                        if (res) {
                            var name = res.post
                            callback(name)
                        }
                    })
                }

                vm.search_company = function () {
                    search_company(function (name) {
                        if (name) {
                            name = name.replace(/(^\s+)|(\s+$)/g, "")
                            TrafficCompanyModify.verifyCompany(name).then(function (res) {
                                console.log(res.data)
                                if (res.status == 'success') {
                                    vm.search_list = res.data.list
                                    if (vm.search_list.length != 0) {
                                        Storage.set('companyList', vm.search_list);
                                    }
                                    $state.go('rsc.traffic_join',{ name: name })
                                } else {
                                    return false
                                }
                            })
                        } else {
                            return false
                        }
                    })
                }

                // $scope.$on("$ionicView.beforeEnter", function () {
                //     $rootScope.tradeListen()
                // })

            }
        ])

})()
