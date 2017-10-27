(function () {
  'use strict'

  angular.module('rsc.im.factory', [])
    .factory('IMFactory', ['$state', '$log', 'IMState', 'IMMutation', 'IMENV', 'Storage', 'IMBlacks', 'IMChatRoomInfos', 'IMChatRoomMsgs', 'IMTeam', 'IMPolyfill',
      'IMFriends', 'IMPageUtil', 'IMInitChatroomSDK', 'IMInitNimSDK', 'IMMsgs', 'IMSearch', 'IMSession', 'IMSysMsgs', 'IMWidgetUi',
      function ($state, $log, IMState, IMMutation, IMENV, Storage, IMBlacks, IMChatRoomInfos, IMChatRoomMsgs, IMTeam, IMPolyfill,
        IMFriends, IMPageUtil, IMInitChatroomSDK, IMInitNimSDK, IMMsgs, IMSearch, IMSession, IMSysMsgs, IMWidgetUi) {

        return {
          updateRefreshState: IMMutation.updateRefreshState,
          // UI 及页面状态变更
          showLoading: IMWidgetUi.showLoading,
          hideLoading: IMWidgetUi.hideLoading,
          showFullscreenImg: IMWidgetUi.showFullscreenImg,
          hideFullscreenImg: IMWidgetUi.hideFullscreenImg,
          continueRobotMsg: IMMsgs.continueRobotMsg,
          // 初始化
          connect: connect,
          logout: logout,
          reload: reload,
          initNimSDK: IMInitNimSDK.initNimSDK, // 初始化 重新连接SDK
          resetSearchResult: IMSearch.resetSearchResult, // 清空所有搜索历史纪录
          searchUsers: IMSearch.searchUsers, // 搜索用户信息
          updateBlack: IMBlacks.updateBlack, // 更新黑名单
          addFriend: IMFriends.addFriend, // 更新好友
          deleteFriend: IMFriends.deleteFriend,
          updateFriend: IMFriends.updateFriend,
          // 会话
          deleteSession: IMSession.deleteSession, // 删除会话
          setCurrSession: IMSession.setCurrSession,  // 设置当前会话
          resetCurrSession: IMSession.resetCurrSession,  // 重置当前会话
          delSameSess: IMSession.delSameSess,
          // 消息
          sendMsg: IMMsgs.sendMsg,  // 发送消息
          sendFileMsg: IMMsgs.sendFileMsg,
          sendRobotMsg: IMMsgs.sendRobotMsg,
          sendMsgReceipt: IMMsgs.sendMsgReceipt, // 发送消息已读回执
          revocateMsg: IMMsgs.revocateMsg, // 消息撤回
          getHistoryMsgs: IMMsgs.getHistoryMsgs,
          resetNoMoreHistoryMsgs: IMMsgs.resetNoMoreHistoryMsgs, // 重置历史消息状态
          markSysMsgRead: IMSysMsgs.markSysMsgRead, // 标记系统消息已读
          markCustomSysMsgRead: IMSysMsgs.markCustomSysMsgRead,
          resetSysMsgs: IMSysMsgs.resetSysMsgs,
          getTeam: IMTeam.getTeam,
          getTeamSession: IMTeam.getTeamSession,
          // 聊天室
          initChatroomSDK: IMInitChatroomSDK.initChatroomSDK,
          initChatroomInfos: IMChatRoomInfos.initChatroomInfos,
          resetChatroomSDK: IMInitChatroomSDK.resetChatroomSDK,
          sendChatroomMsg: IMChatRoomMsgs.sendChatroomMsg,
          sendChatroomFileMsg: IMChatRoomMsgs.sendChatroomFileMsg,
          getChatroomHistoryMsgs: IMChatRoomMsgs.getChatroomHistoryMsgs,
          getChatroomInfo: IMChatRoomInfos.getChatroomInfo,
          getChatroomMembers: IMChatRoomInfos.getChatroomMembers,
          clearChatroomMembers: IMChatRoomInfos.clearChatroomMembers,
          // 联系人
          getContact: IMPolyfill.getContact,
          contact4IM: IMPolyfill.contact4IM
        }

        function connectNim(obj) {
          var force = Object.assign({}, obj).force
          // 操作为内容页刷新页面，此时无nim实例
          if (!IMState.nim || force) {
            if (IMState.userUID && IMState.sdktoken) {
              var loginInfo = {
                uid: IMState.userUID,
                sdktoken: IMState.sdktoken
              }
            } else {
              var loginInfo = {
                uid: Storage.get('userInfo').user._id,
                sdktoken: 'a11111'
              }
            }
            if (window.cordova && cordova.plugins.yimPlugin) {
              if (ionic.Platform.isIOS()) {
                cordova.plugins.yimPlugin.init(IMENV.config.appkey, function (success) {
                  $log.debug('云信初始化', success);
                }, function (error) {
                  $log.debug("云信初始化失败", error)
                });
              }
              cordova.plugins.yimPlugin.login(loginInfo.uid, loginInfo.sdktoken,
                function (success) {
                  $log.debug("云信用户登录成功", success)
                },
                function (error) {
                  $log.error("云信用户登录失败", error);
                });
            }

            if (!loginInfo.uid) {
              // 无id直接跳转登录页
              IMPageUtil.turnPage('自动登录失效，请重新登录', 'login')
            } else {
              // 有id重新登录
              console.log('IM初始化')
              IMState.avatar = Storage.get('userInfo').user.photo_url
              IMInitNimSDK.initNimSDK(loginInfo)
              // 请求群信息
              var id = Storage.get('userInfo').user.company_id
              IMPolyfill.getCompanyTeam(id)

            }
          }
        }

        function connectChatroom(obj) {
          var chatroomId = Object.assign({}, obj).chatroomId
          var nim = IMState.nim
          if (nim) {
            IMWidgetUi.showLoading()
            nim.getChatroomAddress({
              chatroomId: chatroomId,
              done: function getChatroomAddressDone(error, obj) {
                if (error) {
                  console.log(error)
                  $state.go(IMENV.config.loginUrl)
                  return
                }
                if (!IMState.avatar) {
                  IMState.avatar = Storage.get('userInfo').user.photo_url
                }
                IMInitChatroomSDK.initChatroomSDK(obj)
              }
            })
          }
        }

        // 连接sdk请求，false表示强制重连
        function connect(obj) {
          reset()
          IMState.userUID = obj.uid
          IMState.sdktoken = obj.sdktoken
          var type = Object.assign({}, obj).type
          // type 可为 nim chatroom
          type = type || 'nim'
          switch (type) {
            case 'nim':
              connectNim(obj)
              break
            case 'chatroom':
              connectChatroom(obj)
              break
            case 'both':
              connectNim(obj)
              connectChatroom(obj)
              break
          }
        }

        function reset() {
          if (IMState.nim) {
            IMState.nim.disconnect()
          }
          // 正在加载中
          IMState.isLoading = true
          // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
          IMState.isRefresh = true
          // 全屏显示的原图
          IMState.isFullscreenImgShow = false
          IMState.fullscreenImgSrc = ''
          // 切页动画 forward，backward
          IMState.transitionName = 'forward'
          // IM相关
          IMState.nim = null // NIM SDK 实例
          IMState.userUID = null // 登录账户ID
          IMState.avatar = null
          IMState.sdktoken = null
          IMState.myInfo = {} // 用户名片
          IMState.userInfos = {} // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
          IMState.userSubscribes = {} // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
          IMState.friendslist = [] // 好友列表
          IMState.robotslist = [] // 机器人列表
          IMState.robotInfos = {} // 用于判定帐号是否是robots
          IMState.robotInfosByNick = {}
          IMState.blacklist = [] // 黑名单列表
          IMState.mutelist = [] // 禁言列表
          IMState.teamSessionlist = []
          IMState.team = [] // 群成员列表信息
          IMState.teamPerson = [] // 群成员列表个人信息
          IMState.teamlist = [] // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
          IMState.teamAttrs = {} // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
          IMState.teamMembers = {}
          IMState.teamMap = {}
          IMState.teamMemberDone = false
          // 消息列表
          IMState.msgs = {} // 以sessionId作为key
          IMState.msgsMap = {} // 以idClient作为key，诸如消息撤回等的消息查找
          IMState.currMsgId = null
          IMState.sessionlist = [] // 会话列表
          IMState.sessionMap = {}
          IMState.currSessionId = null // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
          IMState.currSessionMsgs = []
          IMState.noMoreHistoryMsgs = false // 是否有更多历史消息，用于上拉加载更多
          IMState.continueRobotAccid = '' // 继续对话的机器人id
          // 系统消息
          IMState.sysMsgs = []
          IMState.customSysMsgs = []
          IMState.sysMsgUnread = {
            total: 0
          }
          IMState.customSysMsgUnread = 0
          // 临时变量
          IMState.searchedUsers = [] // 缓存需要获取的用户信息账号,如searchUser
          IMState.searchedTeams = [] // 缓存需要获取的群组账号
          // 聊天室相关
          IMState.chatroomInsts = {} // 聊天室sdk实例
          IMState.chatroomInfos = {}
          IMState.chatroomMsgs = {} // 聊天室分房间消息集合
          IMState.currChatroom = null // 当前聊天室实例及id
          IMState.currChatroomId = null
          IMState.currChatroomMsgs = []
          IMState.currChatroomInfo = {}
          IMState.currChatroomMembers = [] // 聊天室成员列表

        }

        // 用户触发的登出逻辑
        function logout() {
          if (IMState.nim) {
            IMState.nim.disconnect()
          }
          connect({
            type: 'nim',
            force: true,
            uid: '59ccc81ee8d6a33f30ba3076',
            sdktoken: 'a11111',
          })
        }

        function reload(obj) {
          logout()
          connect(obj)
        }
      }
    ])


})()