(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMBlacks', ['IMState', 'IMMutation',
      function (IMState, IMMutation) {

        return {
          onBlacklist: onBlacklist,
          onMarkInBlacklist: onMarkInBlacklist,
          updateBlack: updateBlack
        }

        // 完成添加/删除黑名单，初始化获取黑名单列表，都会触发此函数
        function onBlacklist(blacks) {

          var newBlacks = []
          angular.forEach(blacks, function (item) {
            if (typeof item.isBlack !== 'boolean') {
              item.isBlack = true
            }
            newBlacks.push(item)
          })
          // 更新黑名单列表
          IMMutation.updateBlacklist(newBlacks)
          // 在好友身上打上标记
          IMMutation.updateFriends(newBlacks)
          // 更新好友信息字典
          IMMutation.updateUserInfo(newBlacks)
        }

        function onMarkInBlacklist(obj) {
          obj = obj || obj2
          var account = obj.account
          // 说明是自己，被别人加入黑名单
          if (account === IMState.userUID) {

          } else {
            // 说明是别人的帐号，黑名单通知
            if (typeof obj.isAdd === 'boolean') {
              onBlacklist([{
                account: account,
                isBlack: obj.isAdd
              }])
            }
          }
        }

        function updateBlack(data) {
          var nim = IMState.nim
          angular.forEach(data, function (value, key) {
            if (key == 'account') {
              var account = value
            } else if (key == 'isBlack') {
              var isBlack = value
            }
          })
          if (account && (typeof isBlack === 'boolean')) {
            nim.markInBlacklist({
              account: account,
              // `true`表示加入黑名单, `false`表示从黑名单移除
              isAdd: isBlack,
              done: function (error, obj) {
                if (error) {
                  alert(error)
                  return
                }
                onMarkInBlacklist(obj)
              }
            })
          }
        }
      }])



})()