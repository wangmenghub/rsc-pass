(function () {
  'use strict'

  angular.module('rsc.im.config')
    .value('IMState', {
      // 正在加载中
      isLoading: true,
      // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
      isRefresh: true,
      // 全屏显示的原图
      isFullscreenImgShow: false,
      fullscreenImgSrc: '',
      // 切页动画 forward，backward
      transitionName: 'forward',
      // IM相关
      nim: null, // NIM SDK 实例
      userUID: null, // 登录账户ID
      avatar: null,
      sdktoken: null,
      myInfo: {}, // 用户名片
      userInfos: {}, // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
      userSubscribes: {}, // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
      friendslist: [], // 好友列表
      robotslist: [], // 机器人列表
      robotInfos: {}, // 用于判定帐号是否是robots
      robotInfosByNick: {},
      blacklist: [], // 黑名单列表
      mutelist: [], // 禁言列表

      teamSessionlist: [], //群会话列表
      hasTeam: false,
      team: [], // 群信息
      teamPerson: [], // 群成员列表个人信息
      teamlist: [], // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
      teamAttrs: {}, // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
      teamMembers: {},
      teamMap: {},
      teamMemberDone: false,
      // 消息列表
      msgs: {}, // 以sessionId作为key
      msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
      currMsgId: null,
      sessionlist: [], // 会话列表
      sessionMap: {},
      hasSessions: false,
      currSessionId: null, // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
      currSessionMsgs: [],
      noMoreHistoryMsgs: false, // 是否有更多历史消息，用于上拉加载更多
      continueRobotAccid: '', // 继续对话的机器人id
      // 系统消息
      sysMsgs: [],
      customSysMsgs: [],
      sysMsgUnread: {
        total: 0
      },
      customSysMsgUnread: 0,
      // 临时变量
      searchedUsers: [], // 缓存需要获取的用户信息账号,如searchUser
      searchedTeams: [], // 缓存需要获取的群组账号
      // 聊天室相关
      chatroomInsts: {}, // 聊天室sdk实例
      chatroomInfos: {},
      chatroomMsgs: {}, // 聊天室分房间消息集合
      currChatroom: null, // 当前聊天室实例及id
      currChatroomId: null,
      currChatroomMsgs: [],
      currChatroomInfo: {},
      currChatroomMembers: [], // 聊天室成员列表
    })

})()