(function () {
    "use strict"
    angular.module('rsc.controller.traffic_company_dynamic', [])
        .controller('traffic_company_dynamic_ctrl', ['$scope', '$state', '$location', '$ionicLoading', '$ionicScrollDelegate', '$timeout', '$rootScope', '$ionicModal', 'Storage', 'TrafficCompanyDynamicService', 'TrafficPersonService', 'TrafficCompanySettingService',
            function ($scope, $state, $location, $ionicLoading, $ionicScrollDelegate, $timeout, $rootScope, $ionicModal, Storage, TrafficCompanyDynamicService, TrafficPersonService, TrafficCompanySettingService) {
                var vm = $scope.vm = this

                function reset() {
                    vm.page = 1
                    vm.message = 0
                    vm.date = null
                    vm.content = []
                    vm.loading = true
                    vm.exist = true
                    vm.verify = false
                    vm.user_info = Storage.get('userInfo')
                    vm.company_info = Storage.get('userInfo').company;
                    console.log(vm.user_info)
                    vm.usertype = ['PURCHASE', 'SALE']
                    $location.hash('')
                    $ionicScrollDelegate.anchorScroll();
                }

                // 唐夏峰给的数据太垃圾需要过滤
                function filterData(data) {
                    var newData = {}
                    if (data.product_categories) {
                        newData.layer_1_chn = data.product_categories[0].layer_1_chn
                        newData.layer_2_chn = data.product_categories[0].layer_2_chn
                    }

                    return newData
                }

                // 请求动态列表
                vm.init = function () {
                    // 审核模态框
                    TrafficCompanySettingService.companyInfo().then(function (data) {
                        console.log('公司信息', data);
                        if (data.status == 'success') {
                            vm.company_info = vm.user_info.company = data.data
                            Storage.set('userInfo', vm.user_info)
                            if (vm.company_info.verify_phase == 'PROCESSING') {
                                vm.verify = true
                                vm.loading = false
                            } else if (data.data.verify_phase == 'FAILED' && vm.user_info.user.company_id != '') {
                                vm.verify = true
                                vm.loading = false
                            } else {
                                vm.verify = false
                            }

                        }
                        if (!vm.verify) {
                            // 列表详情
                            TrafficCompanyDynamicService.GetDynamic(vm.page).then(function (data) {
                                if (data.status == 'success') {
                                    vm.loading = false
                                    vm.exist = data.data.exist
                                    vm.content = data.data.list
                                    angular.forEach(vm.content, function (data) {
                                        data.time_creation = data.time_creation.split('T')[0]
                                        if (vm.date != data.time_creation) {
                                            vm.date = data.time_creation
                                        } else {
                                            delete (data.time_creation)
                                        }
                                        data.data = JSON.parse(data.data)
                                        data.newData = filterData(data.data)
                                    })
                                    console.log(vm.content)
                                } else {

                                }
                            })

                            // 新消息
                            TrafficCompanyDynamicService.GetCount().then(function (res) {
                                if (res.status == 'success') {
                                    vm.message = res.data.count
                                    vm.lastInfo = res.data.photo_url
                                    console.log(res.data)
                                } else {

                                }
                            })
                            // 列表页
                            var date = new Date()
                            var day = date.getDate()
                            var month = date.getMonth() + 1
                            var year = date.getFullYear()
                            TrafficCompanyDynamicService.DynamicDaily(vm.company_info._id, day, month, year).then(function (res) {
                                console.log(res)
                                if (res.status == 'success') {
                                    vm.daily = res.data
                                }
                                console.log(vm.daily)
                            })
                        }
                    })
                }

                vm.phone = function () {
                    window.plugins.CallNumber.callNumber(function (e) {
                        console.log(e)
                    }, function (e) {
                        console.log(e)
                    }, '010-57406666', true)
                }

                vm.reVerify = function () {
                    $state.go('rsc.traffic_company_setting')
                }

                // 点赞
                vm.isPraise = function (id, users, isPraised, showPraise, index) {

                    TrafficCompanyDynamicService.AddPraise(id).then(function (res) {
                        console.log(id)
                        if (res.status == 'success') {
                            console.log(res)
                            isPraised = !isPraised
                            showPraise = false
                            if (isPraised == true) {
                                users.push({
                                    real_name: vm.user_info.user.real_name
                                })
                            } else {
                                var i = users.indexOf({
                                    real_name: vm.user_info.user.real_name
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

                vm.loadMore = function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                    $ionicLoading.show({
                        template: "正在加载数据中..."
                    })
                    vm.page++;
                    TrafficCompanyDynamicService.GetDynamic(vm.page).then(function (data) {
                        if (data.status == 'success') {
                            vm.loading = false
                            vm.exist = data.data.exist
                            //停止事件广播
                            $timeout(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $ionicLoading.hide();
                            }, 1000)

                            angular.forEach(data.data.list, function (data) {
                                data.time_creation = data.time_creation.split('T')[0]
                                if (vm.date != data.time_creation) {
                                    vm.date = data.time_creation
                                } else {
                                    delete (data.time_creation)
                                }
                                data.data = JSON.parse(data.data)
                                data.newData = filterData(data.data)
                            })
                            vm.content = vm.content.concat(data.data.list)
                            console.log(vm.content)
                        } else {

                        }

                    })

                }

                $scope.$on("$ionicView.beforeEnter", function () {
                    $rootScope.trafficListen()
                    reset()
                    vm.init()
                })
            }
        ])

        .controller('traffic_dynamic_msg_ctrl', ['$scope', 'Storage', 'TrafficCompanyDynamicService', 'TrafficPersonService',
            function ($scope, Storage, TrafficCompanyDynamicService, TrafficPersonService) {
                var vm = $scope.vm = this
                vm.user_info = Storage.get('userInfo')
                vm.company_info = Storage.get('userInfo').company;

                // 新消息列表
                vm.init = function () {

                    TrafficCompanyDynamicService.GetTips().then(function (res) {
                        vm.data = res.data
                        angular.forEach(vm.data, function (data) {
                            data.dynamic.data = JSON.parse(data.dynamic.data)
                        })
                        console.log(vm.data)
                    })

                }

            }
        ])

})()
