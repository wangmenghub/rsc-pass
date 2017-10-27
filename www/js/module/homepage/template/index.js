angular.module('rsc.homepage', [
    'rsc.config',
    'rsc.common.service.rest',
    'ui.router',
])
    .config(function ($stateProvider) {
        $stateProvider
        // 企业主页
       .state('rsc.company_page', {
            url: '/company_page?id?type',
            // cache: false,
            views: {
                'center-content': {
                    templateUrl: 'js/module/homepage/template/company_page.html',
                    controller: "company_page_ctrl as vm"
                }
            }
        })
    })
    .service('HomePageService', ['ENV', 'AccountRestAngular','DynamicAngular',
        function (ENV, AccountRestAngular,DynamicAngular) {
            return{
                //获取公司信息
                CompanyInfo:function (id, types) {
                    var all = AccountRestAngular.allUrl('company/get_home_pages');
                    return all.post({
                        company_id: id,
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
                GetCount:function () {
                    var all = DynamicAngular.allUrl('company_dynamic/get_tips_count');
                    return all.post();
                },
                addImg: function (data) {
                    var all = AccountRestAngular.allUrl('company_trade/edit');
                    return all.post(data);
                }
            }
        }
    ])
    .controller('company_page_ctrl', ['$scope', '$rootScope', '$location', '$ionicScrollDelegate', 'ionicToast', 'Storage', 'ShareWeChat', 'ShareHelpNew', 'ENV', '$stateParams', 'TradeMeUtils', '$ionicLoading', '$timeout', '$state', 'iAlert', '$ionicActionSheet','HomePageService',
        function ($scope, $rootScope, $location, $ionicScrollDelegate, ionicToast, Storage, ShareWeChat, ShareHelpNew, ENV, $stateParams, TradeMeUtils, $ionicLoading, $timeout, $state, iAlert, $ionicActionSheet,HomePageService) {
            var vm = $scope.vm = this
            var MAXLINK = 5

            function reset() {
                vm.other_id = $stateParams.id
                vm.url_type=$stateParams.type;
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
                vm.types = ['PURCHASE', 'DJ', 'JJ', 'TRAFFIC_DEMAND']

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
                HomePageService.CompanyInfo(id, vm.types).then(function (data) {
                    if (data.status == 'success') {
                        vm.companyInfo = data.data.company

                        vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
                        $scope.shareInfo = {
                            msg: {
                                title: vm.companyInfo.nick_name,
                                url: "http://" + ENV.shareHost + '/personHome.html?' + vm.companyInfo._id + "." + $rootScope.shareAppKey,
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
                                    id: vm.companyInfo._id
                                }
                            }
                        }
                    } else {

                    }
                })
                HomePageService.GeTabCount({ 'company_id': vm.id }).then(function (res) {
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
                if(vm.url_type=='TRADE'){
                    vm.tabSwitch('trade_all')
                }else {
                    vm.tabSwitch('traffic_all')
                }
            }


            vm.changeBackground = function () {
                confirmVip(true, function () {
                    TradeMeUtils.changeImg($scope, 'company_bg_img', function (data) {
                        HomePageService.backImg(data).then(function (res) {

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
                    if(vm.userInfo.user.role == 'TRADE_STORAGE'){
                        vm.type = 'address'
                    }else {
                        vm.type = type;
                    }

                    getDynamic()
                }

            }


            vm.showPhoto = function (index) {
                confirmVip(vm.vip, function () {
                    $state.go('rsc.trade_show_photo', { index: index })
                })
            }


            vm.editPhoto = function () {
                confirmVip(vm.vip, function () {
                    $state.go('rsc.trade_company_display')
                })
            }
            vm.goDetail = function(list,user_id,company_id){
                console.log(list.list._id,list.list.ownType,user_id,company_id)
                if(list.list.ownType == 'pricing'){
                    if(vm.companyInfo.type=='TRADE') {
                        if (vm.userInfo.user._id == user_id) {
                            $state.go('rsc.offerDetails', {id: list.list._id, deal: 'sell'})
                        } else if (vm.id == company_id) {
                            $state.go('rsc.offerDetails', {id: list.list._id, deal: 'colleague'})
                        } else {
                            $state.go('rsc.offerDetails', {id: list.list._id, deal: 'buy'})
                        }
                    }
                }else if(list.list.ownType == 'bidding'){
                    if(vm.companyInfo.type=='TRADE') {
                        $state.go('rsc.didding_left', {id: list.list._id})
                    }
                }else if(list.list.ownType == 'demand'){
                    if(vm.companyInfo.type=='TRADE') {
                        if (vm.id == company_id) {
                            $state.go('rsc.grab_detail_offer', {id: list.list._id, type: 'self'})
                        } else {
                            $state.go('rsc.grab_detail_offer', {id: list.list._id, type: 'other'})
                        }
                    }
                }else if(list.list.dt_type == 'traffic_demand'){
                    if(vm.companyInfo.type='TRADE'){
                        if(vm.userInfo.user._id==user_id){
                            $state.go('rsc.assign',{id:list.list._id,status:'valid'})
                        }
                    }else if(vm.companyInfo.type='TRAFFIC'){
                        angular.forEach('list.list.verify_company',function (assgin_company) {
                            if(assgin_company == vm.id){
                                $state.go('rsc.goods_detail', {demand_id: list.list._id})
                            }else {
                                ionicToast.show('该订单没有指派您，无法查看', 'middle', false, 2500);
                            }
                        })
                    }

                }
            }
            // 图片上传
            vm.uploadImg = function(){
                if(!vm.operate){
                    return false
                }
                var hideSheet = $ionicActionSheet.show({
                    buttons: [{
                        text: "上传企业展示图片",
                    },
                    ],
                    // destructiveText: 'Delete',
                    // titleText: 'Modify your album',
                    cancelText: '取消',
                    buttonClicked: function(){
                        confirmVip(vm.vip,vm.upload)
                    },
                    destructiveButtonClicked: function() {
                        return true;
                    },
                    cancel: function () {
                        return true;
                    }

                })

                $timeout(function () {
                    hideSheet();
                }, 3000);
            }


            vm.upload = function () {
                TradeMeUtils.upLoadImg($scope, 'qi_ye_zhan_shi', function (data) {

                    var _data = {}
                    var newArr = []
                    // angular.forEach(data['qi_ye_zhan_shi'], function (item) {
                        newArr.unshift(data['qi_ye_zhan_shi'])
                    // })
                    // newArr = vm.companyInfo.url_honor.concat(data['qi_ye_zhan_shi'])
                    _data['url_honor'] = newArr
                    HomePageService.addImg(_data).then(function (res) {
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
                HomePageService.AddPraise(id).then(function (res) {
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
                HomePageService.GetCount().then(function (res) {
                    vm.message = res.data.count
                    vm.lastInfo = res.data.photo_url
                })
                // 列表详情
                var obj = {}
                obj.page = vm.page
                obj.company_id = vm.tmpId
                obj.type = vm.type
                HomePageService.GetDynamic(obj).then(function (res) {
                    console.log(res)
                    if (res.status == 'success') {
                        vm.loading = false
                        vm.exist = res.data.exist;
                        vm.address_store = res.data.count;
                        var tmp = res.data.list
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




            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })


        }
    ])
