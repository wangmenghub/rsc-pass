(function () {
  'use strict'

  angular.module('rsc.im.config', [])
    .constant("IMENV", {

      config: {
        // 用户自定义的登录注册地址
        loginUrl: 'login',
        registUrl: 'register',
        homeUrl: 'rsc.center_goods',
        imUrl: 'rsc.message',
        p2pUrl: 'rsc.im_detail',
        teamUrl: 'rsc.im_team',
        inviteUrl: 'rsc.invite',
        relationUrl: 'rsc.new_relation',
        // 本地消息显示数量，会影响性能
        localMsglimit: 36,
        appkey: '34933ec0c6e6d8add0129e8177d39b41'
      }
      
    });


})()

