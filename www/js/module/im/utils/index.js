(function () {
  'use strict'

  angular.module('rsc.im.utils', [])
    .factory('IMStorageUtil', function (Storage) {

      return {
        setIMStorage: setIMStorage,
        readIMStorage: readIMStorage,
        delIMStorage: delIMStorage
      }
      //写IMStorage 
      function setIMStorage(name, value) {
        var days = 1
        var exp = new Date()
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
        var IMCookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
        Storage.set('IMCookie', IMCookie)
      }

      //读取IMStorage
      function readIMStorage(name) {
        var arr = null
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        var IMCookie = Storage.get('IMCookie')
        if (IMCookie && (arr = IMCookie.match(reg))) {
          return unescape(arr[2])
        } else {
          return null;
        }
      }

      //删除IMStorage
      function delIMStorage(name) {
        var cval = readIMStorage(name)
        var IMCookie = Storage.get('IMCookie')
        if (cval != null) {
          IMCookie = name + '=' + cval + ';expires=' + (new Date(0)).toGMTString()
        }
      }
    })


    .factory('IMUtils', function () {

      return {
        encode: encode,
        escape: escape,
        object2query: object2query,
        mergeObject: mergeObject,
        mapMsgType: mapMsgType,
        stringifyDate: stringifyDate,
        formatDate: formatDate,
        parseSession: parseSession,
        parseCustomMsg: parseCustomMsg,
        getFriendAlias: getFriendAlias,
        generateChatroomSysMsg: generateChatroomSysMsg
      }


      function encode(_map, _content) {
        _content = '' + _content
        if (!_map || !_content) {
          return _content || ''
        }
        return _content.replace(_map.r, function ($1) {
          var _result = _map[!_map.i ? $1.toLowerCase() : $1]
          return _result != null ? _result : $1
        });
      };

      function escape() {
        (function () {
          var _reg = /<br\/?>$/
          var _map = {
            r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            ' ': '&nbsp;',
            '"': '&quot;',
            "'": '&#39;',
            '\n': '<br/>',
            '\r': ''
          }
          return function (_content) {
            _content = encode(_map, _content)
            return _content.replace(_reg, '<br/>');
          };
        })();
      }

      function object2query(obj) {
        var keys = Object.keys(obj)
        var queryArray = []
        angular.forEach(keys, function (item) {
          var str = item + '=' + encodeURIComponent(obj[item])
          newKeys.push(str)
        })
        return queryArray.join('&')
      }

      function mergeObject(dest, src) {
        if (typeof dest !== 'object' || dest === null) {
          dest = Object.create(null)
        }
        dest = Object.assign(Object.create(null), dest, src)
        return dest
      }

      // Utils.mergeVueObject = function (dest, src) {
      //   let keys = Object.keys(src)
      //   keys.forEach(item => {
      //     if (typeof src[item] !== 'undefined') {
      //       Vue.set(dest, item, src[item])
      //     }
      //   })
      //   return dest
      // }

      // 消息类型列表
      function mapMsgType(msg) {
        var map = {
          text: '文本消息',
          image: '图片消息',
          file: '文件消息',
          audio: '语音消息',
          video: '视频消息',
          geo: '地理位置消息',
          tip: '提醒消息',
          custom: '自定义消息',
          notification: '系统通知',
          robot: '机器人消息'
        }
        var type = msg.type
        return map[type] || '未知消息类型'
      }

      function stringifyDate(datetime, simple) {
        simple = (typeof simple !== 'undefined') ? simple : false
        // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        datetime = new Date(datetime)
        var year = datetime.getFullYear()
        var simpleYear = datetime.getYear() - 100
        var month = datetime.getMonth() + 1
        month = month > 9 ? month : '0' + month
        var day = datetime.getDate()
        day = day > 9 ? day : '0' + day
        var hour = datetime.getHours()
        hour = hour > 9 ? hour : '0' + hour
        var min = datetime.getMinutes()
        min = min > 9 ? min : '0' + min
        var week = datetime.getDay()
        week = weekMap[week]
        var thatDay = (new Date(year, month - 1, day, 0, 0, 0)).getTime()

        if (simple) {
          return {
            withYear: day + '/' + month + '/' + simpleYear,
            withMonth: month + '-' + day,
            withDay: week + '',
            withLastDay: '昨天',
            withHour: hour + ':' + min,
            thatDay: thatDay
          }
        } else {
          return {
            withYear: year + '-' + month + '-' + day + ' ' + hour + ':' + min,
            withMonth: month + '-' + day + ' ' + hour + ':' + min,
            withDay: week + ' ' + hour + ':' + min,
            withLastDay: '昨天' + hour + ':' + min,
            withHour: hour + ':' + min,
            thatDay: thatDay
          }
        }
      }

      /* 格式化日期 */
      function formatDate(datetime, simple) {
        simple = (typeof simple !== 'undefined') ? simple : false
        var tempDate = (new Date()).getTime()
        var result = stringifyDate(datetime, simple)
        var thatDay = result.thatDay
        var deltaTime = (tempDate - thatDay) / 1000

        if (deltaTime < 3600 * 24) {
          return result.withHour
        } else if (deltaTime < 3600 * 24 * 2) {
          return result.withLastDay
        } else if (deltaTime < 3600 * 24 * 7) {
          return result.withDay
        } else if (deltaTime < 3600 * 24 * 30) {
          return result.withMonth
        } else {
          return result.withYear
        }
      }

      function parseSession(sessionId) {
        sessionId = sessionId + ''
        if (/^p2p-/.test(sessionId)) {
          return {
            scene: 'p2p',
            to: sessionId.replace(/^p2p-/, '')
          }
        } else if (/^team-/.test(sessionId)) {
          return {
            scene: 'team',
            to: sessionId.replace(/^team-/, '')
          }
        } else if (sessionId.length <= 10) {
          return {
            scene: 'team',
            to: sessionId
          }
        }
      }

      function parseCustomMsg(msg) {
        if (msg.type === 'custom') {
          try {
            var cnt = JSON.parse(msg.content)
            switch (cnt.type) {
              case 1:
                return '[猜拳消息]'
              case 2:
                return '[阅后即焚]'
              case 3:
                return '[贴图表情]'
              case 4:
                return '[白板消息]'
            }
          } catch (e) { }
          return '[自定义消息]'
        }
        return ''
      }
      /* 获得有效的备注名 */
      function getFriendAlias(userInfo) {
        userInfo.alias = userInfo.alias ? userInfo.alias.trim() : ''
        return userInfo.alias || userInfo.nick || userInfo.account
      }

      function generateChatroomSysMsg(data) {
        var text
        switch (data.attach.type) {
          case 'memberEnter':
            text = '欢迎' + data.attach.fromNick + '进入直播间'
            break
          case 'memberExit':
            text = data.attach.fromNick + '离开了直播间'
            break
          case 'blackMember':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员拉入黑名单'
            break
          case 'unblackMember':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员解除拉黑'
            break
          case 'gagMember':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员禁言'
            break
          case 'ungagMember':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员解除禁言'
            break
          case 'addManager':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被任命管理员身份'
            break
          case 'removeManager':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被解除管理员身份'
            break;
          case 'addTempMute':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员临时禁言'
            break;
          case 'removeTempMute':
            text = (data.attach.toNick[0] || data.attach.to[0]) + '被管理员解除临时禁言'
            break;
          case 'addCommon':
            text = '管理员添加普通成员'
            break
          case 'removeCommon':
            text = '管理员删除普通成员'
            break
          case 'kickMember':
            text = data.attach.toNick[0] + '被管理员踢出房间'
            break;
          // case 'xxx':
          // 直播公告已更新
          // break;
          default:
            text = '通知消息'
            break
        }
        return text
      }

      function getObjArr(data, index) {
        var users = [], uhash = {};
        for (var i = 0, length = data.length; i < length; ++i) {
          var indexString = '';
          index.forEach(function (field) {
            if (_.isArray(data[i][field])) {
              data[i][index].forEach(function (att) {
                indexString += att;
              })
            } else {
              indexString += data[i][field];
            }
          });
          if (!uhash[indexString]) {
            uhash[indexString] = true;
            users.push(data[i]);
          }
        }
        return users;
      };

    })


    .factory('IMPageUtil', ['IMENV', '$state', 'ionicToast',
      function (IMENV, $state, ionicToast) {
        return {
          turnPage: turnPage
        }

        var pageMap = {
          'login': IMENV.config.loginUrl,
          'regist': IMENV.config.registUrl,
        }

        // 切换页面，并错误提示
        function turnPage(message, url) {
          if (message) {
            ionicToast.show(message, 'middle', false, 2500)
          }
          if (url) {
            if (pageMap[url]) {
              var newUrl = pageMap[url]
              $state.go(newUrl)
            }
            
          }
        }
      }
    ])

    .factory('im_detail_factory', ['IMState', 'IMUtils',
      function (IMState, IMUtils) {
        return {
          transMsg: transMsg
        }

        function transMsg(item, type) {
          // 标记用户，区分聊天室、普通消息
          if (type === 'session') {
            if (item.flow === 'in') {
              if (item.type === 'robot' && item.content && item.content.msgOut) {
                // 机器人下行消息
                var robotAccid = item.content.robotAccid
                item.avatar = IMState.robotInfos[robotAccid].avatar
                item.isRobot = true
              } else if (item.from !== IMState.userUID) {
                item.avatar = IMState.userInfos[item.from] && IMState.userInfos[item.from].avatar
              } else {
                item.avatar = IMState.myInfo.avatar
              }
            } else if (item.flow === 'out') {
              item.avatar = IMState.myInfo.avatar
            }
          } else {
            // 标记时间，聊天室中
            item.showTime = IMUtils.formatDate(item.time)
          }
          if (item.type === 'timeTag') {
            // 标记发送的时间
            item.showText = item.text
          } else if (item.type === 'text') {
            // 文本消息
            item.showText = IMUtils.escape(item.text)
            if (/\[[^\]]+\]/.test(item.showText)) {
              var emojiItems = item.showText.match(/\[[^\]]+\]/g)
              angular.forEach(emojiItems, function (text) {
                var emojiCnt = emojiObj.emojiList.emoji
                if (emojiCnt[text]) {
                  item.showText = item.showText.replace(text, '<img class="emoji-small" src="' + emojiCnt[text].img + '">')
                }
              })
            }
          } else if (item.type === 'custom') {
            var content = JSON.parse(item.content)
            // type 1 为猜拳消息
            if (content.type === 1) {
              var data = content.data
              var resourceUrl = config.resourceUrl
              // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
              item.type = 'custom-type1'
              item.imgUrl = resourceUrl + '/im/play-' + data.value + '.png'
              // type 3 为贴图表情
            } else if (content.type === 3) {
              var data = content.data
              var emojiCnt = ''
              if (emojiObj.pinupList[data.catalog]) {
                emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet]
                // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
                item.type = 'custom-type3'
                item.imgUrl = emojiCnt.img + ''
              }
            } else if (content.type == 7) {
              var data = content.data
              item.card = data
            }
             else {
              item.showText = IMUtils.parseCustomMsg(item)
              if (item.showText !== '[自定义消息]') {
                item.showText += ',请到手机或电脑客户端查看'
              }
            }
          } else if (item.type === 'image') {
            // 原始图片全屏显示
            item.originLink = item.file.url
          } else if (item.type === 'video') {
            // ...
          } else if (item.type === 'audio') {
            item.audioSrc = item.file.mp3Url
            item.showText = Math.round(item.file.dur / 1000) + '" 点击播放'
          } else if (item.type === 'file') {
            item.fileLink = item.file.url
            item.showText = item.file.name
          } else if (item.type === 'notification') {
            //对于系统通知，更新下用户信息的状态
            item.showText = IMUtils.generateChatroomSysMsg(item)
          } else if (item.type === 'tip') {
            //对于系统通知，更新下用户信息的状态
            item.showText = item.tip
          } else if (item.type === 'robot') {
            var content = item.content || {}
            var message = content.message || []
            if (!content.msgOut) {
              // 机器人上行消息
              item.robotFlow = 'out'
              item.showText = item.text
            } else if (content.flag === 'bot') {
              item.subType = 'bot'
              var newMeg = []
              angular.forEach(message, function (item) {
                if (item.type === 'template') {
                  // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
                  newMeg.push(item.content.json)
                } else if (item.type === 'text' || item.type === 'answer') {
                  // 保持跟template结构一致
                  newMeg.push([{
                    type: 'text',
                    text: item.content
                  }])
                } else if (item.type === 'image') {
                  // 保持跟template结构一致
                  newMeg.push([{
                    type: 'image',
                    url: item.content
                  }])
                }
              })
              item.message = newMeg
            } else if (item.content.flag === 'faq') {
              item.subType = 'faq'
              item.query = message.query
              var match = message.match.sort(function (a, b) {
                // 返回最匹配的答案
                return b.score - a.score
              })
              item.message = match[0]
            }
          } else {
            item.showText = '[' + IMUtils.mapMsgType(item) + '],请到手机或电脑客户端查看'
          }
          return item
        }

        function showNewRelation(obj){
          if(obj.relation.type == 'WORK'){
            return obj.user.real_name + '邀请成为你的' + $filter('relationRole')(obj.relation.extend)
          }else if(obj.relation.type == 'FRIEND'){
            return obj.user.real_name + '邀请你成为好友'
          }else if(obj.relation.type == 'COMPANY_SUPPLY'){
            return obj.user.real_name + '申请加入新同事' + $filter('relationRole')(obj.relation.extend)
          }else if(obj.relation.type == 'COMPANY_INVITE'){
            return obj.user.real_name + '邀请你加入新同事' + $filter('relationRole')(obj.relation.extend)
          }
        }
      }
    ])


})()