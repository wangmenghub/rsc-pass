angular.module('rsc.common.service.account', ['rsc.common.service.rest'])


  .factory('AccountInformation', ['AccountRestAngular', 'AccountRestAngularNoToken', 'authenticationService', '$log', '$q', 'AdminServiceAngular',
    function (AccountRestAngular, AccountRestAngularNoToken, authenticationService, $log, $q, AdminServiceAngular) {

      var getCompanyinfoById = function (id, type) {
        var data = {
          company_id: id
        };
        var info = AccountRestAngular.allUrl('company_trade/get_one');
        if (type) {
          if (angular.lowercase(type) == 'traffic') {
            info = AccountRestAngular.allUrl('company_traffic/get_one');
          } else {
            info = AccountRestAngular.allUrl('company_trade/get_one');
          }
        } else {
          info = AccountRestAngular.allUrl('company_trade/get_one');
        }
        return info.post(data);
      };
      //trade维护区start
      var h;
      var cbg = function (x, y) {
        h = AccountRestAngular.allUrl(x);
        return h.get(y);
      };
      var cbp = function (x, y) {
        h = AccountRestAngular.allUrl(x);
        return h.post(y);
      };
      var cbf = function (x, y) {
        h = AccountRestAngular.allUrl(x);
        return h.customPOST(y, '', undefined, {
          'Content-Type': undefined
        });
      };
      //trade维护区end

      return {
        // 更新token
        update_token: function(){
          var all = AccountRestAngular.allUrl('user/login_data');
          return all.post();
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
        /*
         * 发布报价的区域返回
         *
         *
         */
        areaGetProvincesCities: function (data) {
          var all = AccountRestAngular.allUrl('area/get_provinces_cities');
          return all.post(data);
        },
        /*
         * 物流管理员 获取本公司替换车辆(已派单中使用)
         * @param page 页数
         * @param order_id 订单ID
         */
        get_replace_truck_order: function (data) {
          var all = AccountRestAngular.allUrl('company_traffic/get_replace_truck_plan');
          return all.post(data);
        },

        /**
         * 物流管理员 获取本公司替换车辆（进行中使用）
         * @param page 页数
         * @param order_id 订单ID
         */
        get_replace_truck: function (data) {
          var all = AccountRestAngular.allUrl('company_traffic/get_replace_truck');
          return all.post(data);
        },
        opinion: function (data) {
          var info = AdminServiceAngular.allUrl('func/opinion');
          return info.post(data);
        },
        /**
         * 获取用户信息,服务端已经分开查询了。此处不用分物流和交易
         * @param user_id
         * @returns {*}
         */
        getUserInfoById: function (user_id) {
          //此接口有2个重复
          var info = AccountRestAngular.allUrl('user_trade/get_by_id');
          return info.post({
            user_id: user_id
          });
        },
        getCompanyinfoById: getCompanyinfoById,
        getTrafficCompanyById: function (id) {
          var info = AccountRestAngular.allUrl('/company_traffic/get_one');
          return info.post({
            company_id: id
          });
        },
        getAllLine: function () {
          var all = AccountRestAngular.allUrl('/company_traffic_line/get');
          return all.post();
        },
        /**
         * 获取线路信息，
         * 如果传 user_id 则是获取指定用户的线路
         * 如果传 compamy_id 则是获取指定公司的线路
         * ===================
         * histroy:
         * 2016-06-08 zhoudd
         */
        getAllLineById: function (query) {
          var all = AccountRestAngular.allUrl('/company_traffic_line/business_card_get');
          return all.post(query);
        },
        getOneLine: function (id) {
          var all = AccountRestAngular.allUrl('/company_traffic_line/get_one');
          return all.post({
            line_id: id
          });
        },
        /**
         * 交易通过线路下单，获取线路信息
         */
        getLineByIdForOrder: function (id) {
          var all = AccountRestAngular.allUrl('/company_traffic_line/get_by_id');
          return all.post({
            line_id: id
          });
        },
        /**
         * 获取公司所有有司机的车辆
         * @param company_id
         * @returns {*}
         */
        getAllCars: function (company_id) {
          var all = AccountRestAngular.allUrl('/company_traffic/get_use_truck');
          return all.post({
            company_id: company_id
          });
        },
        /**
         * 新接口，获取公司所有有司机的车辆
         * {number:''}
         * @returns {*}
         */
        getAllCarsAndDriver: function (data) {
          var all = AccountRestAngular.allUrl('/company_traffic/get_use_truck_user');
          return all.post(data);
        },
        getLineCars: function (line_id) {
          var all = AccountRestAngular.allUrl('/company_traffic/get_line_truck');
          return all.post({
            line_id: line_id
          });
        },
        getLineInfoById: function (line_id) {
          var all = AccountRestAngular.allUrl('company_traffic_line/get_one');
          return all.post({
            line_id: line_id
          });
        },
        /**
         * 获取线路所有车辆类型对应的价格信息
         * @param line_id
         * @returns {*}
         */
        getLinePriceList: function (line_id) {
          var all = AccountRestAngular.allUrl('company_traffic_line_price/get');
          return all.post({
            line_id: line_id
          });
        },
        /**
         * 获取线路下的车辆
         * @param line_id
         * @returns {*}
         */
        getLineCarList: function (line_id) {
          var all = AccountRestAngular.allUrl('company_traffic/get_line_truck');
          return all.post({
            line_id: line_id
          });
        },
        /**
         * 邀请注册
         * @param role 被邀请的角色信息
         * @returns {*}
         */
        invitationRegister: function (role, phone) {

          var defer = $q.defer();
          var http;
          if (authenticationService.getUserInfo().user.role == 'TRADE_ADMIN') {
            http = AccountRestAngular.allUrl('/invitation_trade/invite');
          } else if (authenticationService.getUserInfo().user.role == 'TRAFFIC_ADMIN' || authenticationService.getUserInfo().user.role == 'TRAFFIC_DRIVER_PRIVATE' || authenticationService.getUserInfo().user.role == 'TRAFFIC_DRIVER_PUBLISH') {
            http = AccountRestAngular.allUrl('/invitation_traffic/invite');
          } else {
            defer.reject('not admin');
            return defer.promise;
          }
          http.post({
            role: role,
            phone: phone
          }).then(function (result) {
            defer.resolve(result);
          }, function (error) {
            defer.reject(error);
          });
          return defer.promise;
        },
        /**
         * 根据id获取邀请信息(不分交易和物流)
         * @param id
         * @returns {*}
         */
        getInviteInfo: function (id) {
          var all = AccountRestAngularNoToken.allUrl('/invitation_trade/get');
          //return all.post({invite_id: id});
          return all.post({
            index: id
          });


        },
        registerForInvitation: function (data) {
          var all = AccountRestAngularNoToken.allUrl('/user_trade/signup_by_invitation');
          return all.post(data);
        },
        // getDriverInfoById: function (driver_id) {
        //     //http://192.168.3.147:18080/api/user_traffic/get_one_driver
        //     var all = AccountRestAngularNoToken.allUrl('/user_traffic/get_one_driver');
        //     return all.post({driver_id: driver_id});
        // },
        /**
         * 获取车辆信息
         * @param truck_id
         * @returns {*}
         */
        getCarInfoById: function (truck_id) {
          //http://192.168.3.147:18080/api/user_traffic_truck/get_one
          var all = AccountRestAngular.allUrl('/user_traffic_truck/get_one');
          return all.post({
            truck_id: truck_id
          });

        },
        /**
         * 根据司机ID获取司机信息
         * @param driver_id
         * @returns {*}
         */
        getDriverInfoById: function (driver_id) {
          //http://192.168.3.147:18080/api/user_traffic/get_one_driver
          var all = AccountRestAngular.allUrl('/user_traffic/get_one_driver');
          return all.post({
            driver_id: driver_id
          });
        },
        /**
         * 添加线路
         * @param start_province
         * @param start_city
         * @param start_district
         * @param end_province
         * @param end_city
         * @param end_district
         * @returns {*}
         */
        addRoadLine: function (info) {
          var all = AccountRestAngular.allUrl('/company_traffic_line/add');
          return all.post({
            start_province: info.start_province,
            start_city: info.start_city,
            start_district: info.start_district,
            end_province: info.end_province,
            end_city: info.end_city,
            end_district: info.end_district,
            line_id: info.line_id
          });
        },
        addLinePrice: function (type, money, line_id) {
          var all = AccountRestAngular.allUrl('company_traffic_line_price/add');
          return all.post({
            type: type,
            money: money,
            line_id: line_id
          });
        },
        /**
         *
         * 获取线路价格
         * @returns {*}
         */
        getLinePrice: function (id) {
          var all = AccountRestAngular.allUrl('company_traffic_line_price/get');
          return all.post({
            line_id: id
          });
        },
        /**
         * 添加车辆
         * @param type
         * @param long
         * @param weigh
         * @param number
         * @returns {*}
         */
        addCar: function (car) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/add');
          return all.post(car);
        },
        editCar: function (car) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/edit');
          return all.post(car);
        },
        editCarNew: function (data) {
          var all = AccountRestAngular.allUrl('user_traffic/driver_edit_self_info');
          return all.post(data);
        },
        getNotLineCars: function () {
          //user_traffic_truck/get_truck_no_line
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_truck_no_line');
          return all.post();
        },
        /**
         * 获取公司所有仓库
         * @returns {*}
         */
        getCompanyTradeStores: function () {
          var all = AccountRestAngular.allUrl('company_trade_store/get');
          // var all = AccountRestAngular.allUrl('company_trade_store/get_by_type');//只显示固定仓库
          return all.post({
            fix: true,
            getType: 1,
            page: 1
          });
        },
        /**
         * 获取公司所有仓库20160921新（带分页）
         * @returns {*}
         */
        getCompanyTradeStoresNew: function (data) {
          var all = AccountRestAngular.allUrl('company_trade_store/get_by_type');
          return all.post(data);
        },
        addStore: function (store) {
          var all = AccountRestAngular.allUrl('company_trade_store/add');
          return all.post(store);
        },
        addFixStore: function (store) {
          var all = AccountRestAngular.allUrl('company_trade_store/add_fix');
          return all.post(store);
        },
        /**
         * 管理员根据角色获取列表
         * @param role
         */
        getUserByRole: function (role) {
          var all = AccountRestAngular.allUrl('user_trade/get_user_by_role');
          return all.post(role);
        },
        /**
         * 根据store_id获取仓库所有管理员
         * @param store_id
         * @returns {*}
         */
        storeGetManager: function (store_id) {
          var all = AccountRestAngular.allUrl('company_trade_store/get_real_user_by_store_id');
          return all.post({
            store_id: store_id
          });
        },
        /**
         * 给仓库添加管理员
         * @param id
         * @param store_id
         * @returns {*}
         */
        storeAddManager: function (user_id, store_id) {
          //user_trade/modify_other
          var all = AccountRestAngular.allUrl('user_trade/modify_other');
          return all.post({
            id: user_id,
            store_id: store_id
          });
        },
        /**
         * 批量指定仓库管理员
         * @param store_id
         * @param user_id
         * @returns {*}
         */
        storeAddManagerBatch: function (store_id, user_ids) {
          //user_trade/add_user_store_id
          var all = AccountRestAngular.allUrl('user_trade/add_user_store_id');
          return all.post({
            store_id: store_id,
            user_id: user_ids
          });

        },
        /**
         * 解除仓库管理员和仓库的关联
         * @param user_id
         * @param store_id
         * @returns {*}
         */
        storeDelManager: function (user_id, store_id) {
          //user_trade/dec_user_store_id
          var all = AccountRestAngular.allUrl('user_trade/dec_user_store_id');
          return all.post({
            id: user_id,
            store_id: store_id
          });
        },
        /**
         * 查询不是指定仓库管理员的用户（仓库管理员角色）
         * @param store_id
         * @returns {*}
         */
        getAllStoreManagerFilter: function (store_id) {
          var all = AccountRestAngular.allUrl('user_trade/get_store_user_except_store_id');
          return all.post({
            store_id: store_id
          });

        },
        /**
         * 管理员给线路指派车辆
         * @param line_id 线路ID
         * @param truck_id 数组
         * @returns {*}
         */
        lineRelationCar: function (line_id, truck_id) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/add_line_id');
          return all.post({
            line_id: line_id,
            truck_id: truck_id
          });
        },
        /**
         * 解除车辆线路关系
         * @param line_id
         * @param truck_id 数组
         * @returns {*}
         */
        delCarFromLines: function (line_id, truck_id) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/dec_line_id');
          return all.post({
            line_id: line_id,
            truck_id: truck_id
          });

        },
        /**
         * 删除车辆
         * @param truck_id
         * @returns {*}
         */
        delCar: function (truck_id) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/dec');
          return all.post({
            truck_id: truck_id
          });

        },
        /**
         * 获取待审核司机车辆信息
         * @returns {*}
         */
        getNotUserTruck: function () {
          var all = AccountRestAngular.allUrl('user_traffic/get_driver_apply');
          return all.post();
        },
        /**
         * 同意/拒绝审核司机车辆
         * @returns {*}
         */
        applyDrive: function (userid, agree) {
          var all = AccountRestAngular.allUrl('driver_apply/deal');
          return all.post({
            apply_id: userid,
            agree: agree
          });
        },
        /**
         * 获取所有可用空闲（false）/可用忙碌(true)司机车辆列表
         * @returns {*}
         * @update:
         * 2015-02-25
         */
        getAllUserTruck: function (data) {
          //var all = AccountRestAngular.allUrl('company_traffic/get_user_truck');[弃用]
          var all = AccountRestAngular.allUrl('user_traffic/get_driver_free_busy');
          return all.post(data);

        },
        /**
         * 获取空闲/忙碌/待认证司机数量
         * @returns {*}
         */
        getCount: function () {
          var all = AccountRestAngular.allUrl('user_traffic/get_driver_count');
          return all.post();
        },
        /**
         * 获取没有车辆的司机列表
         * @returns {*}
         */
        getUserNoTruck: function () {
          var all = AccountRestAngular.allUrl('user_traffic/get_user_no_truck');
          return all.post();
        },
        /**
         * 批量关联司机和车辆关系
         * @param truck_id 数组
         * @param user_id
         * @returns {*}
         */
        carRelationDriver: function (user_id, truck_id) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/add_user');
          return all.post({
            truck_id: truck_id,
            user_id: user_id
          });
        },
        /**
         * 获取当前用户所有车
         * @returns {*}
         */
        getCurrentUserAllCars: function () {
          //
          var all = AccountRestAngular.allUrl('user_traffic_truck/get');
          return all.post();

        },
        /**
         * 获取所有自有司机
         * @returns {*}
         */
        getAllSelfDriver: function () {
          var all = AccountRestAngular.allUrl('user_traffic/get_driver_public');
          return all.post();
        },
        /**
         * 根据司机ID获取司机的线路和车
         * @param user_id
         * @returns {*}
         */
        getLinCarByUserId: function (user_id) {
          //user_traffic_truck/get_line_truck_by_user_id
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_line_truck_by_user_id');
          return all.post({
            user_id: user_id
          });
        },
        /**
         * 根据司机ID获取司机的车（去掉线路之后的）
         * @param user_id
         * @returns {*}
         */
        getCarByUserId: function (user_id) {
          //user_traffic_truck/get_line_truck_by_user_id
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_truck_by_user_id');
          return all.post({
            user_id: user_id
          });
        },
        fileUpload: function (type, truck_id, file) {
          var defer = $q.defer();
          var formData = new FormData();
          formData.append('file', file);
          var url = ENV.api.account + 'file/upload/' + type + "/" + truck_id;
          $http({
            method: 'POST',
            url: url,
            data: formData,
            headers: {
              "Content-Type": undefined
            },
            transformRequest: angular.identity
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
        /**
         * 获取所有可用车辆列表
         * @returns {*}
         */
        getUseTruck: function () {
          ///api/user_traffic_truck/get_use_truck 获取可用的
          ///api/user_traffic_truck/get_used_truck 获取忙碌中的
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_use_truck');
          return all.post();
        },
        /**
         * 获取所有忙碌中车辆列表
         * @returns {*}
         */
        getUsedTruck: function () {
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_used_truck');
          return all.post();
        },

        ///**
        // * 获取所有未认证车辆列表
        // * @returns {*}
        // */
        //getNotUsedTruck: function () {
        //    var all = AccountRestAngular.allUrl('user_traffic_truck/get_not_verify_truck');
        //    return all.post();
        //},

        /**
         * 获取所有可用车辆个数
         * @returns {*}
         */
        getUseTruckCount: function () {
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_use_truck_count');
          return all.post();
        },
        /**
         * 获取所有忙碌中车辆个数
         * @returns {*}
         */
        getUsedTruckCount: function () {
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_used_truck_count');
          return all.post();
        },

        /**
         * 获取所有未认证车辆个数
         * @returns {*}
         */
        getNotUsedTruckCount: function () {
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_not_verify_truck_count');
          return all.post();
        },
        /**
         * 根据司机ID获取不是当前司机的车辆信息。
         * @param user_id
         * @returns {*}
         */
        getNotInUserTrucks: function (data) {
          //var all = AccountRestAngular.allUrl('user_traffic_truck/get_not_in_user');
          var all = AccountRestAngular.allUrl('user_traffic_truck/get_default_not_by_user_id');
          return all.post(data);
        },
        passDemandFind: function (data) {
          var all = AccountRestAngular.allUrl('demand/find');
          return all.post(data);
        },
        /**
         * 获取锁定状态
         * @returns {*}
         */
        getUseLock: function () {
          var all = AccountRestAngular.one('user_traffic/me');
          return all.get();
        },

        /**
         * 解锁
         * @returns {*}
         */
        userUnlocked: function () {
          var all = AccountRestAngular.allUrl('driver_verify/off');
          return all.post();
        },

        /**
         * 锁定
         * @returns {*}
         */
        userLocked: function () {
          var all = AccountRestAngular.allUrl('driver_verify/on');
          return all.post();
        },
        /**
         * 司机获取认证公司列表
         */
        driveLogistics: function (query, type) {
          var url;
          switch (type) {
            case 'a':
              url = "driver_verify/driver_get_company_verify";
              break;
            case 'b':
              url = "driver_verify/driver_get_company_apply";
              break;
            case 'c':
              url = "driver_verify/driver_get_company_not_verify";
              break;
            default:
              url = "driver_verify/driver_get_company_verify";
          }
          var all = AccountRestAngular.allUrl(url);
          return all.post(query);
        },
        /**
         * 获取已认证物流公司列表
         * @returns {*}
         */
        getUseLogistics: function (query) {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_verify');
          return all.post(query);
        },

        /**
         * 获取认证中物流公司列表
         * @returns {*}
         */
        getUsedLogistics: function (query) {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_apply');
          return all.post(query);
        },

        /**
         * 获取未认证物流公司列表
         * @returns {*}
         */
        getNotUsedLogistics: function (query) {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_not_verify');
          return all.post(query);
        },

        /**
         * 获取已认证物流公司数量
         * @returns {*}
         */
        getUseLogisticsCount: function () {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_verify_count');
          return all.post();
        },

        /**
         * 获取认证中物流公司数量
         * @returns {*}
         */
        getUsedLogisticsCount: function () {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_apply_count');
          return all.post();
        },

        /**
         * 获取未认证物流公司数量
         * @returns {*}
         */
        getNotUsedLogisticsCount: function () {
          var all = AccountRestAngular.allUrl('driver_verify/driver_get_company_not_verify_count');
          return all.post();
        },

        /**
         * 短信分享
         * @param data
         * sms_info_list:[
         *      {"phone_target":15300178737,"name_target":"陈源","comp_target":"日升昌"}
         *    ]
         * template_id:111111
         * content[1,2]
         * @returns {*}
         */
        shardForSMS: function (data) {
          var all = AccountRestAngular.allUrl('invitation_trade/invite_by_message');
          return all.post(data);
        },
        /**
         * 删除司机和车辆的关系
         * @param truck_ids
         * @param user_id
         * @returns {*}
         */
        delCanAndUserRelation: function (truck_ids, user_id) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/dec_user');
          return all.post({
            truck_id: truck_ids,
            user_id: user_id
          });
        },
        /**
         * 物流公司或者私人司机添加车辆时验证号码是否存在
         * @param carNumber
         * @returns {true:表示输入的车牌号已存在,false表示不存在*}
         */
        checkCarNumberExist: function (carNumber) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/check_number');
          return all.post({
            number: carNumber
          });
        },
        /**
         * 物流公司或者私人司机添加车辆时验证号码是否存在
         * @param carNumber
         * @returns {true:表示输入的车牌号已存在,false表示不存在*}
         */
        checkCarNumberExistForOrder: function (carNumber) {
          var all = AccountRestAngular.allUrl('user_traffic_truck/new_check_number');
          return all.post({
            number: carNumber
          });
        },
        /**
         * 物流公司同意司机认证
         * @param compamy_id
         * @returns {*}
         */
        appliCationDrive: function (create_user_id, agree) {
          var info = AccountRestAngular.allUrl("driver_verify/deal");
          return info.post({
            user_id: create_user_id,
            agree: agree
          });
        },
        /**
         * 物流公司获取车辆是否认证
         * @param user_id
         * @returns {*}
         */
        appliCationCar: function (user_id) {
          var info = AccountRestAngular.allUrl("driver_verify/get_truck_verify");
          return info.post({
            user_id: user_id
          });
        },
        /**
         * 公司获取已认证企业
         *
         *
         */
        getCompanyCertification: function (query) {
          var info = AccountRestAngular.allUrl("company_relation/get_company_verify");
          return info.post(query);
        },
        /**
         * 公司获取认证中企业
         *
         *
         */
        getCompaningCertification: function (query) {
          var info = AccountRestAngular.allUrl("company_relation/get_company_apply");
          return info.post(query);
        },
        /**
         * 公司获取未认证企业
         *
         *
         */
        getNotCompanyCertification: function (query) {
          var info = AccountRestAngular.allUrl("company_relation/get_company_not_verify");
          return info.post(query);
        },
        /**
         * 公司申请认证
         *
         *
         */
        apply: function (id, _type) {
          var info = AccountRestAngular.allUrl("company_relation/apply_verify");
          return info.post({
            company_id: id,
            type: _type
          });
        },
        //公司申请认证
        applyNew: function (id, _type) {
          var info = AccountRestAngular.allUrl("company_relation/company_main_page_apply_verify");
          return info.post({
            company_id: id,
            type: _type
          });
        },
        /**
         * 公司增加认证
         *
         *
         */
        join: function (id, _type) {
          var info = AccountRestAngular.allUrl("company_relation/add");
          return info.post({
            company_id: id,
            type: _type
          });
        },
        /**
         * 删除认证关系
         *
         *
         */
        del: function (id, _type) {
          var info = AccountRestAngular.allUrl("company_relation/dec");
          return info.post({
            company_id: id,
            type: _type
          });
        },
        Driverjion: function (id) {
          var info = AccountRestAngular.allUrl("driver_verify/get_one");
          return info.post({
            company_id: id
          });
        },
        /**
         * 删除司机认证物流关系
         *
         *
         */
        dec: function (id) {
          var info = AccountRestAngular.allUrl("driver_verify/dec");
          return info.post({
            user_id: id
          });
        },
        /**
         * 同意、拒绝认证关系
         *
         *
         */
        agree: function (id, agree, type) {
          var info = AccountRestAngular.allUrl("company_relation/approve");
          return info.post({
            company_id: id,
            agree: agree,
            type: type
          });
        },
        /**
         * 获取认证公司的列表信息
         * @param query{page,name}
         * @param type:
         *              Company 已认证的公司
         *              Companing 认证中的公司
         *              NotCompany 未认证的公司
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
         * 获取空闲/忙碌/待认证司机数量
         * @returns {*}
         */
        getPrivateCount: function () {
          var all = AccountRestAngular.allUrl('driver_verify/admin_get_verify_driver_count');
          return all.post();
        },

        /**
         *
         * 删除线路
         */
        delLine: function (id) {
          var all = AccountRestAngular.allUrl('company_traffic_line/dec');
          return all.post({
            line_id: id
          });
        },
        /**
         * 物流需求单详情页,交易企业获取需求单对应的已申请认证的企业个数.
         * @param company_id
         * @returns {*}
         */
        getCompanyApplyCount: function (type, company_id) {
          var all = AccountRestAngular.allUrl('company_relation/get_company_apply_count');
          return all.post({
            type: type,
            company_id: company_id
          });
        },
        /**
         * 获取用户信息，弹窗个人名片用
         *
         */
        getUserInfoForNameCard: function (user_id) {
          var all = AccountRestAngular.allUrl('user/get_business_card');
          return all.post({
            user_id: user_id
          });
        },
        /**
         *
         * 主动推送
         */
        pushMsg: function (data) {
          var all = AccountRestAngular.allUrl('demand/push_msg_by_demand_id');
          return all.post(data);
        },
        /**
         * 获取当前用户剩余的短信条数
         */
        getRemainSmsCount: function () {
          var all = AccountRestAngular.allUrl('phone/get_remain_sms_count');
          return all.post();
        },
        getStoreMgById: function (store_id) {
          var all = AccountRestAngular.allUrl('user_trade/get_by_store_id');
          return all.post({
            store_id: store_id
          });
        },
        /**
         * 物流管理员推送司机抢单
         */
        driverDemandPushMsg: function (order_id) {
          var all = AccountRestAngular.allUrl('demand/driver_demand_push_msg');
          return all.post({
            order_id: order_id
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
         * 获取组列表(给订单用)
         * type：PRIVATE PUBLIC
         */
        getTruckGroupForOrder: function (quert) {
          var all = AccountRestAngular.allUrl('truck_group/add_truck_get');
          return all.post(quert);
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
         * 删除组
         */
        delTruckGroup: function (group_id) {
          var all = AccountRestAngular.allUrl('truck_group/dec');
          return all.post({
            group_id: group_id
          });
        },
        /**
         * 根据组ID获取车辆信息
         * @param group_id
         * @param type
         * @returns {*}
         */
        getCarBuyGroup: function (query) {
          var all = AccountRestAngular.allUrl('/company_traffic/get_use_truck_user');
          return all.post(query);
        },
        getAllCarBuyGroup: function () {
          var all = AccountRestAngular.allUrl('/user_traffic/get_private_driver');
          return all.post();
        },
        /**
         * 根据type,订单ID获取默认组车辆数
         * @param type
         * @returns {*}
         */
        getDefCount: function (type, order_id) {
          var all = AccountRestAngular.allUrl('/truck_group/add_truck_get_default_count');
          return all.post({
            type: type,
            order_id: order_id
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
        /**
         * 获取指定组之外的组列表
         * group_id
         * type
         */
        getGroupsOther: function (data) {
          var all = AccountRestAngular.allUrl('truck_group/get_other');
          return all.post(data);
        },

        hasOfferCar: function (id) {
          var all = AccountRestAngular.allUrl('/company_traffic/get_offer_truck');
          return all.post({
            order_id: id,
            offer: true
          });
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
         * 物流需求单系统推荐获取公司列表
         * /api/company_traffic/get_by_line_name
         物流需求单，系统推荐按钮获取公司列表
         send_province
         send_city
         receive_province
         receive_city
         地址都是中文，账号服务器
         */
        getCompanyListForRec: function (query) {
          var all = AccountRestAngular.allUrl('company_traffic/get_by_line_name');
          return all.post(query);
        },
        getCompanyPushList: function (data) {
          var all = AccountRestAngular.allUrl('company_relation/recommond_get_company_verify');
          return all.post(data);
        },
        /**
         * 获取当前登录用的 申请认证的个数
         */
        getCompanyVerifyCount: function () {
          var all = AccountRestAngular.allUrl('company_relation/get_verify_count');
          return all.post();
        },
        /**
         * 挂靠司机查询是否是指定公司的认证司机
         */
        check_driver: function (company_id) {
          var all = AccountRestAngular.allUrl('user_traffic/check_driver');
          return all.post({
            company_id: company_id
          });
          //
        },
        getLinePrices: function () {
          var all = AccountRestAngular.allUrl('home/get_self_company_line_info');
          return all.post();
        },
        /**
         * 获取申请认证数量
         */
        getVerifyCount: function (data) {
          var all = AccountRestAngular.allUrl('company_relation/get_company_apply_count');
          return all.post(data);
        },
        /**
         * 获取申请认证数量
         */
        getCarInfo: function (data) {
          var all = AccountRestAngular.allUrl('user_traffic/driver_get_self_info');
          return all.post(data);
        },
        /**
         * 物流管理员查看挂靠司机名片
         */
        getPublishDriver: function (id) {
          var all = AccountRestAngular.allUrl('user_trade/get_by_id');
          return all.post(id);
        },
        /**
         * 物流需求单邀请司机
         * type : driverDemand
         * id : 物流需求单
         * phone:被邀请人的电话号码
         */
        driverInviteInfoAdd: function (type, order_id, phone, company_id) {
          var all = AccountRestAngular.allUrl('invitation_trade/share_add');
          return all.post({
            type: type,
            id: order_id,
            phone: phone,
            company_id: company_id
          });
        }


        //查找公司信息
        ,
        FindCompanyInformation: function () {
          var all = AccountRestAngular.allUrl('company/get_one');
          return all.post();
        },






        /*
         *
         * trade维护区start
         *
        */
        //用户信息修改

        userTradeModifySelf: function (data, role) {
          return role == 'TRAFFIC' ? cbp('user_traffic/modify_self', data) : cbp('user_trade/modify_self', data);
        },
        accountCompanyVerify: function (r) {
          return r == 'TRADE' ? cbp('company_trade/authentication_cancel', {}) : cbp('company_traffic/authentication_cancel', {});
        }
        //删除行情
        ,
        userTradeDeleteFromHomeSee: function (name) {
          return cbp("user_trade/delete_from_home_see", name);
        },
        roleButArr: function (arr, role) {
          var d = $q.defer();
          cbp("menu/get_menu_by_role", {
            menu_names: arr,
            role: role
          }).then(function (res) {
            res.data = JSON.parse(res.data);
            d.resolve(res);
          }).finally(function () {
            d.reject()
          });
          return d.promise;
        }
        // 获取线路数据
        ,
        getTruckLineInfo: function () {
          return cbp('home/get_truck_line_info', {});
        }
        // 获取公司数量
        ,
        getCompanyInfo: function () {
          return cbp('home/get_company_info', {});
        }
        //交易管理员，采购，销售获取推荐公司
        ,
        transactionRecommendation: function (data) {
          return cbp('demand/sale_get_recommond', data);
        }
        //挂靠司机获取推荐公司
        ,
        driverRecommended: function () {
          return cbp('company_recommend/driver_get', {});
        }
        //交易管理员，采购，销售修改个人系统推荐设置
        ,
        TransactionModificationSet: function (data) {
          return cbp('user_trade/trade_get', data);
        }
        //交易管理员设置公司买什么，卖什么
        ,
        dealAdminSetUpCompanyBuySell: function (data) {
          return cbp('company_trade/edit', data);
        }
        //交易管理员路线设置
        ,
        AdministratorRouteSettings: function (data) {
          return cbp('company_traffic_line/trade_add', data);
        }
        //获取提交过的路线 ((重复)getAllLine())
        ,
        DisplayLine: function () { }
        //删除线路
        ,
        DeleteLine: function (lineid) {
          return cbp('company_traffic_line/dec', {
            line_id: lineid
          });
        }
        //获取买卖信息
        ,
        GetTransactionRequest: function (data) {
          return data.type == 'TRADE' ? cbp('company_trade/get', data) : cbp('company_traffic/get', data);
        }
        //采购公司列表公司列表
        ,
        GetPurchaseList: function () {
          return cbp('company_recommend/trade_get_purchase', {});
        }
        //销售获取交易需求单
        ,
        TransactionDemandSheet: function () {
          return cbp('company_recommend/trade_get_sale', {});
        }
        //物流获取交易需求单
        ,
        LogisticsRecommendation: function () {
          return cbp('company_recommend/trade_get_traffic', {});
        }
        //推荐需求单
        ,
        RecommendedRequirementsList: function () {
          return cbp('demand/trade_get_recommend', {});
        },
        areaGetIdName: function (data) {
          return cbp('area/get_id_by_name', data);
        },
        companyTradeGetByCate: function (data) {
          return cbp('company_trade/get_by_category_chn', data);
        }
        //企业主页  物流  实时报价 (存在问题)
        ,
        companyTrafficLine: function (data) {
          return cbp('company_traffic_line/business_card_get', data);
        }
        //挂靠司机  推荐需求单（重复）
        ,
        driverGetDriverDemand: function (data) { }
        //挂靠司机  某笔需求单重的状态  申请认证（重复)
        ,
        driverVerifyApply: function (company_id) { },
        shareNameCard: function (userid) {
          return cbp('user/get_business_card/', {
            user_id: userid
          });
        }
        //获取物流公司企业主页 (重复)
        ,
        companyTrafficGetOne: function (company_id) { }
        //获取交易公司企业主页(重复)
        ,
        companyTradeGetOne: function (company_id) { }
        //获取公司关系
        ,
        compRgetByType: function () {
          return cbp('company_relation/get_by_type', {
            status: 'ACCEPT',
            type: 'TRADE'
          });
        },
        getByStoreId: function (id) {
          return cbp('user_trade/get_by_store_id', {
            store_id: id
          });
        }
        // 获取平台线路信息
        ,
        getLineInfo: function () {
          return cbp('home/get_line_info', {});
        }
        // 获取平台车辆信息
        ,
        getTruckInfo: function () {
          return cbp('home/get_truck_info', {});
        }
        // 获取我的各种公司数量
        ,
        getRelationCount: function () {
          return cbp('company_relation/get_relation_count', {});
        }
        // 收藏名片
        ,
        businessCardAdd: function (userid, role) {
          return cbp('business_card/add', {
            user_id: userid,
            role: role
          });
        }
        // 删除名片
        ,
        businessCardDec: function (userid) {
          return cbp('business_card/dec', {
            user_id: userid
          });
        }
        // 获取名片列表
        ,
        businessCardGetByType: function (page, type) {
          return cbp('business_card/get_by_type', {
            page: page,
            type: type
          });
        }
        // 查询某公司名片
        //, businessCardGetByCompanyName: function (page, type, name) {
        //    return cbp('business_card/get_by_company_name', {page: page, type: type, name: name});
        //}
        ,
        businessCardGetByCompanyOrUser: function (page, type, name) {
          return cbp('business_card/get_by_company_or_user_name', {
            page: page,
            type: type,
            name: name
          });
        }
        //获取公司是否被认证
        ,
        companyTradegetOneVerifyPhase: function (company_id) {
          return cbp('company_trade/get_one_verify_phase', {
            company_id: company_id
          });
        },
        ctlGetReferencePrice: function (data) {
          return cbp('company_traffic_line/get_reference_price', data);
        }
        //主动推送  交易 (重复)AccountInformation.getCompanyPushList()
        ,
        GetCompanyVerify: function (data) { }
        //获取物流企业的自有和挂靠车辆
        ,
        getSelfTruckInfo: function (data) {
          return cbp('home/get_self_truck_info', data);
        }
        //分享物流 实时物流  查看请求
        ,
        getDriverDemandtip: function (user_id) {
          return cbp('business_card/get_driver_demand_tip/', {
            user_id: user_id
          });
        }
        //(重复)AccountInformation.getLinePrices()
        ,
        getSelfCompanyLineInfos: function () { }
        //挂靠司机(重复)AccountInformation.getUseLogisticsCount()
        ,
        passdriverGetComVerCount: function () { }
        //验证码登录页面
        ,
        userTradeLogin: function (data) {
          return cbp('user_trade/login', data);
        }
        //获取验证码 (重复)Account.getCode()
        ,
        getVerifyCode: function (phone) {
          return cbg('phone/get_verify_code', phone);
        }
        //判断手机号是否被用 (1重复)Account.checkPhoneExist()
        ,
        phoneExist: function (phone) { }
        //个人设置  电话号码修改，物流 (1重复)
        ,
        userTrafficMdifySelf: function (data) {
          return cbp('user_traffic/modify_self', data);
        }
        //个人设置  电话号码修改，交易(1重复)
        ,
        userTradeMdifySelf: function (data) {
          return cbp('user_trade/modify_self', data);
        }
        //邀请抢单 注册之后页面跳转
        ,
        invitationTradeShareGet: function (phone) {
          return cbp('invitation_trade/share_get', {
            phone: phone
          });
        }
        // 用户信息 重复( AccountInformation.getPublishDriver() .getUserInfoById() .getDriverInfoById())
        ,
        getUserInfo: function (type, data) {
          // if(type="user_trade"){
          //   var _url = ENV.api.account + type + '/get_by_id'
          // }else{
          //   var data = {driver_id:data.user_id};
          //   var _url = ENV.api.account + type + '/get_one_driver'
          // }
          // return $http.post(_url,data)
          return type == 'user_trade' ? cbp(type + '/get_by_id', data) : cbp(type + '/get_one_driver', {
            driver_id: data.user_id
          });
        }
        //(重复 AccountInformation.getCarInfoById())
        ,
        trafficTruckGetone: function (_data) { }
        //查找我的同事个数，contorllers\me
        ,
        NumberOfColleagues: function (urltype) {
          return cbp(urltype, {});
        }
        // 查找我认证企业的个数 重复(AccountInformation.getCompanyVerifyCount())
        ,
        NumberOfEnterprises: function () { }

        //上传到服务器
        ,
        UploadToServer: function (urltype, data) {
          return cbp(urltype + 'edit', data);
        }
        //提交认证
        ,
        SubmitAuthentication: function (urltype, data) {
          return cbp(urltype + 'authentication', data);
        }
        //同事列表
        ,
        ListOfColleagues: function (urlremain) {
          return cbp(urlremain, {});
        }
        //成员管理
        ,
        MemberManagement: function (urlremain) {
          return cbp(urlremain, {});
        }
        //邀请注册
        ,
        InvitationRegistration: function (url_invite) {
          return cbg(url_invite, '');
        }
        //获取现有的路径信息(重复1)
        ,
        GetTheExistingPathInformation: function () { }
        // 添加路径信息 （重复 AccountInformation.addRoadLine())
        ,
        addPathInformation: function (upload_data) { }
        //读取路径信息 （重复 AccountInformation.getOneLine()）
        ,
        AccessPathInformation: function (_data) { }
        //我的车辆 （重复 AccountInformation.getCurrentUserAllCars()）
        ,
        MyCar: function () { },
        //通讯录 2016/8/25
        //获取本人所有通讯录组
        phoneBookGetGroup: function () {
          return cbp('phone_book/get_group', {});
        },
        //增加通讯录组
        phoneBookAddGroup: function (group_name) {
          return cbp('phone_book/add_group', {
            group_name: group_name
          });
        },
        //修改组名
        phoneBookEditGroup: function (group_name, group_id) {
          return cbp('phone_book/edit_group', {
            group_name: group_name,
            group_id: group_id
          });
        },
        //删除通讯录组
        phoneBookDecGroup: function (group_id) {
          return cbp('phone_book/dec_group', {
            group_id: group_id
          });
        },
        //获取某组电话联系人
        phoneBookGetPhone: function (group_id, page) {
          return cbp('phone_book/get_phone', {
            group_id: group_id,
            page: page
          });
        },
        //增加联系人
        phoneBookAddPhone: function (phone, name, group_id) {
          return cbp('phone_book/add_phone', {
            phone: phone,
            name: name,
            group_id: group_id,
            user: user,
            group_name: group_name
          });
        },
        // 我的关系 增加联系人
        addPhoneForRole: function (user, group_name) {
          return cbp('phone_book/add_phone_for_role', {
            user: user,
            group_name: group_name
          });
        },
        // 物流管理员 增加联系人
        driverAddPhoneForRole: function (user, group_name) {
          return cbp('phone_book/add_phone_for_role', {
            user: user,
            group_name: group_name
          });
        },
        // 我的关系 联系人列表
        getPhoneForRole: function (group_name) {
          return cbp('phone_book/get_phone_for_role', {
            group_name: group_name
          });
        },
        //删除联系人
        phoneBookDecPhone: function (phone_id) {
          return cbp('phone_book/dec_phone', {
            phone_id: phone_id
          });
        },
        //修改联系人
        phoneBookEditPhone: function (phone_id, name, phone) {
          return cbp('phone_book/edit_phone', {
            phone_id: phone_id,
            name: name,
            phone: phone
          });
        },
        //移动联系人到某组
        phoneBookMovePhone: function (phone_id, group_id) {
          return cbp('phone_book/move_phone', {
            phone_id: phone_id,
            group_id: group_id
          });
        },
        //搜索
        phoneBookFindPhone: function (name, page) {
          return cbp('phone_book/find_phone', {
            name: name,
            page: page
          });
        },
        //获取替换人员
        replaceGetUserInfo: function (user_id) {
          return cbp('user_trade/get_by_id', {
            user_id: user_id
          });
        },
        //保存替换人员
        replaceSetUserInfo: function (url_remain, info) {
          return cbp(url_remain, info);
        },
        // 修改个人信息
        modifySelf: function (data) {
          return cbp('user_traffic/modify_self', data);
        },
        //修改关键信息（图片）
        setKeyInfo: function (data, url) {
          return cbp(url, data);
        },
        //个人设置 修改个人信息
        mySetModifySelf: function (_url, _data) {
          return cbp(_url, _data)
        },
        //修改图
        editModifyCompany: function (_url, _data) {
          return cbp(_url, _data)
        },
        accountCompanyAuthen: function (r, _data) {
          return r == 'TRADE' ? cbp('company_trade/authentication', _data) : cbp('company_traffic/authentication', _data);
        },
        forgetPassword: function (_data) {
          return cbp('user/forget_password', _data);
        },
        accountFileUpload: function (_url, _data) {
          var c = new FormData();
          c.append('file', _data);
          return cbf('file/upload/' + _url, c);
        },
        getHelpUsImg: function (data) {
          return cbp('help_center/get', data);
        }
        //cbp 发不报价 提货区域内容
        // account:address/add
        //添加一个地址
        ,
        addressAdd: function (data) {
          return cbp('address/add', data);
        }
        //获取所有地址
        ,
        addressGget: function (data) {
          return cbp('address/get', data);
        }
        //删除一个地址
        ,
        addressDec: function (address_id) {
          return cbp('address/dec', {
            address_id: address_id
          });
        }
        //编辑某一个地址
        ,
        addressEdit: function (data) {
          return cbp('address/edit', data);
        }
        //获取某一个地址
        ,
        addressGetOne: function (address_id) {
          return cbp('address/get_one', {
            address_id: address_id
          });
        }
        //发票
        //添加一个地址
        ,
        invoiceAdd: function (data) {
          return cbp('invoice/add', data);
        }
        //获取所有地址
        ,
        invoiceGget: function () {
          return cbp('invoice/get', '');
        }
        //删除一个地址
        ,
        invoiceDec: function (invoice_id) {
          return cbp('invoice/dec', {
            invoice_id: invoice_id
          });
        }
        //编辑某一个地址
        ,
        invoiceEdit: function (data) {
          return cbp('invoice/edit', data);
        }
        //获取某一个地址
        ,
        invoiceGetOne: function (invoice_id) {
          return cbp('invoice/get_one', {
            invoice_id: invoice_id
          });
        }
        //司机
        //添加一个地址
        ,
        driverAdd: function (data) {
          return cbp('driver/add', data);
        }
        //获取所有地址
        ,
        driverGget: function () {
          return cbp('driver/get', '');
        }
        //删除一个地址
        ,
        driverDec: function (driver_id) {
          return cbp('driver/dec', {
            driver_id: driver_id
          });
        }
        //编辑某一个地址
        ,
        driverEdit: function (data) {
          return cbp('driver/edit', data);
        }
        //获取某一个地址
        ,
        driverGetOne: function (driver_id) {
          return cbp('driver/get_one', {
            driver_id: driver_id
          });
        }
        //挂靠司机查询车辆是否上传证件
        ,
        getUserType: function () {
          return cbp('truck_group/judge');
        },
        //挂靠司机 实时货源 订单状态
        driverGetDemandStatus: function (company_id) {
          return cbp('driver_verify/driver_get_demand_status', company_id);
        },
        getUserPriOffComp: function (data) {
          return cbp('company_trade/get_user_price_offer_id_for_company', data);
        },
        crmGetuserRelationCount: function (data) {
          return cbp('company_relation/get_user_relation_count', data);
        },
        crmGetuserRelation: function (data) {
          return cbp('company_relation/get_user_relation', data);
        },
        //指派负责人
        crmAssign: function (data) {
          return cbp('company_relation/assign', data);
        },
        getComRelationId: function (data) {
          return cbp('company_relation/get_company_ids_by_type', data);
        },

        // 物管获取管理页面各个数量
        getAdminNumber: function () {
          return cbp('company_traffic/get_role_count');
        },
        getReferencePriceNew: function (data) {
          return cbp('company_traffic_line/get_reference_price_new', data);
        },
        statGetStellLiji: function (data) {
          //company_id
          return AdminServiceAngular.allUrl('stat/get_steel_liji_weigh_config').post(data);
        }

        //常用地址数量
        ,
        addressGetCount: function () {
          return cbp('address/get_count', '');
        },
        newHasApplyForUser: function (data) {
          //company_id
          return AdminServiceAngular.allUrl('stat/new_has_applied_for_user').post(data);
        },
        getReferencePriceCountNew: function (data) {
          return cbp('company_traffic_line/get_reference_price_count_new', data);
        }
        // trade维护区end

        // 获取公司动态
        ,
        getDynamic: function (data) {
          return cbp('company_dynamic/get', data);
        }

        ,
        getDynamicMessage: function () {
          return cbp('company_dynamic/get_msg');
        },
        isPraised: function (id) {
          return cbp('company_dynamic/add_praise', {
            dynamic_id: id
          });
        }
        // company_relation/get_status_by_company_id
        //认证关系i
        ,
        getStatusByCompanyId: function (type, company_id) {
          return cbp('company_relation/get_status_by_company_id', {
            type: type,
            company_id: company_id
          });
        },
        appliCation: function (company_id) {
          return cbp('driver_verify/apply', {
            company_id: company_id
          })
        },
        //企业管理 供应商和代理商显示
        companyRelationGetUserForCompany: function (company_id, type) {
          return cbp('company_relation/get_user_for_company', {
            company_id: company_id,
            type: type
          })
        },
      }
    }
  ])
  .factory('authenticationService', ['Storage', '$log', '$location', function (Storage, $log, $location) {
        var userInfo;
        var companyInfo;

        function getUserInfo() {
            if (Storage.get('userInfo')) {
                userInfo = Storage.get('userInfo');
                return userInfo;
            } else {
                //$log.warn("no login");
                // $location.path('/tab/login')
                // window.location.href = 'http://'+$location.$$host+':'+ $location.$$port + '#/tab/login'
                return null;
            }
        }

        function getCompanyInfo() {
            if (Storage.get('userInfo')) {
                companyInfo = Storage.get('userInfo').company;
                return companyInfo;
            } else {
                return null;
            }
        }

        return {
            getUserInfo: getUserInfo,
            getCompanyInfo: getCompanyInfo
        };

    }])

