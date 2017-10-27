(function () {
  'use strict'
  angular.module('rsc.im.filters', [])
    .filter('relationRole', function () {
      var relationRole = {
        'TRADE_ADMIN': '交易管理员',
        'TRADE_PURCHASE': '采购负责人',
        'TRADE_SALE': '销售负责人',
        'TRAFFIC_ADMIN': '物流管理员',
        'TRAFFIC_DRIVER_PRIVATE': '挂靠司机',
        'TRADE_STORAGE': '仓库管理员',
        'STORAGE': '库管',
        'SERVICE': '线上客服',
        'OWNER': '货主', //20170406新增邀请人
        'SALE': '销售商',
        'PURCHASE': '采购商',
        'TRAFFIC': '物流企业',
        'COLLRAGUES': '同事',
        'COLLEAGUE': '我的同事',
        'WORK': '合作企业',
        'FRIEND': '我的好友',
        'ZADMIN': '我的账号',
        'superman': '超级管理员',
        'majordomo': '线上总监',
        'manager': '运营经理',
        'charge': '线上主管',
        'service': '线上客服',
        'minister': '部门负责人',
        'warden': '大区负责人'
      }

      return function (type) {
        return relationRole[type];
      }
    })

})()
