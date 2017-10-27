/**
 * Created by Administrator on 2017/5/17.
 */
angular.module('rsc.directive.pass', [])
/**
 * 物流 货源 货源列表
 */
    .directive('passDemandList', function () {
        return {
            restrict: 'EAC',
            scope: {
                data: '=data',
                goDetail: '&goDetail'
            },
            templateUrl: 'js/src/common/directives/template/pass_demand_list.html',
            replace: true,
            controller: function ($scope, $rootScope, $log, AccountInformation) {
                $log.debug('原始data数据', $scope.data);
                $scope.data.timeOut = false;
                $scope.data.role = $rootScope.currentUser.user.role;
                // 查询user信息
                AccountInformation.getUserInfoById($scope.data.demand_user_id ? $scope.data.demand_user_id : $scope.data.user_demand_id).then(function (result) {
                    if (result.status == 'success') {
                        $scope.userInfo = result.data;
                        $log.debug('查询user信息', result);
                    } else {
                        $log.error('查询user信息22', result);
                    }
                });
                $scope.businessCard = function (userInfo, $event) {
                    $event.stopPropagation();
                    $state.go('tab.nameCardMeNew', {id: userInfo, type: 'TRADE_ADMIN'});
                };
                $scope.demandStatus = function () {
                    $scope.data.timeOut = true
                }
            }

        };
    })
    /**
     * 物流 货源 计划抢单列表
     */
    .directive('pkList', function () {
        return {
            restrict: 'EAC',
            scope: {
                offer: "=",
                cancel: '='
            },
            templateUrl: 'js/src/common/directives/template/pk_list.html',
            replace: true,
            controller: function ($scope) {
                $scope.time_end = false;
                $scope.finished = function () {
                    $scope.time_end = true;
                }
            }
        }
    })
    /**
     * 物流 货源 订单待接单、进行中、已完成、已取消列表
     */
    .directive('orderList', function () {
        return {
            restrict: 'EAC',
            scope: {
                order: "=",
                status: "="
            },
            templateUrl: 'js/src/common/directives/template/order_list.html',
            replace: true,
            controller: function ($scope) {

            }
        }
    })
    /**
     * 物流我的订单（新）
     */
    .directive('passOrderItem', function () {
        return {
            restrict: 'EAC',
            templateUrl: 'js/src/common/directives/template/pass_order_item.html',
            replace: true,
            scope: {
                order: '=order',
                goDetail: '&goDetail',
                orderType: '@',
                source: '@'
            },
            controller: function ($scope) {
                $scope.order.pay_time = moment($scope.order.time_current_step).add(3, 'days').toDate();

                $scope.finsh = function () {
                    $scope.time_end = true;
                }
                $scope.pay_finsh = function () {
                    $scope.pay_time_end = true;
                }
            }
        }
    })
    /**
     * 物流 运输 车辆列表（新）
     */
    .directive('carGroup', function () {
        return {
            restrict: 'EAC',
            scope: {
                status: '=',
                selCarList: '='
            },
            templateUrl: 'js/src/common/directives/template/car_group.html',
            replace: true,
            controller: function ($scope, $log, PassSellService, $stateParams, $filter, $ionicLoading, Storage, $rootScope) {
                var vm = this;
                var data;
                var group = {};
                $scope.selCarList = [];
                vm.products = Storage.get('products');
                vm.detail = Storage.get('detail');
                //获取分组中的车辆
                $scope.getCars = function (group, init) {
                    $scope.isSel = true;
                    group.isSel = !group.isSel;
                    group.query = {
                        group_id: group._id,
                        order_id: $stateParams.order_id,
                        type: 'PRIVATE',
                        page: -1,
                        scene: 'assign',
                        id: group._id
                    }
                    if($scope.status == 'replace'){
						group.query.demand_id = $stateParams.demand_id;
                    }
                    if (!init) {
                        group.hide = !group.hide;
                    }
                    if (!group.isLoad || !group.cars || group.cars.length <= 0) {
                        PassSellService.assignDriverList(group.query).then(function (result) {
                            if (result.status == 'success') {
                                $log.debug('获取分组车辆信息', result);
                                group.isLoad = true;
                                group.hide = result.data.exist;
                                //如果有group已经有车了则合并。
                                // $scope.cars = result.data;
                                // group.pages = result.data.pages;
                                // $scope.pages = result.data.pages;

                                if (group.cars) {
                                    $log.debug('获取分组车辆信息', result);
                                    group.cars = group.cars.concat(result.data.list);
                                    $scope.cars = $scope.cars.concat(result.data.list);
                                } else {
                                    $log.debug('获取分组车辆信息', result);
                                    group.cars = result.data.list;
                                    $scope.cars = result.data.list;
                                }
                            } else {
                                $log.error('获取分组车辆信息', result);
                            }
                        });
                    }

                }
                $scope.init = function () {
                    PassSellService.truckGroupList().then(function (result) {
                        if (result.status == 'success') {
                            // if($scope.carGroup){
                            //     $scope.carGroup =$scope.carGroup.concat(result.data);
                            // }else {
                            //     $scope.carGroup =result.data;
                            // }
                            $scope.carGroup = result.data;
                            angular.forEach($scope.carGroup, function (data) {
                                data.checked = false;
                            })
                            $scope.getCars($scope.carGroup[0], 'init');
                            $log.debug('获取分组车辆', result);
                        } else {
                            $log.error('获取分组车辆', result);
                        }
                    });
                }
                //加载分组中的更多车辆
                $scope.loadMore = function (group) {
                    group.query.page++;
                    PassSellService.assignDriverList(group.query).then(function (result) {
                        if (result.status == 'success') {
                            group.hide = result.data.exist;
                            if (group.cars) {
                                $log.debug('获取分组车辆信息', result);
                                group.cars = group.cars.concat(result.data.list);
                            } else {
                                $log.debug('获取分组车辆信息', result);
                                group.cars = result.data.list;
                            }
                        } else {
                            $log.error('获取分组车辆信息', result);
                        }
                    });
                }
                var isLoading = false;
                $scope.selAll = function (item) {
                    $scope.selCarList = [];
                    data = {
                        page: -1,
                        scene: 'assign',
                        group_id: item._id
                    }
                    PassSellService.assignDriverList(data).then(function (result) {
                        if (result.status == 'success') {
                            $log.debug('获取分组车辆', result);
                            // if (!$scope.cars) {
                            //     $scope.cars = result.data.list;
                            // }
                            // else {
                            //     $scope.cars =$scope.cars.concat(result.data.list);
                            // }
                            angular.forEach($scope.cars, function (data) {
                                if (item.checked == false) {
                                    data.checked = false;
                                    $scope.selCarList.splice(data.user_id, 1);
                                } else {
                                    $scope.selCarList.push(data.user_id);
                                    data.checked = true;
                                }

                            });
                        } else {
                            $log.error('获取分组车辆', result);
                        }
                    })
                };
                $scope.selectCar = function (item, group) {
                    if (!item.checked) {
                        item.checked = true;
                        $scope.selCarList.push(item.user_id);
                        $log.debug('push', $scope.selCarList);
                    } else {
                        item.checked = false;
                        for (var i = 0; i < $scope.selCarList.length; i++) {
                            var e = $scope.selCarList[i];
                            if (e == item.user_id) {
                                $scope.selCarList.splice(i, 1);
                                i--;
                            }
                        }
                        $log.debug('splice', $scope.selCarList);
                    }
                    if ($scope.selCarList.length == group.count) {
                        group.checked = true;
                    } else {
                        group.checked = false;
                    }
                };
                $scope.selectRadioCar = function (item) {
                    angular.forEach($scope.cars, function (data) {
                        data.checked = false;
                    });
                    item.checked = true;
                    $scope.selCarList[0] = item.user_id;
                };
                $scope.init();
                // arguments
                $rootScope.$on('$stateChangeSuccess', function (event, toState, roParams, fromState, fromParams) {
                    $scope.init();
                });
            },
            link: function (scope) {


            }
        };
    })
    /**
     * 物流 运输 车辆分组（新）
     */
    .directive('carList', function () {
        return {
            restrict: 'EAC',
            scope: {},
            templateUrl: 'js/src/common/directives/template/car_list.html',
            replace: true,
            controller: function ($rootScope, $scope, $log, PassSellService, $stateParams, $filter, $ionicLoading, Storage, $state) {
                var vm = this;
                $scope.isSel = true;
                $scope.countTotal = 0;
                var isLoading = false;
                //获取分组中的车辆
                $scope.getCars = function (group, init) {
                    group.isSel = !group.isSel;
                    group.query = {
                        group_id: group._id,
                        order_id: $stateParams.order_id,
                        type: 'PRIVATE',
                        page: 1,
                        scene: 'assign',
                        id: group._id
                    }
                    if (!group.isLoad || !group.cars || group.cars.length <= 0) {
                        PassSellService.assignDriverList(group.query).then(function (result) {
                            if (result.status == 'success') {
                                group.hide = result.data.exist;
                                $log.debug('获取分组车辆信息', result);
                                group.isLoad = true;
                                $log.debug('获取分组车辆信息', result);
                                group.cars = result.data.list;
                            } else {
                                $log.error('获取分组车辆信息', result);
                            }
                        });
                    }

                }
                $scope.init = function () {
                    $scope.reqcomplete=false;
                    PassSellService.truckGroupList().then(function (result) {
                        $scope.reqcomplete=true;
                        if (result.status == 'success') {
                            if ($scope.carGroup) {
                                $scope.carGroup = $scope.carGroup.concat(result.data);
                            } else {
                                $scope.carGroup = result.data;
                                angular.forEach($scope.carGroup, function (data) {
                                    $scope.countTotal = $scope.countTotal + data.count;
                                });
                            }

                            $log.debug('获取分组车辆', result);
                        } else {
                            $log.error('获取分组车辆', result);
                        }
                    })
                }
                //加载分组中的更多车辆
                $scope.loadMore = function (group) {
                    group.query.page++;
                    PassSellService.assignDriverList(group.query).then(function (result) {
                        if (result.status == 'success') {
                            group.hide = result.data.exist;
                            if (group.cars) {
                                $log.debug('获取分组车辆信息', result);
                                group.cars = group.cars.concat(result.data.list);
                            } else {
                                $log.debug('获取分组车辆信息', result);
                                group.cars = result.data.list;
                            }
                        } else {
                            $log.error('获取分组车辆信息', result);
                        }
                    });
                };
            },
            link: function (scope) {


            }
        }
    })
    /**
     * 物流 运输 司机订单列表（新）
     */
    .directive('carOrderList', function () {
        return {
            restrict: 'EAC',
            scope: {
                goOrderDetail: '&goOrderDetail',
                demandList: '=',
                query: '=',
                source: '@'
            },
            templateUrl: 'js/src/common/directives/template/car_order_list.html',
            replace: true,
            controller: function ($scope, $log, $state, $stateParams, PassSellService) {
                $scope.getTraffic = function (traffic) {
                    if (traffic.isshow == true) {
                        traffic.isshow = false;
                    } else {
                        traffic.isshow = true;
                    }

                }
                $scope.goOrderDetail = function (order) {
                    $state.go('rsc.order_trans_detail', {
                        order_id: order._id,
                        order_index: order.index,
                        source: $scope.source
                    });
                };
            }

        }
    })
    /**
     * 物流 货源 线路列表
     */
    .directive('passTrafficLine', function () {
        return {
            restrict: "EAC",
            scope: {
                line: '=line',
                lineDetail: "&lineDetail"
            },
            templateUrl: 'js/src/common/directives/template/pass_line_list.html',
            replace: true,
            controller: function ($scope, PassBuyService, $state, $log) {
                $scope.delLine = function (id) {
                    iAlert.popup('提示', '确认删除此线路？', function (res) {
                        PassBuyService.closeLine(id).then(function (result) {
                            if (result.status == 'success') {
                                $log.debug('删除成功', result);
                                // $state.go('rsc_buy.center.line')
                                $state.reload()
                            } else {
                                //修改失败
                                $log.error('删除失败', result);
                            }
                        })
                    });
                };

                // 编辑路线
                $scope.editLine = function (id) {
                    $state.go('rsc.edit_line', {line_id: id})
                }

            }
        }
    })
    /**
     * 检查手机号是否注册
     */
    .directive('phoneCheck', ['PassSellService', '$q', '$log', function (PassSellService, $q, $log) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                var forOrder = attrs['forOrder'];
                ctrl.$asyncValidators.phone = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        return $q.when();
                    }
                    var def = $q.defer();
                    PassSellService.checkPhoneExist(modelValue).then(function (result) {
                        if (result.status == "success") {
                            $log.debug('检查是否存在', result, attrs)
                            if (attrs.findPassword) {
                                if (result.data.use) {
                                    def.resolve();

                                } else {
                                    def.reject();
                                }
                            } else {
                                if (result.data.use) {
                                    def.reject();

                                } else {
                                    def.resolve();
                                }
                            }

                        } else {
                            def.reject();
                        }
                    });
                    return def.promise;
                }
            }
        }
    }])
    /**
     * 检查车牌号是否注册
     */
    .directive('carNumberCheckForOrder', ['AccountInformation', '$q', '$log', function (AccountInformation, $q, $log) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$asyncValidators.carNumber = function (modelValue, viewValue) {
                    // viewValue = angular.uppercase(modelValue);
                    ele[0].value = angular.uppercase(modelValue);
                    if (ctrl.$isEmpty(modelValue)) {
                        return $q.when();
                    }

                    var def = $q.defer();


                    //订单添加车辆的流程
                    AccountInformation.checkCarNumberExistForOrder(modelValue).then(function (result) {
                        if (result.status == "success") {
                            $log.debug('检查车牌号是否存在', result);
                            if (result.data.exist) {
                                // scope._user_car = {
                                //     truck: result.data.truck,
                                //     user: result.data.user
                                // }
                                // scope.newCar.number = scope._user_car.truck.number;
                                // scope.newCar.phone = scope._user_car.user.phone;
                                // scope.newCar.name = scope._user_car.user.real_name;
                                // scope.newCar.type = {eng: scope._user_car.truck.type};
                                // scope.newCar.long = {eng: scope._user_car.truck.long};
                                // scope.newCar.weight = {eng: scope._user_car.truck.weight};
                                //
                                //  scope.hasCar = true;


                                // name: '订单司机',
                                // phone: '18300000001',
                                // number: '京A64568',
                                // type: $scope.select.carType[0],
                                //     long: $scope.select.carLong[0],
                                //         weight: $scope.select.carWeight[0],
                                // def.resolve();

                                def.reject();

                            } else {
                                // scope.hasCar = false;
                                // scope._user_car = {
                                //     truck: null,
                                //     user: null
                                // }
                                // scope.newCar.phone = '';
                                // scope.newCar.name = '';
                                // scope.newCar.type = ""
                                // scope.newCar.long = ""
                                // scope.newCar.weight = ""
                                // def.reject();
                                def.resolve();
                            }
                        }
                    })


                    return def.promise;
                }
            }
        }
    }])

    .directive("appMap", ['$http', '$log', function ($http, $log) {
        return {
            restrict: "EAC",
            template: "<div><div id='container' style='width:100%;'></div><div id='panel' style='display:none'></div></div>",
            scope: {
                'mapList': '='
            },
            replace: true,
            controller: function ($scope, $ionicLoading) {
                $scope.$watch('mapList', function () {
                    $log.debug('mapList', $scope.mapList)
                    var height = document.getElementById('container');
                    height.style.height = window.screen.height - 134 + 'px';
                    var map = new AMap.Map("container", {
                        zoom: 5,
                        center: [116.397428, 39.90923] //new AMap.LngLat(116.39,39.9)
                    });
                    AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.OverView", "AMap.StationSearch"], function () {
                        map.addControl(new AMap.ToolBar());
                        map.addControl(new AMap.Scale());
                        map.addControl(new AMap.StationSearch());
                    });
                    if (location.href.indexOf('&guide=1') !== -1) {
                        map.setStatus({scrollWheel: false})
                    }
                    //构造路线导航类
                    var driving = new AMap.Driving({
                        map: map,
                        panel: "panel"
                    });
                    var lnglats = [];
                    angular.forEach($scope.mapList, function (item) {
                        lnglats.push(item.send_loc)
                        lnglats.push(item.receive_loc)

                    });
                    $log.debug('lnglats', lnglats)
                    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                    for (var i = 0, marker; i < lnglats.length; i++) {
                        var marker = new AMap.Marker({
                            position: lnglats[i],
                            map: map
                        });
                        // marker.content = '我是第' + (i + 1) + '个Marker';
                        marker.content = '<a href="">' + lnglats[i] + '</a>';
                        marker.on('click', markerClick);
                        // marker.emit('click', {target: marker});
                    }
                    function markerClick(e) {
                        $ionicLoading.show();
                        console.log('点击位置坐标', e.target.G.position)
                        console.log('所有线路坐标', lnglats)
                        infoWindow.setContent(e.target.content);
                        infoWindow.open(map, e.target.getPosition());
                        for (var j = 0; j < $scope.mapList.length; j++) {
                            if (e.target.G.position.lng == $scope.mapList[j].send_loc[0]) {
                                driving.search(new AMap.LngLat($scope.mapList[j].send_loc[0], $scope.mapList[j].send_loc[1]), new AMap.LngLat($scope.mapList[j].receive_loc[0], $scope.mapList[j].receive_loc[1]), function (status, result) {
                                    if (status === 'complete' && result.info === 'OK') {
                                        $ionicLoading.hide();
                                    }
                                });
                                return
                            } else if (e.target.G.position.lng == $scope.mapList[j].receive_loc[0]) {
                                driving.search(new AMap.LngLat($scope.mapList[j].send_loc[0], $scope.mapList[j].send_loc[1]), new AMap.LngLat($scope.mapList[j].receive_loc[0], $scope.mapList[j].receive_loc[1]), function (status, result) {
                                    if (status === 'complete' && result.info === 'OK') {
                                        $ionicLoading.hide();
                                    }
                                });
                                return
                            } else {
                                console.log('什么鬼？找不到了·······')
                            }
                        }
                    }

                    map.setFitView();
                })
            }
        };
    }])
    .directive("transMap", ['$http', '$log', 'PassSellService', '$stateParams', function ($http, $log, PassSellService, $stateParams) {
        return {
            restrict: "E",
            replace: true,
            template: "<div><div id='container' style='width:100%;height: 692px;'></div><div id='panel' style='display:none'></div></div>",
            scope: {
                'options': '='
            },
            link: function ($scope, element, attrs) {
                var infoWindow = {};
                var carInfo = [];
                var marker = {};
                var carListById = [];
                PassSellService.getOrderById($stateParams.order_id).then(function (result) {
                    $scope.lnglats = [];
                    if (result.status == 'success') {
                        $scope.order = result.data;
                        angular.forEach($scope.order.driverDemand, function (driverDemand) {
                            angular.forEach(driverDemand.orderList, function (orderList) {
                                carListById.push(orderList.user_id);
                            })
                        })
                        $log.debug('订单', result, $scope.order.send_loc, $scope.order.receive_loc);
                        // 根据起终点经纬度规划驾车导航路线
                        driving.search(new AMap.LngLat($scope.order.send_loc[0], $scope.order.send_loc[1]), new AMap.LngLat($scope.order.receive_loc[0], $scope.order.receive_loc[1]), function (status, result) {
                            //TODO 解析返回结果，自己生成操作界面和地图展示界面
                        });
                    } else {
                        $log.error('订单', result);
                    }

                }).then(function () {
                    PassSellService.getMapList(carListById).then(function (result) {
                        if (result.status == 'success') {
                            $scope.cars = result.data;
                            angular.forEach($scope.cars, function (data) {
                                $scope.lnglats.push(data.loc);
                            })
                            $log.debug('车辆', result);
                            // carInfo = [
                            //     {car:'王标定,13900000060,辽A00005,无烟煤，35吨'},
                            //     {car:'老孟,13900000061,京NB2345,钢铁，65吨'},
                            //     {car:'笑颜,13466678987,京MN2345,无烟煤，20吨'},
                            //     {car:'笑笑,13466678987,京MN2345,无烟煤，20吨'},
                            // ]
                            infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                            for (var i = 0, marker; i < $scope.lnglats.length; i++) {
                                marker = new AMap.Marker({
                                    position: $scope.lnglats[i],
                                    map: map,
                                    icon: 'img/pass/car-top.png',
                                    autoRotation: true
                                });
                                marker.setAngle($scope.cars[i].angle);
                                // marker.content = carInfo[i].car;
                                // marker.on('click', markerClick);
                            }
                        } else {
                            $log.error('车辆', result);
                        }

                    })
                })

                var map = new AMap.Map("container", {
                    zoom: 5,
                    center: [116.397428, 39.90923] //new AMap.LngLat(116.39,39.9)
                });
                AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.OverView", "AMap.StationSearch"], function () {
                    map.addControl(new AMap.ToolBar());
                    map.addControl(new AMap.Scale());
                    map.addControl(new AMap.StationSearch());
                });
                if (location.href.indexOf('&guide=1') !== -1) {
                    map.setStatus({scrollWheel: false})
                }
                //构造路线导航类
                var driving = new AMap.Driving({
                    map: map,
                    panel: "panel",
                });
                // driving.search([{keyword:'鹿鸣苑'},{keyword:'保定'}], function(status, result){
                //     //TODO 解析返回结果，自己生成操作界面和地图展示界面
                // });

                // function markerClick(e) {
                //     infoWindow.setContent(e.target.content);
                //     infoWindow.open(map, e.target.getPosition());
                // }
                map.setFitView();
            }
        };
    }])
    .directive("loadingDire", ['$http', '$log', 'PassSellService', '$stateParams', function ($http, $log, PassSellService, $stateParams) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: 'js/src/common/directives/template/loading.html',
            scope: {
                loadparam:'='
            },
            link: function ($scope, element, attrs) {


            }
        };
    }])

    /**
     * 公用详情页显示产品报价详情指令
     * @param {string} type 报价类型：
     * @param {Array} model 产品数组对象
     */
    .directive('detailsProduct', function (Dicitionary) {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                type: '@',
                model: "="
            },
            templateUrl: 'js/src/common/directives/template/details_product.html',
            controller: function ($scope, $log) {
                //根据type获取选择项数据源

                $scope.$watch('model', function () {
                    if ($scope.model) {
                        $scope.products = $scope.model;
                        console.log($scope.products)
                    }

                })

            }
        }
    })

    /**
     * 公用详情页显示产品名称属性理计公用的指令
     *
     * @param {Array} model 产品名称数组对象
     *
     */
    .directive('orderNames', function (Dicitionary) {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                model: "="
            },
            templateUrl: 'js/src/common/directives/template/order_names.html',
            controller: function ($scope, $log) {
                //根据type获取选择项数据源
                if ($scope.model) {

                }
                $scope.$watch('model', function () {
                    $scope.item = $scope.model;
                })
            }
        }
    })
