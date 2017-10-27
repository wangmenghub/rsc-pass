(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMChatRoomInfos', ['IMState', 'IMMutation',
      function (IMState, IMMutation) {
        return {
          initChatroomInfos: initChatroomInfos,
          getChatroomInfo: getChatroomInfo,
          getChatroomMembers: getChatroomMembers,
          clearChatroomMembers: clearChatroomMembers
        }

        function initChatroomInfos(obj) {
          IMMutation.initChatroomInfos(obj)
        }

        function getChatroomInfo() {
          var chatroom = IMState.currChatroom
          if (chatroom) {
            chatroom.getChatroom({
              done: function getChatroomDone(error, info) {
                if (error) {
                  alert(error.message)
                  return
                }
                info = info.chatroom || { creator: '' }
                var creator = info.creator
                chatroom.getChatroomMembersInfo({
                  accounts: [creator],
                  done: function getChatroomMembersInfoDone(error, user) {
                    if (error) {
                      alert(error.message)
                      return
                    }
                    IMMutation.getChatroomInfo(Object.assign(info, { actor: user.members[0] }))
                  }
                })
              }
            })
          }
        }

        function getChatroomMembers() {
          // 先拉管理员
          getChatroomMembersLocal(false, function (obj) {
            IMMutation.updateChatroomMembers(Object.assign(obj, { type: 'put' }))
            // 再拉成员列表
            getChatroomMembersLocal(true, function (obj) {
              IMMutation.updateChatroomMembers(Object.assign(obj, { type: 'put' }))
            })
          })
        }

        function getChatroomMembersLocal(isGuest, callback) {
          var chatroom = IMState.currChatroom
          if (chatroom) {
            chatroom.getChatroomMembers({
              guest: isGuest,
              limit: 100,
              done: function getChatroomMembersDone(error, obj) {
                if (error) {
                  alert(error.message)
                  return
                }
                callback(obj)
              }
            })
          }
        }

        function clearChatroomMembers() {
          IMMutation.updateChatroomMembers({ type: 'destroy' })
        }




      }
    ])
})()