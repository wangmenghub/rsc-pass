(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMMsgs', ['IMState', 'IMMutation', 'IMUtils', 'IMWidgetUi', 'IMENV',
      function (IMState, IMMutation, IMUtils, IMWidgetUi, IMENV) {
        return {
          onRoamingMsgs: onRoamingMsgs,
          onOfflineMsgs: onOfflineMsgs,
          onMsg: onMsg,
          onRevocateMsg: onRevocateMsg,
          revocateMsg: revocateMsg,
          sendMsg: sendMsg,
          sendFileMsg: sendFileMsg,
          sendRobotMsg: sendRobotMsg,
          sendMsgReceipt: sendMsgReceipt,
          getHistoryMsgs: getHistoryMsgs,
          resetNoMoreHistoryMsgs: resetNoMoreHistoryMsgs,
          continueRobotMsg: continueRobotMsg
        }

        function formatMsg(msg) {
          var nim = IMState.nim
          if (msg.type === 'robot') {
            if (msg.content && msg.content.flag === 'bot') {
              if (msg.content.message) {
                angular.forEach(msg.content.message, function (item) {
                  switch (item.type) {
                    case 'template':
                      item.content = nim.parseRobotTemplate(item.content)
                      break
                    case 'text':
                    case 'image':
                    case 'answer':
                      break
                  }
                })
              }
            }
          }
          return msg
        }

        function onRoamingMsgs(obj) {
          var msgs = obj.msgs
          angular.forEach(msgs, function (msg) {
            msg = formatMsg(msg)
          })
          IMMutation.updateMsgs(msgs)
        }

        function onOfflineMsgs(obj) {
          var msgs = obj.msgs
          angular.forEach(msgs, function (msg) {
            msg = formatMsg(msg)
          })
          IMMutation.updateMsgs(msgs)
        }

        function onMsg(msg) {
          var msg = formatMsg(msg)
          IMMutation.putMsg(msg)
          if (msg.sessionId === IMState.currSessionId) {
            IMMutation.updateCurrSessionMsgs({
              type: 'put',
              msg: msg
            })
            // 发送已读回执
            sendMsgReceipt()
          }
        }

        function onSendMsgDone(error, msg) {
          IMWidgetUi.hideLoading()
          if (error) {
            // 被拉黑
            if (error.code === 7101) {
              msg.status = 'success'
              alert(error.message)
            } else {
              alert(error.message)
            }
          }
          onMsg(msg)
        }

        // 消息撤回
        function onRevocateMsg(error, msg) {
          var nim = IMState.nim
          if (error) {
            if (error.code === 508) {
              alert('发送时间超过2分钟的消息，不能被撤回')
            } else {
              alert(error)
            }
            return
          }
          var tip = ''
          if (msg.from === IMState.userUID) {
            tip = '你撤回了一条消息'
          } else {
            var userInfo = IMState.userInfos[msg.from]
            if (userInfo) {
              tip = IMUtils.getFriendAlias(userInfo) + '撤回了一条消息'
            } else {
              tip = '对方撤回了一条消息'
            }
          }
          nim.sendTipMsg({
            isLocal: true,
            scene: msg.scene,
            to: msg.to,
            tip: tip,
            time: msg.time,
            done: function sendTipMsgDone(error, tipMsg) {
              var idClient = msg.deletedIdClient || msg.idClient
              IMMutation.replaceMsg({
                sessionId: msg.sessionId,
                idClient: idClient,
                msg: tipMsg
              })
              if (msg.sessionId === store.state.currSessionId) {
                IMMutation.updateCurrSessionMsgs({
                  type: 'replace',
                  idClient: idClient,
                  msg: tipMsg
                })
              }
            }
          })
        }

        function revocateMsg(msg) {
          var nim = IMState.nim
          var idClient = msg.idClient
          msg = Object.assign(msg, IMState.msgsMap[idClient])
          nim.deleteMsg({
            msg: msg,
            done: function deleteMsgDone(error) {
              onRevocateMsg(error, msg)
            }
          })
        }

        // 发送普通消息
        function sendMsg(obj) {
          var nim = IMState.nim
          obj = obj || {}
          var type = obj.type || ''
          IMWidgetUi.showLoading()
          switch (type) {
            case 'text':
              nim.sendText({
                scene: obj.scene,
                to: obj.to,
                text: obj.text,
                done: onSendMsgDone
              })
              break
            case 'custom':
              nim.sendCustomMsg({
                scene: obj.scene,
                to: obj.to,
                pushContent: obj.pushContent,
                content: JSON.stringify(obj.content),
                done: onSendMsgDone
              })
          }
        }

        // 发送文件消息
        function sendFileMsg(obj) {
          var nim = IMState.nim
          var scene = obj.scene
          var to = obj.to
          var fileInput = obj.fileInput
          var type = 'file'
          if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
            type = 'image'
          } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
            type = 'video'
          }
          IMWidgetUi.showLoading()
          nim.sendFile({
            scene: scene,
            to: to,
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

        // 发送机器人消息
        function sendRobotMsg(obj) {
          var nim = IMState.nim
          var type = obj.type
          var scene = obj.scene
          var to = obj.to
          var robotAccid = obj.robotAccid
          var content = obj.content
          var params = obj.params
          var target = obj.target
          var body = obj.body
          scene = scene || 'p2p'
          if (type === 'text') {
            nim.sendRobotMsg({
              scene: scene,
              to: to,
              robotAccid: robotAccid || to,
              content: {
                type: 'text',
                content: content,
              },
              body: body,
              done: onSendMsgDone
            })
          } else if (type === 'welcome') {
            nim.sendRobotMsg({
              scene: scene,
              to: scene,
              robotAccid: robotAccid || to,
              content: {
                type: 'welcome',
              },
              body: body,
              done: onSendMsgDone
            })
          } else if (type === 'link') {
            nim.sendRobotMsg({
              scene: scene,
              to: to,
              robotAccid: robotAccid || to,
              content: {
                type: 'link',
                params: params,
                target: target
              },
              body: body,
              done: onSendMsgDone
            })
          }
        }

        // 发送消息已读回执
        function sendMsgReceipt() {
          // 如果有当前会话
          var currSessionId = IMState.currSessionId
          if (currSessionId) {
            // 只有点对点消息才发已读回执
            if (IMUtils.parseSession(currSessionId).scene === 'p2p') {
              var msgs = IMState.currSessionMsgs
              var nim = IMState.nim
              if (IMState.sessionMap[currSessionId]) {
                nim.sendMsgReceipt({
                  msg: IMState.sessionMap[currSessionId].lastMsg,
                  done: function sendMsgReceiptDone(error, obj) {
                    console.log(obj)
                  }
                })
              }
            }
          }
        }

        function sendMsgReceiptDone(error, obj) {
          console.log('发送消息已读回执' + (!error ? '成功' : '失败'), error, obj);
        }

        function getHistoryMsgs(obj) {
          var nim = IMState.nim
          if (nim) {
            var scene = obj.scene
            var to = obj.to
            var options = {
              scene: scene,
              to: to,
              reverse: false,
              asc: true,
              limit: IMENV.config.localMsglimit || 20,
              done: function getHistoryMsgsDone(error, obj) {
                if (obj.msgs) {
                  if (obj.msgs.length === 0) {
                    IMMutation.setNoMoreHistoryMsgs()
                  } else {
                    var msgs = obj.msgs
                    angular.forEach(msgs, function (msg) {
                      msg = formatMsg(msg)
                    })
                    IMMutation.updateCurrSessionMsgs({
                      type: 'concat',
                      msgs: msgs
                    })
                  }
                }
                IMWidgetUi.hideLoading()
              }
            }
            if (IMState.currSessionLastMsg) {
              options = Object.assign(options, {
                lastMsgId: IMState.currSessionLastMsg.idServer,
                endTime: IMState.currSessionLastMsg.time,
              })
            }
            IMWidgetUi.showLoading()
            nim.getHistoryMsgs(options)
          }
        }

        function resetNoMoreHistoryMsgs() {
          IMMutation.resetNoMoreHistoryMsgs()
        }

        // 继续与机器人会话交互
        function continueRobotMsg(robotAccid) {
          IMMutation.continueRobotMsg(robotAccid)
        }

      }
    ])

})()
