(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMSysMsgs', ['IMMutation', 'IMState', 'IMMsgs',
      function (IMMutation, IMState, IMMsgs) {
        return {
          onSysMsgs: onSysMsgs,
          onSysMsg: onSysMsg,
          onSysMsgUnread: onSysMsgUnread,
          onCustomSysMsgs: onCustomSysMsgs,
          markSysMsgRead: markSysMsgRead,
          markCustomSysMsgRead: markCustomSysMsgRead,
          resetSysMsgs: resetSysMsgs
        }

        function onSysMsgs(sysMsgs) {
          IMMutation.updateSysMsgs(sysMsgs)
        }

        function onSysMsg(sysMsg) {
          switch (sysMsg.type) {
            // 在其他端添加或删除好友
            case 'addFriend':
              onUpdateFriend(null, {
                account: sysMsg.from
              })
              IMMutation.updateSysMsgs([sysMsg])
              break
            case 'deleteFriend':
              onDeleteFriend(null, {
                account: sysMsg.from
              })
              break
            // 对方消息撤回
            case 'deleteMsg':
              sysMsg.sessionId = sysMsg.scene + '-' + sysMsg.from
              onRevocateMsg(null, sysMsg)
              break
          }
        }

        function onSysMsgUnread(obj) {
          IMMutation.updateSysMsgUnread(obj)
        }

        function onCustomSysMsgs(customSysMsgs) {
          console.log(customSysMsgs)
          if (!Array.isArray(customSysMsgs)) {
            customSysMsgs = [customSysMsgs]
          }

          var tmp = []
          angular.forEach(customSysMsgs, function (msg) {
            if (msg.type === 'custom') {
              if (msg.content) {
                try {
                  var content = JSON.parse(msg.content)
                  // 消息正在输入中
                  if ((content.id + '') !== '1') {
                    tmp.push(msg)
                  }
                } catch (e) { }
              } else {
                tmp.push(msg)
              }
            } else {
              tmp.push(msg)
            }
          })
          if (tmp.length > 0) {
            IMMutation.updateCustomSysMsgs(tmp)
          }
        }

        // 不传obj则全部重置
        function markSysMsgRead(obj) {
          var nim = IMState.nim
          var sysMsgs = []
          if (obj && obj.sysMsgs) {
            sysMsgs = obj.sysMsgs
          } else {
            sysMsgs = IMState.sysMsgs
          }
          if (Array.isArray(sysMsgs) && sysMsgs.length > 0) {
            nim.markSysMsgRead({
              sysMsgs: sysMsgs,
              done: function (error, obj) {
              }
            })
          }
        }

        function markCustomSysMsgRead() {
          IMMutation.updateCustomSysMsgUnread({
            type: 'reset'
          })
        }

        function resetSysMsgs(obj) {
          IMMutation.resetSysMsgs(obj)
        }

      }

    ])

})()