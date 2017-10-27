angular.module('rsc.service.traffic_relation', [])

    // 通讯录接口
    .service('TrafficContactService', ['AccountRestAngular',
        function (AccountRestAngular) {
            this.userContactList = function (page, select) {
                var all = AccountRestAngular.allUrl('user_invitation_phone/get_linkman');
                return all.post();
            }
            // 获取向某人申请认证的公司个数
            this.getVerifyCount = function () {
                var all = AccountRestAngular.allUrl('company_relation/get_user_apply_count');
                return all.post()
            }
            this.getVerifyList = function () {
                var all = AccountRestAngular.allUrl('company_relation/get_user_apply');
                return all.post()
            }
            this.agreeVerify = function (company_id, type) {
                var all = AccountRestAngular.allUrl('company_relation/approve');
                return all.post({
                    company_id: company_id,
                    type: type,
                    agree: true
                })
            }
            // 获取新的好友数
            this.getNewFriend = function () {
                var all = AccountRestAngular.allUrl('apply_relation/get_count');
                return all.post()
            }

            // 获取新联系人列表
            this.getFriendList = function () {
                var all = AccountRestAngular.allUrl('apply_relation/get_list');
                return all.post()
            }

            // 同意各种申请
            this.agreeDeal = function (apply_id,role) {
                var all = AccountRestAngular.allUrl('apply_relation/deal');
                return all.post({
                    apply_id: apply_id,
                    agree: true,
                    role:role
                })
            }

            this.getColleague = function(){
                var all = AccountRestAngular.allUrl('user/get_colleague_count');
                return all.post()
            }

        }
    ])

    // 邀请接口
    .service('TrafficInviteService', ['ContactAngular', 'AccountRestAngular','PassRestAngular', 
        function (ContactAngular, AccountRestAngular, PassRestAngular) {

            this.getPhoneContact = function (page, uuid) {
                var all = ContactAngular.allUrl('/phone/get_list');
                return all.post({
                    page: page,
                    uuid: uuid
                })
            },


            this.userPhoneBookAdd = function (user) {
                var all = AccountRestAngular.allUrl('/user_phone_book/add');
                return all.post({
                    user: user
                });
            },


            this.userPhoneBookGet = function (page, select) {
                var all = AccountRestAngular.allUrl('user_phone_book/get');
                return all.post({
                    page: page,
                    select: select
                });
            }


            this.userInvitation = function(users, type, role){
                var all = AccountRestAngular.allUrl('apply_relation/invite');
                return all.post({
                    users: users,
                    type: type,
                    role: role
                });
            }


            /**
             *
             * 邀请单子
             * @param {array} phone_list
             * @param {str} id:没有传''
             * @returns
             */
            // 报价，
            this.offerInvite = function(id,phone_list){
                var all = PassRestAngular.allUrl('driver_order_c/send_sms');
                return all.post({
                    id: id,
                    phone_list: phone_list
                });
            }
            // 抢单
            this.demandInvite = function(id,phone_list){
                var all = PassRestAngular.allUrl('offer_c/send_sms');
                return all.post({
                    id: id,
                    phone_list: phone_list
                });
            }
        }
    ])

    // 管理
    .service('TrafficManageService', ['AccountRestAngular',
        function (AccountRestAngular) {

            this.trafficManageColleague = function (page, select) {
                var all = AccountRestAngular.allUrl('user/get_colleague');
                return all.post();
            }

            this.trafficManageSale = function (subType) {
                var all = AccountRestAngular.allUrl('company_relation/get_company_verify_new');
                return all.post({
                    subType: subType
                });
            }

            this.getPartnership = function (company_id ,type){
                var all = AccountRestAngular.allUrl('work_relation/get_one');
                return all.post({
                    company_id: company_id,
                    type: type
                });
            }

            this.getAllocation = function(company_id, user_id, type){
                var all = AccountRestAngular.allUrl('work_relation/get_assign_users');
                return all.post({
                    company_id: company_id,
                    user_id: user_id,
                    type: type
                });
            }

            this.Reallocation = function(company_id, user_id, user_ids, type){
                var all = AccountRestAngular.allUrl('work_relation/assign_users');
                return all.post({
                    company_id: company_id,
                    user_id: user_id,
                    user_ids: user_ids,
                    type: type
                });
            }

            this.trafficReColleague = function (id, real_name, phone) {
                var all = AccountRestAngular.allUrl('/user_traffic/modify_other');
                return all.post({
                    id: id,
                    real_name: real_name,
                    phone: phone
                });
            }

        }
    ])

    // webIM
    .service('TrafficWebIMService', ['WebIMAngular', 'AccountRestAngular',
        function (WebIMAngular, AccountRestAngular) {
            // 消息列表
            this.messageList = function () {
                var all = WebIMAngular.allUrl('im/get_history');
                return all.post();
            }
            // 消息详情
            this.messageDetail = function (user_id, group_id) {
                var all = WebIMAngular.allUrl('im/get_content');
                return all.post({
                    user_id: user_id,
                    group_id: group_id
                });
            }
            // 消息发送
            this.messageSend = function (to_user_id, type, content, group_id) {
                var all = WebIMAngular.allUrl('im/add');
                return all.post({
                    to_user_id: to_user_id,
                    type: type,
                    content: content,
                    group_id: group_id
                });
            }
            // 置顶
            this.imTop = function (history_id) {
                var all = WebIMAngular.allUrl('im/top');
                return all.post({
                    history_id: history_id
                });
            }
            // 标记
            this.imMark = function (history_ids) {
                var all = WebIMAngular.allUrl('im/mark');
                return all.post({
                    history_ids: history_ids // 数组
                });
            }
            // 删除聊天
            this.imRemove = function (history_ids) {
                var all = WebIMAngular.allUrl('im/remove_history');
                return all.post({
                    history_ids: history_ids // 数组
                });
            }
            // 加载更多
            this.getContent = function (user_id, time_creation) {
                var all = WebIMAngular.allUrl('im/get_content');
                return all.post({
                    user_id: user_id,
                    time_creation: time_creation
                });
            }

            // 已读消息
            this.messageRead = function (user_id,number) {
                var all = WebIMAngular.allUrl('im/read');
                return all.post({
                    user_id: user_id,
                    number: number
                });
            }

            this.unReadMsg = function(){
                var all = WebIMAngular.allUrl('im/get_unread_count');
                return all.post();
            }

            // 获取对应公司
            this.getCompanys = function(user_ids){
                var all = AccountRestAngular.allUrl('company/get_company_by_user')
                return all.post({
                    user_ids:user_ids
                })
            }


        }
    ])
