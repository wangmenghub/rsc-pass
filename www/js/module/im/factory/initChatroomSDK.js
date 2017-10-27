(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMInitChatroomSDK', ['IMState', 'IMMutation', 'IMWidgetUi', 'IMENV', 'IMSearch',
      function (IMState, IMMutation, IMWidgetUi, IMENV, IMSearch) {
        return {
          initChatroomSDK: initChatroomSDK,
          resetChatroomSDK: resetChatroomSDK
        }

        function initChatroomSDK(obj) {
          angular.forEach(obj, function (value, key) {
            if (key == 'chatroomId') {
              var chatroomId = value
            } else if (key == 'address') {
              var address = value
            }
          })
          if (chatroomId && address) {
            if (IMState.chatroomInsts[chatroomId]) {
              IMState.chatroomInsts[chatroomId].connect()
            } else {
              IMState.chatroomInsts[chatroomId] = NIM.Chatroom.getInstance({
                appKey: IMENV.config.appkey,
                account: IMState.userUID,
                token: IMState.sdktoken,
                chatroomId: chatroomId,
                chatroomAddresses: address,
                onconnect: function onChatroomConnect(chatroom) {
                  IMWidgetUi.hideLoading()
                  IMMutation.setCurrChatroom(chatroomId)
                },
                onerror: function onChatroomError(error, obj) {
                  IMWidgetUi.hideLoading()
                  if (error) {
                    alert('网络连接状态异常')
                    location.href = IMENV.config.route
                  }
                },
                onwillreconnect: function onChatroomWillReconnect(obj) {
                  // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
                  console.log('即将重连', obj)
                },
                ondisconnect: function onChatroomDisconnect(error) {
                  // 此时说明 `SDK` 处于断开状态, 切换聊天室也会触发次回调
                  IMWidgetUi.hideLoading()
                  if (error) {
                    switch (error.code) {
                      // 账号或者密码错误, 请跳转到登录页面并提示错误
                      case 302:
                        // 此逻辑与nim sdk错误逻辑相同，复用nim sdk的
                        // 如果单用聊天室功能需要在此做处理
                        break;
                      case 13003:
                        alert('抱歉，你已被主播拉入了黑名单')
                        location.href = IMENV.config.route
                        break
                      // 被踢, 请提示错误后跳转到登录页面
                      case 'kicked':
                        if (error.reason === 'managerKick') {
                          alert('你已被管理员移出聊天室')
                          location.href = IMENV.config.route
                        } else if (error.reason === 'blacked') {
                          alert('你已被管理员拉入黑名单，不能再进入')
                          location.href = IMENV.config.route
                        }
                        break;
                      default:
                        console.log(error.message);
                        break
                    }
                  }
                },
                // 聊天室消息
                onmsgs: onChatroomMsgs
              })
            }
          } else {
            alert('没有聊天室地址')
          }
        }

        function resetChatroomSDK(chatroomId) {
          if (chatroomId) {
            IMState.chatroomInsts[chatroomId].disconnect()
          } else {
            for (var tempRoomId in IMState.chatroomInsts) {
              IMState.chatroomInsts[tempRoomId].disconnect()
            }
          }
          IMMutation.resetCurrChatroom()
        }

      }
    ])

})()
