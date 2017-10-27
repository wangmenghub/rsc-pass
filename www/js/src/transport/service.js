/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.pass.sell.service', [])
    .service('PassSellService', function (AccountRestAngular, PassRestAngular,NewTradeRestAngular,Restangular,$q,MapServiceAngular,PassPayAngular) {
        return {
            // 补货
            driverReplenish: function (id,obj) {
                var info = PassPayAngular.allUrl("driver_order_c/driver_replenish");
                return info.post({order_id:id,products_replenish:obj});
            },
            /**
             * 获取我的合作挂靠司机 已认证（true）/认证中(false)司机列表
             * @returns {*}
             * @update:
             * 2015-02-25
             */
            getAllPrivateUserTruck: function (data) {
                var all = AccountRestAngular.allUrl('driver_verify/admin_get_verify_driver');
                return all.post(data);

            },
            /**
             * 获取组列表
             * type：PRIVATE PUBLIC
             */
            getTruckGroupList: function (type) {
                var all = AccountRestAngular.allUrl('truck_group/get');
                return all.post({
                    type: type
                });
            },
            /**
             * 删除组
             */
            delTruckGroup: function (group_id) {
                var all = AccountRestAngular.allUrl('truck_group/dec');
                return all.post({
                    group_id: group_id
                });
            },
            /**
             * 修改组名称
             */
            editTruckGroup: function (group_id, name) {
                var all = AccountRestAngular.allUrl('truck_group/edit');
                return all.post({
                    group_id: group_id,
                    name: name
                });
            },
            /**
             * 获取指定组之外的组列表
             * group_id
             * type
             */
            getGroupsOther: function (data) {
                var all = AccountRestAngular.allUrl('truck_group/get_other');
                return all.post(data);
            },
            /**
             * 根据组ID获取分组信息(zdd)
             * @param group_id
             * @param type
             * @returns {*}
             */
            getGroupById: function (group_id) {
                var all = AccountRestAngular.allUrl('truck_group/get_one');
                return all.post({
                    group_id: group_id
                });
            },
            /**
             * 根据组ID获取车辆信息(zdd)
             * @param group_id
             * @param type
             * @returns {*}
             */
            getTrucksByGroup: function (query) {
                var all = AccountRestAngular.allUrl('truck_group/get_truck');
                return all.post(query);
            },
            /**
             * 给车辆分配组(zdd)
             * group_id
             * truck_id
             */
            addTruckToGroup: function (group_id, truck_id) {
                var all = AccountRestAngular.allUrl('truck_group/add_truck');
                return all.post({
                    group_id: group_id,
                    truck_id: truck_id
                });
            },
            /**
             * 将车辆从组中移除
             * group_id
             * truck_id[]
             */
            delTruckFromGroup: function (group_id, truck_id) {
                var all = AccountRestAngular.allUrl('truck_group/dec_truck');
                return all.post({
                    group_id: group_id,
                    truck_id: truck_id
                });
            },
            //获取某一个地址
            addressGetOne: function (address_id) {
                var all = AccountRestAngular.allUrl('truck_group/get_one');
                return all.post('address/get_one', {
                    address_id: address_id
                });
            }
            , driverDemandAddNew: function (data) {
                var all = AccountRestAngular.allUrl('truck_group/get_one');
                return all.post('driver_demand/add_new_new', data);
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
            // 获取煤炭产品类型
            getCategory: function (data) {
                var all = AccountRestAngular.allUrl('truck_group/get_one');
                return all.post('demand/list_goods', {category: data});
            },
            /**
             * 物流查看发布抢单列表（新）
             * @param offer(true/false)
             */
            // getReleaseOrdersNew: function (query) {
            //     //http://192.168.3.147:18081/api/order/get_one
            //     var all = PassRestAngular.allUrl('driver_demand/admin_get');
            //     return all.post(query);
            // },
            getReleaseOrdersNew: function (query) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('/driver_demand_c/get_list');
                return all.post(query);
            },
            getAllOrdersNew: function (query) {
                var url = "driver_demand/traffic_get_driver_demand_order";
                var all = PassRestAngular.allUrl(url);
                return all.post(query);
                //http://192.168.3.147:18081/api/order/traffic_get
            },
            /**
             * 分组管理中获取默认分组车辆
             */
            getDefaultCount: function (type) {
                var all = AccountRestAngular.allUrl('truck_group/get_default_count');
                return all.post({
                    type: type
                });
            },
            /**
             * 添加车辆分组
             name
             type:
             truck_group_type: {
                    PRIVATE:　'PRIVATE', //挂靠
                    PUBLIC: 'PUBLIC'     //自有
                },
             *
             *  */
            truckGroupAdd: function (data) {
                var all = AccountRestAngular.allUrl('truck_group/add');
                return all.post(data);
            },

            getOrderById: function (id) {
                //http://192.168.3.147:18081/api/order/get_one
                var all = PassRestAngular.allUrl('/order_c/get_one');
                return all.post({order_id: id});
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
            /**
             * 获取产品种类
             */
            getMaterial: function () {
                var pass = NewTradeRestAngular.allUrl("configuration/get");
                return pass.post();
            },
            /**
             * 获取需求单列表
             */
            getDemandOrderById: function (data) {
                var pass = PassRestAngular.allUrl("/driver_demand_c/get_one");
                return pass.post(data);
            },
            /**
             * 获取需求单数量
             */
            getDemandCount: function (data) {
                var pass = PassRestAngular.allUrl("/driver_demand_c/get_count");
                return pass.post(data);
            },
            /**
             * 获取司机接单详情
             */
            getAssignTruckInfo: function (id,scene) {
                var pass = PassRestAngular.allUrl("/driver_demand_c/assign_truck_info");
                return pass.post({demand_id:id,scene:scene});
            },
            /**
             * 获取司机运输详情
             */
            getTransUserCard: function (data) {
                var pass = PassRestAngular.allUrl("/stat_c/user_card");
                return pass.post(data);
            },
            /**
             * 物管添加车辆(物流订单中添加车辆)
             phone
             name
             number
             type
             long
             weight
             */
            traffic_admin_add_user_truck: function (data) {
                var all = AccountRestAngular.allUrl('user_traffic/traffic_admin_add_user_truck');
                return all.post(data);
            },
            /**
             * 获取司机运输详情，自动分配吨数
             */
            getTruckAssign:function (id,weigh) {
                var all = PassRestAngular.allUrl('/driver_demand_c/get_truck_assign');
                return all.post({demand_id:id,weight:weigh});
            },
            /**
             * 获取司机运输详情，代替接单
             */
            driverPriceCanOrder:function (data) {
                var all = PassRestAngular.allUrl('/driver_offer_c/price_can_order');
                return all.post(data);
            },
            /**
             * 获取 运输 订单 进行中已完成个数
             */
            getDriverCoun:function (data) {
                var all = PassRestAngular.allUrl('/driver_demand_c/get_count');
                return all.post(data);
            },
            /**
             * 获取 运输 取消指派
             */
            driverDemandClose:function (id) {
                var all = PassRestAngular.allUrl('/driver_demand_c/close');
                return all.post({demand_id:id});
            },
            /**
             * 获取 订单 进行中列表
             */
            getDemandOrder:function (query) {
                console.log(525252)
                console.log(query)
                var all = PassRestAngular.allUrl('/driver_order_c/get_demand_order');
                return all.post(query);
            },
            /**
             * 获取需求单列表
             */
            getOrderOne: function (id,index) {
                var pass = PassRestAngular.allUrl("/driver_order_c/get_one");
                return pass.post({order_id:id,order_index:index});
            },
            /**
             *物流替换车辆
             */
            orderReplaceDriver: function (id,order_id) {
                var all = PassRestAngular.allUrl("/driver_order_c/replace_driver");
                return all.post({user_supply_id:id,order_id:order_id});
            },
            /**
             * 获取物流订单 司机运输详情
             */
            getDriverOrderOne: function (id) {
                var all = PassRestAngular.allUrl("order_c/get_one");
                return all.post({order_id:id});
            },
            /**
             * 发布司机抢单
             * order_id
             * appendix
             * price_type
             * can_join
             * user_ids[0]
             * time_validity
             * payment_choice
             * payment_mehtod
             * scene
             * @param data
             */
            driverDemandScene: function (data) {
                var all = PassRestAngular.allUrl('/driver_demand_c/scene_add');
                return all.post(data);
            },
            /**
             * 获取车辆分组
             */
            truckGroupList: function () {
                var all = AccountRestAngular.allUrl('/truck_group/get_list');
                return all.post();
            },
            /**
             * 获取可指派的司机列表
             */
            assignDriverList:function (query) {
                var all = PassRestAngular.allUrl('/stat_c/assign_driver_list');
                return all.post(query);
            },
            /**
             * 检查用户输入的手机号码是否注册
             */
            checkPhoneExist: function (phone) {
                var promis = $q.defer();
                var Phone = Restangular.one('/phone/exist/', phone);
                Phone.get().then(function (result) {
                    promis.resolve(result);
                }, function (error) {
                    promis.reject(error);
                });
                return promis.promise;
            },
            getMapList:function (data) {
                var all = MapServiceAngular.allUrl('/map_c/get_only_list');
                return all.post({user_ids:data});
            },
            /**
             * 获取物流公司信息
             */
            getTrafficCompany:function (id, types) {
                var all = AccountRestAngular.allUrl('company/get_home_pages');
                return all.post({company_id: id, types: types});
            },
            /**
             * 获取交易订单，顶部两个数据
             */
            getTransportCarInfo:function (index) {
                var all = PassRestAngular.allUrl('order_c/trade_driver_status');
                return all.post({index_trade:index});
            },
            /**
             * 交易给报名的物流公司下订单
             */
            assingOrder:function (data) {
                var all = PassRestAngular.allUrl('offer_c/assign_order');
                return all.post(data);
            },
            /**
             * 个人信息
             */
            getCompanyUserById: function (id) {
                var all = AccountRestAngular.allUrl('/user/get_personal_homepage ');
                return all.post({user_id: id});
            },
			/**
			 *物流推送个数，
			 * companies
			 */
			getBadgeCount: function () {
				var all = PassRestAngular.allUrl('/stat_c/supply_statis');
				return all.post();
			}
        }
    })
