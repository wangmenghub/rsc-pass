(function () {
  'use strict'

  angular.module('rsc.im.service', [])
    .factory('IMMutation', ['IMState', 'IMENV', 'IMUtils',
      function (IMState, IMENV, IMUtils) {
        return {

          updateRefreshState: updateRefreshState,
          updateLoading: updateLoading,
          updateFullscreenImage: updateFullscreenImage,
          updateUserUID: updateUserUID,
          updateMyInfo: updateMyInfo,
          updateUserInfo: updateUserInfo,
          updateFriends: updateFriends,
          updateRobots: updateRobots,
          updateBlacklist: updateBlacklist,
          updateSearchlist: updateSearchlist,
          updateSessions: updateSessions,
          deleteSessions: deleteSessions,
          updateMsgs: updateMsgs,
          putMsg: putMsg,
          deleteMsg: deleteMsg,
          replaceMsg: replaceMsg,
          updateMsgByIdClient: updateMsgByIdClient,
          updateCurrSessionId: updateCurrSessionId,
          updateCurrSessionMsgs: updateCurrSessionMsgs,
          updateSysMsgs: updateSysMsgs,
          updateSysMsgUnread: updateSysMsgUnread,
          updateCustomSysMsgs: updateCustomSysMsgs,
          updateCustomSysMsgUnread: updateCustomSysMsgUnread,
          resetSysMsgs: resetSysMsgs,
          setNoMoreHistoryMsgs: setNoMoreHistoryMsgs,
          resetNoMoreHistoryMsgs: resetNoMoreHistoryMsgs,
          continueRobotMsg: continueRobotMsg,

          setTeamList: setTeamList,
          addTeam: addTeam,
          hasTeam: hasTeam,
          getTeamlist: getTeamlist,
          getTeamMap: getTeamMap,
          addTeamMap: addTeamMap,
          getTeamById: getTeamById,
          getTeamMapById: getTeamMapById,
          removeTeamById: removeTeamById,
          updateTeam: updateTeam,
          setTeamMembers: setTeamMembers,
          addTeamMembers: addTeamMembers,
          removeTeamMembers: removeTeamMembers,
          getTeamMembers: getTeamMembers,
          getTeamMemberInfo: getTeamMemberInfo,
          isTeamManager: isTeamManager,
          updateTeamMemberMute: updateTeamMemberMute,
          mergeTeamSession: mergeTeamSession,

          initChatroomInfos: initChatroomInfos,
          setCurrChatroom: setCurrChatroom,
          resetCurrChatroom: resetCurrChatroom,
          updateChatroomInfo: updateChatroomInfo,
          updateCurrChatroomMsgs: updateCurrChatroomMsgs,
          getChatroomInfo: getChatroomInfo,
          updateChatroomMembers: updateChatroomMembers
        }


        function updateRefreshState() {
          IMState.isRefresh = false
        }

        function updateLoading(status) {
          IMState.isLoading = status
        }

        function updateFullscreenImage(obj) {
          obj = obj || {}
          if (obj.src && obj.type === 'show') {
            IMState.fullscreenImgSrc = obj.src
            IMState.isFullscreenImgShow = true
          } else if (obj.type === 'hide') {
            IMState.fullscreenImgSrc = ' '
            IMState.isFullscreenImgShow = false
          }
        }

        function updateUserUID(loginInfo) {
          IMState.userUID = loginInfo.uid
          IMState.sdktoken = loginInfo.sdktoken
          // cookie.setCookie('uid', loginInfo.uid)
          // cookie.setCookie('sdktoken', loginInfo.sdktoken)
        }

        function updateMyInfo(myInfo) {
          IMState.myInfo = IMUtils.mergeObject(IMState.myInfo, myInfo)
        }

        function updateUserInfo(users) {
          var userInfos = IMState.userInfos
          angular.forEach(users, function (user) {
            var account = user.account
            if (account) {
              userInfos[account] = IMUtils.mergeObject(userInfos[account], user)
            }
          })
          IMState.userInfos = IMUtils.mergeObject(IMState.userInfos, userInfos)
        }

        function updateFriends(friends, cutFriends) {
          cutFriends = (typeof cutFriends !== 'undefined') ? cutFriends : []
          var nim = IMState.nim
          IMState.friendslist = nim.mergeFriends(IMState.friendslist, friends)
          // IMState.friendslist = nim.cutFriends(IMState.friendslist, cutFriends)
          IMState.friendslist = nim.cutFriends(IMState.friendslist, friends.invalid)
        }

        function updateRobots(robots) {
          var nim = IMState.nim
          var newrobots = []
          angular.forEach(robots, function (item) {
            if (item.avatar) {
              item.originAvatar = item.avatar
              item.avatar = nim.viewImageSync({
                url: item.avatar, // 必填
                thumbnail: { // 生成缩略图， 可选填
                  width: 40,
                  height: 40,
                  mode: 'cover'
                }
              })
            } else {
              item.avatar = IMENV.config.defaultUserIcon
            }
            newrobots.push(item)
          })
          IMState.robotslist = newrobots
          IMState.robotInfos = Object.create(null)
          angular.forEach(newrobots, function (robot) {
            IMState.robotInfos[robot.account] = robot
            IMState.robotInfosByNick[robot.nick] = robot
          })
        }

        function updateBlacklist(blacks) {
          var nim = IMState.nim
          IMState.blacklist = nim.cutFriends(IMState.blacklist, blacks.invalid)
          var addBlacks = []
          angular.forEach(blacks, function (item) {
            if (item.isBlack === true) {
              addBlacks.push[item]
            }
          })
          var remBlacks = []
          angular.forEach(blacks, function (item) {
            if (item.isBlack === false) {
              remBlacks.push[item]
            }
          })
          // 添加黑名单
          IMState.blacklist = nim.mergeFriends(IMState.blacklist, addBlacks)
          // 解除黑名单
          IMState.blacklist = nim.cutFriends(IMState.blacklist, remBlacks)
        }

        function updateSearchlist(obj) {
          var type = obj.type
          switch (type) {
            case 'user':
              if (obj.list.length !== 0 || IMState.searchedUsers.length !== 0) {
                IMState.searchedUsers = obj.list
              } else {
                IMState.searchedUsers = []
              }
              break
            case 'team':
              if (obj.list.length !== 0 || IMState.searchedTeams.length !== 0) {
                IMState.searchedTeams = obj.list
              } else {
                IMState.searchedTeams = []
              }
              break
          }
        }

        function updateSessions(sessions, type) {
          var nim = IMState.nim
          if (type == 'p2p') {
            IMState.sessionlist = nim.mergeSessions(IMState.sessionlist, sessions)
            var newsessionlist = []
            angular.forEach(IMState.sessionlist, function (item) {
              if (!(/^team-/.test(item.id)) && !item.teamId) {
                newsessionlist.push(item)
              }
            })
            IMState.sessionlist = newsessionlist
            IMState.sessionlist.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
            angular.forEach(IMState.sessionlist, function (item) {
              IMState.sessionMap[item.id] = item
            })
          } else if (type == 'team') {
            IMState.teamlist = nim.mergeSessions(IMState.teamlist, sessions)
            IMState.teamSessionlist = nim.mergeSessions(IMState.teamSessionlist, IMState.teamlist)
            var newteamlist = []
            angular.forEach(IMState.teamSessionlist, function (item) {
              if ((/^team-/.test(item.id))) {
                newteamlist.push(item)
              }
            })
            IMState.teamSessionlist = newteamlist
            IMState.teamSessionlist.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
            angular.forEach(IMState.teamSessionlist, function (item) {
              IMState.teamMap[item.id] = item
            })
          } else {
            IMState.sessionlist = nim.mergeSessions(IMState.sessionlist, sessions)
            var newsessionlist = []
            angular.forEach(IMState.sessionlist, function (item) {
              if (!(/^team-/.test(item.id)) && !item.teamId) {
                newsessionlist.push(item)
              }
            })
            IMState.sessionlist = newsessionlist
            IMState.sessionlist.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
            angular.forEach(IMState.sessionlist, function (item) {
              IMState.sessionMap[item.id] = item
            })
            IMState.teamlist = nim.mergeSessions(IMState.teamlist, sessions)
            IMState.teamSessionlist = nim.mergeSessions(IMState.teamSessionlist, IMState.teamlist)
            var newteamlist = []
            angular.forEach(IMState.teamSessionlist, function (item) {
              if ((/^team-/.test(item.id))) {
                newteamlist.push(item)
              }
            })
            IMState.teamSessionlist = newteamlist
            IMState.teamSessionlist.sort(function (a, b) {
              return b.updateTime - a.updateTime
            })
            angular.forEach(IMState.teamSessionlist, function (item) {
              IMState.teamMap[item.id] = item
            })
          }
        }

        function deleteSessions(sessionIds) {
          var nim = IMState.nim
          IMState.sessionlist = nim.cutSessionsByIds(IMState.sessionlist, sessionIds)
        }

        // 初始化，收到离线漫游消息时调用
        function updateMsgs(msgs) {
          var nim = IMState.nim
          var tempSessionMap = {}
          angular.forEach(msgs, function (msg) {
            var sessionId = msg.sessionId
            tempSessionMap[sessionId] = true
            if (!IMState.msgs[sessionId]) {
              IMState.msgs[sessionId] = []
            }
            // sdk会做消息去重
            IMState.msgs[sessionId] = nim.mergeMsgs(IMState.msgs[sessionId], [msg])
            // state.msgs[sessionId].push(msg)
          })
          updateMsgByIdClient(msgs)
          for (var sessionId in tempSessionMap) {
            IMState.msgs[sessionId].sort(function(a, b){
              if (a.time === b.time) {
                // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
                if (a.type === 'robot' && b.type === 'robot') {
                  if (a.content && a.content.msgOut) {
                    return 1
                  }
                  if (b.content && b.content.msgOut) {
                    return -1
                  }
                }
              }
              return a.time - b.time
            })
            if (sessionId === IMState.currSessionId) {
              updateCurrSessionMsgs({ type: 'init' })
            }
          }
        }

        // 更新追加消息，追加一条消息
        function putMsg(msg) {
          var sessionId = msg.sessionId
          if (!IMState.msgs[sessionId]) {
            IMState.msgs[sessionId] = []
          }
          updateMsgByIdClient(msg)
          var tempMsgs = IMState.msgs[sessionId]
          var lastMsgIndex = tempMsgs.length - 1
          if (tempMsgs.length === 0 || msg.time >= tempMsgs[lastMsgIndex].time) {
            tempMsgs.push(msg)
          } else {
            for (var i = lastMsgIndex; i >= 0; i--) {
              var currMsg = tempMsgs[i]
              if (msg.time >= currMsg.time) {
                IMState.msgs[sessionId].splice(i, 0, msg)
                break
              }
            }
          }
        }

        // 删除消息列表消息
        function deleteMsg(msg) {
          var sessionId = msg.sessionId
          var tempMsgs = IMState.msgs[sessionId]
          if (!tempMsgs || tempMsgs.length === 0) {
            return
          }
          var lastMsgIndex = tempMsgs.length - 1
          for (var i = lastMsgIndex; i >= 0; i--) {
            var currMsg = tempMsgs[i]
            if (msg.idClient === currMsg.idClient) {
              IMState.msgs[sessionId].splice(i, 1)
              break
            }
          }
        }

        // 替换消息列表消息，如消息撤回
        function replaceMsg(obj) {
          angular.forEach(obj, function (value, key) {
            if (key == 'sessionId') {
              var sessionId = value
            } else if (key == 'idClient') {
              var idClient = value
            } else if (key == 'msg') {
              var msg = value
            }
          })
          var tempMsgs = IMState.msgs[sessionId]
          if (!tempMsgs || tempMsgs.length === 0) {
            return
          }
          var lastMsgIndex = tempMsgs.length - 1
          for (var i = lastMsgIndex; i >= 0; i--) {
            var currMsg = tempMsgs[i]
            console.log(idClient, currMsg.idClient, currMsg.text)
            if (idClient === currMsg.idClient) {
              IMState.msgs[sessionId].splice(i, 1, msg)
              break
            }
          }
        }

        // 用idClient 更新消息，目前用于消息撤回
        function updateMsgByIdClient(msgs) {
          if (!Array.isArray(msgs)) {
            msgs = [msgs]
          }
          var tempTime = (new Date()).getTime()
          angular.forEach(msgs, function (msg) {
            if (msg.idClient && (tempTime - msg.time < 1000 * 300)) {
              IMState.msgsMap[msg.idClient] = msg
            }
          })
        }

        // 更新当前会话id，用于唯一判定是否在current session状态
        function updateCurrSessionId(obj) {
          var type = obj.type || ''
          if (type === 'destroy') {
            IMState.currSessionId = null
          } else if (type === 'init') {
            if (obj.sessionId && (obj.sessionId !== IMState.currSessionId)) {
              IMState.currSessionId = obj.sessionId
            }
          }
        }

        // 更新当前会话列表的聊天记录，包括历史消息、单聊消息等，不包括聊天室消息
        // replace: 替换idClient的消息
        function updateCurrSessionMsgs(obj) {
          var type = obj.type || ''
          if (type === 'destroy') { // 清空会话消息
            IMState.currSessionMsgs = []
            IMState.currSessionLastMsg = null
            updateCurrSessionId({ type: 'destroy' })
          } else if (type === 'init') { // 初始化会话消息列表
            if (IMState.currSessionId) {
              var sessionId = IMState.currSessionId
              console.log(sessionId)
              var currSessionMsgs = [].concat(IMState.msgs[sessionId] || [])
              // 做消息截断
              var limit = IMENV.config.localMsglimit
              var msgLen = currSessionMsgs.length
              if (msgLen - limit > 0) {
                IMState.currSessionLastMsg = currSessionMsgs[msgLen - limit]
                currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen)
              } else if (msgLen > 0) {
                IMState.currSessionLastMsg = currSessionMsgs[0]
              } else {
                IMState.currSessionLastMsg = null
              }
              IMState.currSessionMsgs = []
              var lastMsgTime = 0
              angular.forEach(currSessionMsgs, function (msg) {
                if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                  lastMsgTime = msg.time
                  IMState.currSessionMsgs.push({
                    type: 'timeTag',
                    text: IMUtils.formatDate(msg.time, false)
                  })
                }
                IMState.currSessionMsgs.push(msg)
              })
            }
          } else if (type === 'put') { // 追加一条消息
            var newMsg = obj.msg
            var lastMsgTime = 0
            var lenCurrMsgs = IMState.currSessionMsgs.length
            if (lenCurrMsgs > 0) {
              lastMsgTime = IMState.currSessionMsgs[lenCurrMsgs - 1].time
            }
            if (newMsg) {
              if ((newMsg.time - lastMsgTime) > 1000 * 60 * 5) {
                IMState.currSessionMsgs.push({
                  type: 'timeTag',
                  text: IMUtils.formatDate(newMsg.time, false)
                })
              }
              IMState.currSessionMsgs.push(newMsg)
            }
          } else if (type === 'concat') {
            // 一般用于历史消息拼接
            var currSessionMsgs = []
            var lastMsgTime = 0
            angular.forEach(obj.msgs, function (msg) {
              if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
                lastMsgTime = msg.time
                currSessionMsgs.push({
                  type: 'timeTag',
                  text: IMUtils.formatDate(msg.time, false)
                })
              }
              currSessionMsgs.push(msg)
            })
            currSessionMsgs.reverse()
            angular.forEach(currSessionMsgs, function (msg) {
              IMState.currSessionMsgs.unshift(msg)
            })
            if (obj.msgs[0]) {
              IMState.currSessionLastMsg = obj.msgs[0]
            }
          } else if (type === 'replace') {
            var msgLen = IMState.currSessionMsgs.length
            var lastMsgIndex = msgLen - 1
            if (msgLen > 0) {
              for (var i = lastMsgIndex; i >= 0; i--) {
                if (IMState.currSessionMsgs[i].idClient === obj.idClient) {
                  IMState.currSessionMsgs.splice(i, 1, obj.msg)
                  break
                }
              }
            }
          }
        }

        function updateSysMsgs(sysMsgs) {
          var nim = IMState.nim
          if (!Array.isArray(sysMsgs)) {
            sysMsgs = [sysMsgs]
          }
          var newSysMsgs = []
          angular.forEach(sysMsgs, function (msg) {
            msg.showTime = IMUtils.formatDate(msg.time, false)
            newSysMsgs.push(msg)
          })
          // IMState.sysMsgs = nim.mergeSysMsgs(IMState.sysMsgs, sysMsgs)
          IMState.sysMsgs = [].concat(nim.mergeSysMsgs(IMState.sysMsgs, newSysMsgs))
        }

        function updateSysMsgUnread(obj) {
          IMState.sysMsgUnread = obj
        }

        function updateCustomSysMsgs(sysMsgs) {
          var nim = IMState.nim
          if (!Array.isArray(sysMsgs)) {
            sysMsgs = [sysMsgs]
          }
          var newSysMsgs = []
          angular.forEach(sysMsgs, function (msg) {
            msg.showTime = IMUtils.formatDate(msg.time, false)
            newSysMsgs.push(msg)
          })
          // IMState.customSysMsgs = nim.mergeSysMsgs(IMState.customSysMsgs, newSysMsgs)
          IMState.customSysMsgs = IMState.customSysMsgs.concat(newSysMsgs)
          updateCustomSysMsgUnread({
            type: 'add',
            unread: newSysMsgs.length
          })
        }

        function updateCustomSysMsgUnread(obj) {
          angular.forEach(obj, function (value, key) {
            if (key == 'type') {
              var type = value
            } else if (key == 'unread') {
              var unread = value
            }
          })
          switch (type) {
            case 'reset':
              IMState.customSysMsgUnread = unread || 0
              break
            case 'add':
              IMState.customSysMsgUnread += unread
              break
          }
        }

        function resetSysMsgs(obj) {
          var type = obj.type
          switch (type) {
            case 0:
              IMState.sysMsgs = []
              break
            case 1:
              IMState.customSysMsgs = []
              updateCustomSysMsgUnread({
                type: 'reset'
              })
              break
          }
        }

        function setNoMoreHistoryMsgs() {
          IMState.noMoreHistoryMsgs = true
        }
        function resetNoMoreHistoryMsgs() {
          IMState.noMoreHistoryMsgs = false
        }
        // 继续与机器人会话交互
        function continueRobotMsg(robotAccid) {
          IMState.continueRobotAccid = robotAccid
        }


        /**
         * 初始化群列表
         * @param {array} list 
       */
        function setTeamList(list) {
          angular.forEach(list, function (item) {
            IMState.teamMap[item.teamId] = item;
          })
          IMState.teamlist = list;
        };

        function addTeam(team) {
          if (!hasTeam(team.teamId)) {
            IMState.teamMap[team.teamId] = team;
            IMState.teamlist.push(team);
          }
        };

        function hasTeam(id) {
          var item;
          for (var i = IMState.teamlist.length - 1; i >= 0; i--) {
            item = IMState.teamlist[i];
            if (item.teamId === id) {
              return true;
            }
          };
          return false;
        };

        /**
        * 获取群列表
        */
        function getTeamlist() {
          return IMState.teamlist;
        };

        /**
        * 获取群对象
        */
        function getTeamMap() {
          return IMState.teamMap;
        };

        function addTeamMap(data) {
          angular.forEach(data, function (item) {
            IMState.teamMap[item.teamId] = item
          })
        };
        /**
        * 根据群id获取群对象
        */
        function getTeamById(teamId) {
          if (hasTeam(teamId)) {
            return IMState.teamMap[teamId];
          }
          return null;
        };

        function getTeamMapById(teamId) {
          return IMState.teamMap[teamId] || null;
        };

        /**
        * 根据群id删除群
        */
        function removeTeamById(id) {
          for (var i in IMState.teamlist) {
            if (IMState.teamlist[i].teamId === id) {
              IMState.teamlist.splice(i, 1);
              break;
            }
          }
        };

        function mergeTeamSession() {
          var teamlist = IMState.team
          angular.forEach(teamlist,function(item){
            item.id = item.teamId
          })
          if (!!IMState.teamlist.length) {
            angular.forEach(teamlist, function (data) {
              angular.forEach(IMState.teamlist, function (item) {
                if ('team-' + data.teamId == item.id) {
                  data = _.extend(data, item)
                }
              })
            })
          }
          return teamlist
        }

        /**
         * 更变群名
         */
        function updateTeam(teamId, obj) {
          for (var p in obj) {
            IMState.teamMap[teamId][p] = obj[p];
          }
          for (var i in this.teamlist) {
            if (IMState.teamlist[i].teamId === teamId) {
              for (var p in obj) {
                IMState.teamlist[i][p] = obj[p];
              }
              break;
            }
          }
        };
        function setTeamMembers(id, list) {
          IMState.teamMembers[id] = list;
        }
        function addTeamMembers(id, array) {
          if (!IMState.teamMembers[id]) {
            return;
          }
          for (var i = array.length - 1; i >= 0; i--) {
            IMState.teamMembers[id].members.push(array[i])
          };
        }
        function removeTeamMembers(id, array) {
          var obj = IMState.teamMembers[id],
            account;
          if (obj) {
            for (var j = array.length - 1; j >= 0; j--) {
              account = array[j];
              for (var i = obj.members.length - 1; i >= 0; i--) {
                if (obj.members[i].account === account) {
                  obj.members.splice(i, 1);
                  break;
                }
              };
            };
          }
        }
        function getTeamMembers(id) {
          return IMState.teamMembers[id];
        }
        function getTeamMemberInfo(account, id) {
          var obj = IMState.teamMembers[id];
          if (obj && obj.members) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
              if (obj.members[i].account === account) {
                return obj.members[i]
              }
            };
          }
          return false
        }
        function isTeamManager(account, id) {
          var obj = IMState.teamMembers[id];
          if (obj) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
              if (obj.members[i].account === account && (obj.members[i].type === 'owner' || obj.members[i].type === 'manager')) {
                return true
              }
            };
          }
          return false
        }
        function updateTeamMemberMute(id, account, mute) {
          var obj = IMState.teamMembers[id];
          if (obj) {
            for (var i = obj.members.length - 1; i >= 0; i--) {
              if (obj.members[i].account === account) {
                obj.members[i].mute = mute;
                return;
              }
            };
          }
        }



        function initChatroomInfos(obj) {
          IMState.chatroomInfos = obj
        }

        function setCurrChatroom(chatroomId) {
          IMState.currChatroomId = chatroomId
          IMState.currChatroom = IMState.chatroomInsts[chatroomId]
          IMState.currChatroomMsgs = []
          IMState.currChatroomInfo = {}
          IMState.currChatroomMembers = []
        }

        function resetCurrChatroom() {
          IMState.currChatroomId = null
          IMState.currChatroom = null
          IMState.currChatroomMsgs = []
          IMState.currChatroomInfo = {}
          IMState.currChatroomMembers = []
        }

        // 聊天室相关逻辑
        function updateChatroomInfo(obj) {
          IMState.currChatroomInfo = Object.assign(IMState.currChatroomInfo, obj)
        }

        function updateCurrChatroomMsgs(obj) {
          var newObj = Object.assign({}, obj)
          angular.forEach(newObj, function (value, key) {
            if (key == 'type') {
              var type = value
            } else if (key == 'msgs') {
              var msgs = value
            }
          })
          if (type === 'put') {
            angular.forEach(msgs, function (msg) {
              var chatroomId = msg.chatroomId
              if (chatroomId === IMState.currChatroomId) {
                angular.forEach(msgs, function (msg) {
                  IMState.currChatroomMsgs.push(msg)
                })
              }
            })
          } else if (type === 'concat') {
            // 一般用于历史消息拼接
            var currSessionMsgs = obj.msgs
            currSessionMsgs.reverse()
            angular.forEach(currSessionMsgs, function (msg) {
              IMState.currSessionMsgs.unshift(msg)
            })
            if (obj.msgs[0]) {
              IMState.currSessionLastMsg = obj.msgs[0]
            }
          }
        }

        function getChatroomInfo(obj) {
          IMState.currChatroomInfo = obj
        }

        function updateChatroomMembers(obj) {
          angular.forEach(obj, function (value, key) {
            if (key == 'type') {
              var type = value
            } else if (key == 'members') {
              var members = value
            }
          })
          if (type === 'destroy') {
            IMState.currChatroomMembers = []
          } else if (type === 'put') {
            angular.forEach(members, function (member) {
              if (member.online) {
                IMState.currChatroomMembers.push(member)
              }
            })
          }
        }


      }
    ])

})()