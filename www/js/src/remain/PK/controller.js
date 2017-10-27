/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controller.pk', ['rsc.pass.services'])
/**
 * 物流 pk 获取订单数量控制器
 */
    .controller('pk_ctrl', ['$scope', 'PassBuyService', '$ionicLoading', '$log'
        , function ($scope, PassBuyService, $ionicLoading, $log) {
            var vm = $scope.vm = this;
            // //已参与抢单 已取消抢单 数量
            vm.getCount = function () {
                vm.query = {
                    status: 'all',
                    find_role: 'company',
                    scene: 'self'
                };
                PassBuyService.getOfferStatusCount(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取订单数量', result);
                        vm.processing_count = result.data.effective;
                        vm.cancel_count = result.data.ineffective;
                    } else {
                        $log.error('获取订单数量', result);
                    }

                }).finally(function () {
                    $log.error('获取已抢单订单', result);
                })
            }
        }])
    /**
     * 物流 计划 已取消抢单
     */
    .controller('cancel_demand_ctrl', ['$scope', 'PassBuyService', '$ionicLoading', '$log'
        , function ($scope, PassBuyService, $ionicLoading, $log) {
            var vm = $scope.vm = this;

            vm.init = function () {
                queryAction();
            };

            vm.orderQuery = {
                page: 1,
                getType: 1,
                status: 'ineffective'
            };

            var run = false;
            vm.hasMore = false;

            // 获取订单列表
            var queryAction = function () {
                if (!run) {
                    $ionicLoading.show();
                    run = true;
                    PassBuyService.getOfferBuyRole(vm.orderQuery).then(function (result) {
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.orderQuery.getType == 3) {
                                if (vm.offers) {
                                    vm.offers = vm.offers.concat(result.data.offers);
                                } else {
                                    vm.offers = result.data.offers;
                                }
                            } else {
                                vm.offers = result.data.offers;
                            }
                            $log.debug('获取已取消抢单', result);
                        } else {
                            $log.error('获取已取消抢单', result);
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        run = false;
                        $ionicLoading.hide();
                    })
                }
            };

            // 需求单详情
            vm.goDetail = function (offer) {
                $log.debug('已取消抢单', offer)
            };

            //加载更多
            vm.loadMore = function () {
                vm.orderQuery.page += 1;
                vm.orderQuery.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            //下拉刷新
            vm.doRefresh = function () {
                vm.orderQuery.page = 1;
                vm.orderQuery.getType = 2;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    /**
     * 物流 计划 已参与抢单
     */
    .controller('processing_demand_ctrl', ['$scope', 'PassBuyService', '$ionicLoading', '$log', '$state', 'PassService','$timeout'
        , function ($scope, PassBuyService, $ionicLoading, $log, $state, PassService,$timeout) {
            var vm = $scope.vm = this;
            vm.init = function () {
                vm.orderQuery = {
                    page: 1,
                    getType: 1,
                    status: 'effective',
                    is_refresh:false
                };
                queryAction();
            };

            //Ionic页面的生命周期之$ionicView.beforeEnter：视图是即将进入并成为活动视图
            $scope.$on('$ionicView.beforeEnter', function () {
                vm.init();
            })




            var run = false;
            vm.hasMore = false;


            // 获取订单列表
            vm.reqcomplete=false;
            var queryAction = function () {
                if (!run) {
                    run = true;
                    PassBuyService.getPlanList(vm.orderQuery).then(function (result) {
                        vm.reqcomplete=true;
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.orderQuery.getType == 3) {
                                if (vm.offers) {
                                    vm.offers = vm.offers.concat(result.data.list);
                                } else {
                                    vm.offers = result.data.list;
                                }
                            } else {
                                vm.offers = result.data.list;
                            }
                            $log.debug('获取已参与订单', result);
                        } else {
                            $log.error('获取已参与订单', result);
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        vm.reqcomplete=true;
                        run = false;
                        // $ionicLoading.hide();
                    })
                }
            };

            // 需求单详情
            vm.goDetail = function (offer) {
                $log.debug('已参与抢单', offer)
                $state.go('rsc.goods_detail', {demand_id: offer.demand_id, wait: true})
            };

            //加载更多
            vm.loadMore = function () {
                vm.orderQuery.page += 1;
                vm.orderQuery.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            //下拉刷新
            vm.doRefresh = function () {
                vm.orderQuery.page = 1;
                vm.orderQuery.getType = 2;
                vm.orderQuery.is_refresh = true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
