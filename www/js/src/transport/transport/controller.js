/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controllers.PassSellTrans', ['rsc.pass.sell.service','rsc.pass.services'])
    .controller('pass_sell_ctrl', ['$scope', 'PassSellService', '$log', function ($scope, PassSellService, $log) {
        var data;
        $scope.init = function () {
            data = {
                status: 'all',
                scene: 'status',
                find_role: 'company'
            }
            PassSellService.getDemandCount(data).then(function (result) {
                if (result.status == 'success') {
                    $scope.ineffective = result.data.ineffective;
                    $scope.complete = result.data.complete;
                    $scope.cancelled = result.data.cancelled + result.data.ineffective;
                    $scope.effective = result.data.effective;
                    $log.debug('获取需求单数量', result);
                } else {
                    $log.error('获取需求单数量', result);
                }
            });
        };

    }])
    //物流 运 运输 我发布的司机抢单
    .controller('trans_grab_ctrl', ['$scope', '$state', '$timeout','$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', 'PassSellService','PassService','PassBuyService',
        function ($scope, $state,$timeout, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, PassSellService,PassService,PassBuyService) {
            var vm = $scope.vm = this;
            vm.hasMore = false;

            $scope.$on('$ionicView.enter', function () {
                $ionicSlideBoxDelegate.$getByHandle("basePage").update();
            })

            vm.init = function () {
                vm.getType = 1;
                // 查询运输大厅列表
                vm.query = {
                    page: 1,
                    status: 'effective',
                    find_role: 'user',
                    search_company: '',
                    scene:'assign',
                    is_refresh:'false'//请求最新的数据
                };
                queryAction();

            }



            var queryAction = function () {
                PassBuyService.getStatusOrder(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        vm.hasMore = result.data.exist;
                        if (vm.getType == 2) {
                            if (vm.orderList) {
                                vm.orderList = vm.orderList.concat(result.data.orders);
                            } else {vm.orderList = result.data.orders; }
                        } else { vm.orderList = result.data.orders; }
                    } else {
                        vm.orderList = null;
                        vm.hasMore = false;
                    }
                })
            };

            // 订单详情
            vm.goDetail = function (orderId) {
                $state.go('rsc.goods_order_goods_detail', {order_id: orderId})
            };

            //无限加载执行的方法
            $scope.loadMore = function () {
                 vm.query.page += 1;
                 vm.getType = 2;//追加
                 queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.getType = 1; //刷新
                vm.query.is_refresh=true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };

            //添加车辆
            vm.addCar=function () {
               $state.go('rsc.add_driver')
            }
        }])
    //物流 运 运输 已取消抢单
    .controller('trans_cancle_ctrl', ['$scope', '$state', '$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', 'PassSellService','PassService',
        function ($scope, $state, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, PassSellService,PassService) {
            var vm = this;
            vm.isCancle = true;
            var data;
            vm.query = {
                page: 1,
                scene: 'selfUser',
                status: 'cancelled',
				is_refresh:true
            };
            var run = false;
            vm.hasMore = false;
            $scope.getAllMsg=function () {
                PassService.getMsg().then(function (response) {
                    $scope.transpmsg = PassService.msgDataFmt(response).data.transportation;
                    $scope.msgData = PassService.msgDataFmt(response);
                    $rootScope.RmsgData=PassService.msgDataFmt(response);
                })
            }
            $scope.$on('$ionicView.enter', function () {
                $log.debug('enter')
                $ionicSlideBoxDelegate.$getByHandle("basePage").update();
                $scope.getAllMsg()
            })
            vm.init = function () {
                vm.query.getType = 1;
                queryAction();
            }
            var queryAction = function () {
                $scope.getAllMsg()
                data = {
                    status: 'all',
                    scene: 'status',
                    find_role: 'company'
                }
                if (!run) {
                    // $ionicLoading.show();
                    run = true;
                    vm.reqcomplete=false;
                    PassSellService.getReleaseOrdersNew(vm.query).then(function (result) {
                        run = false;
                        vm.reqcomplete=true;
                        $log.debug('获取发布订单', result);
                        if (result.status == 'success') {
                            vm.hasMore = result.data.exist;
                            if (vm.query.getType == 3) {
                                if (vm.orders) {
                                    vm.orders = vm.orders.concat(result.data.demand);
                                } else {
                                    vm.orders = result.data.demand;
                                }
                            } else {
                                vm.orders = result.data.demand;
                            }
                        } else {
                            vm.orders = null;
                            $log.error('获取发布订单', result);
                            run = false;
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        vm.reqcomplete=true;
                        $ionicLoading.hide();
                    });
                    PassSellService.getDemandCount(data).then(function (result) {
                        if (result.status == 'success') {
                            $scope.ineffective = result.data.ineffective;
                            $scope.complete = result.data.complete;
                            $scope.cancelled = result.data.cancelled;
                            $scope.effective = result.data.effective;
                            $scope.transp={
                                expired : result.data.ineffective,
                                complete : result.data.complete,
                                canceled : result.data.cancelled,
                                underway : result.data.effective
                            }
                            $log.debug('获取需求单数量', result);
                        } else {
                            $log.error('获取需求单数量', result);
                        }
                    });

                } else {
                    if (vm.query.getType == 3) {
                        vm.query.page -= 1;
                    }
                }
            };
            $scope.goDetail = function (order) {
                $state.go('rsc.trans_assign_detail', {
                    demand_id: order._id,
                    demand_index: order.index,
                    index_order: order.index_order,
                    source: 'cancle'
                })
            };
            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.query.getType = 2; //刷新
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    //物流 运 运输 已完成
    .controller('trans_complete_ctrl', ['$scope', '$state', '$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', 'PassSellService','PassService',
        function ($scope, $state, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, PassSellService,PassService) {
            var vm = this;
            vm.isCancle = true;
            var data;
            vm.query = {
                page: 1,
                scene: 'selfUser',
                status: 'ineffective',
				is_refresh:true
            };
            var run = false;
            vm.hasMore = true;
            $scope.getAllMsg=function () {
                PassService.getMsg().then(function (response) {
                    $scope.transpmsg = PassService.msgDataFmt(response).data.transportation;
                    $scope.msgData = PassService.msgDataFmt(response);
                    $rootScope.RmsgData=PassService.msgDataFmt(response);
                })
            }
            $scope.$on('$ionicView.enter', function () {
                $log.debug('enter')
                $ionicSlideBoxDelegate.$getByHandle("basePage").update();
                $scope.getAllMsg()
            })
            vm.init = function () {
                vm.query.getType = 1;
                queryAction();
            }
            var queryAction = function () {
                $scope.getAllMsg()
                data = {
                    status: 'all',
                    scene: 'status',
                    find_role: 'company'
                }
                if (!run) {
                    // $ionicLoading.show();
                    run = true;
                    vm.reqcomplete=false;
                    PassSellService.getReleaseOrdersNew(vm.query).then(function (result) {
                        run = false;
                        vm.reqcomplete=true;
                        $log.debug('获取发布订单', result);
                        if (result.status == 'success') {
                            result.data.demand.length==5?vm.hasMore=true:vm.hasMore=false;
                           /* vm.hasMore = result.data.exist;*/
                            if (vm.query.getType == 3) {
                                if (vm.orders) {
                                    vm.orders = vm.orders.concat(result.data.demand);
                                } else {
                                    vm.orders = result.data.demand;
                                }
                            } else {
                                vm.orders = result.data.demand;
                            }
                        } else {
                            vm.orders = null;
                            $log.error('获取发布订单', result);
                            run = false;
                            vm.reqcomplete=true;
                            vm.hasMore = false;
                        }

                    }).finally(function () {
                        $ionicLoading.hide();
                    });
                    PassSellService.getDemandCount(data).then(function (result) {
                        if (result.status == 'success') {
                            $scope.ineffective = result.data.ineffective;
                            $scope.complete = result.data.complete;
                            $scope.cancelled = result.data.cancelled;
                            $scope.effective = result.data.effective;
                            $log.debug('获取需求单数量', result);
                            $scope.transp={
                                expired : result.data.ineffective,
                                complete : result.data.complete,
                                canceled : result.data.cancelled,
                                underway : result.data.effective
                            }
                        } else {
                            $log.error('获取需求单数量', result);
                        }
                    });

                } else {
                    if (vm.query.getType == 3) {
                        vm.query.page -= 1;
                    }
                }
            };
            $scope.goDetail = function (order) {
                $state.go('rsc.trans_assign_detail', {
                    demand_id: order._id,
                    demand_index: order.index,
                    index_order: order.index_order,
                    source: 'ineffective'
                })
            };
            //无限加载执行的方法
            $scope.loadMore = function () {

                vm.query.page += 1;
                vm.query.getType = 3; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                vm.query.page = 1;
                vm.query.getType = 2; //刷新
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
   //物流 运 运输顶部导航tab
    .controller('transportcenterCtrl', ['$scope', '$state', '$stateParams', 'PassSellService', '$log', function ($scope, $state, $stateParams, PassSellService, $log) {
        $scope.id = $stateParams.demand_id;
        $scope.leftBtn = true;
        $scope.init = function () {
            $state.go('rsc.trans_assign_detail')
        }

        $scope.goDetail = function () {
            if ($scope.leftBtn) {
                $scope.leftBtn = false;
                $state.go('rsc.trans_supply_details')
            } else {
                $scope.leftBtn = true;
                $state.go('rsc.trans_assign_detail')
            }
        };
        $scope.closeDemand = function () {
            PassSellService.driverDemandClose($scope.id).then(function (result) {
                if (result.status == 'success') {
                    $log.debug('取消指派', result);
                } else {
                    $log.error('取消指派', result);
                }
            })
        }
    }])
    //物流 运 运输 指派
    .controller('trans_assign_detail_ctrl', function ($scope, $rootScope, $stateParams, $log, PassSellService, $ionicLoading, ShareWeChat, iAlert, $state, $bottomSheet, $cordovaClipboard, ShareHelpNew, ENV,$ionicHistory) {
        var vm = this;
        var data;
        vm.overtime = 'start';
        vm.phoneNumbers = [];
        vm.demand_id = $stateParams.demand_id;
        vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
        vm.demand_index = $stateParams.demand_index;
        vm.index_order = $stateParams.index_order;
        vm.source = $stateParams.source;
        vm.myUser = {};
        $scope.shareInfo = {
            msg: {
                url: "http://" + ENV.shareHost + '/personHome.html?' + $rootScope.currentUser.user._id + "."+$rootScope.shareAppKey,
                // description: '',
                // type: '【物流抢单】',
                description: '邀请您在线进行交易',
                tagName: 'rsc',
                img: $rootScope.currentUser.user.photo_url?$rootScope.currentUser.user.photo_url:vm.myUrl
            },
            opts: {
                hideSms: false,
                type: '',
                params: {}

            },
            params: {
                route: {
                    // type: 'trafficDemand',
                    id: $rootScope.currentUser.user._id
                }
            }

        }
        $scope.init = function () {
            $ionicLoading.show();
            data = {
                demand_id: $stateParams.demand_id,
                demand_index: $stateParams.demand_index,
                index_order: $stateParams.index_order
            }
            if(!$rootScope.currentUser.company.nick_name){
                $scope.shareInfo.msg.title = $rootScope.currentUser.user.real_name;
            }else{
                $scope.shareInfo.msg.title = $rootScope.currentUser.company.nick_name + ' ' +$rootScope.currentUser.user.real_name;
            }
            PassSellService.getAssignTruckInfo($stateParams.demand_id, 'demand').then(function (result) {
                if (result.status == 'success') {
                    $log.debug('获取已派单车辆', result);
                    vm.offerCarList = result.data;
                } else {
                    $log.error('获取已派单车辆', result);
                }
            })
            PassSellService.getDemandOrderById(data).then(function (result) {
                $log.debug('获取订单信息', result);
                if (result.status = 'success') {
                    vm.order = result.data;
                    $scope.shareInfo.msg.description = '发布'+vm.order.send_city+'至'+vm.order.receive_city+'运输，立即查看。';
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
        vm.finsh = function () {
            vm.overtime = 'finsh';
        }
        vm.closeDemand = function () {
            iAlert.confirm('提示', '您确定要取消指派吗？', function () {
                PassSellService.driverDemandClose(vm.demand_id).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('取消指派', result);
                        $state.go('rsc.trans_grab');
                    } else {
                        iAlert.alert('取消指派失败');
                        $log.error('取消指派', result);
                    }
                })
            })

        }
        $scope.doRefresh = function () {
            $scope.init();
            $scope.$broadcast('scroll.refreshComplete');
        }
        ShareHelpNew.initShare($scope, $scope.shareInfo);
        $scope.shareAction = function () {
            $scope.show();
        };
        vm.goBack = function () {
            var isGoback= $stateParams.isGoback;
            if(isGoback){
                $rootScope.rootGoBack();
            }else{
                $state.go('rsc.trans_order_doing');
            }

            // $ionicHistory.nextViewOptions({
            //     disableAnimate: true,
            //     disableBack: true,
            //     historyRoot:true
            // });
            // $ionicViewSwitcher.nextDirection("back")
            // switch (vm.source){
            //     case 'grab':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });
            //     $state.go('rsc.trans_grab')
            //         break;
            //     case 'ineffective':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });$state.go('rsc.trans_complete')
            //         break;
            //     case 'cancle':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });$state.go('rsc.trans_cancle')
            //         break;
            // }
        }
    })
    //物流 运 运输 司机抢单详情
    .controller('trans_supply_details_ctrl', function ($scope, $stateParams, PassSellService, $log, $ionicLoading, $bottomSheet, Storage,$ionicModal,$rootScope,$ionicViewSwitcher,ShareWeChat,ShareHelpNew,$state,$ionicHistory,ENV,iAlert) {
        var vm = this;
        var data;
        vm.overtime = 'start';
        vm.phoneNumbers = [];
        vm.demand_id = $stateParams.demand_id;
        vm.demand_index = $stateParams.demand_index;
        vm.index_order = $stateParams.index_order;
        vm.source = $stateParams.source;
        vm.company = Storage.get('userInfo').company;
        vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
        vm.myUser = {};
        $scope.shareInfo = {
            msg: {
                url: "http://" + ENV.shareHost + '/personHome.html?' + $rootScope.currentUser.user._id + "."+$rootScope.shareAppKey,
                // description: '',
                // type: '【物流抢单】',
                description: '邀请您在线进行交易',
                tagName: 'rsc',
                img: $rootScope.currentUser.user.photo_url?$rootScope.currentUser.user.photo_url:vm.myUrl
            },
            opts: {
                hideSms: false,
                type: '',
                params: {}

            },
            params: {
                route: {
                    // type: 'trafficDemand',
                    id: $rootScope.currentUser.user._id
                }
            }

        }
        $scope.init = function () {
            data = {
                demand_id: vm.demand_id,
                demand_index: vm.demand_index,
                index_order: vm.index_order
            }
            vm.address = {};
            if(!$rootScope.currentUser.company.nick_name){
                $scope.shareInfo.msg.title = $rootScope.currentUser.user.real_name;
            }else{
                $scope.shareInfo.msg.title = $rootScope.currentUser.company.nick_name+ ' ' +  $rootScope.currentUser.user.real_name;
            }
            $ionicLoading.show();
            PassSellService.getDemandOrderById(data).then(function (result) {
                $log.debug('获取订单信息', result);
                if (result.status = 'success') {
                    vm.order = result.data;
                    $scope.shareInfo.msg.description = '发布'+vm.order.send_city+'至'+vm.order.receive_city+'运输，立即查看。';
                    vm.companyInfo();
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
        vm.finsh = function () {
            vm.overtime = 'finsh';
        }
        ShareHelpNew.initShare($scope, $scope.shareInfo);
        $scope.shareAction = function () {
            $scope.show();
        };
        vm.closeDemand = function () {
            iAlert.confirm('提示', '您确定要取消指派吗？', function () {
                PassSellService.driverDemandClose(vm.demand_id).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('取消指派', result);
                        $state.go('rsc.trans_grab');
                    } else {
                        iAlert.alert('取消指派失败');
                        $log.error('取消指派', result);
                    }
                })
            })

        }
        //下拉刷新执行方法
        $scope.doRefresh = function () {
            $scope.init();
            $scope.$broadcast('scroll.refreshComplete');
        };
        vm.companyInfo = function () {
            PassSellService.getTrafficCompany(vm.company._id, vm.company.type).then(function (result) {
                if (result.status == 'success') {
                    vm.companyInfo = result.data;
                    $log.debug('公司信息', result)
                } else {
                    $log.error('公司信息', result)
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
        vm.goBack = function () {
            $state.go('rsc.trans_order_doing')
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true,
                historyRoot:true
            });
            $ionicViewSwitcher.nextDirection("back")
            // switch (vm.source){
            //     case 'grab':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });$state.go('rsc.trans_grab')
            //         break;
            //     case 'ineffective':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });$state.go('rsc.trans_complete')
            //         break;
            //     case 'cancle':
            //         $ionicHistory.nextViewOptions({
            //         historyRoot: true,
            //         disableAnimate: true
            //     });$state.go('rsc.trans_cancle')
            //         break;
            // }
        }
        // $rootScope.$on('$stateChangeStart', function () {
        //     $scope.init();
        // });
    })
    //物流 运 运输 司机运输详情
    .controller('dirver_detail_ctrl', function ($scope, $stateParams, PassSellService, $log, $ionicLoading, $filter, $state, iAlert, ionicToast,$ionicModal,RscAlert,GlobalService) {
        var vm = this;
        vm.user_id = $stateParams.user_id;
        vm.demand_id = $stateParams.demand_id;
        vm.status = $stateParams.status;
        vm.order_id = $stateParams.order_id;
		vm.assign_amount = true;
        vm.truckList = {};
        var data;
        var replaceData;
        var weight;
        vm.long = {
            amount: 0
        };
        if (vm.status != 'ineffective'&&vm.status != 'wait_assign') {
            vm.source = 'driver_order';
        } else {
            vm.source = 'assign';
        }
        var globalPriceMax='';
        vm.init = function () {
            $ionicLoading.show();
            data = {
                user_id: vm.user_id,
                scene: vm.source,
                order_id: vm.order_id ? vm.order_id : vm.demand_id
            }
            PassSellService.getTransUserCard(data).then(function (result) {
                $log.debug('获取司机信息', result);
                if (result.status = 'success') {
                    vm.dirverTransDetail = result.data;
                    console.log('vm.dirverTransDetail')
                    console.log(vm.dirverTransDetail)
                    vm.order_index = result.data.order_index;
                    weight = $filter('carMaxWeight')(vm.dirverTransDetail.truck_weight);
                    if (vm.status == 'ineffective'||vm.status == 'wait_assign') {
                        PassSellService.getTruckAssign((vm.order_id ? vm.order_id : vm.demand_id), weight).then(function (res) {
                            $log.info('获取运输信息', res);
                            if (res.status == 'success') {
                                vm.truckList = res.data;
									vm.truckList.type = vm.truckList.product_categories[0].type;
									vm.truckList.newamount = vm.truckList.product_categories[0].amount;
									vm.truckList.amount_remain = vm.truckList.amount_total - vm.truckList.product_categories[0].amount;
									//产品种类
									angular.forEach(vm.truckList.product_categories, function (pro, index) {
										angular.forEach(pro.product_name, function (product_name, index) {
                                            var myconst={};
                                            GlobalService.es5Const().setConst(myconst,'priceMax',product_name.number);
                                            globalPriceMax=GlobalService.es5Const().getConst(myconst,'priceMax');
											vm.long.amount = vm.long.amount + product_name.amount;
											vm.long.count_remain = vm.truckList.amount_total - vm.truckList.amount;
											// long.max = long.count_assign + (long.count_remain ? long.count_remain : 0);

										})
									});
                            } else if(res.msg = 'driverDemand_not_found'){
                                vm.assign_amount = false;
                            } else {
                                $log.error('获取运输信息', result);
                            }
                        })
                    } else {
                        vm.truckList = vm.dirverTransDetail.order;
                        vm.truckList.type = vm.dirverTransDetail.order.product_categories[0].type;
                        vm.order = vm.truckList
                    }
                } else {
                    $log.error('获取司机信息', result);
                    $ionicLoading.hide();
                }
            }, function (result) {
                $log.error('获取司机信息', result);
                $ionicLoading.hide();

            }).finally(function () {
                $ionicLoading.hide();
            });

        };
        vm.confirm = function (type) {
			if(vm.truckList.product_categories[0].unit != vm.truckList.product_categories[0].pass_unit){
				if(vm.long.amount > vm.dirverTransDetail.truck_weight){
					if(type == 'ineffective'){
						RscAlert.confirm('提示','您指派的重量大于该车的载重吨数，是否代替司机接单',function () {
							vm.replaceOrders(type);
						})
                    }else {
						RscAlert.confirm('提示','您指派的重量大于该车的载重吨数，是否派货',function () {
							vm.replaceOrders(type);
						})
                    }

				}else {
					vm.replaceOrders(type);
				}

			}else if(vm.truckList.product_categories[0].unit == vm.truckList.product_categories[0].pass_unit){
				if(vm.truckList.newamount > vm.dirverTransDetail.truck_weight){
					if(type == 'ineffective'){
						RscAlert.confirm('提示','您指派的重量大于该车的载重吨数，是否代替司机接单',function () {
							vm.replaceOrders(type);
						})
					}else {
						RscAlert.confirm('提示','您指派的重量大于该车的载重吨数，是否派货',function () {
							vm.replaceOrders(type);
						})
					}
				}else {
					vm.replaceOrders(type);
				}
			}
		}
        vm.replaceOrders = function (type) {
            replaceData = {
                scene: 'assign',
                demand_id: vm.demand_id,
                user_supply_id: vm.dirverTransDetail.user_id,
				product_categories: vm.truckList.product_categories,
                amount: vm.truckList.amount
            }
            PassSellService.driverPriceCanOrder(replaceData).then(function (result) {
                if (result.status == 'success') {
                    vm.status = result.data.status;
                    vm.order_index = result.data.index;
                    vm.order_id = result.data._id;
                    vm.truckList.price = result.data.price;
                    vm.truckList.product_categories = result.data.product_categories;
                    if(type == 'ineffective'){
                        ionicToast.show('代替司机接单成功', 'middle', false, 2500);
                    }else {
                        ionicToast.show('立即派货成功', 'middle', false, 2500);
                    }
                    $log.debug('代替接单', result);
                    $state.go('rsc.trans_assign_detail',{demand_id:result.data.demand_id,source:'grab'})
                } else if (result.msg == 'not_enough_goods') {
                    ionicToast.show('已指派吨数超出剩余吨数，请重新指派', 'middle', false, 2500);
                } else {
                    if(type == 'ineffective'){
                        ionicToast.show('代替司机接单失败', 'middle', false, 2500);
                    }else {
                        ionicToast.show('立即派货失败', 'middle', false, 2500);
                    }
                    $log.debug('代替接单', result)
                    $state.go('rsc.trans_assign_detail',{demand_id:result.data.demand_id,source:'grab'})
                }
            })
        }
//      vm.changeAmount = function (long, car, num, pro) {
//
//      	console.log(arguments)
//			$scope.$watch(long.number, function () {
//				if (pro && num && long) {
//					long.amount = long.amount_unit*long.number;
//					long.count_remain = pro.amount - long.amount;
//					$log.debug('已分配吨数',long.amount)
//				} else {
//					car.amount = 0;
//					car.count_remain = 0;
//					vm.long.amount = 0;
//					angular.forEach(car.product_categories, function (pro, index) {
//						angular.forEach(pro.product_name, function (product_name, index) {
//							car.amount = car.amount+product_name.amount_unit*product_name.number;
//							vm.long.amount = vm.long.amount+product_name.amount_unit*product_name.number;
//							vm.long.count_remain = vm.truckList.amount_total - vm.long.amount;
//							car.count_remain = vm.truckList.amount - vm.long.amount;
//						})
//					})
//				}
//			})
//      }
//      vm.upAmount=function(){
//      	var that=this;
//      	if(event.keyCode !=37 && event.keyCode != 39){
//      		alert(that.value)
//				if (! /^[0-5]{0,1}[0-9]{1}$/ig.test()){
//
//					that.value='';
//					if(!$scope.$$phase) {
//						$scope.$apply()
//					}
//
//				}
//			}
//      }
		vm.changeAmount = function (truckList, numbers, guige, guigenum) {
			var re = /^[1-9]*[1-9][0-9]*$/ ;
			var iszs=re.test(guigenum);
        	$log.info(arguments)
        	amountCount(truckList, numbers, guige);

        }
        vm.add = function (long, car, num, pro) {
            if (vm.status != 'ineffective'&&vm.status != 'wait_assign') {
                return false;
            }

            //不能超过最大值
            if(long.number==globalPriceMax){

                return false;
            }

            var cont = long.count_assign + 1;
            if (cont > long.max) {
            } else {
                long.number++;
                long.number_remain -= 1;
                amountCount(car, num, pro, long);
                $log.info(car, num, pro, long)
            }
        }
        vm.subtraction = function (long, car, num, pro) {
			var cont = long.number - 1;
			if (cont < 0) {
				cont=0;
			} else {
				long.number = cont;
				long.number_remain += 1;
				amountCount(car, num, pro, long);
			}
            if (vm.status != 'ineffective'&&vm.status != 'wait_assign') {
                return false;
            }

        }
        var amountCount = function (car, num, pro, long) {
            car.amount = 0;
            car.number_remain = 0;
            vm.long.amount = 0;
            angular.forEach(car.product_categories, function (pro, index) {
                angular.forEach(pro.product_name, function (product_name, index) {
					car.amount = car.amount+product_name.amount_unit*product_name.number;
					vm.long.amount = vm.long.amount+product_name.amount_unit*product_name.number;
					vm.long.count_remain = vm.truckList.amount_total - vm.long.amount;
					car.count_remain = vm.truckList.amount - vm.long.amount;
                })
            })
             $log.debug('已指派吨数',vm.long.amount)
            $log.debug('剩余吨数',vm.long.count_remain)
            //如果是点击加减号来改变则计算
            if (pro && num && long) {
                long.amount = long.amount_unit*long.number;
                long.number_remain = pro.amount - long.amount;
                $log.debug('已分配吨数',long.amount)
            } else {
                // calculate_freight(car)
            }
        }
        //下拉刷新执行方法
        $scope.doRefresh = function () {
            vm.init();
            $scope.$broadcast('scroll.refreshComplete');
        };
        //运输货物
        vm.productsDetail = function () {
            vm.openModal();
        }
        //选择样式
        vm.selectModnt = function (btnArr, fnArr) {
            // 显示操作表
            $ionicActionSheet.show({
                buttons: btnArr,
                cancelText: '取消',
                buttonClicked: function (index) {

                    if (index || index == 0) {
                        fnArr[index].fn();
                        return true;
                    }

                }
            });

        };
        //指派有效期
        vm.selectTime = function () {
            var btnArr = [{
                text: '30分钟'
            }, {
                text: '60分钟'
            }, {
                text: '120分钟'
            }];
            var fnArr = [{
                fn: function () {
                    vm.order.time_validity = 30;
                }
            }, {
                fn: function () {
                    vm.order.time_validity = 60;
                }
            },
                {
                    fn: function () {
                        vm.order.time_validity = 120;
                    }
                }
            ];
            vm.selectModnt(btnArr, fnArr);
        };
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
        vm.telPhone = function () {
            console.log( vm.dirverTransDetail.phone)
            window.plugins.CallNumber.callNumber(function onSuccess(result){
                    console.log("Success:call number"+result);
                },
                function onError(result) {
                    console.log("Error:call number"+result);
                },
                vm.dirverTransDetail.phone,true);
        };

        vm.doSome=function (item) {
            var status=vm.status;
            var methods={
                bh:function () {
                    var orderId= item.orderId;
                    var prr=true;
                    if(!item.prr || item.prr.length==0){
                        prr=false;
                    }
                    console.log('----prr----')
                    console.log(prr.length==0)
                    var step=item.step;
                    if(step<=3&&prr){
                        console.log('----orderId----')
                        console.log(orderId)
                        $state.go('rsc.replenish',{orderId:orderId})
                    }else{
                        ionicToast.show('不能补货!', 'middle', false, 2500);
                    }

                },
                djd:function () {
                    if(status=='ineffective'){
                        var param=item.others;
                        vm.confirm(param)
                    }else{
                        ionicToast.show('订单已接单!', 'middle', false, 2500);
                    }
                },
                th:function () {
                    if(status == 'effective'){
                        var param=item.routePram;
                        $state.go('rsc.car_anchored',param)
                    }else{
                        ionicToast.show('尚未接单，不能替换!', 'middle', false, 2500);
                    }
                }
            };
            methods[item.type]()
        }

    })

    //物流订单 顶部导航路由嵌套
    .controller('sellordercenterCtrl', ['$state', '$scope', function ($state, $scope) {
        var vm = this;
        vm.leftBtn = true;
        vm.goDetail = function () {
            if (vm.leftBtn) {
                vm.leftBtn = false;
                $state.go('sell_release.transdetail')
            } else {
                vm.leftBtn = true;
                $state.go('sell_release.orderdetail')
            }
        };
        vm.init = function () {
            $state.go('sell_release.orderdetail')
        }

    }])
    //物流 订单 货源
    .controller('goods_order_goods_detail_ctrl', ['$scope','$state', '$timeout', '$ionicActionSheet', '$stateParams', 'PassSellService', '$log', '$ionicScrollDelegate','$ionicModal',
        function ($scope,$state, $timeout, $ionicActionSheet, $stateParams, PassSellService, $log, $ionicScrollDelegate, $ionicModal) {
            var vm = $scope.vm = this;
            vm.order_id = $stateParams.order_id;
            vm.special = $stateParams.special;
            $scope.$on('$ionicView.beforeEnter', function () {
                init()
            })
            var init = function () {
                PassSellService.getOrderById(vm.order_id).then(function (result) {
                    if (result.status == 'success') {
                        vm.order = result.data;
                        vm.user_id=vm.order.demand_user_id;
                        vm.getCompanyUser(vm.user_id);
                        $log.debug('订单', result);
                        PassSellService.getTrafficCompany(vm.order.demand_company_id).then(function (res) {
                            if (res.status == 'success') {
                                vm.companyInfo = res.data;
                                $log.debug('公司信息', res)
                            } else {
                                $log.error('公司信息', res)
                            }
                        })
                    } else {
                        $log.error('订单', result);
                    }

                })
            }
            init();
            vm.show = function () {
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '定价指派'},
                        {text: '竞价指派'}
                    ],
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $state.go('rsc.assign_driver_start', {order_id: vm.order_id})
                        }
                        else if (index == 1) {
                            $state.go('model-57')
                        }
                    }
                });
                // For example's sake, hide the sheet after two seconds
            }
            // $ionicScrollDelegate.resize();

            // 运输货物详情
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
            //对方个人信息
            vm.getCompanyUser = function (id) {
                PassSellService.getCompanyUserById(id).then(function (res) {
                    if (res.status == 'success') {
                        $log.debug('对方个人信息', res);
                        vm.companyUserInfo = res.data;
                    } else {
                        $log.error('对方个人信息', res);
                    }
                });
            };

        }])
    //物流 订单 运输详情
    .controller('goods_order_trans_detail_ctrl', ['$log', '$stateParams', 'PassSellService', function ($log, $stateParams, PassSellService) {
        var vm = this;
        vm.order_id = $stateParams.order_id;
        vm.init = function () {
            PassSellService.getDriverOrderOne(vm.order_id).then(function (result) {
                if (result.status == 'success') {
                    $log.debug('获取司机运输详情', result)
                    vm.driverOrderDetail = result.data.driverDemand;
                    vm.driverOrder = result.data;
                } else {
                    $log.debug('获取司机运输详情', result)
                }
            })
        }
        vm.show = function () {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '定价指派'},
                    {text: '竞价指派'}
                ],
                cancelText: '取消',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index == 0) {
                        $state.go('sell_release.asigndriver', {order_id: vm.order_id})
                    }
                    else if (index == 1) {
                        $state.go('model-57')
                    }
                }
            });
            // For example's sake, hide the sheet after two seconds
        }
    }])
    //物流 订单 定价指派
    .controller('assign_driver_start_ctrl', ['$scope', 'PassSellService', '$log', '$stateParams', '$state', 'Storage', 'RscAlert', 'ionicToast', '$ionicModal','$ionicActionSheet',
        function ($scope, PassSellService, $log, $stateParams, $state, Storage, RscAlert, ionicToast, $ionicModal,$ionicActionSheet) {
            var vm = this;
            vm.order_id = $stateParams.order_id;
            // 付款方式
            vm.demand = {
                payment_method: 'all_goods',
            };
            // 付款类型
            vm.sale = {
                payment_choice: 'transfer'
            };
            vm.data = {
                comment: ''
            };
            vm.init = function () {
                PassSellService.getOrderById(vm.order_id).then(function (result) {
                    if (result.status == 'success') {
                        vm.order = result.data;
                        angular.forEach(vm.order.product_categories,function (data) {
                            vm.data.price = data.price;
                            if (data.unit == '件') {
                                vm.method = 'get'
                            } else {
                                vm.method = 'theory'
                            }
                            return false;
                        })
                        if (!vm.order.att_traffic) {
                            vm.order.att_traffic = {one: [1, 0, 0], two: [0]};
                        }
                        $log.debug('订单', result);
                    } else {
                        $log.error('订单', result);
                    }

                })
            };
            // 付款方式
            vm.selPaymentMethod = function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '款到发货'},
                        {text: '货到付款'},
                        // {text: '分期付款'},
                        {text: '信用付款'}
                    ],
                    // titleText: '付款方式',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                vm.demand.payment_method = 'all_cash';
                                break;
                            case 1:
                                vm.demand.payment_method = 'all_goods';
                                break;
                            //
                            case 2:
                                vm.demand.payment_method = 'credit';
                                break;
                        }
                        return true;
                    }
                });
            };
            // 调整付款类型
            vm.selPaymentChoice = function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '银行转账'},
                        {text: '线下付款'}
                    ],
                    // titleText: '付款方式',
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        switch (index) {
                            case 0:
                                vm.sale.payment_choice = 'transfer';
                                break;
                            case 1:
                                vm.sale.payment_choice = 'offline';
                                break;
                        }
                        return true;
                    }
                });
            };
            //指派有效时间
            vm.assignMinuit = function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '30分钟'},
                        {text: '60分钟'},
                        {text: '6小时'},
                        {text: '24小时'},
                        {text: '7天'}
                    ],
                    cancelText: '取消',
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        if (index == 0) {
                            vm.termOfValidity = 30;
                            vm.termOfValidityTxt = '30分钟';
                        } else if (index == 1) {
                            vm.termOfValidity = 60;
                            vm.termOfValidityTxt = '60分钟';
                        } else if (index == 2){
                            vm.termOfValidity = 6*60;
                            vm.termOfValidityTxt = '6小时';
                        }else if(index == 3){
                            vm.termOfValidity = 24*60;
                            vm.termOfValidityTxt = '24小时';
                        }else {
                            vm.termOfValidity = 24*60*7;
                            vm.termOfValidityTxt = '7天';
                        }
                        return true;
                    }
                });
                // For example's sake, hide the sheet after two seconds
            };

            vm.assignDriver = function (type) {
                if (type) {
                    ionicToast.show('请选择物流结算方式!', 'middle', false, 2500);
                } else {
                    if (!vm.termOfValidity) {
                        ionicToast.show('请选择指派有效期!', 'middle', false, 2500);
                    }else if(!vm.order.product_categories[0].pass_price){
                        ionicToast.show('请输入正确的价格，最多保留两位小数!', 'middle', false, 2500);
                    }else {
                        vm.detail = {
                            appendix: vm.data.comment,//备注
                            payment_method: vm.demand.payment_method,
                            payment_choice: vm.sale.payment_choice,
                            comment: vm.demand.comment,
                            termOfValidity: vm.termOfValidity,
                            weigh_settlement_style: vm.method,
                            count_day_extension: vm.demand.count_day_extension,
                            percentage_advance: vm.demand.percentage_advance,
                            att_traffic: vm.order.att_traffic,
                            price:vm.order.product_categories[0].pass_price
                        }
                        Storage.set('replenish', vm.order.products_replenish);
                        Storage.set('detail', vm.detail);
                        $state.go('rsc.car_anchored', {order_id: vm.order_id})
                    }
                }
            };
            //运输货物
            vm.productsDetail = function () {
                vm.openModal();
            }
            //选择样式
            vm.selectModnt = function (btnArr, fnArr) {
                // 显示操作表
                $ionicActionSheet.show({
                    buttons: btnArr,
                    cancelText: '取消',
                    buttonClicked: function (index) {

                        if (index || index == 0) {
                            fnArr[index].fn();
                            return true;
                        }

                    }
                });

            };
           //指派有效期
            vm.selectTime = function () {
                var btnArr = [{
                    text: '30分钟'
                }, {
                    text: '60分钟'
                }, {
                    text: '120分钟'
                }];
                var fnArr = [{
                    fn: function () {
                        vm.order.time_validity = 30;
                    }
                }, {
                    fn: function () {
                        vm.order.time_validity = 60;
                    }
                },
                    {
                        fn: function () {
                            vm.order.time_validity = 120;
                        }
                    }
                ];
                vm.selectModnt(btnArr, fnArr);
            };
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

        }])
    //物流 指派司机车辆 添加司机
    .controller('add_driver_ctrl', ['$scope', 'PassSellService', '$log', 'iAlert', '$state', 'ionicToast', '$timeout', '$stateParams', 'ListConfig',
        function ($scope, PassSellService, $log, iAlert, $state, ionicToast, $timeout, $stateParams, ListConfig) {
            var vm = this;
            var isLoading = false;
            vm.order_id = $stateParams.order_id;
            //添加页面车辆属性选择项原始数据
            vm.select = {
                carType: ListConfig.getCarType(),
                carWeight: ListConfig.getCarWeighList(),
                carLong: ListConfig.getCarLongList()
            }

            //弹窗： 确定添加按钮
            vm.addCarConfirm = function (valid, hasCar) {
                var postData = {
                    real_name: vm.newCar.name?vm.newCar.name:'',
                    phone: vm.newCar.phone,
                    number: angular.uppercase(vm.newCar.number),
                    type: vm.newCar.type?vm.newCar.type.eng:'',
                    weight: vm.newCar.weight,
                    long: vm.newCar.long?vm.newCar.long:'',
                };
                isLoading = true;
                PassSellService.traffic_admin_add_user_truck(postData).then(function (result) {
                    isLoading = false;
                    if (result.status == 'success') {
                        ionicToast.show('添加司机成功', 'middle', false, 2500);
                        //$state.go('rsc.trans_grab');
                    } else {
                        $log.error('添加车辆', result)
                        if (result.msg == "already_verify") {
                            ionicToast.show('该车已经是我公司的认证车辆了！', 'middle', false, 2500);
                        }
                        else {
                            ionicToast.show('添加司机失败', 'middle', false, 2500);
                        }
                    }
                }, function () {
                    isLoading = false;
                })
            }
        }])
    //物流 运输 指派挂靠车辆
    .controller('car_anchored_ctrl', function ($scope, $state, PassSellService, $log, $stateParams, Storage, iAlert, ionicToast, $ionicModal,sendVal) {
        var vm = this;
        vm.status = $stateParams.status;
        vm.order_id = $stateParams.order_id;
        vm.selCarList = [];
        vm.carGroupList = [];

        vm.replenish = Storage.get('replenish');
        vm.dirverLogos = [];
        var myPhoto = '';
        //司机信息
        var driver_info={
            scene:'self_info'
        }
        //发布司机抢单
        vm.driverToGrab = function () {

            var data = {
                order_id: $stateParams.order_id,
                appendix: vm.detail.appendix,
                price_type: 'fix',
                can_join: false,
                user_ids: vm.selCarList,
                time_validity: vm.detail.termOfValidity,
                payment_choice: vm.detail.payment_choice,
                payment_method: vm.detail.payment_method,
                products: vm.product_categories,
                products_replenish: vm.replenish,
                scene: 'traffic_assign',
                weigh_settlement_style: vm.detail.weigh_settlement_style,
                att_traffic: vm.detail.att_traffic,
                price:vm.detail.price
            };
            PassSellService.driverDemandScene(data).then(function (result) {
                if (result.status == 'success') {
                    vm.successList = result.data;
					vm.dirverLogos =  result.data.assign_user_info;
					console.log(vm.successList._id)
					$log.debug('发布司机抢单', result);
					$log.debug(vm.dirverLogos)
                    var assign_driver_succeed_param={
                        dirverLogos:vm.dirverLogos,//xx司机信息
                        demandId: vm.successList._id,//
                        orderId:data.order_id
                    };
                    Storage.set('assign_driver_succeed_param',assign_driver_succeed_param);
                    $state.go('rsc.assign_driver_succeed')
                } else {
                    $log.error('发布司机抢单', result)
                }
            })

        }
        //替换车辆
        vm.replaceCars = function () {
            vm.selCar = vm.selCarList[0];
            PassSellService.orderReplaceDriver(vm.selCar, vm.order_id).then(function (result) {
                if (result.status == 'success') {
                    vm.successList = result.data;
                    ionicToast.show('替换车辆成功', 'middle', false, 2500);
                    $log.debug('替换车辆', result);
                    $scope.selCarList = vm.selCarList;
                    $state.go('rsc.trans_assign_detail', {demand_id: vm.successList.demand_id,source:'grab'});

                } else {
                    ionicToast.show('替换车辆失败', 'middle', false, 2500);
                    $log.error('替换车辆', result)
                }
            })

        };
        // 返回刷新已选车辆
        $scope.$on('$ionicView.beforeEnter', function () {
            vm.selCarList = [];
            vm.detail = Storage.get('detail');
        });
        //指派司机成功模态框
        $ionicModal.fromTemplateUrl('./js/src/common/modal/assign_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        vm.openModal = function () {
            $scope.modal.show();
        };
        vm.closeModal = function () {
            $scope.modal.hide();
            $state.go('rsc.trans_assign_detail', {demand_id: vm.successList._id, source: 'grab'})
        };
        vm.goDetail = function () {
            $scope.modal.hide();
            $state.go('rsc.trans_assign_detail', {demand_id: vm.successList._id, source: 'grab'})
        }
    })
    //物流 运输 指派自有车辆
    .controller('car_owncar_ctrl', function ($scope, PassSellService, $log, $stateParams, Storage) {
        var vm = this;
        vm.order_id = $stateParams.order_id;
        vm.selCarList = [];
    })

    //物流 订单 指派车辆抢单成功
    .controller('assign_driver_succeed_ctrl', function ($scope,$state, PassSellService, $log, $stateParams, Storage,sendVal) {
        var vm = this;
        var temp='';
        $scope.$on('$ionicView.beforeEnter', function () {
            temp=Storage.get('assign_driver_succeed_param');
            vm.dirverLogos=temp.dirverLogos;
        })

        vm.goDetail = function () {
            $state.go('rsc.trans_assign_detail', {demand_id: temp.demandId, source: 'grab'})
        };
        vm.locationHrf=function(){
            $state.go('rsc.goods_order_goods_detail', {order_id: temp.orderId, special: true})
        }
    })



    //运输>找线路
    .controller('find_line_ctrl', ['$scope', '$rootScope', '$log', '$state', 'PassBuyService', '$ionicHistory', 'RscAlert', 'Storage', '$cordovaInAppBrowser', 'PassService', '$timeout','comService','GlobalService'
        , function ($scope, $rootScope, $log, $state, PassBuyService, $ionicHistory, RscAlert, Storage, $cordovaInAppBrowser, PassService, $timeout,comService,GlobalService) {
        var vm = $scope.vm = this;

        //生命周期函数-->页面进入前
        vm.init = function () {
                vm.allDemands = true;
                vm.lineListQueryParam={
                    scene:'relation',
                    user_id:'',
                    page:1,
                    is_refresh: vm.action=='doRefresh'?true:false
                };
                vm.recommendQuery = {
                    page: 1,
                    name: '',
                    type: 'TRADE',
                    subType: 'PURCHASE',
                    getType: 1
                };
                queryAction();
                lineListQuery();
                $scope.getCarousel();
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.trafficListen()
            vm.init()
        })

        //获取轮播图
        $scope.getCarousel = function () {
            var data = {
                type:$rootScope.rscPlatform,
                name:$rootScope.rscAppName
            };
            comService.getCarouselfigure(data).then(function (result) {
                if(result.status == 'success'){
                    $scope.carousel_img= result.data;
                    $log.debug('获取轮播图',result);
                }else{
                    $log.error('获取轮播图',result);
                }
            })
        }

        // 获取企业列表
        var queryAction = function () {
            PassBuyService.getDriverVerify(vm.recommendQuery).then(function (result) {
                $log.debug('$scope.query', vm.recommendQuery);
                if (result.status == 'success') {
                    vm.hasMore = result.data.exist;
                    vm.company_count = result.data.count;
                    if (vm.recommendQuery.getType == 3) {
                        if (vm.Certification) {
                            vm.Certification = vm.Certification.concat(result.data.list);
                        } else {
                            vm.Certification = result.data.list;
                        }
                    } else {
                        vm.Certification = result.data.list;
                        if (false) { // 默认选择生意圈
                           // vm.listDetail(vm.Certification[0]._id)
                        } else {
                           // vm.listDetail()
                        }
                    }
                    console.log(vm.Certificatione);
                    var idArr = [];
                    for (var i = 0; i < vm.Certification.length; i++) {
                        idArr.push(vm.Certification[i]._id)
                    }
                } else {
                    $log.error('认证货主', result);
                    vm.hasMore = false;
                }
            }).finally(function () {
                $ionicLoading.hide();
            });
        };

        // 右滑加载货主
        vm.swipeLeft = function () {
            vm.recommendQuery.page += 1;
            vm.recommendQuery.getType = 3;
            queryAction();
        };

        var lineListQuery=function () {
            PassBuyService.lineList(vm.lineListQueryParam).then(function(rep){
                var status=rep.status;
                var data=rep.data;

                if(status == 'success'){
                    vm.listhasMore=data.exist;
                    //下拉刷新，或首次进入
                    if(vm.lineListQueryParam.page==1){
                        vm.driverLines=data.lines;
                    }else{//如果是下拉翻页，那么数据将会是追加，而非全部更新
                        vm.driverLines=vm.driverLines.concat(data.lines);
                    }
                }else{

                }
            })
        }


        // 下拉刷新
        vm.doRefresh = function () {
            vm.action='doRefresh';
            vm.init();
            $scope.$broadcast('scroll.refreshComplete');
        };

        //上拉加载
         vm.loadMore = function () {
            vm.action='loadMore';
            vm.lineListQueryParam.page+=1;
            lineListQuery();
            $scope.$broadcast('scroll.infiniteScrollComplete');
         };

        vm.aboutUs = function (index) {
            console.log($cordovaInAppBrowser)
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
            };
            $cordovaInAppBrowser.open($scope.carousel_img[index].text, '_blank', options)

                .then(function (event) {
                    // success
                    console.log(event)

                })

                .catch(function (event) {
                    // error
                    console.log(event)
                });
        };
        vm.recommendDetail = function (item) {
            console.log(item)
            if (item.timeOut) {
                RscAlert.alert('该笔订单已过有效期', function () {
                    vm.doRefresh()
                })
            } else {
                $state.go('rsc.goods_detail', {demand_id: item._id})
            }
        }


        //添加车辆
        vm.addCar=function () {
            $state.go('rsc.add_driver')
        }

        // 查看点击公司列表
        vm.listDetail = function (id) {
            if(id){
                vm.allDemands = false;
                vm.activeId = id;//好像僅僅只用於樣式
                vm.lineListQueryParam.scene='other';
                vm.lineListQueryParam.user_id=id;
                vm.lineListQueryParam.page=1;
                lineListQuery()
            }else {
                vm.activeId='';
                vm.allDemands = true;
                vm.init()
            }

        };
    }])




















    //物流订单 补货
    .controller('replenishCtrl', ['$rootScope','$state','$stateParams', '$scope','$log','$filter','PassSellService','rscMath','ionicToast', function ($rootScope,$state,$stateParams,$scope,$log,$filter,PassSellService,rscMath,ionicToast) {
            var vm = $scope.vm = this;
            var orderId=$stateParams.orderId;
            vm.totleNumber=0;
            vm.totlePrice=0;


            //获取补货信息
            PassSellService.getOrderOne(orderId).then(function (rep) {
                var status=rep.status;
                if(status=='success'){
                    vm.result=rep.data;
                }else{
                    ionicToast.show('获取补货信息失败!', 'middle', false, 2500);
                }
            })



            //补货加减号点击
            vm.jisuan=function (type,index1,index2) {
                var info=vm.result.products_replenish[index1].product_name[index2];
                var price=info.amount_unit==0?1:info.amount_unit;
                if(type=='reduce'){
                    if(info.count!=0){
                        info.count--
                    }
                }else if(type=='add'){
                    info.count++
                }else{

                }


                //显示页面上计算吨数那个地方
                vm[index1][index2].rs=rscMath.ride(info.count,price);
                info.amount=vm[index1][index2].rs;//用于后端传值

                //计算总运费和总吨数
                zyf()

            }

            //计算总运费
            var  zyf=function () {
                var totlePrice,totleNumber=0;
                var pr=vm.result.products_replenish;
                for(var i=0; i<pr.length; i++){
                    for(var j=0; j<pr[i].product_name.length; j++){
                        totleNumber+=Number(pr[i].product_name[j].count);
                        totlePrice=totleNumber*pr[i].pass_price;
                    }
                }
                vm.totleNumber=totleNumber;
                vm.totlePrice=totlePrice;
            }





            //提交
           vm.sbmit=function () {
               var products_replenish=vm.result.products_replenish;
               PassSellService.driverReplenish(orderId,products_replenish).then(function (rep) {

                   var status=rep.status;
                   if(status=='success'){
                       $rootScope.rootGoBack()
                   }else{
                       ionicToast.show('补货失败!', 'middle', false, 2500);
                   }
               })
           }

    }])

