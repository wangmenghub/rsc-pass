/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.service.remain', [])
    .service('PassBuyService', function (AccountRestAngular, PassRestAngular) {
        return {
            /**
             * 获取物流公司PK抢单数量
             * status: effective 有效
             *         ineffective 取消
             *         all 全部
             * @returns {data}
             */
            getOfferStatusCount:function (data) {
                var all = PassRestAngular.allUrl('offer_c/get_count');
                return all.post(data);
            },
            /**
             * 获取物流公司的所有抢单列表
             * @returns {*}
             */
            getOfferBuyRole: function (data) {
                var all = PassRestAngular.allUrl('offer_c/get_by_role');
                return all.post(data);
            },
            /**
             * 获取物流公司的所有抢单列表
             * @returns {*}
             */
            getPlanList: function (data) {
                var all = PassRestAngular.allUrl('plan_c/get_list');
                return all.post(data);

            },
            /**
             * 获取物流公司所有订单数量
             * status: cancelled 已取消
             *         complete 已完成
             *         effective 进行中
             *         ineffective 待接单
             *         all 全部
             * @returns {data}
             */
            getOrderStatusCount:function (data) {
                var all = PassRestAngular.allUrl('order_c/get_count');
                return all.post(data);
            },
            /**
             * 获取物流公司所有订单
             * status: cancelled 已取消
             *         complete 已完成
             *         effective 进行中
             *         ineffective 待接单
             *         all 全部
             * @returns {data}
             */
            getStatusOrder:function (data) {
                var all = PassRestAngular.allUrl('order_c/get_list');
                return all.post(data);
            },

            /*获取物流与司机形成的订单*/
            getDriverOrder:function (data) {
                var all = PassRestAngular.allUrl('driver_order_c/get_list');
                return all.post(data);
            },



            /**
             * 获取与己方公司达成的订单的对方公司列表
             */
            getCompanyList:function () {
                var all = PassRestAngular.allUrl('order_c/get_company_count');
                return all.post();
            },
            /**
             * 物流货源添加线路
             * @param info
             * money: {type:Number},        //线路价格
             * start_province: {type:String},  //省
             * start_city: {type:String},      //市
             * start_district: {type:String},   //区县
             * end_province: {type:String},    //省
             * end_city: {type:String},        //市
             * end_district: {type:String},    //区县

             */
            addLine: function (info) {
                var all = PassRestAngular.allUrl('/line_c/add');
                return all.post(info);
            },
            /**
             * 物流货源线路列表
             * @param scene 应用场景[self, other]
             *
             */
            lineList: function (data) {
                var all = PassRestAngular.allUrl('/line_c/get_list');
                return all.post(data);
            },
            /**
             * 物流货源查看线路详情
             * @param line_id
             *
             */
            lineDetail: function (data) {
                var all = PassRestAngular.allUrl('/line_c/get_one');
                return all.post(data);
            },
            /**
             * 物流货源编辑线路
             * @param info
             * line_id:line_id
             * money: {type:Number},        //线路价格
             * start_province: {type:String},  //省
             * start_city: {type:String},      //市
             * start_district: {type:String},   //区县
             * end_province: {type:String},    //省
             * end_city: {type:String},        //市
             * end_district: {type:String},    //区县

             */
            editLine: function (info) {
                var all = PassRestAngular.allUrl('/line_c/edit');
                return all.post(info);
            },
            /**
             * 物流货源删除线路
             * @param line_id
             *
             */
            closeLine: function (line_id) {
                var all = PassRestAngular.allUrl('/line_c/close');
                return all.post({line_id:line_id});
            },
            /**
             * 物流公司获取认证公司需求单
             * @param data
             *
             */
            getDemands: function (data) {
                var all = PassRestAngular.allUrl('/demand_c/find');
                return all.post(data);
            },
            /**
             * 物流管理根据 认证公司id 获取认证公司是否有新订单
             * @param arr
             * @returns {*}
             */
             getDemandNewCountByCompanyIds: function (arr) {
                var all = PassRestAngular.allUrl('/tip_c/get_demand_new_count_by_company_ids');
                return all.post(arr);
            },
            /**
             * 公司获取已认证企业
             * type: 'TRADE',
             * subType: 'PURCHASE',
             * page: 1
             */
            getCompanyCertification: function (query) {
                var info = AccountRestAngular.allUrl("company_relation/get_company_verify");
                return info.post(query);
            },
            //公司获取已认证司机
            getDriverVerify: function (query) {
                var info = AccountRestAngular.allUrl("company_relation/get_driver_verify");
                return info.post(query);
            },
            /**
             * 获取物流需求单
             * demand_id: 需求单id
             * demand_index:需求单index
             * index_trade:交易订单的index
             * @param data
             */
            getDemandOne: function (data) {
                var all = PassRestAngular.allUrl('demand_c/get_one');
                return all.post(data);

            },
            /**
             * 查询需求单是否已接单
             * demand_id: 需求单id
             */
            planExists: function (demand_id) {
                var all = PassRestAngular.allUrl('plan_c/exists');
                return all.post({demand_id:demand_id})
            },
            /**
             * 获取物流需求单抢单公司列表
             * demand_id: 需求单id
             * @param data
             */
            getOfferList: function (data) {
                var all = PassRestAngular.allUrl('offer_c/get_list');
                return all.post(data);
            },
            /**
             * 物流抢单
             * demand_id: 需求单id
             * prices: 产品种类
             * prices_replenish: 补货产品
             * @param data
             */
            priceCanOrder: function (data) {
                var all = PassRestAngular.allUrl('offer_c/price_can_order');
                return all.post(data);
            },
            /**
             * 获取物流订单详情
             * demand_id: 需求单id
             * @param data
             */
            getOrderById: function (id) {
                var all = PassRestAngular.allUrl('order_c/get_one');
                return all.post({order_id: id});
            },
            /**
             * 物流接单判断状态
             * user_id: 发单人id
             * @param data
             */
            getRelationStatus: function (id) {
                var all = AccountRestAngular.allUrl('work_relation/get_status');
                return all.post({user_id: id});
            },
            /**
             * 物流接单判断状态
             * user_id: 发单人id
             * @param data
             */
            applyRelation: function (data) {
                var all = AccountRestAngular.allUrl('apply_relation/work');
                return all.post(data);
            },
            /**
             * 获取物流订单详情
             * demand_id: 需求单id
             * @param data
             */
            planAdd: function (id) {
                var all = PassRestAngular.allUrl('plan_c/add');
                return all.post({demand_id: id});
            },
             /**
             * 获取物流订单详情
             * user_id: 用户id
             * @param data
             */
            getInfo: function (id) {
                var all = AccountRestAngular.allUrl('company/get_company_and_user');
                return all.post({user_id: id});
            },

        }
    })
	/**
	 * 获取平台配置
	 */
	.factory('comService',['CompatibleServiceAngular',function (CompatibleServiceAngular) {
		return {
			/**
			 * 获取登录背景图
			 */
			getCarouselfigure: function (data) {
				var all = CompatibleServiceAngular.allUrl('/config/get_banner');
				return all.post(data);
			},
		}
	}])
