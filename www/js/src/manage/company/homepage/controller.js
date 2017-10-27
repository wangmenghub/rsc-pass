(function () {
    "use strict"
    angular.module('rsc.controller.traffic_company_homepage', [])
        .controller('traffic_company_homepage_ctrl', ['$scope', '$rootScope', '$location', '$ionicScrollDelegate', 'ionicToast', 'Storage', 'ShareWeChat', 'ShareHelpNew', 'ENV', '$stateParams', 'TrafficCompanyManageService', 'TrafficCompanyDynamicService', 'TrafficMeUtils', '$ionicLoading', '$timeout', '$state', 'iAlert', 'TrafficCompanySettingService',
            function ($scope, $rootScope, $location, $ionicScrollDelegate, ionicToast, Storage, ShareWeChat, ShareHelpNew, ENV, $stateParams, TrafficCompanyManageService, TrafficCompanyDynamicService, TrafficMeUtils, $ionicLoading, $timeout, $state, iAlert, TrafficCompanySettingService) {
                var vm = $scope.vm = this
                var MAXLINK = 5

                function reset() {
                    vm.other_id = $stateParams.id
                    vm.page = 1
                    vm.message = 0
                    vm.date = null
                    vm.content = []
                    vm.loading = true
                    vm.exist = true
                    vm.type = null
                    vm.link = 0

                    // 用户本企业信息
                    vm.userInfo = Storage.get('userInfo')
                    vm.companyInfo = Storage.get('userInfo').company;
                    vm.role = vm.userInfo.user.role
                    vm.id = vm.userInfo.company._id
                    vm.types = ['DRIVER_DEMAND']

                    if (_.isBoolean($rootScope.vip)) {
                        vm.vip = $rootScope.vip
                    } else if (!!$rootScope.currentCompanyInfo && _.isBoolean($rootScope.currentCompanyInfo.vip)) {
                        vm.vip = $rootScope.currentCompanyInfo.vip
                    } else {
                        vm.vip = !!Storage.get('userInfo').company.vip
                    }

                    // 判断是否为用户公司及能否操作
                    var id = vm.other_id && (vm.other_id != vm.id) ? vm.other_id : vm.id
                    vm.operate = (vm.id == id) && vm.role == "TRAFFIC_ADMIN" ? true : false
                    return id
                }


                vm.init = function () {
                    var id = vm.tmpId = reset()
                    TrafficCompanyManageService.CompanyInfo(id, vm.types).then(function (data) {
                        if (data.status == 'success') {
                            vm.companyInfo = data.data.company
                            vm.userInfo = data.data
                            vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
                            $scope.shareInfo = {
                                msg: {
                                    title: vm.companyInfo.nick_name,
                                    url: "http://" + ENV.shareHost + '/personHome.html?' + vm.companyInfo._id + "."+$rootScope.shareAppKey,
                                    // description: '',
                                    // type: '【物流抢单】',
                                    description: '邀请您在线进行交易',
                                    tagName: 'rsc',
                                    img: vm.companyInfo.url_logo ? vm.companyInfo.url_logo : vm.myUrl
                                },
                                opts: {
                                    hideSms: false,
                                    type: '',
                                    params: {}

                                },
                                params: {
                                    route: {
                                        // type: 'trafficDemand',
                                        id: vm.companyInfo._id
                                    }
                                }
                            }
                        } else {

                        }
                    })
                    TrafficCompanyDynamicService.GeTabCount({ 'company_id': vm.id }).then(function (res) {
                        if (res.status == 'success') {
                            vm.count = res.data
                            console.log(vm.count)
                        } else {

                        }
                    })
                    $scope.shareAction = function () {
                        ShareHelpNew.initShare($scope, $scope.shareInfo);
                        $scope.show();
                    };
                    vm.tabSwitch('ALL')
                }


                vm.changeBackground = function () {
                    confirmVip(vm.vip, function () {
                        TrafficMeUtils.changeImg($scope, 'company_bg_img', function (data) {
                            TrafficCompanySettingService.backImg(data).then(function (res) {

                                if (res.status == 'success') {
                                    vm.companyInfo.url_company_bg_img = data.company_bg_img
                                    // console.log(vm.companyInfo.url_company_bg_img)
                                    vm.userInfo.company = vm.companyInfo
                                    Storage.set('userInfo', vm.userInfo)
                                } else {
                                    ionicToast.show(res.msg, 'middle', false, 2500);
                                }
                            })
                        })
                    })
                }


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


                vm.showPhoto = function (index) {
                    confirmVip(vm.vip, function () {
                        $state.go('rsc.traffic_show_photo', { index: index })
                    })
                }


                vm.editPhoto = function () {
                    confirmVip(vm.vip, function () {
                        $state.go('rsc.traffic_company_display')
                    })
                }


                // vm.goDetail = function(id,type){
                //     console.log(id,type)
                //     if(type == 'pricing'){
                //         $state.go('trade.offerDetails',{id:id,deal:'buy'})
                //     }else if(type == 'bidding'){
                //         $state.go('trade.didding_left',{id:id})
                //     }else if(type == 'demand'){
                //         $state.go('trade.grab_detail_offer',{id:id})
                //     }
                // }


                // 图片上传
                vm.uploadImg = function(){
                    confirmVip(vm.vip,vm.upload)
                }


                vm.upload = function () {
                    TrafficMeUtils.upLoadImg($scope, 'qi_ye_zhan_shi', function (data) {

                        var _data = {}
                        var newArr = []
                        angular.forEach(data['qi_ye_zhan_shi'], function (item) {
                            newArr = vm.companyInfo.url_honor.unshift(item)
                        })
                        // newArr = vm.companyInfo.url_honor.concat(data['qi_ye_zhan_shi'])
                        _data['url_honor'] = newArr
                        TrafficCompanySettingService.addImg(_data).then(function (res) {
                            if (res.status == 'success') {
                                vm.companyInfo.url_honor = newArr
                            } else {
                                ionicToast.show(res.err, 'middle', false, 2500)
                            }
                        })
                    }, {
                            templateUrl: 'js/common/template/popupRadio.html',
                            title: ''
                        })
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


                function confirmVip(bool, cb) {
                    if(!vm.operate){
                        return false
                    }
                    if (bool) {
                        cb()
                    } else {
                        iAlert.confirm(
                            '开通企业版',
                            '开通企业版获得企业相册功能,全方面展示企业情况！',

                            function () {
                                $state.go('rsc.slide')
                                return false
                            }, function () {
                                return false
                            }, {
                                exit: '取消',
                                save: '了解详情'
                            })
                    }
                }


                function getDynamic(cb) {
                    // 新消息
                    TrafficCompanyDynamicService.GetCount().then(function (res) {
                        vm.message = res.data.count
                        vm.lastInfo = res.data.photo_url
                    })
                    // 列表详情
                    var obj = {}
                    obj.page = vm.page
                    obj.company_id = vm.tmpId
                    obj.type = vm.type
                    TrafficCompanyDynamicService.GetDynamic(obj).then(function (res) {
                        console.log(res)
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




                $scope.$on("$ionicView.beforeEnter", function () {
                    vm.init()
                })

            }
        ])

        .controller('traffic_company_display_ctrl', ['$scope', '$stateParams', 'ionicToast', 'TrafficCompanySettingService', 'TrafficMeUtils', 'AccountSev',
            function ($scope, $stateParams, ionicToast, TrafficCompanySettingService, TrafficMeUtils, AccountSev) {
                var vm = $scope.vm = this

                vm.init = function () {
                    vm.photo = {}
                    vm.delSel = []
                    vm.add = true
                    AccountSev.companyInfo().then(function (res) {
                        if (res.status == 'success') {
                            console.log(res.data)
                            vm.list = res.data.url_honor
                            for(var i=0;i<vm.list.length;i++){
                                vm.photo[i] = false
                            }
                        }
                    })
                }

                // 图片上传
                vm.upload = function () {

                    TrafficMeUtils.upLoadImg($scope, 'qi_ye_zhan_shi', function (data) {

                        var _data = {}
                        var newArr = vm.list
                        if(_.isArray(data['qi_ye_zhan_shi'])){
                            angular.forEach(data['qi_ye_zhan_shi'], function (item) {
                                newArr.unshift(item)
                            })
                        }else{
                            newArr.unshift(data['qi_ye_zhan_shi'])
                        }

                        // newArr = vm.companyInfo.url_honor.concat(data['qi_ye_zhan_shi'])
                        _data['url_honor'] = newArr

                        TrafficCompanySettingService.addImg(_data).then(function (res) {
                            if (res.status == 'success') {
                                vm.list = newArr
                                vm.photo = {}
                                for(var i=0;i<vm.list.length;i++){
                                    vm.photo[i] = false
                                }
                            } else {
                                ionicToast.show(res.err, 'middle', false, 2500)
                            }
                        })
                    }, {
                            templateUrl: 'js/common/template/popupRadio.html',
                            title: ''
                        })
                }

                // 图片编辑，此时发生页面变化
                vm.edit = function () {
                    vm.add = !vm.add
                }

                // 图片删除
                vm.delete = function () {
                    var delArr = []
                    var savArr = []
                    angular.forEach(vm.photo, function (value, key) {
                        if (value) {
                            delArr.push(vm.list[key])
                        } else {
                            savArr.push(vm.list[key])
                        }
                    })

                    TrafficCompanySettingService.delImg(delArr).then(function (res) {
                        if (res.status == 'success') {
                            vm.list = savArr
                        } else {
                            ionicToast.show(res.msg, 'middle', false, 2500);
                        }
                        vm.add = !vm.add
                    })
                }

                // 选择需要删除的图片
                vm.isSelect = function (index, isSelect) {
                    vm.photo[index] = isSelect
                    console.log(vm.photo)
                }

                vm.showPhoto = function (index) {
                    $state.go('rsc.traffic_show_photo', { index: index })
                }

                $scope.$on("$ionicView.beforeEnter", function () {
                    vm.init()
                })

            }
        ])

        .controller('traffic_company_photo_ctrl', ['$scope', '$stateParams', '$ionicSlideBoxDelegate', 'ionicToast', 'TrafficCompanySettingService', 'AccountSev',
            function ($scope, $stateParams, $ionicSlideBoxDelegate, ionicToast, TrafficCompanySettingService, AccountSev) {
                var vm = $scope.vm = this

                vm.init = function () {
                    vm.delSuccess = true
                    vm.myActiveSlide = $stateParams.index
                    AccountSev.companyInfo().then(function (res) {
                        if (res.status == 'success') {
                            vm.list = res.data.url_honor
                            $ionicSlideBoxDelegate.update();
                        }
                    })
                }

                vm.onSlideChanged = function (index) {
                    vm.index = index
                }


                vm.delete = function () {
                    if (!vm.delSuccess) {
                        return false
                    }
                    vm.delSuccess = false
                    if (vm.index == undefined) {
                        vm.index = $stateParams.index
                    }
                    var tmp = [vm.list[vm.index]]
                    TrafficCompanySettingService.delImg(tmp).then(function (res) {
                        if (res.status == 'success') {
                            vm.list.splice(vm.index, 1)
                            vm.delSuccess = true
                            $ionicSlideBoxDelegate.update();
                            ionicToast.show('删除成功', 'middle', false, 2500);
                        } else {
                            vm.delSuccess = true
                            ionicToast.show(res.msg, 'middle', false, 2500);
                        }
                    })

                }

                $scope.$on("$ionicView.beforeEnter", function () {
                    vm.init()
                })
            }
        ])
})()
