/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controller.order', ['rsc.pass.services'])
/**
 * 物流 订单获取订单数量控制器
 */
    .controller('order_ctrl', ['$scope', '$state', 'PassBuyService', '$log'
        , function ($scope, $state, PassBuyService, $log) {
            var vm = $scope.vm = this;

            vm.getCount = function () {
                PassBuyService.getOrderStatusCount({status: 'all'}).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取订单数量', result);
                        vm.waiting_count = result.data.ineffective; //待接单
                        vm.processing_count = result.data.effective; //进行中
                        vm.robbed_count = result.data.complete; //已完成
                        vm.cancel_count = result.data.cancelled; //已取消

                    } else {
                        $log.error('获取订单数量', result)
                    }
                })
            };
        }])
    /**
     * 物流 订单 待接单
     */
    .controller('waiting_ctrl', ['$scope', '$state', 'PassBuyService', '$ionicLoading', '$log'
        , function ($scope, $state, PassBuyService, $ionicLoading, $log) {
            var vm = $scope.vm = this;

            vm.init = function () {
                queryAction();
            };

            vm.query = {
                page: 1,
                getType: 1,
                status: 'ineffective',
                find_role: 'company'
            };
            var run = false;
            vm.hasMore = false;
            vm.reqcomplete=false;
            var queryAction = function () {
                if (!run) {
                    $ionicLoading.show();
                    run = true;
                    $log.debug(vm.query)
                    PassBuyService.getStatusOrder(vm.query).then(function (result) {
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.query.getType == 3) {
                                if (vm.orderList) {
                                    vm.orderList = vm.orderList.concat(result.data.orders);
                                } else {
                                    vm.orderList = result.data.orders;
                                }
                            } else {
                                vm.orderList = result.data.orders;
                            }
                            $log.debug('获取待接单订单', result);
                        } else {
                            $log.error('获取待接单订单', result);
                            vm.hasrMore = false;
                        }

                    }).finally(function () {
                        run = false;
                        $ionicLoading.hide();
                    });
                }
            };

            // 订单详情
            vm.goDetail = function (order) {
                $log.debug('待接单详情', order)
                // $state.go('sell_release.ordercenter',{order_id:order._id})
                $state.go('rsc.goods_order_goods_detail', {order_id: order._id})
            };
            //加载更多
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            vm.doRefresh = function () {
                vm.query.page = 1;
                vm.query.getType = 2;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    /**
     * 物流 订单 进行中
     */
    .controller('processing_ctrl', ['$scope', '$state', '$ionicLoading', 'PassBuyService', 'authenticationService', '$log', 'PassService'
        , function ($scope, $state, $ionicLoading, PassBuyService, authenticationService, $log, PassService) {
            var vm = $scope.vm = this;

            vm.init = function () {
                PassBuyService.getCompanyList().then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取与己方公司达成的订单的对方公司列表', result);
                        vm.companyList = result.data;
                        // vm.companyList.push()
                    } else {
                        $log.error('获取与己方公司达成的订单的对方公司列表', result);
                    }
                });
                vm.changeStatus('effective');

            };

            $scope.getAllMsg=function () {
                PassService.getMsg().then(function (response1) {
                    PassService.getGoodsOrderMsg('all', 'status', 'user',true).then(function (response2) {
                        $scope.msgData = PassService.msgDataFmt(response1)
                        $scope.goodsOrderMsg = response2.data;
                    })

                })
            }
            // 返回自动刷新
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.getAllMsg()
            })
            vm.query = {
                page: 1,
                getType: 1,
                status: 'effective',
                find_role: 'user',
                search_company: ''
            };
            // 默认激活状态
            vm.statueActive = 'effective';

            vm.changeCompany = function (item) {
                vm.query.search_company = item;
                queryAction();
            };
            vm.changeStatus = function (type) {
                vm.query.page=1;
                vm.orderList = [];
                vm.statueActive = type;
                vm.query.status = type;
                queryAction();
            };
            var run = false;
            vm.hasMore = false;
            var queryAction = function () {
                $scope.getAllMsg()
                vm.reqcomplete=false;
                if (!run) {
                    // $ionicLoading.show();
                    run = true;
                    $log.debug('vm.query', vm.query)
                    PassBuyService.getStatusOrder(vm.query).then(function (result) {
                        vm.reqcomplete=true;
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.query.getType == 3) {
                                if (vm.orderList) {
                                    vm.orderList = vm.orderList.concat(result.data.orders);
                                } else {
                                    vm.orderList = result.data.orders;
                                }
                            } else {
                                vm.orderList = result.data.orders;
                            }
                            $log.debug('获取订单', result);
                        } else {
                            vm.orderList = null;
                            $log.error('获取订单', result);
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        vm.reqcomplete=true;
                        run = false;
                        // $ionicLoading.hide();
                    });
                }
            };

            // 订单详情
            vm.goDetail = function (order) {
                $log.debug('订单详情', order)
                // $state.go('sell_release.ordercenter',{order_id:order._id})
                $state.go('rsc.goods_order_goods_detail', {order_id: order._id})
            };

            //加载更多
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            vm.doRefresh = function () {
                vm.query.page = 1;
                vm.query.getType = 2;
                vm.query.is_refresh = true;
                ;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    /**
     * 物流 订单 已完成
     */
    .controller('robbed_ctrl', ['$scope', '$state', '$ionicLoading', 'PassBuyService', 'authenticationService', '$log'
        , function ($scope, $state, $ionicLoading, PassBuyService, authenticationService, $log) {
            var vm = $scope.vm = this;
            vm.init = function () {
                queryAction();
            };

            vm.query = {
                page: 1,
                getType: 1,
                status: 'complete',
                find_role: 'company'
            };
            var run = false;
            vm.hasMore = false;

            var queryAction = function () {
                if (!run) {
                    $ionicLoading.show();
                    run = true;
                    $log.debug(vm.query)
                    PassBuyService.getStatusOrder(vm.query).then(function (result) {
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.query.getType == 3) {
                                if (vm.orderList) {
                                    vm.orderList = vm.orderList.concat(result.data.orders);
                                } else {
                                    vm.orderList = result.data.orders;
                                }
                            } else {
                                vm.orderList = result.data.orders;
                            }
                            $log.debug('获取已完成订单', result);
                        } else {
                            vm.orderList = null;
                            $log.error('获取已完成订单', result);
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        run = false;
                        $ionicLoading.hide();
                    });
                }
            };

            // 订单详情
            vm.goDetail = function (order) {
                $log.debug('已完成详情', order)
                // $state.go('sell_release.ordercenter',{order_id:order._id})
                $state.go('rsc.goods_order_goods_detail', {order_id: order._id})
            };

            //加载更多
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            vm.doRefresh = function () {
                vm.query.page = 1;
                vm.query.getType = 2;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    /**
     * 物流 订单 已取消
     */
    .controller('cancel_ctrl', ['$scope', '$state', '$ionicLoading', 'PassBuyService', 'authenticationService', '$log'
        , function ($scope, $state, $ionicLoading, PassBuyService, authenticationService, $log) {
            var vm = $scope.vm = this;

            vm.init = function () {
                queryAction();
            };

            vm.query = {
                page: 1,
                getType: 1,
                status: 'cancelled',
                find_role: 'company'
            };
            var run = false;
            vm.hasMore = false;

            var queryAction = function () {
                if (!run) {
                    $ionicLoading.show();
                    run = true;
                    $log.debug(vm.query)
                    PassBuyService.getStatusOrder(vm.query).then(function (result) {
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.query.getType == 3) {
                                if (vm.orderList) {
                                    vm.orderList = vm.orderList.concat(result.data.orders);
                                } else {
                                    vm.orderList = result.data.orders;
                                }
                            } else {
                                vm.orderList = result.data.orders;
                            }
                            $log.debug('获取已取消订单', result);
                        } else {
                            vm.orderList = null;
                            $log.error('获取已取消订单', result);
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        run = false;
                        $ionicLoading.hide();
                    });
                }
            };

            // 订单详情
            vm.goDetail = function (order) {
                $log.debug('已取消详情', order)
                // $state.go('sell_release.ordercenter',{order_id:order._id})
                $state.go('rsc.goods_order_goods_detail', {order_id: order._id})
            };

            //加载更多
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            vm.doRefresh = function () {
                vm.query.page = 1;
                vm.query.getType = 2;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
