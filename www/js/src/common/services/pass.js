/**
 * Created by ID on 15/12/7.
 * Author:zhoudd
 * email:zhoudd@stark.tm
 */
angular.module('rsc.pass.services', ['restangular', 'rsc.common.service.rest'])
     .factory('PassService', function ($q, ENV, PassRestAngular, PassPayAngular, $http, AccountRestAngular, LogServiceAngular) {
        //trade维护区 start
        var h;
        var cbg = function (x, y) {
            h = PassRestAngular.allUrl(x);
            return h.get(y);
        };
        var cbp = function (x, y) {
            h = PassRestAngular.allUrl(x);
            return h.post(y);
        };
        //trade维护区 end
        return {


            /**
             *获取消息数量
             */
            //【物流】获取顶层的消息数量
            getMsg:function () {
                var all = PassRestAngular.allUrl('stat_c/supply_statis');
                return all.post();
            },
            //【物流】货源（底部导航）>订单（顶部二级导航）子数据
            getGoodsOrderMsg:function (status,scene,find_role,is_refresh,searchCompany) {
                // var all = PassRestAngular.allUrl('driver_order_c/get_count');
                // return all.post();
                var param={
                    status:status,
                    scene:scene,
                    find_role:find_role,
                    is_refresh:is_refresh,
                    search_company:searchCompany

                }
                var all = PassRestAngular.allUrl('order_c/get_count');
                return all.post(param);

            },

            // 获取订单>运输订单（也就是司机订单）的相关信息,比如各类型订单的数量，新消息的数量，总金额
            getTransOrderMsg:function (data) {
                var all = PassRestAngular.allUrl('driver_order_c/get_count');
                return all.post(data);
            },


            //【物流】运输（底部导航）>运输（顶部二级导航）子数据(是上边getTranspOrderMsg之前的老版本方法，后期可以删除)
            getTranspTranspMsg:function () {
                var all = PassRestAngular.allUrl('driver_demand_c/get_count');
                return all.post();
            },
            //【物流】运输（底部导航）>订单（顶部二级导航）子数据
            getTranspOrderMsg:function (status,scene,find_role,is_refresh) {

                var param={
                    status:status,
                    scene:scene,
                    find_role:find_role,
                    is_refresh:is_refresh
                }
                var all = PassRestAngular.allUrl('driver_order_c/get_count');
                return all.post(param);
            },
            //订单>货源>获取与己方公司达成订单的公司列表及统计数量
            getCompanyCount:function (param) {
                var all = PassRestAngular.allUrl('order_c/get_company_count');
                return all.post(param);
            },
            //订单>运输>获取与己方公司达成订单的公司列表及统计数量
            getDriveCount:function (param) {
                var all = PassRestAngular.allUrl('driver_order_c/get_company_count');
                return all.post(param);
            },
            /**
             * 物流管理员 代替司机确认订单
             * @param order_id 订单ID
             * @param user_id 代替接单的人的id
             */
            confirm_truck: function (order_id, user_id) {
                var all = PassRestAngular.allUrl('route/agree_by_traffic_agree');
                return all.post({order_id: order_id, user_id: user_id});
            },
            /**
             * 物流管理员 替换指定车辆（已派单车辆替换）
             * @param order_id 订单ID
             * @param route_id 被替换的route_id
             * @param truck_id 替换的车辆id
             * @param user_id 替换的人员id
             */
            order_replace_truck: function (plan_user_id, plan_truck_id, order_id, user_id, truck_id) {
                var all = PassRestAngular.allUrl('driver_plan/replace');
                return all.post({
                    plan_user_id: plan_user_id,
                    plan_truck_id: plan_truck_id,
                    order_id: order_id,
                    user_id: user_id,
                    truck_id: truck_id
                });
            },
            /**
             * 物流管理员 替换指定车辆（进行中车辆替换）
             * @param order_id 订单ID
             * @param route_id 被替换的route_id
             * @param truck_id 替换的车辆id
             * @param user_id 替换的人员id
             */
            replace_truck: function (order_id, route_id, truck_id, user_id) {
                var all = PassRestAngular.allUrl('route/replace_new');
                return all.post({order_id: order_id, route_id: route_id, truck_id: truck_id, user_id: user_id});
            },
            /**
             * 物流管理员确认订单完成
             * @param order_id 订单ID
             */
            orderComplate: function (data) {
                var all = PassRestAngular.allUrl('/order/traffic_3_confirm_new');
                return all.post(data);
            },


            /**
             * 获取订单中各种车辆列表
             * @param order_id
             * @param offer 指派车辆就传false 抢单车辆中的就传true
             * @returns
             * {   complete完成的
                            doing进行中
                            not_ready已派单
                        }
             */
            getOrderCarList: function (order_id, offer) {
                var pass = PassRestAngular.allUrl("order/get_truck_info");
                return pass.post({order_id: order_id, offer: offer});
            },
            driverPlan: function (id) {
                var all = PassRestAngular.allUrl('driver_plan/get_one');
                return all.post({driver_plan_id: id});
            },
            getCountForInformate: function (company_id) {
                var pass = PassRestAngular.allUrl("driver_offer/get_count_for_information_department");
                return pass.post({company_id: company_id});
            },
            getLineForTruckId: function (truck_id) {
                var pass = PassRestAngular.allUrl("route/get_line_for_truck_id");
                return pass.post({truck_id: truck_id});
            },
            // 物管 货 订单 待接单订单数量
            getNewOrderCountNew: function () {
                var pass = PassRestAngular.allUrl("order/get_new_order_count");
                return pass.post();
            },
            // 物管 货 订单 进行中订单数量
            getTrafficProcessing: function () {
                var pass = PassRestAngular.allUrl("order/traffic_get_processing");
                return pass.post();
            },
            // 物管 货 订单 已完成订单数量
            getTrafficOrderAllCount:function(){
                var pass = PassRestAngular.allUrl("order/traffic_order_complete");
                return pass.post();
            },
            driverGetCount: function () {
                var pass = PassRestAngular.allUrl("driver_plan/driver_get_count");
                return pass.post();
            },
            driverGetAmount: function (id) {
                var pass = PassRestAngular.allUrl("route/get_one");
                return pass.post({route_id: id});
            },
            getDriverLog: function () {
                var pass = PassRestAngular.allUrl("route/get_driver_log");
                return pass.post();
            },
            getCountForShippe: function (company_id, user_id) {
                var pass = PassRestAngular.allUrl("offer/get_count_for_shipper");
                return pass.post({company_id: company_id, user_id: user_id});
            },
            getDriverByCompanyIds: function (companyids) {
                var pass = PassRestAngular.allUrl("tip/get_driver_demand_new_count_by_company_ids");
                return pass.post({company_ids: companyids});
            },
            /**
             * 根据车辆的吨位获取派单件数
             * @param order_id
             * @param weight
             */
            getAssignInfo: function (data) {
                var pass = PassRestAngular.allUrl("order/get_truck_assign");
                return pass.post(data);
            },
            /**
             * 设置司机运输吨数
             * @param order_id
             * @param products
             * @param user_id
             */
            setDriverAmount: function (products) {
                var pass = PassRestAngular.allUrl("order/3_edit_route_info_new_new");
                return pass.post(products);
            },
            /**
             * 获取所有的货源的信息
             * @param data
             * @returns {*}
             */
            queryDemandList: function (data) {
                var pass = PassRestAngular.oneUrl('demand/getList/' + data.all + '/' + data.order + '/' + data.pageSize);
                return pass.get();
            },
            /**
             * 根据ID获取物流货源的信息。
             * @param id
             * @returns {*}
             */
            getDemandById: function (id) {
                var pass = PassRestAngular.allUrl('demand/get_one');
                return pass.post({demand_id: id});
            },
            //物流确认订单新接口
            getDemandByOffer: function (price, id) {
                var pass = PassRestAngular.allUrl('offer/add_by_price_offer_demand');
                return pass.post({price: price, demand_id: id});
            },
            //获取司机我的线路抢单数
            getDriverByLine: function (send, receive) {
                var pass = PassRestAngular.allUrl('driver_demand/get_count_by_address');
                return pass.post({send_city: send, receive_city: receive});
            },
            //获取需求单报价企业总数
            getDemandOfferCountById: function (id) {
                var count = PassRestAngular.allUrl('/demand/get_offer_count');
                var data = {
                    demand_id: id
                }
                return count.post(data);
            },
            offerCommit: function (data) {
                var offer = PassRestAngular.allUrl('/offer/add');
                return offer.post(data);
            },
            confirmOrders: function (prices, replenish, id) {
                var all = PassRestAngular.allUrl('/offer/add_new');
                return all.post({prices: prices, prices_replenish: replenish, demand_id: id});
            },
            /**
             * 物流公司修改物流抢单
             *price, amount, style_payment, demand_id
             * @returns {*}
             */
            offerEdit: function (data) {
                var offer = PassRestAngular.allUrl('/offer/edit');
                return offer.post(data);
            },
            getOfferList: function (data) {
                var offerlist = PassRestAngular.allUrl('offer/get_by_demand_id');
                return offerlist.post(data);
            },
            getAllAmount: function () {
                var all = PassRestAngular.allUrl('/demand/get_all_amount');
                return all.post();
            },
            getOrderTrafficStatus: function (order_id) {
                var all = PassRestAngular.allUrl('/order/traffic_get_status');
                return all.post({order_id: order_id});
            },
            //新增订单中取消和确认按钮的显示
            getOrderTrafficAssign: function (order_id, confirm) {
                var all = PassRestAngular.allUrl('/assign/deal');
                return all.post({order_id: order_id, confirm: confirm});
            },
            //物管获取两方物流订单状态
            getTrafficStatusBoth: function (order_id) {
                var all = PassRestAngular.allUrl('/order/traffic_get_status_both');
                return all.post({order_id: order_id});
            },
            getOrderTradeStatus: function (order_id) {
                var all = PassRestAngular.allUrl('/order/trade_get_status');
                return all.post({order_id: order_id});
            },
            /**
             * 根据公司类型获取当前公司所有的订单。
             * @param type
             * @returns {*}
             */
            getAllOrders: function (type, query) {
                var url = "/order/" + type.toLowerCase() + "_get";
                var all = PassRestAngular.allUrl(url);
                return all.post(query);
                //http://192.168.3.147:18081/api/order/traffic_get
            },
            getAllOrdersNew: function (query) {
                var url = "driver_demand/traffic_get_driver_demand_order";
                var all = PassRestAngular.allUrl(url);
                return all.post(query);
                //http://192.168.3.147:18081/api/order/traffic_get
            },
            getOrderById: function (id) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('/order/get_one');
                return all.post({order_id: id});
            },
            /**
             *查询订单是否可取消
             *
             */
            getOrderStatus: function (id) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('route/get_count');
                return all.post({order_id: id});
            },
            //获取司机抢单个数
            getCarCounts: function (data) {
                var all = PassRestAngular.allUrl('driver_offer/count');
                return all.post({order_id: data});
            },
            /**
             *物流管理员查看发布的司机抢单 bug#518
             *
             */
            getOneInclude: function (id) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('driver_demand/get_one_include_order');
                return all.post({order_id: id});
            },
            /**
             *  物流公司1.5步确认订单
             * @param order_id
             * @returns {*}
             */
            orderStepTraffic_confirm: function (order_id) {
                //order/2_add_traffic
                var all = PassRestAngular.allUrl('/order/1_traffic_confirm');
                return all.post({order_id: order_id});
            },
            /**
             * 物流公司申请发车
             * @param time
             * @returns {*}
             */
            orderDispatchTruck: function (order_id, time) {
                var all = PassRestAngular.allUrl('/order/2_apply_add_traffic_time');
                return all.post({order_id: order_id, time: time});
            },
            /**
             * 交易确认发车时间
             * @param order_id
             * @param time
             * @returns {*}
             */
            orderConfirmDispatchTruckTime: function (order_id, time) {
                var all = PassRestAngular.allUrl('/order/2_deal_add_traffic_time');
                return all.post({order_id: order_id, time: time});
            },
            //
            /**
             * 物流订单选择车辆后确认
             * @param array
             * @returns {*}
             */
            orderStep2SelectCar: function (order_id, array, is_offer, is_public) {
                //order/2_add_traffic
                var all = PassRestAngular.allUrl('/order/2_add_traffic');
                return all.post({order_id: order_id, v_info: array, is_offer: is_offer, is_public: is_public});
            },
            /**
             * 新物流订单选择车辆后确认
             * @param array
             * @returns {*}
             */
            orderStep2SelectCarNew: function (order_id, array) {
                //order/2_add_traffic
                var all = PassRestAngular.allUrl('/order/add_traffic_right_now');
                return all.post({order_id: order_id, v_info: array});
            },
            /**
             * 强制指派
             *
             */
            orderStep2SelectCarIpm: function (order_id, array, role) {
                //order/2_add_traffic
                var all = PassRestAngular.allUrl('/order/add_traffic_force');
                return all.post({order_id: order_id, v_info: array, role: role});
            },
            getOrderUseCar: function (order_id) {
                //route/get
                var all = PassRestAngular.allUrl('/route/get');
                return all.post({order_id: order_id});

            },
            /**
             * 物流确认收预付款 后加2.25
             * @param order_id
             * @returns {*}
             */
            orderStep2Confirm: function (order_id) {
                var all = PassRestAngular.allUrl('/order/2_traffic_confirm');
                return all.post({order_id: order_id});
            },
            /**
             * 第四步物流方确认
             * @param order_id
             * @param confirm false 表示确认，true 表示申请申诉
             * @param price 当 confirm为false的时候可以不传，当为true传申请申诉的金额
             * @returns {*}
             */
            orderStep4ApplyUnderstanding: function (order_id, confirm, price) {
                var all = PassRestAngular.allUrl('/order/4_traffic_confirm');
                return all.post({order_id: order_id, confirm: confirm, price: price});
            },
            orderStep3Confirm: function (data) {
                var all = PassRestAngular.allUrl('/order/3_confirm');
                return all.post(data);
            },
            traffic3Confirm: function (data) {
                var all = PassRestAngular.allUrl('/order/traffic_3_confirm');
                return all.post(data);
            },
            getAllRouteByOrderId: function (order_id) {
                var all = PassRestAngular.allUrl('/route/get');
                return all.post({order_id: order_id});
            },
            /**
             * 获取我的物流需求单
             * @returns {*}
             */
            getAllDemand: function (data) {
                var all = PassRestAngular.allUrl('/demand/get_by_role');
                return all.post(data);

            },
            /**
             * 销售选择物流单
             * @param offer_id amount
             * @returns {*}
             */
            selectOffer: function (data) {
                var all = PassRestAngular.allUrl('offer/select');
                return all.post(data);
            },
            selectOffers: function (data) {
                var all = PassRestAngular.allUrl('offer/select_new');
                return all.post(data);
            },
            selectByPriceOffer1: function (data) {
                var all = PassRestAngular.allUrl('offer/select_new');
                return all.post(data);
            },
            selectByOffer: function (data) {
                var all = PassRestAngular.allUrl('offer/select_new_new');
                return all.post(data);
            },
            /**
             * 销售第一步确认订单
             * @param order_id
             * @returns {*}
             */
            passOrderConfirm: function (order_id) {
                var all = PassRestAngular.allUrl('/order/1_confirm');
                return all.post({order_id: order_id});
            },
            /**
             * 销售公司确认收货
             * @param order_id
             */
            tradeOrder4ConfirmReceipt: function (data) {
                var all = PassRestAngular.allUrl('/order/4_buy_confirm');
                return all.post(data);
            },
            /**
             * 物流发布抢单
             * @param offer(true/false)
             */
            getReleaseOrders: function (query) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('/order/traffic_get_add_traffic');
                return all.post(query);
            },
            /**
             * 物流查看发布抢单列表（新）
             * @param offer(true/false)
             */
            getReleaseOrdersNew: function (query) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('driver_demand/admin_get');
                return all.post(query);
            },
            /**
             * 第五步 物流方确认收款
             * @param order_id
             * @returns {*}
             */
            trafficOrder5Confirm: function (order_id) {
                var all = PassRestAngular.allUrl('/order/5_confirm');
                return all.post({order_id: order_id});
            },
            trafficOrder4ReConfirm: function (order_id, confirm) {
                var all = PassRestAngular.allUrl('/order/4_buy_reconfirm');
                return all.post({order_id: order_id, confirm: confirm});
            },
            orderPay: function (type, order_id, file) {
                //var formData = new FormData();
                //formData.append('file', file);
                //
                //var url = '/file/upload/' + type + "/" + order_id;
                //var all = PassPayAngular.allUrl(url);
                //
                //return all.post({transformRequest: angular.identity},formData);

                var defer = $q.defer();
                var formData = new FormData();
                formData.append('file', file);
                var url = ENV.api.pass + 'file/upload/' + type + "/" + order_id;
                $http({
                    method: 'POST'
                    , url: url
                    , data: formData
                    , headers: {
                        "Content-Type": undefined
                    }
                    , transformRequest: angular.identity
                }).success(function (data) {
                    if (data.status == "success") {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                    }
                }).error(function (error) {
                    console.log(error)
                });
                return defer.promise;
            },
            payMentConfirm: function (order_id, url, step) {

                var postUrl;
                var postData = {order_id: order_id};
                if (step == 2) {
                    postUrl = "/order/2_upload_payment";
                    postData.url = url;
                } else if (step == 5) {
                    postUrl = "/order/5_upload_payment";
                    postData.url = url;
                } else if (step == 4) {
                    postUrl = "/order/4_buy_confirm";
                    postData.url_remain_payment = url;
                } else if (step == 2.2) {
                    postUrl = "/order/2_upload_payment";
                } else {
                    postUrl = "";
                }
                // console.log('postUrl', arguments)
                // console.log('postUrl', postUrl)
                var all = PassRestAngular.allUrl(postUrl);


                return all.post(postData);
            },
            /**
             * 仓库管理员获取未完成、已完成的订单列表
             * @param store_id
             * @param finish true 完成，false 未完成
             * @returns {*}
             */
            getOrderForStorer: function (store_id, type, page) {
                var all = PassRestAngular.allUrl('order/get_storage_log');
                return all.post({store_id: store_id, type: type, page: page});
            },
            /**
             * 获取仓库信息
             * @param store_id
             * @returns {*}
             */
            getStores: function (store_id) {
                var all = AccountRestAngular.allUrl('company_trade_store/get_one');
                return all.post({store_id: store_id});
            },
            /**
             * 编辑仓库信息
             * @param store
             * @returns {*}
             */
            editStore: function (store) {
                var all = AccountRestAngular.allUrl('company_trade_store/edit');
                return all.post(store);
            },

            /**
             * 仓库过磅
             * @param order_id 订单id
             * @param user_id 过磅人
             * @param number 吨数
             * @returns {*}
             * @constructor
             */
            storeWeigh: function (order_id, user_id, number) {
                var all = PassRestAngular.allUrl('/order/3_sell_weigh');
                return all.post({order_id: order_id, number: number, user_id: user_id});
            },
            storeWeighForBuy: function (order_id, user_id, number) {
                var all = PassRestAngular.allUrl('/order/3_buy_weigh');
                return all.post({order_id: order_id, number: number, user_id: user_id});

            },
            /**
             * 判断当前公司是否已经对该订单
             * ,如果是发单企业为true,如果是物流企业需要根据抢单范围进行判断
             * 如果是限定范围判断,该用户公司是否是发单企业的认证企业.如果不是为false,否则为true
             * @param demand_id
             * @returns {canOffer 表示该公司是否能对该订单抢单,hasOffer是否已经抢过单了>0 表示已有报价}
             */
            getCompanyOfferCountByDemandId: function (demand_id) {
                var all = PassRestAngular.allUrl('offer/get_company_offer_count_by_demand_id');
                return all.post({demand_id: demand_id});

            },
            /**
             * 根据Demand_id判断，当前用户是否有权操作
             * @param demand_id
             * @returns {*}
             */
            checkDemandAuthority: function (demand_id) {
                var all = PassRestAngular.allUrl('demand/is_same_demand_user');
                return all.post({demand_id: demand_id});

            },
            /**
             * 车辆相关图片上传
             * @param type
             * @param truck_id
             * @param file
             * @returns {*}
             */
            carImgUpload: function (type, truck_id, file) {
                //var formData = new FormData();
                //formData.append('file', file);
                //
                //var url = '/file/upload/' + type + "/" + order_id;
                //var all = PassPayAngular.allUrl(url);
                //
                //return all.post({transformRequest: angular.identity},formData);

                var defer = $q.defer();
                var formData = new FormData();
                formData.append('file', file);
                var url = ENV.api.account + 'file/upload/' + type + "/" + truck_id;
                $http({
                    method: 'POST'
                    , url: url
                    , data: formData
                    , headers: {
                        "Content-Type": undefined
                    }
                    , transformRequest: angular.identity
                }).success(function (data) {
                    if (data.status == "success") {
                        defer.resolve(data);
                    } else {
                        defer.reject(data);
                    }
                }).error(function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            },

            /**
             * 运输途中更换车辆
             * @param order_id
             * @param route_id
             * @param truck_id
             * @param user_id
             * @returns {*}
             */
            replaceCar: function (data) {
                var all = PassRestAngular.allUrl('route/replace');
                //{order_id: order_id, route_id: route_id, truck_id: truck_id, user_id: user_id}
                return all.post(data);

            },
            /**
             * 根据抢单Id获取抢单详情
             * @param offer_id
             * @returns {*}
             */
            getOfferById: function (offer_id) {
                var all = PassRestAngular.allUrl('offer/get_by_id');
                //{order_id: order_id, route_id: route_id, truck_id: truck_id, user_id: user_id}
                return all.post({offer_id: offer_id});

            },
            /**
             * 获取物流公司的所有抢单列表
             * @returns {*}
             */
            getOfferListByCompany: function (data) {
                var all = PassRestAngular.allUrl('offer/get_by_role');
                //{order_id: order_id, route_id: route_id, truck_id: truck_id, user_id: user_id}
                return all.post(data);

            },
            /**
             * 根据订单ID获取应到货、实际到货、未到货数量
             * @param order_id
             * @returns {*}
             */
            getAmountLast: function (order_id) {
                var all = PassRestAngular.allUrl('order/get_amount_and_last');
                return all.post({order_id: order_id});
            },
            /**
             * 获取司机状态
             * @param uesr_id
             * @returns {*}
             */
            getDriverStateById: function (uesr_id) {
                var all = PassRestAngular.allUrl('route/get_by_user_id');
                return all.post({user_id: uesr_id});
            },
            /**
             * 新页面获取司机状态
             * @param uesr_id
             * @returns {*}
             */
            getDriverOfferStatus: function (uesr_id, order_id) {
                var all = PassRestAngular.allUrl('driver_offer/admin_get_status');
                return all.post({user_id: uesr_id, order_id: order_id});
            },
            /**
             * 获取车辆是否正在运输其它订单
             * @param uesr_id
             * @returns {*}
             */
            getOtherDriverOfferStatus: function (uesr_id, order_id) {
                var all = PassRestAngular.allUrl('driver_offer/admin_get_other_status');
                return all.post({user_id: uesr_id, order_id: order_id});
            },
            /**
             * 获取物流货源列表（新接口）queryDemandList（旧）
             * @param data
             * @returns {*}
             */
            passDemandFind: function (data) {
                var all = PassRestAngular.allUrl('demand/find');
                return all.post(data);
            },
            getSMSParams: function (data) {
                var all = PassRestAngular.allUrl('demand/get_SMS_content_by_id');
                return all.post(data);
            },
            /**
             * 取消订单
             * @param order_id
             * @returns {*}
             */
            cancelOrder: function (order_id) {
                var all = PassRestAngular.allUrl('order/cancel');
                return all.post({order_id: order_id});
            },
            /**
             * 新物流取消订单
             * @param order_id
             * @returns {*}
             */
            cancelOrderNew: function (order_id) {
                var all = PassRestAngular.allUrl('order/cancel_price_offer_order');
                return all.post({order_id: order_id});
            },
            /**
             * 交易方取消订单
             * @param order_id
             * @returns {*}
             */
            cancelTradeOrder: function (_id) {
                var all = PassRestAngular.allUrl('order/trade_cancel');
                return all.post({order_id: _id});
            },
            /**
             * 根据订单id检查当前登陆公司是否可以抢单.
             * @param order_id
             * @returns {true:可以抢单,false:不可抢单}
             */
            checkOfferAuthority: function (demand_id) {
                var all = PassRestAngular.allUrl('demand/can_offer');
                return all.post({demand_id: demand_id});
            },
            getDriverOfferCount: function (order_id) {
                ///api/driver_offer/count
                //获取某笔订单司机抢单数
                //order_id
                var all = PassRestAngular.allUrl('driver_offer/count');
                return all.post({order_id: order_id});
            },
            /**
             * 发布物流抢单.
             * @param data
             * @returns {*}
             */
            publishDriverDemand: function (data) {
                var all = PassRestAngular.allUrl('order/2_edit_driver_offer');
                return all.post(data);
            },
            /**
             * 发布物流抢单.
             * @param data
             * @returns {*}
             */
            publishDriverDemandNew: function (data) {
                var all = PassRestAngular.allUrl('order/edit_driver_by_price_offer_order');
                return all.post(data);
            },
            /**
             * 物流发布司机抢单.
             * @param data
             * @returns {*}
             */
            driverDemanPublish: function (data) {
                var all = PassRestAngular.allUrl('order/edit_driver_demand_new');
                return all.post(data);
            },
            /**
             * 物流企业获取,申请申诉前后所得收入,支出信息.
             * @param data
             * @returns {*}
             */
            getForgivenDetail: function (data) {
                var all = PassRestAngular.allUrl('order/get_forgiven_detail');
                return all.post({order_id: data});
            },

            /**
             * 获取汇款信息.
             * @param data
             * @returns {*}
             */
            getRemit: function () {
                var all = PassRestAngular.allUrl('offer/get_last_remit');
                return all.post();
            },

            /**
             * 挂靠司机获取认证抢单数量
             *
             */
            getOrderNum: function () {
                var all = PassPayAngular.allUrl('driver_offer/driver_get_count_by_verify_company')
                return all.post();
            },

            /**
             * 获取抢单抢单信息 总吨数 涉及金额.
             *
             *
             */
            getOffer: function () {
                var all = PassRestAngular.allUrl('offer/get_total_detail');
                return all.post();
            },

            getDemand: function () {
                var all = PassRestAngular.allUrl('demand/get_total_detail');
                return all.post();
            },

            getOrder: function () {
                var all = PassRestAngular.allUrl('order/get_total_detail');
                return all.post();
            },
            getDriverOffetDetail: function () {
                var all = PassRestAngular.allUrl('order/get_driver_offer_detail');
                return all.post();
            },
            DriverGetTotalDetail: function () {
                var all = PassRestAngular.allUrl('driver_offer/driver_get_total_detail');
                return all.post();
            },
            getAskPrice: function () {
                var all = PassRestAngular.allUrl('home/get_self_company_price_ask_offer_info');
                return all.post();
            },
            /**
             * 设置公有司机和私有司机的运输吨数.
             * @param is_public  true:表示设置公有司机的吨数,false:表示设置私有司机的吨数
             * @param amount  具体吨数
             * @returns {*}
             */
            edit_truck_weigh_amount_2: function (order_id, is_public, amount) {
                var all = PassRestAngular.allUrl('order/2_edit_truck_weigh_amount');
                return all.post({order_id: order_id, is_public: is_public, amount: amount});
            },
            /**
             * 取消物流抢单
             */
            cancelOffer: function (offer_id) {
                var all = PassRestAngular.allUrl('offer/close');
                return all.post({offer_id: offer_id});
            },
            /**
             * 取消物流需求单
             */
            cancelDemand: function (demand_id) {
                var all = PassRestAngular.allUrl('demand/close');
                return all.post({demand_id: demand_id});
            },
            /**
             * 确认物流订单
             */
            acceptPassOrders: function (order_id) {
                var all = PassRestAngular.allUrl('order/1_traffic_confirm_price_offer_order');
                return all.post({order_id: order_id});
            },
            /**
             * 确认物流订单运输完毕
             */
            confimCompelte: function (order_id) {
                var all = PassRestAngular.allUrl('order/traffic_3_confirm_price_offer');
                return all.post({order_id: order_id});
            },
            /**
             * 交易公司查看线路报价
             * start_pro
             start_cit
             end_pro
             end_cit
             */
            searchLinesPrice: function (data) {
                var all = PassRestAngular.allUrl('order/get_reference_price');
                return all.post(data);
            },
            /**
             * 分享物流计划获取物流计划的参数
             */
            get_SMS_content: function () {
                var all = PassRestAngular.allUrl('plan/get_SMS_content');
                return all.post();
            },
            /**
             * 公司名称
             * 产品种类
             * 重量
             */
            get_link_content: function () {
                var all = PassRestAngular.allUrl('plan/get_link_content');
                return all.post();
            },
            /**
             * 获取某人有效需求单
             * page:
             * user_id:
             * type: company , user
             */
            getDemandByUserId: function (query) {
                var all = PassRestAngular.allUrl('demand/get_by_id');
                return all.post(query);
            },
            /**
             * /api/demand/add_recommend_push_count
             物流需求单，系统推荐按钮发送消息
             demand_id
             company_id：这个是数组，就是通过公司列表，把选中的公司id发给我就行
             物流服务器
             */
            companyPushDemand: function (type, data) {
                var url = 'demand/add_recommend_push_count';
                if (type == 'price') {
                    url = 'price_ask/add_recommend_push_count';
                }
                var all = PassRestAngular.allUrl(url);
                return all.post(data);
            },
            /**
             * 根据routeID获取司机运输次数
             * @param route_id
             * @returns {*}
             */
            getDriverCount: function (route_id) {
                var all = PassRestAngular.allUrl('/route/driver_get_status');
                return all.post({route_id: route_id});
            },
            /**
             * 交易企业获取线路报价查询的省市历史记录
             *  实际服务端回的是 改公司进一次订单成交的省市
             */
            getLineForPriceSearch: function () {
                var all = PassRestAngular.allUrl('order/get_last_order_line');
                return all.post();
            },
            /**
             * 物流导航 新增订单的个数
             */
            getNewOrderCount: function () {
                var all = PassRestAngular.allUrl('order/get_new_order_count');
                return all.post();
            },
            getNewOrderList: function () {
                var all = PassRestAngular.allUrl('order/get_new_order');
                return all.post();
            },
            //获取订单状态
            getStatusLists: function (query) {
                var count = LogServiceAngular.allUrl('list_order_status');
                return count.post(query);
            },
            /**
             * 司机获取搜索可抢单列表
             *
             */
            driverPassDemandFind: function (data) {
                var all = PassRestAngular.allUrl('driver_offer/driver_get');
                return all.post(data);
            },
            getStepText: function (order_id) {
                var all = PassRestAngular.allUrl('driver_offer/driver_get_status');
                return all.post(order_id);
            },
            /**
             * 物管获取订单车辆状态（2016-12-23）
             * @param order_id
             * @returns {*}
             */
            getStepTextNew: function (order_id) {
                var all = PassRestAngular.allUrl('order/driver_get_status_both');
                return all.post(order_id);
            },
            /**
             * 物流管理员获取询价详情的认证状态：
             * not_verify
             wait_verify
             already_offer
             not_offer
             */
            getVerifyStatusForPrice: function (price_ask_id) {
                var all = PassRestAngular.allUrl('price_ask/traffic_admin_get_status');
                return all.post({price_ask_id: price_ask_id});
            },
            /**
             * 设置运输中车辆的实际交货吨数
             * @param
             * order_id: 订单id
             * user_id：司机的id
             * amount  ：实际交货吨数
             */
            editRouteAmount: function (order_id, user_id, amount) {
                var all = PassRestAngular.allUrl('order/3_edit_route_info_price_offer');
                return all.post({order_id: order_id, user_id: user_id, number: amount});
            },
            /**
             * 2.0给司机下单
             * @param order_id 订单ID
             * @param is_offer 是否抢单车辆派车
             * @param amount 指派吨数
             * @param v_info {
           *        user_id:数组
                    truck_id
                    amount
                    products
           *    }
             * @returns {*}
             */
            orderForDriver: function (data) {
                var all = PassRestAngular.allUrl('/order/add_traffic_right_now_new');
                return all.post(data);
            },

            /**
             * 2.0 强制 给司机下单
             * @param order_id 订单ID
             * @param is_offer 是否抢单车辆派车
             * @param amount 指派吨数
             * @param v_info {
            *        user_id:数组
                    truck_id
                    amount
                    products
            *    }
             * @returns {*}
             */
            orderForDriverForce: function (data) {
                var all = PassRestAngular.allUrl('/order/add_traffic_force_new');
                return all.post(data);
            }
            //  trade维护区 start
            , passStatGetbyuser: function (data) {
                return cbp('stat/get_by_user_id', data);
            }
            // 获取物流数据
            , getPassDemandInfo: function () {
                return cbp('home/get_demand_info', {});
            }
            // 添加物流计划
            , passPlanAdd: function (data) {
                return cbp('plan/add', data);
            }
            // 获取物流计划列表
            , passPlandGet: function (data) {
                return cbp('plan/get', data);
            }
            // 添加物流计划
            , passPlandAllow: function () {
                return cbp('plan/allow_add', {});
            }
            // 删除物流计划
            , passPlandDec: function (id) {
                return cbp('plan/dec', {'plan_id': id});
            }
            // 计划列表与搜索20160604
            , passPlanfind: function (data) {
                return cbp('plan/find', data);
            }
            // 物流询价20160604
            , passPriceAskAdd: function (data) {
                return cbp('price_ask/add', data);
            }
            , passPriceAskGet: function () {
                return cbp('price_ask/get', {});
            }
            , passPriceAskFind: function (data) {
                return cbp('price_ask/find', data);
            }
            , passPriceAskGetOne: function (data) {
                return cbp('price_ask/get_one', data);
            }
            //企业主页  物流  实时物流
            , businessCardGet: function (data) {
                return cbp('driver_demand/business_card_get', data);
            }
            //企业主页   查看企业名片交易公司的
            , demandBusinessCardGet: function (data) {
                return cbp('demand/business_card_get', data);
            }
            //挂靠司机  推荐需求单  详情页
            , driverDemandGetOne: function (id) {
                return cbp('driver_demand/get_one/', {order_id: id});
            }
            //挂靠司机  某笔需求单重的状态
            , driverGetStatus: function (id) {
                return cbp('driver_demand/driver_get_status/', {driver_demand_id: id});
            }
            //挂靠司机  某笔需求单重的状态 立即抢单
            , driverVerifyAdd: function (id) {
                return cbp('driver_offer/add/', {order_id: id});
            }
            , getPassGetPriceDetail: function (pay) {
                var data = {pay: pay == 'true' ? true : false};
                return cbp('order/get_price_detail', data);
            }
            // 获取平台抢单信息
            , getOfferInfo: function () {
                return cbp('home/get_offer_info', {});
            }
            // 线上企业发布物流询价xx个
            , passgetPriaskinf: function () {
                return cbp('home/get_price_ask_info', {});
            }
            // 线上企业已参与的报价xx次
            , passgetPriaskoffinf: function () {
                return cbp('home/get_price_ask_offer_info', {});
            }
            // 线上物流发布运输,车辆进行中,已完成运输
            , passgetDriveDeminf: function () {
                return cbp('home/get_driver_demand_info', {});
            }
            // 获取我的需求单详情 （重复  PassService.getDemand()）
            , getTotalDetail: function () {
            }
            // 获取我的需求单详情  (重复 src.getOrder())
            , getTotalDetailOrder: function () {
            }
            , CompanyStatGetSelf: function () {
                return cbp('company_stat/get_self', {});
            }
            , passgetSelfCompanyPriceaskinfo: function () {
                return cbp('home/get_self_company_price_ask_info', {});
            }
            , passgetSelfCompanyPlanInfo: function () {
                return cbp('home/get_self_company_plan_info', {});
            }
            //重复 src.passStatGetbyuser()
            , passuserStatgetbyuserid: function (_data) {
            }
            , passgetSelfpriaskinf: function () {
                return cbp('home/get_self_price_ask_info', {});
            }
            , passgetSelfplainf: function () {
                return cbp('home/get_self_plan_info', {});
            }
            // (重复 src.getAllAmount())
            , passdemandGetAllAmount: function () {
            }
            // 获取物流需求单最近3个
            , passDemandGetLately: function (company_id, user_id) {
                return cbp("demand/get_lately", {company_id: company_id, user_id: user_id});
            }
            //获取获取平台物流计划信息
            , getPlanInfo: function () {
                return cbp('home/get_plan_info', {});
            }
            //获取获取平台询价信息 重复pass.passgetPriaskinf()
            , getPriceAskInfo: function () {
            }
            //获取本公司的询价报价信息 重复 src.getAskPrice()
            , getSelfCompanyPriceAskOfferInfos: function () {
            }
            // 我参与的询价报价xx次
            , passgetSelfPriaskoffinf: function () {
                return cbp('home/get_self_price_ask_offer_info', {});
            }
            //挂靠司机
            , passdriverGetCount: function () {
                return cbp('driver_offer/driver_get_count', {});
            }
            //挂靠司机
            , passgetDriveLogCount: function (data) {
                return cbp('route/get_driver_log_count', data);
            }
            //获取物流订单详细 重复 src.getDemandById()
            , demandGetOne: function () {
            }
            //销售管理员和销售的我的抢单页面 重复 src.getAmountLast()
            , getAmountAndLast: function () {
            }
            //销售管理员和销售的我的抢单页面
            , routeGetCount: function (id) {
                return cbp('route/get_count', {order_id: id});
            }
            //重复 src.businessCardGet()
            , driverDemandBusinessCardGet: function () {
            }
            //通讯录物流选择和推荐
            , demandGetSMSPhoneBook: function (demand_id) {
                return cbp('demand/get_SMS_phone_book', {demand_id: demand_id});
            }
            // 重复 src.getOrderById()
            , orderGetone: function () {
            }
            // 重复 getOrderUseCar()
            , routeGet: function () {
            }
            , passDemandAdd: function (data) {
                return cbp('demand/add', data);
            }
            , passDemandAddBoth: function (data) {
                return cbp('demand/add_both', data);
            }
            //新双方物流提交
            , passDemandAddBothByStore: function (data) {
                return cbp('demand/add_both_by_store', data);
            }
            , passGetLastInvoice: function () {
                return cbp('demand/get_last_invoice', {});
            }
            , driverDemandAdd: function (data) {
                return cbp('driver_demand/add', data);
            }
            , driverDemandAddNew: function (data) {
                console.log(data)
                return cbp('driver_demand/add_new_new', data);
            }
            /**
             * 自有司机三方物流交货方收货后 司机刷新当前页面获取已完成最新订单ID
             *
             */
            , driverGetNewWestId: function (data) {
                return cbp('route/get_newest_driver_log', data);
            }
            , passOrderGetOneIndex: function (data) {
                return cbp('order/get_one', data)
            }
            //  挂靠司机获取新增订单数
            , driverGetNumb: function () {
                return cbp('driver_plan/driver_get_count')
            }
            // 物流管理员 派车查看已派车辆
            , getSendCars: function (data) {
                return cbp('driver_plan/admin_get', data)
            }
            , getAmountByTrade: function (data) {
                return cbp('order/get_amount_by_trade_order_index', data)
            }
            , editDriverAmount: function (data) {
                return cbp('order/3_edit_route_info', data)
            }
            , decDriverDemand: function (id) {
                var all = PassRestAngular.allUrl('driver_demand/dec');
                return all.post({order_id: id});
            }
            , decDriverDemandState: function (id) {
                var all = PassRestAngular.allUrl('driver_demand/admin_get_cancel_status');
                return all.post({order_id: id});
            }
            , cancelDriverDemand: function (id) {
                var all = PassRestAngular.allUrl('driver_plan/dec');
                return all.post({driver_plan_id: id});
            }
            , passDemandAddbyPrice: function (data) {
                return cbp('demand/add_by_price_offer_order', data);
            }
            , passDemandtradeOrderIndex: function (data) {
                return cbp('demand/get_by_trade_order_index', {index_trade: data});
            }
            , getCarList: function (id) {
                return cbp('order/get_truck_info', {order_id: id, offer: 'all'})
            }
            , selectByPriceOffer: function (data) {
                return cbp('offer/select_by_price_offer', data)
            }
            , getTrafficInfo: function (data) {
                return cbp('order/get_traffic_info', data)
            }
            , demandAddNew: function (data) {
                return cbp('demand/add_new', data)
            }
            // 挂靠司机获取已抢单列表（我的订单里）
            , getRobbedList: function () {
                return cbp('driver_offer/driver_get_already_new')
            }
            //获取未指派公司
            , assignGetNotAssignComp: function (data) {
                return cbp('assign_c/get_not_assign_company', data)
            }
            //获取未指派公司（加行业类别）
            , demandGetNotAssignComp: function (data) {
                return cbp('demand_c/get_not_assign_company', data)
            }
            //获取已指派
            , assiagnGetAssignedComp: function (data) {
                return cbp('assign/get_assigned_company', data)
            }
            //获取已确认
            , assiagnGetConfirmComp: function (data) {
                return cbp('assign/get_confirm_company', data)
            }
            //获取已完成
            , assiagnGetCompelteComp: function (data) {
                return cbp('assign/get_complete_company', data)
            }
            //指派公司
            , assignAssign: function (data) {
                return cbp('assign/assign', data)
            }
            //获取某笔交易订单已确认的物流订单吨数
            , assignGetOrderAmountByTradeIndex: function (index_trade) {
                return cbp('assign/get_order_amount_by_trade_index', {index_trade: index_trade})
            }
            //获取某笔交易订单已确认的物流订单
            , assignGetOrderByTradeIndex: function (index_trade) {
                return cbp('assign/get_order_by_trade_index', {index_trade: index_trade})
            }
            //物流发短信
            , statSendSms: function (id, template) {
                return cbp('stat/send_sms', {id: id, template: template});
            }
            // 统计物流金额
            , getPriceStatic: function (data) {
                return cbp('order/get_price_statistics', data);
            }
            //物流管理根据 认证公司id 获取认证公司是否有新订单
            , getDemandNewCountByCompanyIds: function (arr) {
                return cbp('tip/get_demand_new_count_by_company_ids', arr)
            },
            //获取 交易车队 物流公司  数据
            offerGetCountForMotorcade: function (company_id) {
                return cbp('offer/get_count_for_motorcade', {company_id: company_id})
            },
            //获取司机进行中和已完成的单数
            routeGetDriverOrderCount: function (user_id) {
                return cbp('route/get_driver_order_count', {user_id: user_id})
            },
            //已完成订单导出功能
            goPrint: function (id) {
                return cbp('print/get_order', {order_id: id})
            },
            //获取公司信息
            CompanyInfo: function (id, types) {
                var all = AccountRestAngular.allUrl('company/get_home_pages');
                return all.post({
                    company_id: id,
                    types: types
                });
            }
        }
    })
     /**
      * 注册页面企业类型控制
      */
    .factory('ListConfig', function () {
        var companyType = [
            {
                text: '交易型企业',
                value: 'TRADE',
                checked: true,
                disabled: false
            },
            {
                text: '物流型企业',
                value: 'TRAFFIC',
                checked: false,
                disabled: false
            }
        ];

        return {
            getCompanyType: function () {
                return companyType;
            }, getCarType: function () {
                return [
					{ chn: '平板车', eng: 'PING_BAN' },
					{ chn: '高栏车', eng: 'GAO_LAN' },
					{ chn: '前四后八', eng: 'QIAN_SI_HOU_BA' },
                    { chn: '半挂', eng: 'BAN_GUA' },
					{ chn: '厢式', eng: 'XIANG_SHI' },
					{ chn: '单桥', eng: 'DAN_QIAO' },
					{ chn: '四桥', eng: 'SI_QIAO' },
					{ chn: '低栏', eng: 'DI_LAN' },
					{ chn: '三桥', eng: 'SAN_QIAO' },
                    { chn: '后八轮', eng: 'HOU_BA_LUN' },
					{ chn: '敞篷', eng: 'CHANG_PENG' },
					{ chn: '全挂', eng: 'QUAN_GUA' },
					{ chn: '中栏', eng: 'ZHONG_LAN' },
					{ chn: '加长挂', eng: 'JIA_CHANG_GUA' },
					{ chn: '不限', eng: 'BU_XIAN' },
                ]
            }, getCarWeighList: function () {
                return [
                    { chn: '6至10吨', eng: '6_10' },
                    { chn: '11至15吨', eng: '11_15' },
                    { chn: '16至20吨', eng: '16_20' },
                    { chn: '21至25吨', eng: '21_25' },
                    { chn: '26至30吨', eng: '26_30' },
                    { chn: '31至35吨', eng: '31_35' },
                    { chn: '36至40吨', eng: '36_40' },
                    { chn: '40吨以上', eng: '40_' }

                ]
            }, getCarLongList: function () {
                return [
                    { chn: '2至5米', eng: '2_5' },
                    { chn: '6至8米', eng: '6_8' },
                    { chn: '9至10米', eng: '9_10' },
                    { chn: '11至12米', eng: '11_12' },
                    { chn: '13至15米', eng: '13_15' },
                    { chn: '16至17.5米', eng: '16_17.5' },
                    { chn: '17.5米以上', eng: '17.5_' }

                ]
            }, getAmountList: function () {
                return [
                    {
                        chn: '不限',
                        eng: {
                            max: null,
                            min: null
                        }
                    },
                    {
                        chn: '0-200吨',
                        eng: {
                            max: 200,
                            min: 0
                        }
                    },
                    {
                        chn: '200-500吨',
                        eng: {
                            max: 500,
                            min: 200
                        }
                    },
                    {
                        chn: '500-1000吨',
                        eng: {
                            max: 1000,
                            min: 500
                        }
                    },
                    {
                        chn: '1000-2000吨',
                        eng: {
                            max: 2000,
                            min: 1000
                        }
                    }
                    ,
                    {
                        chn: '2000吨以上',
                        eng: {
                            max: null,
                            min: 2000,
                        }
                    }


                ]
            }
        }
    })
    .service('TradeTransportService', function (AccountRestAngular, PassRestAngular, PassPayAngular, $ionicHistory, TradeRestAngular, NewTradeRestAngular) {

        return {
            /**
             * 获取认证公司的列表信息
             * @param query{page,name}
             * @param type:
             *              Company 已认证的公司
             *              Companing 认证中的公司
             *              NotCompany 未认证的公司company/get_home_pages
             * @returns {*}
             */
            getCompany: function (query, type) {
                var url;
                switch (type) {
                    case 'Company':
                        url = "company_relation/get_company_verify";
                        break;
                    case 'Companing':
                        url = "company_relation/get_company_apply";
                        break;
                    case 'NotCompany':
                        url = "company_relation/get_company_not_verify";
                        break;
                    default:
                        url = "company_relation/get_company_verify";
                }
                var info = AccountRestAngular.allUrl(url);
                return info.post(query);
            },
            /**
             * 获取指定公司的线路
             */
            getCompanyLineById: function (obj) {
                //var info = AccountRestAngular.allUrl("company_traffic_line/get_reference_price_new");
                var info = PassRestAngular.allUrl("line_c/get_relation_list");
                return info.post(obj);
            },
            /**
             * 获取我的货源
             * @param
             * page:页数
             * validity:是否有效
             */
            getGoods: function (page, validity,is_refresh) {
                var info = PassRestAngular.allUrl("demand_c/get_by_role");
                return info.post({page: page, status: validity,is_refresh:is_refresh});
            },
            /**
             * @description 根据订单状态获取订单列表
             *
             * @param {number} page  页数
             * @param {string} type 订单状态。
             *  complete：已完成；
             *  effective 进行中；
             *  ineffective：待接单；
             * cancelled 已取消
             * @returns {object}
             */
            getOrderList: function (page, type, find,is_refresh) {
                var info = PassRestAngular.allUrl("order_c/get_list");
                return info.post({page: page, status: type, find_role: find,is_refresh:is_refresh});
            },
            /**
             * @description 获取各个订单状态的数量
             *
             * @param {number} page  页数
             * @param {string} type 订单状态。
             * all
             * @returns {object}
             */
            getOrderCount: function (type, find) {
                var info = PassRestAngular.allUrl("order_c/get_count");
                return info.post({status: type, scence: 'status', find_role: find});
            },

            /**
             * @description 指派物流公司查询物流公司信息
             *
             * @param {id}
             */
            getCompanyNewById: function (id) {
                var info = AccountRestAngular.allUrl("company/get_home_pages");
                return info.post({company_id: id});
            },
            /**
             * @description 交易定价指派发布 物流需求单
             *
             * @param {number}
             * @param {string}
             * @returns {object}
             */
            putNeedOrder: function (obj) {
                var info = PassPayAngular.allUrl("demand_c/add_new");
                return info.post(obj);
            },
            /**
             * @description 交易看运输指派物流需求单详情
             *
             * @param {string} demand_id 需求单id  ||
             * @param {string} demand_index 需求单index  ||
             * @returns {object} index_trade 交易订单的index ||
             */
            getGoodOne: function (id) {
                var info = PassPayAngular.allUrl("demand_c/get_one");
                return info.post({demand_id: id});
            },
            /**
             * @description 交易看运输 订单 详情
             *
             * @param {string} demand_id 需求单id  ||
             * @param {string} demand_index 需求单index  ||
             * @returns {object} index_trade 交易订单的index ||
             */
            getPassOrderOne: function (id) {
                var info = PassPayAngular.allUrl("order_c/get_one");
                return info.post({order_id: id});
            },
            /**
             * @description 获取一个地址详情
             *
             * @param {string} address_id 需求地址id
             */
            addressGetOneSz: function (address_id) {
                var info = AccountRestAngular.allUrl('address/get_one');
                return info.post({address_id: address_id});
            },
            /**
             * 获取订单中各种车辆列表
             * @param order_id
             * @param offer 指派车辆就传false 抢单车辆中的就传true
             * @returns
             * {   complete完成的
                   doing进行中
                   not_ready已派单
                }
             */
            getOrderCarListys: function (order_id, offer) {
                var pass = PassRestAngular.allUrl("order/get_truck_info");
                return pass.post({order_id: order_id, offer: offer});
            },
            /**
             * 获取车辆信息
             * @param truck_id
             * @returns {*}
             */
            getDriverInfoByIdys: function (truck_id) {
                var all = AccountRestAngular.allUrl('/user_traffic_truck/get_one');
                return all.post({
                    truck_id: truck_id
                });
            },
            goBack: function () {
                $ionicHistory.goBack();
            },
            /**
             * 取消交易指派的物流需求单信息
             * @param demand_id
             * @returns {*}
             */
            closeNeedOrder: function (demand_id) {
                var all = PassPayAngular.allUrl('/demand_c/close');
                return all.post({
                    demand_id: demand_id
                });
            },
            /**
             * 交易获取物流指派需求单的接单情况
             * @param demand_id
             * @returns {*}
             */
            getNeedOrder: function (demand_id, page) {
                var all = PassPayAngular.allUrl('demand_c/assign_company_info');
                return all.post({
                    demand_id: demand_id,
                    scene: 'other',
                    order: 'price',
                    page: page
                });
            },
            /**
             * @description 获取各个订单状态的数量
             *
             * @param {number} page  页数
             * @param {string} type 订单状态。
             * all
             * @returns {object}
             */
            getNeedOrderCount: function (type, find) {
                var info = PassPayAngular.allUrl("demand_c/get_count");
                return info.post({status: type, scence: 'status', find_role: find});
            }
            ,
            /**
             * all 销售方给司机补货
             * @returns {object}
             */
            driverReplenishSj: function (id,obj) {
                var info = PassPayAngular.allUrl("driver_order_c/driver_replenish");
                return info.post({order_id:id,products_replenish:obj});
            },
            /**
             * @description 获取交易订单的信息
             * @param {string} method 通过什么获取。
             * @param {string} id 订单id号。
             */
            getDemandOrderDetailById: function (id) {
                var all = TradeRestAngular.allUrl('order/detail')
                return all.post({id: id});
            }
        }
    })
	/**
	 * web tab 的配置
	 */
	.factory('rscWebTab', function () {

		return {
			getTabs: function getTabs(type) {
				var arr = {
					'offer': [{
						text: '交易',
						link: 'rsc.sale_grab',
						active: true,
						type: 'goods',
						count: 0
					},
						{
							text: '运输',
							link: "rsc.valid",
							active: false,
							type: 'pk',
							count: 1
						},
						{
							text: '关系',
							link: 'rsc.contact',
							active: false,
							type: 'order',
							count: 2
						},
						{
							text: '订单',
							link: 'rsc.finance_supply',
							active: false,
							type: 'line',
							count: 3
						},
						{
							text: '企业',
							link: 'rsc.company_dynamic',
							active: false,
							type: 'order',
							count: 4
						}
					],
					'traffic': [{
						text: '货源',
						link: 'rsc.center_goods',
						active: true,
						type: 'goods',
						count: '0'
					},
						{
							text: '运输',
							link: "rsc.trans_grab",
							active: false,
							type: 'pk',
							count: '0'
						},
						{
							text: '关系',
							link: 'rsc.contact',
							active: false,
							type: 'order',
							count: '0'
						},
						{
							text: '订单',
							link: 'rsc.finance_logistics',
							active: false,
							type: 'line',
							count: '0'
						},
						{
							text: '企业',
							link: 'rsc.company_manager',
							active: false,
							type: 'order',
							count: '0'
						},

					]
				};
				switch (type) {
					case "TRADE_ADMIN":
						arr.offer[3].link = 'rsc.finance_supply';//销售
						return arr.offer;

					case "TRADE_SALE":
						arr.offer[3].link = 'rsc.finance_supply';//销售
						return arr.offer; //銷售

					case "TRADE_PURCHASE":
						arr.offer[3].link = 'rsc.finance_purchase';//采购
						return arr.offer; //采购

					case "TRAFFIC_ADMIN":
						return arr.traffic; // 物流
					default:
						$log.error('未知类型')
				}
			}
		}



	})
