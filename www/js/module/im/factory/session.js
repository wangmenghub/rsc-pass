(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMSession', ['$rootScope', 'Storage', 'IMMutation', 'IMState', 'IMMsgs', 'IMSearch', 'IMPolyfill', 'IMWidgetUi',
      function ($rootScope, Storage, IMMutation, IMState, IMMsgs, IMSearch, IMPolyfill, IMWidgetUi) {
        return {
          onSessions: onSessions,
          onUpdateSession: onUpdateSession,
          deleteSession: deleteSession,
          setCurrSession: setCurrSession,
          resetCurrSession: resetCurrSession,
          delSameSess: delSameSess
        }

        // 如果会话对象不是好友，需要更新好友名片
        function updateSessionAccount(sessions) {
          var accountsNeedSearch = []
          // console.log(sessions)
          angular.forEach(sessions, function (item) {
            if (item.scene === 'p2p') {
              // 如果不存在缓存资料
              if (!IMState.userInfos[item.to]) {
                accountsNeedSearch.push(item.to)
                IMPolyfill.getNewInfo(item.to, item)
              }
            }
          })
          if (accountsNeedSearch.length > 0) {
            IMSearch.searchUsers({
              accounts: accountsNeedSearch
            })
          }
        }

        function onSessions(sessions) {
          updateSessionAccount(sessions)
          sessions = IMPolyfill.getRscInfo(sessions)
          IMMutation.updateSessions(sessions)
          console.log('>>>sessions', sessions)
          IMState.hasSessions = true
          Storage.set('hasSessions', IMState.hasSessions)
          IMWidgetUi.hideLoading()
          $rootScope.$emit('hideLoading')
        }

        function onUpdateSession(session) {
          if (IMState.currMsgId != session.lastMsg.idClient) {
            console.log('会话更新了', session)
            IMState.currMsgId = session.lastMsg.idClient
            var sessions = [session]
            var type = session.scene
            updateSessionAccount(sessions)
            IMMutation.updateSessions(sessions, type)
            if (!!IMState.currSessionId) {
              if (IMState.currSessionId == session.id && session.to == session.lastMsg.from && session.unread) {
                setTimeout(function () {
                  IMPolyfill.rscUnread(session.to, 1)
                }, 2000)
              }
            }
            var newArr = []
            angular.forEach(IMState.sessionlist, function(item){
              if(!item.companyInfo){
                newArr.push(item.to)
              }
            })
            if(!!newArr.length){
              IMPolyfill.getNewInfo(newArr, IMState.sessionlist)
            }
            $rootScope.$emit('updateMsg', { data: session })
          } else {

          }
        }

        function deleteSession(sessionId) {
          var nim = IMState.nim
          sessionId = sessionId || ''
          var scene = null
          var account = null
          if (/^p2p-/.test(sessionId)) {
            scene = 'p2p'
            account = sessionId.replace(/^p2p-/, '')
          } else if (/^team-/.test(sessionId)) {
            scene = 'team'
            account = sessionId.replace(/^team-/, '')
          }
          if (account && scene) {
            nim.deleteSession({
              scene: scene,
              to: account,
              done: function deleteServerSessionDone(error, obj) {
                if (error) {
                  alert(error)
                  return
                }
                nim.deleteLocalSession({
                  id: sessionId,
                  done: function deleteLocalSessionDone(error, obj) {
                    if (error) {
                      alert(error)
                      return
                    }
                    IMMutation.deleteSessions([sessionId])
                  }
                })
              }
            })
          }
        }

        function setCurrSession(sessionId) {
          var nim = IMState.nim
          if (sessionId) {
            IMMutation.updateCurrSessionId({
              type: 'init',
              sessionId: sessionId
            })
            if (nim) {
              // 如果在聊天页面刷新，此时还没有nim实例，需要在onSessions里同步
              nim.setCurrSession(sessionId)
              IMMutation.updateCurrSessionMsgs({
                type: 'init',
                sessionId: sessionId
              })
              // 发送已读回执
              IMMsgs.sendMsgReceipt()
            }
          }
        }

        function resetCurrSession() {
          var nim = IMState.nim
          nim.resetCurrSession()
          IMMutation.updateCurrSessionMsgs({
            type: 'destroy'
          })
        }

        function delSameSess(arr) {
          if (arr.length > 1) {
            var last = arr.length - 1
            if (arr[last].idClient == arr[last - 1].idClient) {
              arr.pop()
            }
          }
        }

      }
    ])

})()
