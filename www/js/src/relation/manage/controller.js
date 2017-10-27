angular.module('rsc.controller.traffic_manage', [])

    // 关系管理同事
    .controller('traffic_manage_colleague_ctrl', ['$scope', 'ionicToast', 'TrafficManageService', 'TrafficInviteFactory',
        function ($scope, ionicToast, TrafficManageService, TrafficInviteFactory) {
            var vm = $scope.vm = this

            vm.init = function () {
                //获取联系人数据
                TrafficManageService.trafficManageColleague().then(function (data) {
                    vm.loading = false
                    vm.contact = data.data
                    vm.list = roleSort(vm)
                    console.log(vm.list)
                    angular.forEach(vm.list, function (value, key) {
                        var sort = key.slice(6).charCodeAt()
                        if (key != 'TRAFFIC_DRIVER_PRIVATE') {
                            vm.arr.push({
                                key: key,
                                value: value,
                                sort: sort
                            })
                        }

                    })
                    console.log(vm.arr)
                    if(vm.arr.length==0){
                        vm.show = false
                    }
                })

            }

            vm.invite = TrafficInviteFactory.invite

            var roleSort = TrafficInviteFactory.roleSort

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.loading =true
                vm.contact = {} // 服务器返回通讯录
                vm.arr = []
                vm.show = true
                vm.init()
            })
        }
    ])

    // 关系管理同事替换
    .controller('traffic_replace_colleague_ctrl', ['$scope', '$stateParams', 'iAlert', '$state', 'TrafficManageService',
        function ($scope, $stateParams, iAlert, $state, TrafficManageService) {
            var vm = $scope.vm = this
            vm.id = $stateParams.id
            vm.rename = $stateParams.rename
            vm.name = $stateParams.name
            vm.phone = $stateParams.phone

            vm.replace = function () {
                iAlert.confirm('提示', '是否将' + vm.rename + '替换成' + vm.name,
                    function (res) {
                        if (res) {
                            TrafficManageService.trafficReColleague(vm.id, vm.name, vm.phone).then(function (data) {
                                console.log(data)
                                if (data.status == 'success') {
                                    $state.go("rsc.manage_colleague")
                                } else {

                                }
                            })
                        }
                    })
            }
        }
    ])

    // 关系管理供应采购
    .controller('traffic_manage_detail_ctrl', ['$scope', '$stateParams', '$state', '$ionicModal', 'ionicToast', 'TrafficManageService',
        function ($scope, $stateParams, $state, $ionicModal, ionicToast, TrafficManageService) {
            var vm = $scope.vm = this

            function reset() {
                vm.loading = true
                vm.type = $stateParams.type
                vm.cache = []
                vm.page = 1
                vm.show = true
            }


            vm.init = function() {
                //获取联系人数据
                TrafficManageService.trafficManageSale(vm.type).then(function (data) {
                    console.log(data)
                    if (data.status == 'success') {
                        vm.loading = false
                        vm.contact = data.data
                        console.log(vm.contact)
                        vm.list = vm.contact.list
                        vm.cache.push.apply(vm.cache, vm.list)
                        vm.list = vm.contact.yes.concat(vm.contact.no)
                        if(vm.list.length == 0){
                            vm.show = false
                        }
                        vm.class = vm.type != 'TRAFFIC' && vm.list.length != 0
                        // if(vm.contact['yes'].length == 0){
                        //     ionicToast.show('暂无数据，请先邀请', 'middle', false, 1000);
                        // }
                    }

                })

            }
            vm.loadMore = function () {
                vm.page++
                vm.init(vm)
                $scope.$broadcast('scroll.infiniteScrollComplete')
            }

            vm.goPartnership = function (item) {
                if (vm.type == 'TRAFFIC') {
                    return false
                } else {
                    $state.go("rsc.partnership", {
                        company_id: item.company._id,
                        type: vm.type
                    })
                }
            }

            // 页面渲染
            $scope.$on("$ionicView.beforeEnter", function () {
                reset()
                vm.init()
            })

        }
    ])

