angular.module('rsc.personpage', [
    'rsc.config',
    'rsc.common.service.rest',
    'ui.router'
])
    .config(function ($stateProvider) {
        $stateProvider
            // 个人主页
            .state('rsc.person_page', {
                url: "/person_page?id?type?sidebar",
                // cache: false,
                views: {
                    'center-content': {
                        templateUrl: "js/module/personpage/template/person_page.html",
                        controller: 'person_page_ctrl as vm'
                    }
                }
            })
    })
    .service('PersonPageService', ['ENV', 'AccountRestAngular', 'DynamicAngular', 'WebIMAngular',
        function (ENV, AccountRestAngular, DynamicAngular, WebIMAngular) {
            return {
                //获取个人信息
                userInfo: function (id, types) {
                    var all = AccountRestAngular.allUrl('user/get_personal_homepage');
                    return all.post({
                        user_id: id,
                        types: types
                    });
                },
                //获取动态
                GeTabCount: function (data) {
                    var all = DynamicAngular.allUrl('company_dynamic/get_list_count');
                    return all.post(data);
                },
                //企业主页背影图
                backImg: function (data) {
                    var all = AccountRestAngular.allUrl('company/add_bg');
                    return all.post(data);
                },
                GetDynamic: function (data) {
                    var all = DynamicAngular.allUrl('company_dynamic/get_list_dt');
                    return all.post(data);
                },
                /**
                 * 点赞
                 *
                 * @param {any} dynamic_id
                 * @returns
                 */
                AddPraise: function (dynamic_id) {
                    var all = DynamicAngular.allUrl('company_dynamic/add_praise');
                    return all.post({
                        dynamic_id: dynamic_id
                    });
                },
                GetCount: function () {
                    var all = DynamicAngular.allUrl('company_dynamic/get_list_count');
                    return all.post();
                },
                messageRead: function (user_id, number) {
                    var all = WebIMAngular.allUrl('im/read');
                    return all.post({
                        user_id: user_id,
                        number: number
                    });
                },
                getStatus: function (user_id) {
                    var all = AccountRestAngular.allUrl('user/get_personal_homepage_status');
                    return all.post({
                        user_id: user_id
                    });
                },
                addRelation: function (user_id, friend, status) {
                    var all = AccountRestAngular.allUrl('apply_relation/homepage_supply');
                    return all.post({
                        user_id: user_id,
                        friend: friend,
                        status: status
                    });
                }
            }
        }
    ])
    .controller('person_page_ctrl', ['$scope', '$rootScope', '$ionicLoading', '$timeout', '$stateParams', 'ShareWeChat', 'ShareHelpNew', 'ENV', 'ionicToast', 'PersonPageService', 'Storage', 'TradeMeUtils', '$ionicHistory', '$state', 'iAlert', '$window', 'RscAlert', '$ionicViewSwitcher','$ionicModal',
        function ($scope, $rootScope, $ionicLoading, $timeout, $stateParams, ShareWeChat, ShareHelpNew, ENV, ionicToast, PersonPageService, Storage, TradeMeUtils, $ionicHistory, $state, iAlert, $window, RscAlert, $ionicViewSwitcher,$ionicModal) {

            var vm = $scope.vm = this;
            vm.url_type = $stateParams.type
            var MAXLINK = 5
            vm.init = function () {

                reset()
                PersonPageService.userInfo(vm.id, vm.role).then(function (data) {
                    if (data.status == 'success') {

                        vm.userInfo = data.data
                        if(vm.myStorageInfo.user.post){
                           vm.userInfo.user.post = vm.myStorageInfo.user.post;
                         }
                        if (vm.userInfo.company) {
                            vm.com_id = vm.userInfo.company._id
                        }
                        console.log(vm.com_id)
                        if (vm.userInfo.user.role != 'TRAFFIC_ADMIN') {
                            vm.comType = 'TRADE'
                        } else {
                            vm.comType = 'TRAFFIC'
                        }
                        console.log(data.data)
                        vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
                        $scope.shareInfo = {

                            msg: {
                                url: "http://" + ENV.shareHost + '/personHome.html?' + vm.userInfo.user._id + "." + $rootScope.shareAppKey,
                                // description: '',
                                // type: '【物流抢单】',
                                description: '邀请您在线进行交易',
                                tagName: 'rsc',
                                img: vm.userInfo.user.photo_url ? vm.userInfo.user.photo_url : vm.myUrl
                            },
                            opts: {
                                hideSms: false,
                                type: '',
                                params: {}

                            },
                            params: {
                                route: {
                                    // type: 'trafficDemand',
                                    id: vm.userInfo.user._id
                                }
                            }
                        }

                        if (!vm.userInfo.company || !vm.userInfo.company.nick_name) {
                            $scope.shareInfo.msg.title = vm.userInfo.user.real_name;
                        } else {
                            $scope.shareInfo.msg.title = vm.userInfo.user.real_name;
                        }
                    }
                }).then(
                    function () {
                        if(vm.role == 'TRAFFIC_DRIVER_PUBLISH'||vm.role == 'TRAFFIC_DRIVER_PRIVATE'){
                            return false
                        }
                        PersonPageService.getStatus(vm.id).then(function (res) {
                            if (res.status == 'success') {
                                console.log(res)
                                vm.status = res.data.status
                            } else {
                                console.log(res)
                            }
                            // 修改网速慢显示方法
                            vm.chatShow = true
                        })
                        if (vm.url_type == 'TRAFFIC_ADMIN') {
                            vm.tabSwitch('traffic_driver_demand')
                        } else {
                            if (vm.role != 'TRADE_PURCHASE') {
                                vm.tabSwitch('trade_pricing')
                            } else if (vm.role != 'TRADE_SALE') {
                                vm.tabSwitch('trade_demand')
                            } else if(vm.role == 'TRADE_STORAGE'){
                                vm.tabSwitch('TRAFFIC')
                            }else {
                                vm.tabSwitch('traffic_demand')
                            }
                        }

                        PersonPageService.GeTabCount({ 'user_id': vm.id }).then(function (res) {
                            if (res.status == 'success') {
                                vm.count = res.data
                                console.log(vm.count)
                            } else {

                            }
                        })

                    }
                    )


                $scope.shareAction = function () {
                    ShareHelpNew.initShare($scope, $scope.shareInfo);
                    $scope.show();
                };


            }
            //路由跳转
            vm.goRoute = function (list, user_id, company_id) {
                if (list.list.type == 'DJ') {
                    if (vm.companyInfo.type == 'TRADE') {
                        if (vm.userinfo_self.user._id == user_id) {
                            $state.go('rsc.offerDetails', { id: list.list._id, deal: 'sell' })
                        } else if (vm.company_id == company_id) {
                            $state.go('rsc.offerDetails', { id: list.list._id, deal: 'colleague' })
                        } else {
                            $state.go('rsc.offerDetails', { id: list.list._id, deal: 'buy' })
                        }
                        $ionicViewSwitcher.nextDirection("forward")
                    }

                } else if (list.list.type == 'demand') {
                    if (vm.companyInfo.type == 'TRADE') {
                        if (vm.company_id == company_id) {
                            $state.go('rsc.grab_detail_offer', { id: list.list._id, type: 'self' })
                        } else {
                            $state.go('rsc.grab_detail_offer', { id: list.list._id, type: 'other' })
                        }
                        $ionicViewSwitcher.nextDirection("forward")
                    }
                } else if (list.list.dt_type == 'traffic_demand') {
                    if (vm.companyInfo.type == 'TRADE') {
                        if (vm.userinfo_self.user._id == user_id) {
                            $state.go('rsc.assign', { id: list.list._id, status: 'valid' })
                        }
                    } else {
                        var newlist = list.list.verify_company.concat(list.list.unoffer_list)
                        angular.forEach(newlist, function (assgin_company) {
                            if (assgin_company == vm.company_id) {
                                console.log(list.list._id)
                                $state.go('rsc.goods_detail', { demand_id: list.list._id, isGoBack:true})
                            } else {
                                ionicToast.show('该订单没有指派您，无法查看', 'middle', false, 2500);
                            }
                        })
                    }

                }
            }
            // 切导航
            vm.tabSwitch = function (type) {
                // $location.hash('')
                // $ionicScrollDelegate.anchorScroll();
                if (vm.type == type) {
                    return false
                } else {
                    vm.content = []
                    vm.loading = true
                    vm.exist = true
                    vm.page = 1
                    if (vm.userInfo.user.role == 'TRADE_STORAGE') {
                        vm.type = 'address'
                    } else {
                        vm.type = type;
                    }
                    getDynamic()
                }

            }
           // 点赞
            vm.isPraise = function (id, users, isPraised, showPraise, index) {

                PersonPageService.AddPraise(id).then(function (res) {
                    if (res.status == 'success') {
                        isPraised = !isPraised
                        showPraise = false
                        if (isPraised == true) {
                            users.push({
                                real_name: vm.userInfo.user.real_name
                            })
                        } else {
                            var i = users.indexOf({
                                real_name: vm.userInfo.user.real_name
                            })
                            if (i == 0) {
                                users.shift();
                            } else if (i == users.length - 1) {
                                users.pop();
                            } else {
                                users.splice(i, 1);
                            }
                        }
                        vm.content[index].isPraised = isPraised
                        vm.content[index].showPraise = showPraise
                        vm.content[index].users = users
                    }
                })
            }

            // 加载更多
            vm.loadMore = function () {

                // $ionicLoading.show({
                //     template: "正在加载数据中..."
                // })
                vm.loading = true
                vm.page++;
                vm.exist = false
                getDynamic(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $timeout(function () {
                        // $ionicLoading.hide();
                        vm.loading = false
                    }, 1000)
                    if (!vm.content.length && vm.link < MAXLINK) {
                        // 循环加载
                        vm.link++
                        vm.loadMore()
                    } else {
                        vm.link = 0
                    }
                })
            }

            // 电话
            vm.callPhone = function (mobilePhone) {
                if (vm.userInfo.friend) {
                    ionicToast.show('暂不是好友，无法通话', 'middle', false, 2500);
                } else {
                    if (ionic.Platform.isWebView()) {
                        console.log("拨打:" + mobilePhone);
                        window.plugins.CallNumber.callNumber(function (e) {
                            console.log(e)
                        }, function (e) {
                            console.log(e)
                        }, mobilePhone, true)
                    } else {
                        RscAlert.alert('电话：' + mobilePhone);
                    }

                }
            }

            // 聊天
            vm.chat = function () {
                $rootScope.chat('p2p-' + vm.id, 'p2p', vm.role, vm.userInfo.user.real_name)
            }
            // 加关系
            vm.addRelation = function (type) {
                if (type == 'supply') {
                    get_role(vm.status, function (status) {
                        addRelation(status)
                    })
                } else if (type == 'friend') {
                    addRelation('')
                }

            }


            // 初始化
            function reset() {

                // 个人信息
                vm.userInfo = Storage.get('userInfo')
                vm.myStorageInfo = Storage.get('userInfo');
                vm.companyInfo = Storage.get('userInfo').company
                vm.company_id = vm.userInfo.company._id
                vm.userinfo_self = Storage.get('userInfo');
                vm.userRole = vm.userInfo.user.role
                vm.userId = vm.userInfo.user._id
                vm.photo_url = vm.userInfo.user.photo_url

                // 访问者信息
                vm.other_id = $stateParams.id
                vm.other_role = $stateParams.type

                vm.id = vm.other_id && (vm.other_id != vm.userId) ? vm.other_id : vm.userId
                vm.role = vm.other_role && (vm.other_role != vm.userRole) ? vm.other_role : vm.userRole
                vm.operate = (vm.userId == vm.id) && true
                console.log(vm.id, vm.role)

                vm.page = 1
                vm.message = 0
                vm.date = null
                vm.content = []
                vm.loading = true
                vm.exist = true

                if (_.isBoolean($rootScope.vip)) {
                    vm.vip = $rootScope.vip
                } else if (!!$rootScope.currentCompanyInfo && _.isBoolean($rootScope.currentCompanyInfo.vip)) {
                    vm.vip = $rootScope.currentCompanyInfo.vip
                } else {
                    vm.vip = !!Storage.get('userInfo').company.vip
                }
            }

            // 获取个人动态
            function getDynamic(cb) {
                // 新消息
                PersonPageService.GetCount().then(function (res) {
                    vm.message = res.data.count
                    vm.lastInfo = res.data.photo_url
                })
                // 列表详情
                var obj = {}
                obj.page = vm.page
                obj.user_id = vm.id
                obj.type = vm.type
                PersonPageService.GetDynamic(obj).then(function (res) {
                    if (res.status == 'success') {
                        vm.loading = false
                        vm.exist = res.data.exist
                        var tmp = res.data.list;
                        vm.address_store = res.data.count;
                        angular.forEach(tmp, function (data) {
                            data.list.time_creation = data.list.time_creation.split('T')[0]
                            if (vm.date != data.list.time_creation) {
                                vm.date = data.list.time_creation
                            } else {
                                delete (data.list.time_creation)
                            }
                            data.list.data = vm.date
                            data.list.newData = filterData(data.list.data)

                        })
                        vm.content = vm.content.concat(tmp)
                        // vm.cache = JSON.parse(JSON.stringify(vm.content))
                    } else {

                    }
                }).then(function () {
                    if (_.isFunction(cb)) {
                        return cb()
                    } else {
                        return false
                    }
                })

            }


            function filterData(data) {
                var newData = {}
                if (data.product_categories) {
                    newData.layer_1_chn = data.product_categories[0].layer_1_chn
                    newData.layer_2_chn = data.product_categories[0].layer_2_chn
                    newData.pass_unit = data.product_categories[0].pass_unit

                    if (data.price_routes && data.price_routes[0]) {
                        newData.price_min = data.price_routes[0].min
                        newData.price_max = !!data.price_routes[0].max ? data.price_routes[0].max : ''
                        newData.price_routes = data.price_routes[0]
                    }

                }
                return newData
            }


            // 加关系
            function addRelation(status) {
                PersonPageService.addRelation(vm.id, !!vm.userInfo.friend, status).then(function (res) {
                    console.log(res)
                    if (res.status == 'success') {
                        ionicToast.show('请等待对方同意', 'middle', false, 2500);
                    } else {
                        ionicToast.show(res, 'middle', false, 2500);
                    }
                })
            }

            // 角色弹出框
            function get_role(status, callback) {
                if (status == 'TRADE_TRAFFIC') {
                    $scope.popup_lists = [{
                        chn: '合作物流方',
                        eng: 'TRADE_TRAFFIC'
                    }]
                } else if (status == 'PURCHASE_SALE') {
                    $scope.popup_lists = [{
                        chn: '合作销售商',
                        eng: 'PURCHASE_SALE'
                    }]
                } else if (status == 'SALE_PURCHASE') {
                    $scope.popup_lists = [{
                        chn: '合作采购商',
                        eng: 'SALE_PURCHASE'
                    }]
                } else if (status == 'TRADE_ADMIN') {
                    $scope.popup_lists = [{
                        chn: '合作采购商',
                        eng: 'SALE_PURCHASE'
                    }, {
                        chn: '合作销售商',
                        eng: 'PURCHASE_SALE'
                    }]
                } else if (status == 'TRAFFIC_TRADE') {
                    $scope.popup_lists = [{
                        chn: '合作交易方',
                        eng: 'TRAFFIC_TRADE'
                    }]
                } else {
                    $scope.popup_lists = [{
                        chn: '合作采购商',
                        eng: 'SALE_PURCHASE'
                    }, {
                        chn: '合作销售商',
                        eng: 'PURCHASE_SALE'
                    }, {
                        chn: '合作物流方',
                        eng: 'TRADE_TRAFFIC'
                    }
                    ];
                }
                var object = {
                    templateUrl: 'js/common/template/popupRadio.html',
                    title: '申请合作'
                };
                var objmsg = {
                    type: 'radio'
                };

                iAlert.tPopup($scope, object, objmsg, function (res) {
                    if (res) {
                        console.log(res)
                        var status = res.subtype.eng
                        callback(status)
                    }
                })
            };


            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })
            $ionicModal.fromTemplateUrl('./js/src/common/modal/driver_card.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {

            };
            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            vm.open = function () {
                vm.init();
                $scope.modal.show();
            }


            vm.closeModal = function () {
                $scope.modal.hide();
            }

        }
    ])
