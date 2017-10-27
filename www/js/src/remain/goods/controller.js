/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controller.goods', ['rsc.pass.services', 'rsc.common.directives','rsc.common.services.public'])
/**
 *货源
 *
 */
    .controller('goods_ctrl', ['$scope', '$rootScope', '$log', '$state', 'PassBuyService', '$ionicHistory', 'RscAlert', 'Storage', '$cordovaInAppBrowser', 'PassService', '$timeout','comService','GlobalService'
        , function ($scope, $rootScope, $log, $state, PassBuyService, $ionicHistory, RscAlert, Storage, $cordovaInAppBrowser, PassService, $timeout,comService,GlobalService) {
            var vm = $scope.vm = this;

            vm.recommendQuery = {
                page: 1,
                name: '',
                type: 'TRADE',
                subType: 'PURCHASE',
                getType: 1
            };
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
			$scope.getCarousel();



            vm.init = function () {
                queryAction();
            };

            $scope.$on("$ionicView.beforeEnter",vm.init)

            // 获取企业列表
            var queryAction = function () {
                PassBuyService.getCompanyCertification(vm.recommendQuery).then(function (result) {
                    $log.debug('$scope.query', vm.recommendQuery);
                    if (result.status == 'success') {
                        $log.debug('认证货主', result, vm.hasMore);
                        vm.hasMore = result.data.exist;
                        vm.company_count = result.data.count;
                        if (vm.recommendQuery.getType == 3) {
                            if (vm.Certification) {
                                vm.Certification = vm.Certification.concat(result.data.company);
                            } else {
                                vm.Certification = result.data.company;
                            }
                        } else {
                            vm.Certification = result.data.company;
                            if (false) { // 默认选择生意圈
                                vm.listDetail(vm.Certification[0]._id)
                            } else {
                                vm.listDetail()
                            }
                        }
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
            // 查看点击公司列表
            vm.listDetail = function (id) {
                vm.recommendOrders = [];
                vm.activeId = id;
                if (vm.activeId) {
                    vm.allDemands = false;
                    vm.recommends = false;
                    vm.query = {
                        page: 1,
                        getType: 1,
                        scene: 'relation',
                        verify: [vm.activeId]
                    };
                } else {
                    vm.allDemands = true;
                    vm.recommends = false;
                    vm.query = {
                        page: 1,
                        getType: 1,
                        // scene: 'relation' //所有
                        scene: 'friend' //生意圈
                    };
                }

                PassBuyService.getDemands(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取物流需求单', result);
                        vm.recommendOrders = result.data.demands;
                    } else {
                        $log.error('查看点击公司列表获取物流需求单', result);
                    }
                }, function (error) {
                    $log.error('查看点击公司列表获取物流需求单', error);
                })
            };

            // 推荐 商业智能
            vm.recommend = function () {
                vm.recommends = true;
                vm.allDemands = false;
                vm.activeId = '';
                vm.recommendOrders = [];
                vm.query = {
                    page: 1,
                    getType: 1,
                    // scene: 'relation' //所有
                    scene: 'recommend' //智能推荐
                };
                PassBuyService.getDemands(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取物流需求单', result);
                        vm.recommendOrders = result.data.demands;
                    } else {
                        $log.error('查看点击公司列表获取物流需求单', result);
                    }
                }, function (error) {
                    $log.error('查看点击公司列表获取物流需求单', error);
                })
            };
            // 下拉刷新
            vm.doRefresh = function () {
                // 认证货源下拉刷新
                if (vm.activeId) {
                    vm.query = {
                        page: 1,
                        getType: 1,
                        scene: 'relation',
                        verify: [vm.activeId],
                        is_refresh: true
                    };
                }
                if (!vm.activeId) {
                    vm.query = {
                        page: 1,
                        getType: 1,
                        // scene: 'relation' //所有
                        scene: 'friend', //生意圈
                        is_refresh: true
                    };
                }
                if (vm.recommends) {
                    vm.query = {
                        page: 1,
                        getType: 1,
                        // scene: 'relation' //所有
                        scene: 'recommend' //智能推荐
                    };
                }

                PassBuyService.getDemands(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('下拉刷新', result);
                        vm.newCount = result.data.new_count;
                        vm.recommendOrders = result.data.demands;

                        // 遍历'新'字显示
                        var idArr = [];
                        for (var i = 0; i < vm.Certification.length; i++) {
                            idArr.push(vm.Certification[i]._id);
                        }


                    } else {
                        $log.error('下拉刷新获取物流需求单', result);
                    }
                }, function (error) {
                    $log.error('下拉刷新获取物流需求单', error);
                });

                $scope.$broadcast('scroll.refreshComplete');

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
            // 返回自动刷新
            $scope.$on('$ionicView.beforeEnter', function () {
                $rootScope.trafficListen()
                vm.listDetail()
                // vm.doRefresh()
            })
        }])
    /**
     *货源 地图模式
     *
     */
    .controller('goods_map_ctrl', ['$scope', '$log', '$state', 'PassBuyService', '$ionicLoading', '$stateParams'
        , function ($scope, $log, $state, PassBuyService, $ionicLoading, $stateParams) {
            var vm = $scope.vm = this;
            vm.distance = '';
            vm.time = '';
            vm.init = function () {
                vm.data = {
                    demand_id: $stateParams.demand_id //需求单id
                };
                PassBuyService.getDemandOne(vm.data).then(function (data) {
                    if (data.status == 'success') {
                        vm.demandDetail = data.data;
                        $log.info('获取物流需求单', data)
                        driving.search(new AMap.LngLat(vm.demandDetail.send_loc[0], vm.demandDetail.send_loc[1]), new AMap.LngLat(vm.demandDetail.receive_loc[0], vm.demandDetail.receive_loc[1]), function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                console.log('status', status)
                                console.log('result', result)
                                vm.distance = result.routes[0].distance;
                                formatSeconds(result.routes[0].time)
                            }
                        });
                    } else {
                        $log.error('获取物流需求单', result)
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                })

                var height = document.getElementById('container');
                height.style.height = window.screen.height - 144 + 'px';
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

                map.setFitView();
            };
            function formatSeconds(value) {
                var theTime = parseInt(value);// 秒
                var theTime1 = 0;// 分
                var theTime2 = 0;// 小时
                if (theTime > 60) {
                    theTime1 = parseInt(theTime / 60);
                    theTime = parseInt(theTime % 60);
                    if (theTime1 > 60) {
                        theTime2 = parseInt(theTime1 / 60);
                        theTime1 = parseInt(theTime1 % 60);
                    }
                }
                vm.time = "" + (parseInt(theTime)) + "秒";
                if (theTime1 > 0) {
                    vm.time = "" + parseInt(theTime1) + "分" + vm.time;
                }
                if (theTime2 > 0) {
                    vm.time = "" + parseInt(theTime2) + "小时" + vm.time;
                }
                document.getElementById('distance').innerText = (vm.distance / 1000)
                document.getElementById('time').innerText = '预计' + vm.time
                return vm.time;
            }

        }])
    /**
     * 物流 货源 认证公司需求单指派详情
     */
    .controller('goods_detail_ctrl', ['$scope', '$state', '$stateParams', 'PassBuyService', '$log', '$ionicLoading', 'RscAlert', 'ionicToast', '$ionicModal', '$ionicHistory', 'TradeTransportService', 'authenticationService','Storage',
        function ($scope, $state, $stateParams, PassBuyService, $log, $ionicLoading, RscAlert, ionicToast, $ionicModal, $ionicHistory, TradeTransportService, authenticationService,Storage) {
            var vm = $scope.vm = this;
            vm.data = {
                demand_id: $stateParams.demand_id,//需求单id
                // demand_index: $stateParams.demand_index,//需求单index
                // index_trade: $stateParams.index_trade//交易订单的index
            };
            var query = {
                demand_id: $stateParams.demand_id,//需求单id
                order: 'price',
                page: 1,
                scene: 'other'
            };
            vm.wait = $stateParams.wait;
            vm.isGoBack=$stateParams.isGoBack;
            vm.demandList = {};
            vm.loc_company = authenticationService.getCompanyInfo();
            console.log('vm.loc_company', vm.loc_company)
            vm.init = function () {
                $ionicLoading.show();
                // PassBuyService.getOfferList(query).then(function (result) {
                //     if (result.status == 'success') {
                //         vm.demandOfferList = result.data.offers;
                //         $log.debug('获取物流需求单抢单公司列表', result)
                //     } else {
                //         $log.error('获取物流需求单抢单公司列表', result)
                //     }
                // });
                TradeTransportService.getNeedOrder($stateParams.demand_id).then(function (result) {
                    if (result.status == 'success') {
                        vm.demandOfferList = result.data;
                        $log.debug('获取物流需求单抢单公司列表', result)
                    } else {
                        $log.error('获取物流需求单抢单公司列表', result)
                    }
                });
                PassBuyService.getDemandOne(vm.data).then(function (result) {
                    if (result.status == 'success') {
                        vm.demandList = result.data;
                        $log.info('获取物流需求单', result)
                    } else {
                        $log.error('获取物流需求单', result)
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                });
                // 查询需求单是否已接单
                PassBuyService.planExists(vm.data.demand_id).then(function (result) {
                    if (result.status == 'success') {
                        vm.wait = result.data;
                        $log.debug('查询需求单是否已接单', result)
                    } else {
                        $log.error('查询需求单是否已接单', result)
                    }
                });
            }
            vm.time_end = false;
            vm.finished = function () {
                vm.time_end = true;
            }
            vm.goOfferOrder = function () {
                PassBuyService.getRelationStatus(vm.demandList.demand_user_id).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('公司认证状态', result)
                        if (!result.data.company_self) {
                            RscAlert.confirm('', '您暂无企业，请先创建您的企业', function () {
                                console.log('立即创建')
                                $state.go('rsc.traffic_verify_company')
                            }, '', {
                                exit: '暂不创建',
                                save: '立即创建'
                            });
                            return false
                        }
                        if (!result.data.work_relation) {
                            RscAlert.confirm('', '您与该企业不是合作关系请先进行合作', function () {
                                PassBuyService.applyRelation({
                                    user_id: vm.demandList.user_id,
                                    status: 'TRAFFIC_TRADE'
                                }).then(function (result) {
                                    $log.debug(result)
                                    if (result.status == 'success') {
                                        ionicToast.show('您已成功申请合作，请等待对方处理', 'middle', false, 1500);
                                    } else {
                                        ionicToast.show('申请合作失败，请稍后再试', 'middle', false, 1500);
                                    }
                                })
                            }, '', {
                                exit: '暂不合作',
                                save: '立即合作'
                            });
                            return false
                        }
                        PassBuyService.planAdd($stateParams.demand_id).then(function (res) {
                            if (res.status == 'success') {
                                $log.debug('报名成功', res)
                                var arr=[];
                                arr.push(res.data.demand_user_info);//这样封装没别的意思，只是为了配合能出页面的动画效果
                                vm.demandUserInfo =arr ;
                                var assign_good_succeed_param={
                                    demandId:$stateParams.demand_id,
                                    demandUserInfo:arr
                                }
                                Storage.set('assign_good_succeed_param',assign_good_succeed_param);
                                $state.go('rsc.assign_good_succeed')
                            } else {
                                $log.error('报名失败', res)
                            }
                        })
                    } else {
                        $log.error('公司认证状态', result)
                    }
                })

            };
            vm.goRoute = function (type) {
                $scope.modal_product.hide();
                if (type == 'look') {
                    $state.go('rsc.goods_detail', {demand_id: vm.demandList._id, wait: true})
                } else {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true
                    });
                    $state.go('rsc.center_goods');
                }
            };

            //运输货物模态框
            $ionicModal.fromTemplateUrl('./js/src/remain/goods/goods_success.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal_product = modal;
            });
            vm.openModal_assign = function () {
                $scope.modal_product.show();
            };
            vm.closeModal_assign = function () {
                $scope.modal_product.hide();
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go('rsc.pk_processing');
            };
            //销毁模态框
            $scope.$on('$destroy', function() {
                $scope.modal_product.remove();
            });
            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.init();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                vm.init();
                $scope.$broadcast('scroll.refreshComplete');
            };

            //物流点击立即接单
            vm.locationHrf=function () {
                $state.go('rsc.assign_good_succeed');
            }
        }])
    //货源--下方接单
    .controller('assign_good_succeed_ctrl', ['$scope', '$state', '$stateParams', 'PassBuyService', '$log', '$ionicLoading', 'RscAlert', 'ionicToast', '$ionicModal', '$ionicHistory', 'TradeTransportService', 'authenticationService','Storage',
        function ($scope, $state, $stateParams, PassBuyService, $log, $ionicLoading, RscAlert, ionicToast, $ionicModal, $ionicHistory, TradeTransportService, authenticationService,Storage) {
            var vm = $scope.vm = this;
            var temp=Storage.get('assign_good_succeed_param');
            vm.demandUserInfo=temp.demandUserInfo;
            vm.demandId=temp.demandId;
            vm.locationHrf=function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true
                });
                $state.go('rsc.pk_processing');
            }
            vm.goRoute = function (type) {
                if (type == 'look') {
                    $state.go('rsc.goods_detail', {demand_id: vm.demandId, wait: true})
                } else {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true
                    });
                    $state.go('rsc.center_goods');
                }
            };
        }
    ])

    /**
     * 物流 货源 认证公司需求单运输详情
     */
    .controller('goods_rush_detail_ctrl', ['$scope', '$state', '$stateParams', 'PassBuyService', '$log', '$ionicLoading', '$ionicModal', 'PassSellService', 'RscAlert','$ionicHistory','$ionicViewSwitcher',
        function ($scope, $state, $stateParams, PassBuyService, $log, $ionicLoading, $ionicModal, PassSellService, RscAlert,$ionicHistory,$ionicViewSwitcher) {
            var vm = $scope.vm = this;
            vm.data = {
                demand_id: $stateParams.demand_id,//需求单id
                // demand_index: $stateParams.demand_index,//需求单index
                // index_trade: $stateParams.index_trade//交易订单的index
            }
            vm.demandList = {};
            vm.wait = $stateParams.wait;
            vm.init = function () {
                $ionicLoading.show();
                PassBuyService.getDemandOne(vm.data).then(function (result) {
                    if (result.status == 'success') {
                        vm.demandList = result.data;
                        console.log(result.data)
                        vm.products = result.data.product_categories;
                        vm.order = result.data;
                        $log.debug('获取物流需求单', result)
                        vm.user_id=vm.order.demand_user_id;
                        vm.getCompanyUser(vm.user_id);
                        PassSellService.getTrafficCompany(vm.demandList.demand_company_id).then(function (res) {
                            if (res.status == 'success') {
                                vm.companyInfo = res.data;
                                $log.debug('公司信息', res)
                            } else {
                                $log.error('公司信息', res)
                            }
                        })
                    } else {
                        $log.error('获取物流需求单', result)
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                })
                // 查询需求单是否已接单
                PassBuyService.planExists(vm.data.demand_id).then(function (result) {
                    if (result.status == 'success') {
                        vm.wait = result.data;
                        $log.debug('查询需求单是否已接单', result)
                    } else {
                        $log.error('查询需求单是否已接单', result)
                    }
                });

            }
            vm.goOfferOrder = function () {
                PassBuyService.getRelationStatus(vm.demandList.demand_user_id).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('公司认证状态', result);
                        if (!result.data.company_self) {
                            RscAlert.confirm('', '您暂无企业，请先创建您的企业', function () {
                                console.log('立即创建')
                                //TODO:接孟令浩页面
                            }, '', {
                                exit: '暂不创建',
                                save: '立即创建'
                            });
                            return false
                        }
                        if (!result.data.work_relation) {
                            RscAlert.confirm('', '您与该企业不是合作关系请先进行合作', function () {
                                PassBuyService.applyRelation({
                                    user_id: vm.demandList.user_id,
                                    status: 'TRAFFIC_TRADE'
                                }).then(function (result) {
                                    $log.debug(result)
                                    if (result.status == 'success') {
                                        ionicToast.show('您已成功申请合作，请等待对方处理', 'middle', false, 1500);
                                    } else {
                                        ionicToast.show('申请合作失败，请稍后再试', 'middle', false, 1500);
                                    }
                                })
                            }, '', {
                                exit: '暂不合作',
                                save: '立即合作'
                            });
                            return false
                        }
                        PassBuyService.planAdd($stateParams.demand_id).then(function (res) {
                            if (res.status == 'success') {
                                $log.debug('报名成功', res)
                                vm.demandUserInfo = res.data.demand_user_info;
                                vm.openModal_assign()
                            } else {
                                $log.error('报名失败', res)
                            }
                        })
                    } else {
                        $log.error('公司认证状态', result)
                    }
                })

            };
            //无限加载执行的方法
            $scope.loadMore = function () {
                vm.init();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                vm.init();
                $scope.$broadcast('scroll.refreshComplete');
            };

            //接单成功弹窗
            $ionicModal.fromTemplateUrl('./js/src/remain/goods/goods_success.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.assign_modal_product = modal;
            });
            vm.openModal_assign = function () {
                $scope.assign_modal_product.show();
            };
            vm.closeModal_assign = function () {
                $state.go('rsc.pk_processing');
                $scope.assign_modal_product.hide();
            };

            //运输货物
            vm.productsDetail = function () {
                vm.openModal();
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

            //点击返回按钮，跳转不同的界面
            vm.goLocation=function () {

                if( vm.wait){
                    $state.go('rsc.pk_processing')
                }else{
                    $state.go('rsc.center_goods')
                }
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true,
                    historyRoot:true
                });
                $ionicViewSwitcher.nextDirection("back")


            }
        }])
    /**
     * 物流 货源 认证公司需求单 立即抢单
     */
    .controller('goods_info_ctrl', ['$scope', '$log', 'PassBuyService', '$ionicLoading', '$stateParams', '$state', 'RscAlert', '$ionicModal', 'accountTrade', 'ionicToast', '$ionicHistory',
        function ($scope, $log, PassBuyService, $ionicLoading, $stateParams, $state, RscAlert, $ionicModal, accountTrade, ionicToast, $ionicHistory) {
            var vm = $scope.vm = this;
            var data = {
                demand_id: $stateParams.demand_id,//需求单id
                demand_index: $stateParams.demand_index,//需求单index
                index_trade: $stateParams.index_trade//交易订单的index
            };
            vm.init = function () {
                PassBuyService.getDemandOne(data).then(function (result) {
                    if (result.status == 'success') {
                        vm.demandList = result.data;
                        vm.demandList.demandAmount = 0;
                        $log.debug('获取物流需求单', result)
                    } else {
                        $log.error('获取物流需求单', result)
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                })
            };
            vm.add = function (long, item, num, pro) {
                console.log(item);
                if (item.locCount >= item.count) {
                    return false;
                } else {
                    item.locCount++;
                }
                // if (vm.truckList.type != 'steel') {
                //     vm.truckList.products[0].amount++;
                //     vm.truckList.newamount++;
                //     vm.truckList.amount_remain = vm.truckList.amount_total - vm.truckList.newamount;
                //     return false;
                // }
                // if (vm.status != 'ineffective') {
                //     return false;
                // }
                // var cont = long.count_assign + 1;
                // if (cont > long.max) {
                // } else {
                //     long.count_assign++;
                //     long.count_remain -= 1;
                //     amountCount(car, num, pro, long);
                // }
            };
            vm.subtraction = function (long, item, num, pro) {
                console.log(item);
                if (item.locCount <= 1) {
                    return false;
                } else {
                    item.locCount--;
                }
                // if (vm.truckList.type != 'steel') {
                //     vm.truckList.newamount--;
                //     vm.truckList.products[0].amount--;
                //     vm.truckList.amount_remain = vm.truckList.amount_total - vm.truckList.newamount;
                //     return false;
                // }
                // if (vm.status != 'ineffective') {
                //     return false;
                // }
                // var cont = long.count_assign - 1;
                // if (cont < 0) {
                // } else {
                //     long.count_assign = cont;
                //     long.count_remain += 1;
                //     amountCount(car, num, pro, long);
                // }
            }
            vm.itemChange = function (item) {
                if (item.locCount >= item.count) {
                    item.locCount = item.count
                    return false;
                }
                if (item.locCount <= -1) {
                    item.locCount = 1;
                    return false;
                }
                if (item.locCount == 0) {
                    item.locCount = 1;
                    return false;
                }
            }

            vm.isSureOrder = function (type) {
                var arr = [];
                for (var i = 0; i < vm.demandList.products.length; ++i) {
                    var obj = {};
                    if (vm.demandList.products[i].type == 'coal') {
                        if (vm.demandList.products[i].locCount <= 0) {
                            RscAlert.alert('请输入运输吨数');
                            return;
                        }
                        if (vm.demandList.products[i].locCount > vm.demandList.amount_remain) {
                            RscAlert.alert('运输吨数不能大于剩余运输总量');
                            return;
                        }
                    }
                    obj.category = vm.demandList.products[i].category;
                    obj.count = vm.demandList.products[i].locCount;
                    arr.push(obj);
                }
                var info = {
                    demand_id: data.demand_id,
                    prices: arr
                }
                PassBuyService.priceCanOrder(info).then(function (result) {
                    if (result.status == 'success') {
                        vm.transp = result.data;
                        $log.debug('物流抢单', result);
                        accountTrade.getUserInfoForNameCard(vm.transp.user_demand_id).then(function (user) {
                            $log.debug("获取个人信息", user)
                            if (user.status == 'success') {
                                vm.offerUser = user.data;
                            } else {
                                vm.offerUser = {}
                                $log.error("获取个人信息", user)
                            }
                        });
                        vm.openModal();
                        // $state.go('rsc.goods_success', {order_id: vm.transp._id})
                    } else if (result.msg == 'demand_not_found') {
                        ionicToast.show('当前指派已无吨数可接单', 'middle', false, 1500);
                    } else {
                        $log.error('物流抢单', result)
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                })
            }
            vm.goRoute = function (type) {
                $scope.modal_product.hide();
                if (type == 'look') {
                    $state.go('rsc.goods_order_goods_detail', {order_id: vm.transp._id, special: true})
                } else {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true
                    });
                    $state.go('rsc.center_goods');
                }
            }

            // //确认接单
            // vm.goNext = function () {
            //     vm.openModal();
            // };
            //运输货物模态框
            $ionicModal.fromTemplateUrl('./js/src/remain/goods/goods_success.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal_product = modal;
            });
            vm.openModal = function () {
                $scope.modal_product.show();
            };
            vm.closeModal = function () {
                $state.go('rsc.order_processing');
                $scope.modal_product.hide();
            };
        }])
    /**
     * 物流 货源 认证公司需求单 抢单成功
     */
    .controller('goods_success_ctrl', ['$state', '$stateParams', '$scope',
        function ($state, $stateParams, $scope) {
            var vm = $scope.vm = this;
            vm.goOrderList = function () {
                $state.go('rsc.order_processing')
            };
            vm.orderDetail = function () {
                $state.go('rsc.goods_order_goods_detail', {order_id: $stateParams.order_id, special: true})
            }
            vm.goRoute = function (type) {
                if (type == 'look') {
                    $state.go('rsc.goods_order_goods_detail', {order_id: $stateParams.order_id, special: true})
                } else {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true,
                        disableAnimate: true
                    });
                    $state.go('rsc.center_goods')
                }
            }
        }])
    /**
     * 物流 货源 认证公司需求单详情 跳转控制器
     */
    .controller('centerCtrl', ['$scope', '$state',
        function ($scope, $state) {
            var vm = $scope.vm = this;
            $state.go('rsc_demand.rushList')
        }])

    .controller('demand_invalidCtrl', ['$scope', 'PassBuyService', '$ionicLoading', '$log', '$state', 'PassService','$timeout'
        , function ($scope, PassBuyService, $ionicLoading, $log, $state, PassService,$timeout) {
            var vm = $scope.vm = this;
            vm.init = function () {
                vm.orderQuery = {
                    page: 1,
                    getType: 1,
                    status: 'ineffective',
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


