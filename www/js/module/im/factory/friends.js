(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMFriends', ['IMState', 'IMMutation', 'IMWidgetUi', 'IMSearch',
      function (IMState, IMMutation, IMWidgetUi, IMSearch) {
        return {
          onFriends: onFriends,
          onUpdateFriend: onUpdateFriend,
          onDeleteFriend: onDeleteFriend,
          onSyncFriendAction: onSyncFriendAction,
          updateFriend: updateFriend,
          addFriend: addFriend,
          deleteFriend: deleteFriend
        }

        function onFriends(friends) {
          var newFriends = []
          angular.forEach(friends, function (item) {
            if (typeof item.isFriend !== 'boolean') {
              item.isFriend = true
            }
            newFriends.push(item)
          })

          IMMutation.updateFriends(newFriends)
          // 更新好友信息字典，诸如昵称
          IMMutation.updateUserInfo(newFriends)
        }

        // 更新好友资料，添加好友成功
        function onUpdateFriend(error, friends) {
          if (error) {
            alert(error)
            return
          }
          if (!Array.isArray(friends)) {
            friends = [friends]
          }

          var newFriends = []
          angular.forEach(friends, function (item) {
            if (typeof item.isFriend !== 'boolean') {
              item.isFriend = true
            }
            newFriends.push(item)
          })

          // 补充好友资料
          var newAccounts = []
          angular.forEach(newFriends, function (item) {
            newAccounts.push(item.account)
          })
          IMSearch.searchUsers({
            accounts: newAccounts,
            done: function (users) {
              var nim = IMState.nim
              friends = nim.mergeFriends(newAccounts, users)
              // 更新好友列表
              IMMutation.updateFriends(newAccounts)
              // 更新好友资料
              IMMutation.updateUserInfo(newAccounts)
            }
          })
        }

        // 删除好友，这里使用标记删除
        function onDeleteFriend(error, friends) {
          if (error) {
            alert(error)
            return
          }
          if (!Array.isArray(friends)) {
            friends = [friends]
          }
          var newFriends = []
          angular.forEach(friends, function (item) {
            item.isFriend = false
            newFriends.push(item)
          })
          // 更新好友列表
          IMMutation.updateFriends([], newFriends)
          // 更新好友资料
          IMMutation.updateUserInfo(newFriends)
        }

        function onSyncFriendAction(obj) {
          switch (obj.type) {
            case 'addFriend':
              // alert('你在其它端直接加了一个好友' + obj.account + ', 附言' + obj.ps);
              onUpdateFriend(null, obj.friend);
              break;
            case 'applyFriend':
              // alert('你在其它端申请加了一个好友' + obj.account + ', 附言' + obj.ps);
              break;
            case 'passFriendApply':
              alert('你在其它端通过了一个好友申请' + obj.account + ', 附言' + obj.ps);
              onUpdateFriend(null, obj.friend);
              break;
            case 'rejectFriendApply':
              // alert('你在其它端拒绝了一个好友申请' + obj.account + ', 附言' + obj.ps);
              break;
            case 'deleteFriend':
              // alert('你在其它端删了一个好友' + obj.account);
              onDeleteFriend(null, {
                account: obj.account
              });
              break;
            case 'updateFriend':
              // alert('你在其它端更新了一个好友', obj.friend);
              onUpdateFriend(null, obj.friend);
              break;
          }
        }

        // 更新好友昵称
        function updateFriend(friend) {
          var nim = IMState.nim
          nim.updateFriend({
            account: friend.account,
            alias: friend.alias,
            done: onUpdateFriend
          })
        }

        function addFriend(account) {
          var nim = IMState.nim
          nim.addFriend({
            account: account,
            ps: '',
            done: onUpdateFriend
          })
        }

        function deleteFriend(account) {
          var nim = IMState.nim
          nim.deleteFriend({
            account: account,
            done: onDeleteFriend
          })
        }


      }
    ])

})()