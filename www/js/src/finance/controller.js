/**
 *
 * 物流的财务
 */
angular.module('rsc.pass.finance.ctr', [])
    .controller('pass_logistics_ctrl', ['$scope', '$rootScope', '$state', 'Storage', '$ionicLoading', 'TradeEbankService', '$log', '$timeout', '$filter', 'PassBuyService', 'PassService',
        function ($scope, $rootScope, $state, Storage, $ionicLoading, TradeEbankService, $log, $timeout, $filter, PassBuyService, PassService) {
            $scope.$on("$ionicView.beforeEnter", function () {
                vm.query = {
                    page: 1,
                    status: 'effective',
                    find_role: 'user',
                    search_company: '',
                    scene: 'view',
                    is_refresh: false
                };
                //点击进行中、已完成、已失效
                vm.effective = true;
                vm.complete = false;
                vm.ineffective = false;
                queryAction()
                getCompanyCount()
                getGoodsOrderMsg()
            })

            var vm = $scope.vm = this;
            vm.reqComplete = false;//判断是否请求完成（如果是则再判断vm.orderList.length>0?）
            // 查询运输计划列表
            var queryAction = function () {
                vm.reqComplete = false;
                PassBuyService.getStatusOrder(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        vm.reqComplete = true;
                        vm.hasMore = result.data.exist;
                        if (vm.getType == 2) {
                            if (vm.orderList) {
                                vm.orderList = vm.orderList.concat(result.data.orders);
                            } else {
                                vm.orderList = result.data.orders;
                            }
                        } else {
                            vm.orderList = result.data.orders;
                        }
                    } else {
                        vm.orderList = null;
                        vm.hasMore = false;
                    }
                })
            };

            //获取与己方公司达成订单的公司列表
            var getCompanyCount = function () {
                var getCompanyCountQuery = {find_role: 'user'};
                PassService.getCompanyCount(getCompanyCountQuery).then(function (result) {
                    var status = result.status;
                    var data = result.data;
                    if (status == 'success') {
                        vm.companys = data;
                    } else {

                    }

                })
            }


            //获取总账户
            var getGoodsOrderMsg = function () {
                var status = vm.query.status;
                var scene = vm.query.scene;
                var find_role = vm.query.find_role;
                var is_refresh = true;
                var search_company = vm.query.search_company;
                PassService.getGoodsOrderMsg(status, scene, find_role, is_refresh, search_company).then(function (result) {
                    var status = result.status;
                    var data = result.data;
                    if (status == 'success') {
                        vm.goodsOrders = data;
                    } else {

                    }

                })
            }


            //货源>选取公司
            vm.companyChange = function (companyId) {
                vm.query.search_company = companyId;
                queryAction();
                getGoodsOrderMsg();
            }


            vm.clickStatus = function (type) {
                //样式改变
                if (type == 'effective') {
                    vm.effective = true;
                    vm.complete = false;
                    vm.ineffective = false;
                } else if (type == 'complete') {
                    vm.effective = false;
                    vm.complete = true;
                    vm.ineffective = false;
                } else {
                    vm.effective = false;
                    vm.complete = false;
                    vm.ineffective = true;
                }

                //发出请求
                vm.query.status = type;
                queryAction()

            }


            // 订单详情
            vm.goDetail = function (orderId) {
                $state.go('rsc.goods_order_goods_detail', {order_id: orderId})
            };

            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.query.page += 1;
                vm.getType = 2; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.getType = 1; //刷新
                vm.query.is_refresh = true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };


            //点击货源或运输
            vm.huoyuan = true;
            vm.yunshu = false;
            vm.clickOne = function (param) {
                if (param == 'huoyuan') {
                    vm.huoyuan = true;
                    vm.yunshu = false;
                } else {
                    vm.huoyuan = false;
                    vm.yunshu = true;
                }
            }
        }
    ])

    .controller('transport_order_ctrl', ['$scope', '$rootScope', '$state', 'Storage', '$ionicLoading', 'TradeEbankService', '$log', '$timeout', '$filter', 'PassBuyService', 'PassService',
        function ($scope, $rootScope, $state, Storage, $ionicLoading, TradeEbankService, $log, $timeout, $filter, PassBuyService, PassService) {
            $scope.$on("$ionicView.beforeEnter", function () {
                vm.query = {
                    page: 1,
                    status: 'effective',
                    search_company: '',
                    is_refresh: false
                };
                vm.effective = true;
                vm.complete = false;
                vm.ineffective = false;
                queryAction()
                getCompanyCount()
                getGoodsOrderMsg()
            })

            var vm = $scope.vm = this;
            vm.reqComplete = false;//判断是否请求完成（如果是则再判断vm.orderList.length>0?）
            // 查询运输订单列表
            var queryAction = function () {
                vm.reqComplete = false;
                PassBuyService.getDriverOrder(vm.query).then(function (result) {
                    vm.reqComplete = true;
                    if (result.status == 'success') {
                        vm.hasMore = result.data.exist;
                        if (vm.getType == 2) {
                            if (vm.orderList) {
                                vm.orderList = vm.orderList.concat(result.data.orders);
                            } else {
                                vm.orderList = result.data.orders;
                            }
                        } else {
                            vm.orderList = result.data.orders;
                        }
                    } else {
                        vm.orderList = null;
                        vm.hasMore = false;
                    }
                })
            };

            //获取与己方公司达成订单的公司列表
            var getCompanyCount = function () {
                var getCompanyCountQuery = {find_role: 'user'};
                PassService.getDriveCount(getCompanyCountQuery).then(function (result) {
                    var status = result.status;
                    var data = result.data;
                    if (status == 'success') {
                        vm.drivers = data;
                    } else {

                    }

                })
            }


            //获取总账户
            var getGoodsOrderMsg = function () {
                var getTranspOrderMsgParam = {
                    status: vm.query.status,
                    search_company: vm.query.search_company,
                    is_refresh: vm.query.is_refresh
                };
                PassService.getTransOrderMsg(getTranspOrderMsgParam).then(function (result) {
                    var status = result.status;
                    var data = result.data;
                    if (status == 'success') {
                        vm.driverOrders = data;
                    } else {

                    }
                })
            }


            //货源>选取公司
            vm.driverChange = function (companyId) {
                vm.query.search_company = companyId;
                queryAction();
                getGoodsOrderMsg();
            }

            //点击进行中、已完成、已失效
            vm.clickStatus = function (type) {
                //样式改变
                if (type == 'effective') {
                    vm.effective = true;
                    vm.complete = false;
                    vm.ineffective = false;
                } else if (type == 'complete') {
                    vm.effective = false;
                    vm.complete = true;
                    vm.ineffective = false;
                } else {
                    vm.effective = false;
                    vm.complete = false;
                    vm.ineffective = true;
                }

                //发出请求
                vm.query.status = type;
                vm.query.is_refresh = true;
                queryAction();
                getGoodsOrderMsg()

            }


            // 订单详情
            vm.goDetail = function (orderId) {
                $state.go('rsc.order_trans_detail', {order_id: orderId})
            };

            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.query.page += 1;
                vm.getType = 2; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.getType = 1; //刷新
                vm.query.is_refresh = true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }
    ])
