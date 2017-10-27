(function () {
  'use strict'

  angular.module('rsc.im.service')
    .service('RscIMService', ['WebIMAngular', 'AccountRestAngular',
      function (WebIMAngular, AccountRestAngular) {
        // 已读消息
        this.messageRead = function (user_id, number) {
          var all = WebIMAngular.allUrl('im/read');
          return all.post({
            user_id: user_id,
            number: number
          });
        }

        // 获取对应公司
        this.getCompanys = function (user_ids) {
          var all = AccountRestAngular.allUrl('company/get_company_by_user')
          return all.post({
            user_ids: user_ids
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
        this.agreeDeal = function (apply_id, role) {
          var all = AccountRestAngular.allUrl('apply_relation/deal');
          return all.post({
            apply_id: apply_id,
            agree: true,
            role: role
          })
        }

        // 加入公司
        this.agreeVerify = function (company_id, type) {
          var all = AccountRestAngular.allUrl('company_relation/approve');
          return all.post({
            company_id: company_id,
            type: type,
            agree: true
          })
        }

        // 更新公司信息
        this.companyInfo = function () {
          var all = AccountRestAngular.allUrl('company/get_one');
          return all.post();
        }

        this.getCompanyTeam = function (id) {
          var all = AccountRestAngular.allUrl('user/get_team_data');
          return all.post({
            company_id: id
          });
        }

        //  获取联系人列表
        this.getContactList = function (page, select) {
          var all = AccountRestAngular.allUrl('user_invitation_phone/get_linkman');
          return all.post();
        }

      }
    ])

})()
