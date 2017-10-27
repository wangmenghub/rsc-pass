(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMInitNimSDK', ['IMState', 'IMMutation', 'IMWidgetUi', 'IMENV', 'IMSearch', 'IMBlacks', 'IMFriends', 'IMRobots', 'IMUserInfo', 'IMTeam', 'IMSession', 'IMMsgs', 'IMSysMsgs', 'IMPageUtil', 'IMUtils',
      function (IMState, IMMutation, IMWidgetUi, IMENV, IMSearch, IMBlacks, IMFriends, IMRobots, IMUserInfo, IMTeam, IMSession, IMMsgs, IMSysMsgs, IMPageUtil, IMUtils) {
        return {
          initNimSDK: initNimSDK
        }

        function initNimSDK(loginInfo) {
          if (IMState.nim) {
            IMState.nim.disconnect()
          }
          IMWidgetUi.showLoading()
          // 初始化SDK
          window.nim = IMState.nim = NIM.getInstance({
            // debug: true && { api: 'info', style: 'font-size:12px;color:blue;background-color:rgba(0,0,0,0.1)' },
            appKey: IMENV.config.appkey,
            account: loginInfo.uid,
            token: loginInfo.sdktoken,
            db: false,
            syncSessionUnread: true,
            syncRobots: true,
            autoMarkRead: true, // 默认为true
            syncRoamingMsgs: true,
            isRoamingable: true,

            onconnect: function onConnect(event) {
              console.log('连接成功');
              if (loginInfo) {
                // 连接上以后更新uid
                IMMutation.updateUserUID(loginInfo)
              }
            },
            onerror: function onError(event) {
              // alert(JSON.stringify(event))
              IMState.teamMemberDone = false;
              IMPageUtil.turnPage('网络连接状态异常', 'login')
            },
            onwillreconnect: function onWillReconnect(event) {
              console.log(event)
            },
            ondisconnect: function onDisconnect(error) {
              switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                  IMPageUtil.turnPage('帐号或密码错误', 'login')
                  break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                  var map = {
                    PC: '电脑版',
                    Web: '网页版',
                    Android: '手机版',
                    iOS: '手机版',
                    WindowsPhone: '手机版'
                  }
                  var str = error.from
                  var errorMsg = '你的帐号于' + IMUtils.formatDate(new Date()) + '被' + (map[str] || '其他端') + '踢出下线，请确定帐号信息安全!'
                  IMPageUtil.turnPage(errorMsg, 'login')
                  break
                default:
                  break
              }
            },
            // 多端登录
            onloginportschange: function onLoginPortsChange(loginPorts) {
              console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
            },
            // 用户关系及好友关系
            onblacklist: IMBlacks.onBlacklist,
            onsyncmarkinblacklist: IMBlacks.onMarkInBlacklist,
            // onmutelist: onMutelist,
            // onsyncmarkinmutelist: onMarkInMutelist,
            onfriends: IMFriends.onFriends,
            onsyncfriendaction: IMFriends.onSyncFriendAction,
            // 机器人
            onrobots: IMRobots.onRobots,
            // 用户名片 - actions/userInfo
            onmyinfo: IMUserInfo.onMyInfo,
            onupdatemyinfo: IMUserInfo.onMyInfo,
            onusers: IMUserInfo.onUserInfo,
            onupdateuser: IMUserInfo.onUserInfo,
            // // 群组
            onteams: IMTeam.onTeams,
            // onsynccreateteam: IMTeam.onCreateTeam,
            onteammembers: IMTeam.onTeamMembers,
            onsyncteammembersdone: IMTeam.onSyncTeamMembersDone,
            // onupdateteammember: IMTeam.onUpdateTeamMember,
            // // 会话
            onsessions: IMSession.onSessions,
            onupdatesession: IMSession.onUpdateSession,
            // // 消息
            onroamingmsgs: IMMsgs.onRoamingMsgs,
            onofflinemsgs: IMMsgs.onOfflineMsgs,
            onmsg: IMMsgs.onMsg,
            // // 系统通知
            onsysmsg: IMSysMsgs.onSysMsg,
            onofflinesysmsgs: IMSysMsgs.onSysMsgs,
            onupdatesysmsg: IMSysMsgs.onSysMsg, // 通过、拒绝好友申请会收到此回调

            onsysmsgunread: IMSysMsgs.onSysMsgUnread,
            onupdatesysmsgunread: IMSysMsgs.onSysMsgUnread,

            onofflinecustomsysmsgs: IMSysMsgs.onCustomSysMsgs,
            oncustomsysmsg: IMSysMsgs.onCustomSysMsgs,
            // 同步完成
            onsyncdone: function onSyncDone() {
              IMWidgetUi.hideLoading()
              // 说明在聊天列表页
              if (IMState.currSessionId) {
                IMSession.setCurrSession(IMState.currSessionId)
              }
            }
          })
          
        }

      }
    ])

})()