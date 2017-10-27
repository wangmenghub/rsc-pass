/**
 *测试 地址地图模式
 *
 */
angular.module('rsc.controller.traffic_map', [])
    .controller('traffic_add_map_ctrl', ['$scope', '$state', '$stateParams', 'TrafficCompanyManageService','RscAlert',
        function ($scope, $state, $stateParams, TrafficCompanyManageService,RscAlert) {
            var vm = $scope.vm = this;

            function getLocal(longitude, latitude) {
                var container = angular.element(document.getElementById('container'))[0];
                // console.log(container)
                container.style.height = window.screen.height - 130 + 'px';
                var map = new AMap.Map("container", {
                    zoom: 5,
                    center: [116.397428, 39.90923]
                });
                AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.OverView", "AMap.StationSearch"], function () {
                    map.addControl(new AMap.ToolBar());
                });
                if (location.href.indexOf('&guide=1') !== -1) {
                    map.setStatus({scrollWheel: false})
                }
                var marker = new AMap.Marker({
                    position: [longitude, latitude], //TODO:获取动态经纬度
                    map: map,
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    autoRotation: true
                });
                marker.setAngle();
                map.setFitView();
            }

            vm.init = function () {
                vm.province = $stateParams.province;
                vm.city = $stateParams.city;
                vm.district = $stateParams.district;
                vm.addr = $stateParams.addr;
                vm.address = $stateParams.province + $stateParams.city + $stateParams.addr + $stateParams.district;
                TrafficCompanyManageService.getMapLocal(vm.province, vm.city, vm.district, vm.addr).then(function (res) {
                    if (res.status === 'success') {
                        var local = res.data.geocodes[0].location.split(",")
                        vm.longitude = local[0]
                        vm.latitude = local[1]
                        getLocal(vm.longitude, vm.latitude)
                    } else {

                    }
                })


            };
            vm.goMap = function () {
                cordova.plugins.MapNavigator.baiMapNavigatorMethod(vm.address, function (result) {
                    if (result === 'false') {
                        //提示请安装百度或者高德app;
                        RscAlert.alert("未检测到导航软件，请安装百度地图或高度地图App");
                    } else {
                        console.log(error);
                    }
                })
            }


            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })

        }])