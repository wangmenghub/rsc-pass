(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMSearch', ['IMMutation', 'IMState', 'IMUserInfo',
      function (IMMutation, IMState, IMUserInfo) {
        return {
          resetSearchResult: resetSearchResult,
          searchUsers: searchUsers
        }

        function resetSearchResult() {
          IMMutation.updateSearchlist({
            type: 'user',
            list: []
          })
          IMMutation.updateSearchlist({
            type: 'team',
            list: []
          })
        }

        function searchUsers(obj) {
          var accounts = obj.accounts
          var done = obj.done
          var nim = IMState.nim
          if (!Array.isArray(accounts)) {
            accounts = [accounts]
          }
          nim.getUsers({
            accounts: accounts,
            done: function searchUsersDone(error, users) {
              if (error) {
                alert(error)
                return
              }
              IMMutation.updateSearchlist({
                type: 'user',
                list: users
              })
              var updateUsers = []
              angular.forEach(users, function (item) {
                var account = item.account
                if (item.account !== IMState.userUID) {
                  // var userInfo = IMState.userInfos[account] || {}
                  // if (!userInfo.isFriend) {
                    updateUsers.push(item)
                  // }
                }
              })

              angular.forEach(updateUsers, function (item) {
                item = IMUserInfo.formatUserInfo(item)
              })

              IMMutation.updateUserInfo(updateUsers)
              if (done instanceof Function) {
                done(users)
              }
            }
          })
        }

      }
    ])

})()