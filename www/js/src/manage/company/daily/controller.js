(function () {
    "use strict"
    angular.module('rsc.controller.traffic_company_daily', [])
        .controller('traffic_daily_detail_ctrl', ['$scope', 'ionicToast', 'Storage', 'TrafficCompanyDynamicService',
            function ($scope, ionicToast, Storage, TrafficCompanyDynamicService) {
                var vm = $scope.vm = this;
                vm.show = true
                vm.init = function () {
                    vm.company_info = Storage.get('userInfo').company;
                    vm.now = new Date().getTime()
                    getDaily(vm.now)
                }

                vm.yesterday = function () {
                    vm.show = true
                    vm.now = vm.now - 86400000
                    console.log(vm.now)
                    getDaily(vm.now)
                }

                vm.tomorrow = function () {
                    if (new Date(vm.now).getDate() < new Date().getDate()) {
                        vm.now = vm.now + 86400000
                        console.log(vm.now)
                        getDaily(vm.now)
                    } else {
                        console.log('>>>end')
                        ionicToast.show('没有更多', 'middle', false, 2500)
                        vm.show = false
                        return false
                    }
                }

                function diff(browse, order, data) {
                    var tempBrowse = []
                    var tempOrder = []
                    angular.forEach(data, function (value, key) {
                        if (key == browse) {
                            tempBrowse = value
                        }
                        if (key == order) {
                            tempOrder = value
                        }
                    })
                    var temp = _.difference(tempBrowse, tempOrder)
                    return temp
                }

                function getDaily(time) {
                    var date = new Date(time)
                    vm.day = date.getDate()
                    vm.month = date.getMonth() + 1
                    vm.year = date.getFullYear()
                    TrafficCompanyDynamicService.DailyDetail(vm.company_info._id, vm.day, vm.month, vm.year).then(function (res) {
                        vm.loading = false
                        console.log(res.data)
                        vm.list = res.data.traffic?res.data.traffic:{}
                        vm.list.diff_pricing_order = diff('pricing_browse','pricing_order',vm.list)
                        vm.list.diff_bidding_order = diff('bidding_browse','bidding_order',vm.list)
                        vm.list.diff_demand_order = diff('demand_browse','demand_order',vm.list)
                    })
                }

                $scope.$on("$ionicView.beforeEnter", function () { 
                    vm.loading = true 
                    vm.init() 
                }) 


            }
        ])
})()
