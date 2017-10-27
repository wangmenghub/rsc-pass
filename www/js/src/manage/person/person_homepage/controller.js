(function () {
    
        angular.module('rsc.controller.traffic_person', [])
            .controller('traffic_person_homepage_ctrl', ['$scope', '$rootScope', '$ionicLoading', '$timeout', '$stateParams', 'ShareWeChat', 'ShareHelpNew', 'ENV', 'ionicToast', 'TrafficWebIMService', 'TrafficPersonService', 'AuthenticationService', 'Storage', 'TrafficMeUtils', '$ionicHistory', '$state', 'iAlert', 'TrafficCompanyDynamicService', '$window', 'RscAlert',
                function ($scope, $rootScope, $ionicLoading, $timeout, $stateParams, ShareWeChat, ShareHelpNew, ENV, ionicToast, TrafficWebIMService, TrafficPersonService, AuthenticationService, Storage, TrafficMeUtils, $ionicHistory, $state, iAlert, TrafficCompanyDynamicService, $window, RscAlert) {
    
                    var vm = $scope.vm = this;
                    var MAXLINK = 5
    
                    vm.init = function () {
    
                        reset()
                        TrafficPersonService.userInfo(vm.id, vm.role).then(function (data) {
                            if (data.status == 'success') {
    
                                vm.userInfo = data.data
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
                                TrafficPersonService.getStatus(vm.id).then(function (res) {
                                    if (res.status == 'success') {
                                        console.log(res)
                                        vm.status = res.data.status
                                    } else {
                                        console.log(res)
                                    }
                                    // 修改网速慢显示方法
                                    vm.chatShow = true
                                })
                                if (vm.role != 'TRADE_PURCHASE') {
                                    vm.tabSwitch('SALE')
                                } else if (vm.role != 'TRADE_SALE') {
                                    vm.tabSwitch('PURCHASE')
                                } else {
                                    vm.tabSwitch('TRAFFIC')
                                }
                                TrafficCompanyDynamicService.GeTabCount({ 'user_id': vm.id }).then(function (res) {
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
                            vm.type = type
                            getDynamic()
                        }
    
                    }
    
                    // 点赞
                    vm.isPraise = function (id, users, isPraised, showPraise, index) {
    
                        TrafficCompanyDynamicService.AddPraise(id).then(function (res) {
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
                        $rootScope.chat('p2p-'+vm.id, 'p2p', vm.role)
                    }
    
                    // 加关系
                    vm.addRelation = function (type) {
                        if (type == 'supply') {
                            // get_role(function (status) {
                                addRelation('TRAFFIC_ADMIN')
                            // })
                        } else if (type == 'friend'){
                            addRelation('')
                        }
    
                    }
    
    
                    // 初始化
                    function reset() {
    
                        // 个人信息
                        vm.userInfo = Storage.get('userInfo')
                        vm.companyInfo = Storage.get('userInfo').company
    
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
                        TrafficCompanyDynamicService.GetCount().then(function (res) {
                            vm.message = res.data.count
                            vm.lastInfo = res.data.photo_url
                        })
                        // 列表详情
                        var obj = {}
                        obj.page = vm.page
                        obj.user_id = vm.id
                        obj.type = vm.type
                        TrafficCompanyDynamicService.GetDynamic(obj).then(function (res) {
                            if (res.status == 'success') {
                                vm.loading = false
                                vm.exist = res.data.exist
                                var tmp = res.data.list
                                angular.forEach(tmp, function (data) {
                                    data.time_creation = data.time_creation.split('T')[0]
                                    if (vm.date != data.time_creation) {
                                        vm.date = data.time_creation
                                    } else {
                                        delete (data.time_creation)
                                    }
                                    data.data = JSON.parse(data.data)
                                    data.newData = filterData(data.data)
                                })
    
                                vm.content = vm.content.concat(tmp)
                                console.log(vm.content)
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
                        TrafficPersonService.addRelation(vm.id, !!vm.userInfo.friend, status).then(function (res) {
                            console.log(res)
                            if (res.status == 'success') {
                                ionicToast.show('请等待对方同意', 'middle', false, 2500);
                            } else {
                                ionicToast.show(res, 'middle', false, 2500);
                            }
                        })
                    }
    
                    // 角色弹出框
                    function get_role(callback) {
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
    
    
                }
            ])
    })()
    