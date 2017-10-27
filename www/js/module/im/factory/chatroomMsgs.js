(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMChatRoomMsgs', ['IMState', 'IMMutation', 'IMWidgetUi', 'IMENV',
      function (IMState, IMMutation, IMWidgetUi, IMENV) {
        return {
          onChatroomMsgs: onChatroomMsgs,
          sendChatroomMsg: sendChatroomMsg,
          sendChatroomFileMsg: sendChatroomFileMsg,
          getChatroomHistoryMsgs: getChatroomHistoryMsgs
        }

        function onChatroomMsgs(msgs) {
          if (!Array.isArray(msgs)) {
            msgs = [msgs]
          }
          if (IMState.currChatroomId) {
            IMMutation.updateCurrChatroomMsgs({
              type: 'put',
              msgs: 'msgs'
            })
          }
        }

        function onSendMsgDone(error, msg) {
          IMWidgetUi.hideLoading()
          if (error) {
            alert(error.message)
            return
          }
          onChatroomMsgs([msg])
        }

        function sendChatroomMsg(obj) {
          var chatroom = IMState.currChatroom
          obj = obj || {}
          var type = obj.type || ''
          switch (type) {
            case 'text':
              chatroom.sendText({
                text: obj.text,
                done: onSendMsgDone
              })
              break
            case 'custom':
              chatroom.sendCustomMsg({
                content: JSON.stringify(obj.content),
                pushContent: obj.pushContent,
                done: onSendMsgDone
              })
          }
        }

        function sendChatroomFileMsg(obj) {
          var chatroom = IMState.currChatroom
          var fileInput = Object.assign({}, obj).fileInput
          var type = 'file'
          if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
            type = 'image'
          } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
            type = 'video'
          }
          chatroom.sendFile({
            type: type,
            fileInput: fileInput,
            uploadprogress: function (data) {
              // console.log(data.percentageText)
            },
            uploaderror: function () {
              console && console.log('上传失败')
            },
            uploaddone: function (error, file) {
              // console.log(error);
              // console.log(file);
            },
            beforesend: function (msg) {
              // console && console.log('正在发送消息, id=', msg);
            },
            done: function (error, msg) {
              onSendMsgDone(error, msg)
            }
          })
        }

        function getChatroomHistoryMsgs(obj) {
          var chatroom = IMState.currChatroom
          if (chatroom) {
            var timetag = Object.assign({}, obj).timetag
            var options = {
              timetag: timetag,
              limit: IMENV.config.localMsglimit || 20,
              done: function getChatroomHistoryMsgsDone(error, obj) {
                if (obj.msgs) {
                  if (obj.msgs.length === 0) {
                    IMMutation.setNoMoreHistoryMsgs()
                  } else {
                    IMMutation.updateCurrChatroomMsgs({
                      type: 'concat',
                      msgs: obj.msgs
                    })
                  }
                }
                IMWidgetUi.hideLoading()
              }
            }
            IMState.nim.getHistoryMsgs(options)
          }
        }


      }
    ])

})()