angular.module('rsc.service.traffic_company', [])
    .service('TrafficCompanyManageService', ['ContactAngular', 'ENV', 'AccountRestAngular',
        function (ContactAngular, ENV, AccountRestAngular) {
            this.CompanyInfo = function (id, types) {
                var all = AccountRestAngular.allUrl('company/get_home_pages');
                return all.post({
                    company_id: id,
                    types: types
                });
            }

            this.getMapLocal = function(province,city,addr,district){
                var all = AccountRestAngular.allUrl('address/get_Coord');
                return all.post({
                    province: province,
                    city: city,
                    addr: addr,
                    district: district
                });
            }
        }
    ])

    .service('TrafficCompanySettingService', ['ContactAngular', 'ENV', 'AccountRestAngular',
        function (ContactAngular, ENV, AccountRestAngular) {
            this.companyInfo = function () {
                var all = AccountRestAngular.allUrl('company/get_one');
                return all.post();
            }

            this.delImg = function (urls) {
                var all = AccountRestAngular.allUrl('file/delete_qi_ye_zhan_shi');
                return all.post({
                    urls: urls
                });
            }

            this.companyVerify = function () {
                var all = AccountRestAngular.allUrl('company/authentication_apply');
                return all.post();
            }

            this.cancelVerify = function () {
                var all = AccountRestAngular.allUrl('company/authentication_cancel');
                return all.post();
            }

            this.creatNewCompany = function (data) {
                var all = AccountRestAngular.allUrl('company/add');
                return all.post(data);
            }

            this.editCompany = function (data) {
                var all = AccountRestAngular.allUrl('company/edit');
                return all.post(data);
            }

            this.getCompanyInfoCount = function (id) {
                var all = AccountRestAngular.allUrl('company_relation/recommond_get_company_verify_count');
                return all.post({
                    company_id: id
                });
            }

            this.backImg = function (data) {
                var all = AccountRestAngular.allUrl('company/add_bg');
                return all.post(data);
            }

            this.addImg = function (data) {
                var all = AccountRestAngular.allUrl('company_trade/edit');
                return all.post(data);
            }
            this.getCompanyStatus = function () {
                var all = AccountRestAngular.allUrl('company/three_if');
                return all.post();
            }
        }
    ])

    .service('TrafficCompanyDynamicService', ['DynamicAngular', 'StatistServiceAngular',
        function (DynamicAngular, StatistServiceAngular) {

            /**
             * 获取动态列表
             *
             * @returns
             */
            this.GetDynamic = function (data) {
                var all = DynamicAngular.allUrl('company_dynamic/get_list');
                return all.post(data);
            }

            /**
             * 点赞
             *
             * @param {any} dynamic_id
             * @returns
             */
            this.AddPraise = function (dynamic_id) {
                var all = DynamicAngular.allUrl('company_dynamic/add_praise');
                return all.post({
                    dynamic_id: dynamic_id
                });
            }


            /**
             * 获取提示数
             *
             * @returns
             */
            this.GetCount = function () {
                var all = DynamicAngular.allUrl('company_dynamic/get_tips_count');
                return all.post();
            }

            this.GeTabCount = function (data) {
                var all = DynamicAngular.allUrl('company_dynamic/get_list_count');
                return all.post(data);
            }


            /**
             * 获取提示信息
             *
             * @returns
             */
            this.GetTips = function () {
                var all = DynamicAngular.allUrl('company_dynamic/get_tips');
                return all.post();
            }

            this.DynamicDaily = function (company_id, day, month, year) {
                var all = StatistServiceAngular.allUrl('companyDay/get_daily');
                return all.post({
                    company_id: company_id,
                    day: day,
                    month: month,
                    year: year
                });
            }
            this.DailyDetail = function (company_id, day, month, year) {
                var all = StatistServiceAngular.allUrl('companyDay/get_daily_detail');
                return all.post({
                    company_id: company_id,
                    day: day,
                    month: month,
                    year: year
                });
            }

            this.getWeekData = function () {
                var all = StatistServiceAngular.allUrl('company/week');
                return all.post();
            }
            this.getUserImg = function (users) {
                var all = AccountRestAngular.allUrl('user/get_photo');
                return all.post({
                    user_ids: users
                });
            }
        }
    ])

    .service('TrafficPersonService', ['AccountRestAngular', 'AccountService', 'MsgServiceAngular',
        function (AccountRestAngular, AccountService, MsgServiceAngular) {
            this.userInfo = function (id, types) {
                var all = AccountRestAngular.allUrl('user/get_personal_homepage');
                return all.post({
                    user_id: id,
                    types: types
                });
            }

            this.companyInfo = function (id, types) {
                var all = AccountRestAngular.allUrl('company/get_home_pages');
                return all.post({
                    company_id: id,
                    types: types
                });
            }

            this.editUser = function (params) {
                var all = AccountRestAngular.allUrl('user_traffic/modify_self');
                return all.post(params);
            }

            this.sendVertify = function (phone) {
                return AccountService.getCode(phone)
            }

            this.getStatus = function (user_id) {
                var all = AccountRestAngular.allUrl('user/get_personal_homepage_status');
                return all.post({
                    user_id: user_id
                });
            }

            this.addRelation = function (user_id, friend, status) {
                var all = AccountRestAngular.allUrl('apply_relation/homepage_supply');
                return all.post({
                    user_id: user_id,
                    friend: friend,
                    status: status
                });
            }

            this.logOut = function (){
                var all = MsgServiceAngular.allUrl('push/dec');
                return all.post();
            }

        }
    ])

    .service('AddressManageService', ['AccountRestAngular', 'ContactAngular',
        function (AccountRestAngular, ContactAngular) {

            /**
             * 获得用户的提货地址sz
             */
            this.getAddressList = function (obj) {
                var all = AccountRestAngular.allUrl('address/get');
                return all.post(obj);
            }
            /**
             * 删除提货地址sz
             * */
            this.delAddress = function (obj) {
                var all = AccountRestAngular.allUrl('address/dec');
                return all.post(obj);
            }
            /**
             * 编辑指定id的提货地址；sz
             * */
            this.editAddress = function (obj) {
                var all = AccountRestAngular.allUrl('address/get_one');
                return all.post(obj);
            }
            /**
             * 保存编辑指定id的提货地址；
             * */
            this.saveEditAddress = function (obj) {
                var all = AccountRestAngular.allUrl('address/edit');
                return all.post(obj);
            }
            /**
             * 保存新增提货地址；
             * */
            this.saveAddAddress = function (obj) {
                var all = AccountRestAngular.allUrl('address/add');
                return all.post(obj);
            }
            /**
             * 修改默认地址；
             * */
            this.setDefaultAddress = function (obj) {
                var all = AccountRestAngular.allUrl('address/set_default_address');
                return all.post(obj);
            }


            this.get_phone_contact = function (page, uuid) {
                var all = ContactAngular.allUrl('/phone/get_list');
                return all.post({
                    page: page,
                    uuid: uuid
                })
            }


        }

    ])

    .service('TrafficCompanyModify', ['PassRestAngular', 'AccountRestAngular',
        function (PassRestAngular, AccountRestAngular) {
            this.getCompanyModify = function (data) {
                var all = PassRestAngular.allUrl('/order/driver_get');
                return all.post(data);
            }

            // 查询
            this.verifyCompany = function (name) {
                var all = AccountRestAngular.allUrl('/company/find');
                return all.post({
                    name: name
                });
            }

            // 添加公司
            this.addCompany = function (data) {
                var all = AccountRestAngular.allUrl('/company/add');
                return all.post(data);
            }

            // 加入企业
            this.joinCompany = function (data) {
                var all = AccountRestAngular.allUrl('/apply_relation/company_supply');
                return all.post(data);
            }

            // 监听是否通过企业验证
            this.listenCompanyStatus = function () {
                var all = AccountRestAngular.allUrl('/user/login_data');
                return all.post();
            }

        }
    ])
