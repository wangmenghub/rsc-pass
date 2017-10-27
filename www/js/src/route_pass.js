/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.routers.pass', [
    'rsc.service.remain',
    'rsc.controller.goods',
    'rsc.controller.line',
    'rsc.controller.order',
    'rsc.controller.pk',
])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('rsc', {
                url: "/rsc",
                abstract: true,
                cache: false,
                templateUrl: "js/src/menu.html",
                controller: "traffic_person_ctrl as vm",
                resolve: {
                    auth: ["$q", "AuthenticationService", "$rootScope", function ($q, AuthenticationService, $rootScope) {
                        if($rootScope.currentUser){
                            var userInfo = $rootScope.currentUser
                        }else{
                            var userInfo = AuthenticationService.getUserInfo();
                        }
                        if (userInfo) {
                            return $q.when({
                                data: userInfo
                            });
                        } else {
                            return $q.reject({
                                msg: 'no_login'
                            });
                        }
                    }]
                }
            })
            /**
             * 物流货源 货源
             */
            .state('rsc.center_goods', {
                url: '/center_goods',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods.html',
                        controller: "goods_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 地图模式
             */
            .state('rsc.goods_map', {
                url: '/goods_map/:demand_id',
                cache: true,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods_map.html',
                        controller: "goods_map_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 PK 已取消抢单
             */
            .state('rsc.pk_cancel', {
                url: '/pk_cancel',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/PK/cancel_demand.html',
                        controller: "cancel_demand_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 PK 已参与抢单
             */
            .state('rsc.pk_processing', {
                url: '/pk_processing',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/PK/processing_demand.html',
                        controller: "processing_demand_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 订单 待接单
             */
            .state('rsc.order_waiting', {
                url: '/order_waiting',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/order/waiting.html',
                        controller: "waiting_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 订单 进行中
             */
            .state('rsc.order_processing', {
                url: '/order_processing',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/order/processing.html',
                        controller: "processing_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 订单 已完成
             */
            .state('rsc.order_robbed', {
                url: '/order_robbed',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/order/robbed.html',
                        controller: "robbed_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 订单 已取消
             */
            .state('rsc.order_cancel', {
                url: '/order_cancel',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/order/cancel.html',
                        controller: "cancel_ctrl as vm"
                    }
                }
            })
            /**
             * 物流货源 发布线路
             */
            .state('rsc.line', {
                url: '/line',
                cache: true,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/line/line.html',
                        controller: "line_ctrl as vm"
                    }
                }
            })
            /**
             * 物流 货源 发布线路 详情
             */
            .state('rsc.line_detail', {
                url: '/line_detail/:line_id',
                cache: true,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/line/line_detail.html',
                        controller: "line_detail_ctrl as vm"
                    }
                }
            })
            /**
             * 物流 货源 编辑线路
             */
            .state('rsc.edit_line', {
                url: '/edit_line/:line_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/line/edit_line.html',
                        controller: 'edit_line_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 货源 线路详情
             */
            .state('rsc.add_line', {
                url: '/add_line/:line_id',
                cache: true,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/line/add_line.html',
                        controller: 'add_line_ctrl'
                    }
                }
            })
            /**
             * 物流运页面 运输 我发布的司机抢单
             */
            .state('rsc.trans_grab', {
                url: '/trans_grab',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/trans_grab.html',
                        controller: 'trans_grab_ctrl as vm'
                    }
                }
            })
            /**
             * 物流运页面 运输 已完成
             */
            .state('rsc.trans_complete', {
                url: '/trans_complete',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/trans_complete.html',
                        controller: 'trans_complete_ctrl as vm'
                    }
                }
            })
            /**
             * 物流运页面 运输 已取消抢单
             */
            .state('rsc.trans_cancle', {
                url: '/trans_cancle',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/trans_cancle.html',
                        controller: 'trans_cancle_ctrl as vm'
                    }
                }
            })
            /**
             * 运输>找线路
             */
            .state('rsc.find_line', {
                url: '/find_line',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/find_line.html',
                        controller: "find_line_ctrl as vm"
                    }
                }
            })
            // 物流运页面 订单
            // .state('src.sell_order', {
            //     url: '/sell_order?source',
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/transport/order/pass_sell_order.html',
            //             //controller: 'pass_sell_order_ctrl'
            //         }
            //     }
            // })

            /**
             * 物流运页面 订单 进行中
             */
            .state('rsc.trans_order_doing', {
                url: '/trans_order_doing?source&demand_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/order/trans_order_doing.html',
                        controller: 'trans_order_doing_ctrl as vm'
                    }
                }
            })
            /**
             * 物流运页面 订单 已完成
             */
            .state('rsc.trans_order_already', {
                url: '/trans_order_already?source&demand_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/order/trans_order_already.html',
                        controller: 'trans_order_already_ctrl as vm'
                    }
                }
            })
            /**
             * 物流运页面 车辆
             */
            .state('rsc.trans_car', {
                url: '/trans_car?source',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/car/trans_car.html',
                        controller: 'trans_car_ctrl as vm'
                    }
                }
            })
            /**
             * 司机分组列表
             */
            .state('rsc.car_group_list', {
                url: '/car_group_list?type',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/car/car_group_list.html',
                        controller: 'car_group_list_ctrl as vm'
                    }
                }
            })
            /**
             * 车辆分组详情
             */
            .state('rsc.car_group_detail', {
                url: '/car_group_detail/:group_id?type',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/car/car_group_detail.html',
                        controller: 'car_group_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 默认的分组详情
             */
            .state('rsc.car_group_default', {
                url: '/car_group_default/:type/:id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/car/car_group_default.html',
                        controller: 'car_group_default_ctrl as vm'
                    }
                }
            })
            /**
             * 运输 运输 指派详情
             * param:isGoback用于是否启动默认返回
             */
            .state('rsc.trans_assign_detail', {
                url: '/trans_assign_detail/:demand_id/:source/:isGoback',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/trans_assign_detail.html',
                        controller: 'trans_assign_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 运输 运输 货源详情
             */
            .state('rsc.trans_supply_details', {
                url: '/trans_supply_details/:demand_id/:source',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/trans_supply_details.html',
                        controller: 'trans_supply_details_ctrl as vm'
                    }
                }
            })
            /**dirverDetail
             * 运输 运输 货源详情
             */
            .state('rsc.dirver_detail', {
                url: '/dirver_detail?user_id&demand_id&status&order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/dirver_detail.html',
                        controller: 'dirver_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 运输 订单 运输订单详情
             */
            .state('rsc.order_trans_detail', {
                url: '/order_trans_detail/:order_id/:order_index/:source',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/order/order_trans_detail.html',
                        controller: 'order_trans_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 运输 车辆 车辆名片
             */
            .state('rsc.driver_name_cared', {
                url: '/driver_name_cared/:user_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/car/driver_name_cared.html',
                        controller: 'driver_name_cared_ctrl as vm'
                    }
                }
            })
            /**
             * 交易发布的物流需求单 指派详情
             */
            .state('rsc.goods_detail', {
                url: '/goods_detail?demand_id?wait?isGoBack',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods_detail.html',
                        controller: 'goods_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 交易发布的物流需求单 运输详情
             */
            .state('rsc.goods_rush_detail', {
                url: '/goods_rush_detail?demand_id?wait',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods_rush_detail.html',
                        controller: 'goods_rush_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 物流需求单 立即抢单
             */
            .state('rsc.goods_info', {
                url: '/goods_info?demand_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods_info.html',
                        controller: 'goods_info_ctrl as vm'
                    }
                }
            })
            /**
             * 物流需求单 抢单成功
             */
            .state('rsc.goods_success', {
                url: '/goods_success?order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/goods_success.html',
                        controller: 'goods_success_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 货 发布线路 我的报价
             */
            .state('rsc.pass_my_price_offer', {
                url: '/pass_my_price_offer/:user_id',
                views: {
                    'center-content': {
                        templateUrl: 'templates/line/my_price_offer.html',
                        resolve: {
                            userToken: ["$q", "$log", "authenticationService", function ($q, $log, authenticationService) {
                                var userToken = authenticationService.getUserInfo();
                                if (userToken) {
                                    $log.debug('检查用户是否登录', userToken)
                                    return $q.resolve(userToken)
                                } else {
                                    return $q.reject({
                                        islogin: false
                                    })
                                }
                            }]
                        },
                        controller: 'add_line_ctrl'
                    }
                }
            })
            /**
             * 物流 订单 货源
             */
            .state('rsc.goods_order_goods_detail', {
                url: '/goods_order_goods_detail/:order_id/:special',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/goods_order_goods_detail.html',
                        controller: 'goods_order_goods_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 订单 运输详情
             */
            .state('rsc.goods_order_trans_detail', {
                url: '/goods_order_trans_detail/:order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/goods_order_trans_detail.html',
                        controller: 'goods_order_trans_detail_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 订单 指派司机
             */
            .state('rsc.assign_driver_start', {
                url: '/assign_driver_start/:order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/assign_driver_start.html',
                        controller: 'assign_driver_start_ctrl as vm'
                    }
                }
            })

            /**
             * 物流 指派司机车辆 添加司机
             */
            .state('rsc.add_driver', {
                url: '/add_driver?order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/add_driver.html',
                        controller: 'add_driver_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 选择车辆  挂靠
             */
            .state('rsc.car_anchored', {
                url: '/car_anchored?status&order_id&demand_id',
                cashe:false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/car_anchored.html',
                        controller: 'car_anchored_ctrl as vm'
                    }
                }
            })
            /**
             * 物流 选择车辆 自有
             */
            .state('rsc.car_owncar', {
                url: '/car_owncar?status&order_id',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/car_owncar.html',
                        controller: 'car_owncar_ctrl as vm'
                    }
                }
            })
            /**
             * 物流订单 地图
             */
            .state('rsc.map', {
                url: '/map/:order_id',
                cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/map.html',
                        // controller: 'map_ctrl as vm'
                    }
                }
            })

            /**
             * 物流指派司机成功
             */
            .state('rsc.assign_driver_succeed', {
                url: '/assign_driver_succeed/',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/assign_driver_succeed.html',
                        controller: 'assign_driver_succeed_ctrl as vm'
                    }
                }
            })


            /**
             * 物流接单成功
             */
            .state('rsc.assign_good_succeed', {
                url: '/assign_good_succeed',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/assign_good_succeed.html',
                        controller: 'assign_good_succeed_ctrl as vm'
                    }
                }
            })


            /*
            *物流>已失效
            */
            .state('rsc.demand_invalid', {
                url: '/demand_invalid',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/remain/goods/demand_invalid.html',
                        controller: 'demand_invalidCtrl as vm'
                    }
                }
            })

            /*
                *物流订单>补货
                */
            .state('rsc.replenish', {
                url: '/replenish/:orderId',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/transport/transport/replenish.html',
                        controller: 'replenishCtrl as vm'
                    }
                }
            })

    }]);
