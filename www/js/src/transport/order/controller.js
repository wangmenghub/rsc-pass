/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controllers.PassSellOrder', ['rsc.pass.services'])
//物流 运 订单 进行中
    .controller('trans_order_doing_ctrl', ['$scope', '$state', '$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', 'PassSellService', 'PassService','PassBuyService',
        function ($scope, $state, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, PassSellService, PassService,PassBuyService) {
            var vm =  $scope.vm = this;
            $scope.special = true;
            $scope.hasMore = false;

            $scope.$on('$ionicView.enter', function () {
                vm.init()
            })

            vm.init = function () {
                vm.effective=true;
               vm.ineffective=false;
                vm.getType = 1;
                // 查询运输计划列表
                vm.query = {
                    page: 1,
                    scene: 'selfUser',
                    is_refresh:false,
                    status:'effective'
                };
                queryAction();
            }




            var queryAction = function () {
                PassSellService.getReleaseOrdersNew(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        vm.hasMore = result.data.exist;
                        if (vm.getType == 2) {
                            if (vm.orderList) {
                                vm.orderList = vm.orderList.concat(result.data.demand);
                            } else {vm.orderList = result.data.demand; }
                        } else { vm.orderList = result.data.demand; }
                    } else {
                        vm.orderList = null;
                        vm.hasMore = false;
                    }
                    vm.query.is_refresh=false;
                })
            };



            vm.clickStatus=function (status) {
                vm.query.status=status;
                if(status=='effective'){
                    vm.effective=true;
                    vm.ineffective=false;

                }else{
                    vm.ineffective=true;
                    vm.effective=false;
                }
                queryAction()

            };


            // 订单详情
            vm.goDetail = function (orderId) {
                $state.go('rsc.trans_assign_detail', {
                    demand_id: orderId,
                    source: 'grab'
                })
            };

            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.query.page += 1;
                vm.getType  = 2; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.getType  = 1; //刷新
                vm.query.is_refresh=true
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    //物流 运 订单 已完成
    .controller('trans_order_already_ctrl', ['$scope', '$state', '$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', 'PassSellService', 'PassService',
        function ($scope, $state, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, PassSellService, PassService) {
            var vm = this;
            $scope.special = true;
            $scope.query = {
                type: '',
                page: 1,
                scene: 'selfComp',
                status: 'complete',
                getType: 1
            };
            var run = false;
            $scope.hasMore = false;
            vm.init = function () {
                queryAction();
            };
            $scope.getAllMsg=function () {
                PassService.getMsg().then(function (response1) {
                    PassService.getTranspOrderMsg('all', 'status', 'user').then(function (response2) {
                        $scope.transpmsg = PassService.msgDataFmt(response1).data.transportation;
                        $scope.transpOrderMsg = response2.data;
                        $rootScope.RmsgData=PassService.msgDataFmt(response1);
                    })
                })
            }
            $scope.$on("$ionicView.beforeEnter", function () {
                // $rootScope.transport()
                $scope.getAllMsg()
            })
            var queryAction = function () {
                $scope.getAllMsg()
                if (!run) {
                    vm.reqcomplete=false;
                    run = true;
                    // $ionicLoading.show();
                    PassSellService.getDemandOrder($scope.query).then(function (result) {
                        vm.reqcomplete=true;
                        if (result.status == 'success') {
                            $scope.hasMore = result.data.exist;
                            if ($scope.query.getType == 3) {
                                $scope.orders = $scope.orders.concat(result.data.demand);
                            } else {
                                $scope.orders = result.data.demand;
                            }
                            $log.debug('获取司机订单', result);
                        } else {
                            $scope.orders = null;
                            run = false;
                            $scope.hasMore = false;
                            $log.debug('获取司机订单', result);
                        }
                    }).finally(function () {
                        $ionicLoading.hide();
                    })
                } else {
                    vm.reqcomplete=true;
                    run = false;
                    if ($scope.query.getType == 3) {
                        $scope.query.page -= 1;
                    }
                }
            };
            $scope.goOrderDetail = function (order) {
                $state.go('rsc.order_trans_detail', {
                    order_id: order._id,
                    order_index: order.index
                });
            };
            //无限加载执行的方法
            $scope.loadMore = function () {
                $scope.query.page += 1;
                $scope.query.getType = 3; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                PassService.getMsg().then(function (response1) {
                    PassService.getTranspOrderMsg('all', 'status', 'user',true).then(function (response2) {
                        $scope.transpmsg = PassService.msgDataFmt(response1).data.transportation;
                        $scope.transpOrderMsg = response2.data;
                    })
                })
                //页面在顶部的时候为第一页
                $scope.query.page = 1;
                $scope.query.getType = 2; //刷新
                $scope.query.is_refresh=true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    //物流 运 订单 指派
    .controller('assignorderdetailsCtrl', function ($scope, $stateParams, $log, PassSellService, $ionicLoading) {
        var vm = this;
        var data;
        vm.demand_id = $stateParams.demand_id;
        vm.phoneNumbers = [];
        vm.init = function () {
            data = {
                demand_id: $stateParams.demand_id,
                demand_index: $stateParams.demand_index,
                index_order: $stateParams.index_order
            }
            $ionicLoading.show();
            PassSellService.getAssignTruckInfo($stateParams.demand_id, 'demand').then(function (result) {
                if (result.status == 'success') {
                    $log.debug('获取已派单车辆', result);
                    vm.offerCarList = result.data;
                } else {
                    $log.error('获取已派单车辆', result)
                }
            })
            PassSellService.getDemandOrderById(data).then(function (result) {
                $log.debug('获取订单信息', result);
                if (result.status = 'success') {
                    vm.order = result.data;
                } else {
                    $log.error('获取订单信息失败', result);
                    $ionicLoading.hide();
                    iAlert.alert('获取订单信息失败!');

                }
            }, function (result) {
                $log.error('获取订单信息失败', result);
                $ionicLoading.hide();

            }).finally(function () {
                $ionicLoading.hide();
            });
        };
    })
    //物流 运 订单 司机抢单详情
    .controller('supplyorderdetailsCtrl', function ($scope, $stateParams, PassSellService, StoreManage, $log, $ionicLoading) {
        var vm = this;
        var data;
        vm.phoneNumbers = [];
        vm.demand_id = $stateParams.demand_id;
        vm.init = function () {
            data = {
                demand_id: $stateParams.demand_id,
                demand_index: $stateParams.demand_index,
                index_order: $stateParams.index_order
            }
            vm.address = {};
            $ionicLoading.show();
            PassSellService.getDemandOrderById(data).then(function (result) {
                $log.debug('获取订单信息', result);
                if (result.status = 'success') {
                    vm.order = result.data;
                } else {
                    $log.error('获取订单信息失败', result);
                    $ionicLoading.hide();
                    iAlert.alert('获取订单信息失败!');

                }
            }, function (result) {
                $log.error('获取订单信息失败', result);
                $ionicLoading.hide();

            }).finally(function () {
                $ionicLoading.hide();
            });
        };
    })
    .controller('pass_sell_order_ctrl', function ($scope, PassSellService, $log, Storage) {
        $scope.init = function () {
            $scope.company = Storage.get('userInfo');
            var data = {
                status: 'all',
                scene: 'selfComp',
                company_id: $scope.company._id
            }
            PassSellService.getDriverCoun(data).then(function (result) {
                if (result.status == 'success') {
                    $scope.effective = result.data.effective;
                    $scope.ineffective = result.data.ineffective;
                    $log.debug('获取进行中与已完成订单个数', result)
                } else {
                    $log.debug('获取进行中与已完成订单个数', result)
                }
            })
        }
    })
    //物流 运输订单详情
    .controller('order_trans_detail_ctrl', function ($scope, PassSellService, $log, $stateParams, $ionicLoading, iAlert, $ionicModal) {
        var vm = this;
        // vm.source = $stateParams.source;
        vm.init = function () {
            PassSellService.getOrderOne($stateParams.order_id, $stateParams.order_index).then(function (result) {
                $log.debug('获取订单信息', result);
                if (result.status = 'success') {
                    vm.order = result.data;
                    vm.driveOrder();
                } else {
                    $log.error('获取订单信息失败', result);
                    $ionicLoading.hide();
                    iAlert.alert('获取订单信息失败!');

                }
            }, function (result) {
                $log.error('获取订单信息失败', result);
                $ionicLoading.hide();

            }).finally(function () {
                $ionicLoading.hide();
            });
        };
        vm.driveOrder = function () {
            PassSellService.getDriverOrderOne(vm.order.order_id).then(function (result) {
                if (result.status == 'success') {
                    $log.debug('获取司机运输详情', result)
                    $scope.driverOrderDetail = result.data.driverDemand;
                    angular.forEach($scope.driverOrderDetail[0].orderList,function(orderList){
                       if(orderList._id == $stateParams.order_id){
                         $scope.driverOrder = orderList;
                         $log.debug('车辆信息',$scope.driverOrder)
                       }
                    })

                } else {
                    $log.debug('获取司机运输详情', result)
                }
            })
        }
        //运输货物
        vm.productsDetail = function () {
            vm.openModal();
        }
        //运输货物模态框
        $ionicModal.fromTemplateUrl('./js/src/transport/transport/product_detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal_product = modal;
        });
        vm.openModal = function () {
            $scope.modal_product.show();
        };
        vm.closeModal = function () {
            $scope.modal_product.hide();
        };
    })
