(function () {
  'use strict'

  angular.module('rsc.im', [
    'rsc.im.config',
    'rsc.im.service',
    'rsc.im.factory',
    'rsc.im.utils',
    'rsc.im.directive',
    'rsc.im.filters',
    'ui.router'
  ])
    .run(function ($ionicPlatform, $log, $state, $rootScope, IMENV, IMFactory, IMState, Storage, IMPolyfill) {
      $ionicPlatform.ready(function () {
        if (ionic.Platform.isWebView()) {
          if (ionic.Platform.isAndroid()) {
            cordova.plugins.yimPlugin.addNavigationToHtmlListener('', function (success) {
              console.log('回调注册', success)
            }, function (error) {
              console.log('回调注册', error)
            })
          }
          cordova.plugins.yimPlugin.onNavigationToHtmlCallBack = function (params) {
            if(ionic.Platform.isIOS()){
              params = JSON.parse(params)
            }
            if (params.back_type == 'toptitle_back' || params.back_type == 'press_back' || params.back_type == 'normal_back') {
              $state.go('rsc.message')
            } else if (params.back_type == 'head_back' || params.back_type == 'businesscard_back') {
              $state.go('rsc.person_page', { id: params.id, role: params.data.role, sidebar: true })
            } else if (params.back_type == 'orderinfo_back ') {

            }
          }
          cordova.plugins.yimPlugin.onShareBusinessCardCallBack = function (e) {
            var linkman = Storage.get('linkman')
            cordova.plugins.yimPlugin.shareBusinessCard(
              linkman,
              function (success) {
                $log.debug("云信自定义消息成功", success)
              },
              function (error) {
                $log.error("云信自定义消息失败", error);
              }
            )
          }
        }
      })

      $rootScope.$on('$stateChangeSuccess', function (event, toState, roParams, fromState, fromParams) {
        // 监听IM是否连接
        var hasSession = Storage.get('hasSession')
        var hasTeam = Storage.get('hasTeam')
        if(toState.name != 'rsc.message'){
          return false
        }
        if (!IMState.nim || (!!hasSession && !IMState.sessionlist.length) || (!!hasTeam && !IMState.teamlist.length)) {
          var userInfo = Storage.get('userInfo')
          if (!!userInfo && !!userInfo.user) {
            console.log('IM reload')
            IMFactory.reload({
              type: 'nim',
              force: true,
              uid: Storage.get('userInfo').user._id,
              sdktoken: 'a11111',
            })
          }
        }
        // if (!!IMState.sessionlist.length) {
        IMPolyfill.getRscRelation()
        // }
      });

      $rootScope.chat = function (id, type, role, name) {
        var userRole = Storage.get('userInfo').user.role || ''
        if (ionic.Platform.isWebView()) {
          if (!!IMState.nim && (!!('resetSessionUnread' in IMState.nim))) {
            IMState.nim.resetSessionUnread(id)
          }
          var user_id = null
          if (/^p2p-/.test(id)) {
            user_id = id.replace(/^p2p-/, '')
          } else if (/^team-/.test(id)) {
            user_id = id.replace(/^team-/, '')
          } else {
            user_id = id
          }
          if (ionic.Platform.isIOS()) {
            if (type == 'team') {
              cordova.plugins.yimPlugin.chat(user_id, 1, '', '',
                function (success) { console.log('云信群聊成功', success); },
                function (error) { console.log('云信群聊失败', error); });

            } else {
              cordova.plugins.yimPlugin.chat(user_id, 0, role, userRole,
                function (success) { console.log('云信Chat成功', success); },
                function (error) { console.log('云信Chat失败', error); });
            }
          }
          else {
            if (type == 'team') {
              cordova.plugins.yimPlugin.chat(user_id, 1, '', '',
                function (success) { console.log('云信群聊成功', success); },
                function (error) { console.log('云信群聊失败', error); });
            } else {
              cordova.plugins.yimPlugin.chat(user_id, 0, role, userRole,
                function (success) { console.log('云信Chat成功', success); },
                function (error) { console.log('云信Chat失败', error); });
            }
          }
        } else {
          if (type == 'p2p') {
            $state.go(IMENV.config.p2pUrl, { sessionId: id, name: name, role: role })
          } else if (type == 'team') {
            $state.go(IMENV.config.teamUrl, { teamId: id })
          }
        }
        IMPolyfill.rscUnread(id, 0)
      }

    })

    .config(function ($stateProvider, IMENV) {
      $stateProvider
        .state(IMENV.config.imUrl, {
          url: '/im_list',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/imList.html',
              controller: "im_list_ctrl as vm"
            }
          }
        })

        .state(IMENV.config.p2pUrl, {
          url: '/im_detail?sessionId?name?role',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/imDetail.html',
              controller: "im_detail_ctrl as vm"
            }
          }
        })

        .state(IMENV.config.teamUrl, {
          url: '/im_team?teamId',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/imTeam.html',
              controller: "im_team_ctrl as vm"
            }
          }
        })

        .state(IMENV.config.relationUrl, {
          url: '/new_relation',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/rscNewRelation.html',
              controller: "rsc_new_relation_ctrl as vm"
            }
          }
        })

        .state('rsc.slide', {
          url: '/slide',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/slide.html',
            }
          }
        }) //平台公告

        .state('rsc.video', {
          url: '/video',
          views: {
            'center-content': {
              templateUrl: 'js/module/im/template/video.html',
            }
          }
        }) //在线视频秘书
    })

    .controller('im_list_ctrl', ['$scope', '$rootScope', '$state', 'Storage', 'IMENV', 'IMState', 'IMUtils', 'IMFactory', 'RscIMService', 'IMPolyfill', 'im_detail_factory',
      function ($scope, $rootScope, $state, Storage, IMENV, IMState, IMUtils, IMFactory, RscIMService, IMPolyfill, im_detail_factory) {
        var vm = $scope.vm = this


        var userInfos = IMState.userInfos
        var myInfo = IMState.myInfo
        var myPhoneId = IMState.userUID

        vm.init = function () {
          vm.msg = {}
          IMPolyfill.getRscRelation(vm.msg)
          vm.sessionlist = []
          if (!!IMState.sessionlist.length) {
            vm.sessionlist = IMState.sessionlist
          }
          if (!!IMState.team.length) {
            vm.teamlist = IMFactory.getTeamSession()
          }
          // console.log(vm.sessionlist)
          // console.log(vm.teamlist)
          // return

          vm.loading = IMState.isLoading
          console.log('vm.loading', vm.loading)
          if (vm.loading) {
            setTimeout(function () {
              $scope.$apply(function () {
                vm.loading = false
              })
            }, 3000)
          }
        }

        $rootScope.$on('hideLoading', function () {
          console.log('hideLoading')
          vm.loading = IMState.isLoading
          if (vm.loading) {
            setTimeout(function () {
              $scope.$apply(function () {
                vm.loading = false
              })
            }, 3000)
          }
          angular.forEach(IMState.sessionlist, function (item) {
            item.name = ''
            item.avatar = ''
            if (item.scene === 'p2p') {
              var userInfo = null
              if (item.to !== myPhoneId) {
                userInfo = userInfos[item.to]
              }
              if (userInfo) {
                item.name = IMUtils.getFriendAlias(userInfo)
                item.avatar = userInfo.avatar
              }
            }
            var lastMsg = item.lastMsg || {}
            if (lastMsg.type === 'text') {
              item.lastMsgShow = lastMsg.text || ''
            } else if (lastMsg.type === 'custom') {
              item.lastMsgShow = IMUtils.parseCustomMsg(lastMsg)
            } else if (IMUtils.mapMsgType(lastMsg)) {
              item.lastMsgShow = "[" + IMUtils.mapMsgType(lastMsg) + "]"
            } else {
              item.lastMsgShow = ''
            }
            if (item.updateTime) {
              item.updateTimeShow = IMUtils.formatDate(item.updateTime, true)
            }
            vm.sessionlist.push(item)
          })
          if (!!IMState.team.length) {
            vm.teamlist = IMFactory.getTeamSession()
          }
        })

        vm.chat = function (id, type, role) {
          return $rootScope.chat(id, type, role)
        }

        vm.doRefresh = function () {
          IMFactory.reload({
            type: 'nim',
            force: true,
            uid: Storage.get('userInfo').user._id,
            sdktoken: 'a11111',
          })
          $scope.$broadcast('scroll.refreshComplete');
        }

        vm.invite = function () {
          $state.go(IMENV.config.inviteUrl)
        }

        vm.newRelation = function () {
          vm.data = 0
          $state.go(IMENV.config.relationUrl)
        }

        $rootScope.$on('updateMsg', function (e, data) {
          console.log(data.data)
          if (/^p2p-/.test(data.data.id)) {
            $scope.$apply(function () {
              angular.forEach(vm.sessionlist, function (item) {
                if (item.id == data.data.id) {
                  item.unread = data.data.unread
                  item.lastMsg = im_detail_factory.transMsg(data.data.lastMsg, 'session')
                }
              })
            })
          } else if (/^team-/.test(data.data.id)) {
            $scope.$apply(function () {
              angular.forEach(vm.teamlist, function (item) {
                if (item.id == data.data.id) {
                  item.unread = data.data.unread
                  item.lastMsg = im_detail_factory.transMsg(data.data.lastMsg, 'session')
                }
              })
            })
          }
        })

        $scope.$on("$ionicView.beforeEnter", function () {
          vm.init()
          var linkman = Storage.get('linkman')
          if (!linkman) {
            IMFactory.contact4IM()
          }
        })

      }
    ])

    .controller('im_detail_ctrl', ['$scope', '$rootScope', '$location', '$ionicScrollDelegate', 'ionicToast', '$stateParams', 'im_detail_factory', 'IMUtils', 'IMFactory', 'IMState',
      function ($scope, $rootScope, $location, $ionicScrollDelegate, ionicToast, $stateParams, im_detail_factory, IMUtils, IMFactory, IMState) {
        var vm = $scope.vm = this

        vm.init = function () {
          var sessionId = vm.sessionId = $stateParams.sessionId + ''
          var scene = vm.scene = IMUtils.parseSession(sessionId).scene
          var to = vm.to = IMUtils.parseSession(sessionId).to
          vm.role = $stateParams.role

          vm.isRobot = (function () {
            var user = null
            if (/^p2p-/.test(sessionId)) {
              user = sessionId.replace(/^p2p-/, '')
              if (IMState.robotInfos[user]) {
                return true
              }
            }
            return false
          })()

          vm.sessionName = (function () {
            var user = null
            if (/^p2p-/.test(sessionId)) {
              user = sessionId.replace(/^p2p-/, '')
              if (user === IMState.userUID) {
                return '我的手机'
              } else {
                var userInfo = vm.userInfo = IMState.userInfos[user] || {}
                return IMUtils.getFriendAlias(userInfo)
              }
            }
          })()
          if (!vm.sessionName) {
            vm.sessionName = $stateParams.name
          }

          IMFactory.showLoading()
          // 此时设置当前会话
          IMFactory.setCurrSession(vm.sessionId)
          vm.session = angular.copy(IMState.currSessionMsgs)
          angular.forEach(vm.session, function (item) {
            item = im_detail_factory.transMsg(item, 'session')
          })
          setTimeout(function () {
            IMFactory.hideLoading()
          }, 1000)
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }

        $rootScope.$on('updateMsg', function (e, data) {
          console.log(data.data)
          if (data.data.id == vm.sessionId) {
            $scope.$apply(function () {
              vm.lastMsg = data.data.lastMsg
              vm.lastMsg = im_detail_factory.transMsg(vm.lastMsg, 'session')
              vm.session.push(vm.lastMsg)
              IMFactory.delSameSess(vm.session)
              console.log(vm.session)
            })

            $location.hash("bottom");
            $ionicScrollDelegate.anchorScroll();
          }
        })

        vm.sendMsg = function (type) {
          if (/^\s*$/.test(vm.msg)) {
            ionicToast.show('请不要刷屏', 'middle', false, 1500)
            return
          } else if (vm.msg.length > 800) {
            ionicToast.show('请不要超过800个字', 'middle', false, 1500)
            return
          }
          vm.msg = vm.msg.trim()
          if (type === 'session') {
            // 如果是机器人
            if (vm.isRobot) {
              IMFactory.sendRobotMsg({
                type: 'text',
                scene: vm.scene,
                to: vm.to,
                robotAccid: vm.to,
                // 机器人后台消息
                content: vm.msg,
                // 显示的文本消息
                body: vm.msg
              })
            } else {
              var robotAccid = ''
              var robotText = ''
              var atUsers = vm.msg.match(/@[^\s@$]+/g)
              if (atUsers) {
                for (var i = 0; i < atUsers.length; i++) {
                  var item = atUsers[i].replace('@', '')
                  if (IMState.robotInfosByNick[item]) {
                    robotAccid = IMState.robotInfosByNick[item].account
                    robotText = (vm.msg + '').replace(atUsers[i], '').trim()
                    break
                  }
                }
              }
              if (robotAccid) {
                if (robotText) {
                  IMFactory.sendRobotMsg({
                    type: 'text',
                    scene: vm.scene,
                    to: vm.to,
                    // robotAccid,
                    // 机器人后台消息
                    content: robotText,
                    // 显示的文本消息
                    body: vm.msg
                  })
                } else {
                  IMFactory.sendRobotMsg({
                    type: 'welcome',
                    scene: vm.scene,
                    to: vm.to,
                    // robotAccid,
                    // 显示的文本消息
                    body: vm.msg
                  })
                }
              } else {
                IMFactory.sendMsg({
                  type: 'text',
                  scene: vm.scene,
                  to: vm.to,
                  text: vm.msg
                })
              }
            }
          } else if (type === 'chatroom') {
            IMFactory.sendChatroomMsg({
              type: 'text',
              text: vm.msg
            })
          }
          vm.msg = ''
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }

        vm.fileNameChanged = function (file) {
          $scope.$apply(function (scope) {
            var ipt = file
            console.log(ipt)
            if (ipt.value) {
              IMFactory.sendFileMsg({
                scene: vm.scene,
                to: vm.to,
                fileInput: ipt
              })

            }
          })
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }

        $scope.$on("$ionicView.beforeEnter", function () {
          vm.init()
        })

        $scope.$on("$ionicView.leave", function () {
          IMFactory.resetCurrSession()
        })

      }

    ])

    .controller('im_team_ctrl', ['$scope', '$rootScope', '$location', '$ionicScrollDelegate', 'ionicToast', '$stateParams', 'im_detail_factory', 'IMUtils', 'IMFactory', 'IMState',
      function ($scope, $rootScope, $location, $ionicScrollDelegate, ionicToast, $stateParams, im_detail_factory, IMUtils, IMFactory, IMState) {
        var vm = $scope.vm = this

        vm.init = function () {
          var teamId = $stateParams.teamId + ''
          var scene = vm.scene = IMUtils.parseSession(teamId).scene
          var to = vm.to = IMUtils.parseSession(teamId).to

          vm.sessionName = (function () {
            if (/^team-/.test(teamId)) {
              var name = teamId.replace(/^team-/, '')
              vm.teamId = teamId
              return IMState.teamMap[name].name
            } else if (teamId.length <= 10) {
              vm.teamId = teamId
              return IMState.teamMap[teamId].name
            }
          })()

          IMFactory.showLoading()
          // 此时设置当前会话
          IMFactory.setCurrSession(vm.teamId)
          vm.session = angular.copy(IMState.currSessionMsgs)
          angular.forEach(vm.session, function (item) {
            item = im_detail_factory.transMsg(item, 'session')
          })
          setTimeout(function () {
            IMFactory.hideLoading()
          }, 1000)
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }

        $rootScope.$on('updateMsg', function (e, data) {
          console.log(data.data)
          if (data.data.id == vm.teamId) {
            $scope.$apply(function () {
              vm.lastMsg = data.data.lastMsg
              vm.lastMsg = im_detail_factory.transMsg(vm.lastMsg, 'session')
              vm.session.push(vm.lastMsg)
              IMFactory.delSameSess(vm.session)
              console.log(vm.session)
            })
            $location.hash("bottom");
            $ionicScrollDelegate.anchorScroll();
          }
        })

        vm.sendMsg = function (type) {
          if (/^\s*$/.test(vm.msg)) {
            ionicToast.show('请不要刷屏', 'middle', false, 1500)
            return
          } else if (vm.msg.length > 800) {
            ionicToast.show('请不要超过800个字', 'middle', false, 1500)
            return
          }
          vm.msg = vm.msg.trim()
          if (type === 'session') {
            // 如果是机器人
            if (vm.isRobot) {
              IMFactory.sendRobotMsg({
                type: 'text',
                scene: vm.scene,
                to: vm.to,
                robotAccid: vm.to,
                // 机器人后台消息
                content: vm.msg,
                // 显示的文本消息
                body: vm.msg
              })
            } else {
              var robotAccid = ''
              var robotText = ''
              var atUsers = vm.msg.match(/@[^\s@$]+/g)
              if (atUsers) {
                for (var i = 0; i < atUsers.length; i++) {
                  var item = atUsers[i].replace('@', '')
                  if (IMState.robotInfosByNick[item]) {
                    robotAccid = IMState.robotInfosByNick[item].account
                    robotText = (vm.msg + '').replace(atUsers[i], '').trim()
                    break
                  }
                }
              }
              if (robotAccid) {
                if (robotText) {
                  IMFactory.sendRobotMsg({
                    type: 'text',
                    scene: vm.scene,
                    to: vm.to,
                    // robotAccid,
                    // 机器人后台消息
                    content: robotText,
                    // 显示的文本消息
                    body: vm.msg
                  })
                } else {
                  IMFactory.sendRobotMsg({
                    type: 'welcome',
                    scene: vm.scene,
                    to: vm.to,
                    // robotAccid,
                    // 显示的文本消息
                    body: vm.msg
                  })
                }
              } else {
                IMFactory.sendMsg({
                  type: 'text',
                  scene: vm.scene,
                  to: vm.to,
                  text: vm.msg
                })
              }
            }
          } else if (type === 'chatroom') {
            IMFactory.sendChatroomMsg({
              type: 'text',
              text: vm.msg
            })
          }
          vm.msg = ''
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }

        vm.fileNameChanged = function (file) {
          $scope.$apply(function (scope) {
            var ipt = file
            console.log(ipt)
            if (ipt.value) {
              IMFactory.sendFileMsg({
                scene: vm.scene,
                to: vm.to,
                fileInput: ipt
              })

            }
          })
          $location.hash("bottom");
          $ionicScrollDelegate.anchorScroll();
        }


        $scope.$on("$ionicView.beforeEnter", function () {
          vm.init()
        })

        $scope.$on("$ionicView.leave", function () {
          IMFactory.resetCurrSession()
        })

      }

    ])

    .controller('rsc_new_relation_ctrl', ['$scope', '$state', 'iAlert', '$cordovaBarcodeScanner', '$rootScope', 'Storage', 'IMENV', 'RscIMService', 'IMPolyfill', 'AuthenticationService',
      function ($scope, $state, iAlert, $cordovaBarcodeScanner, $rootScope, Storage, IMENV, RscIMService, IMPolyfill, AuthenticationService) {
        var vm = $scope.vm = this

        vm.init = function () {
          vm.loading = true
          RscIMService.getFriendList().then(function (res) {
            vm.loading = false
            if (res.status == 'success') {
              vm.list = res.data
            }
          })
        }

        vm.acceptJoinCompany = function (data) {
          console.log(data)
          // if (data.extend == 'TRADE_STORAGE') {
            vm.agreeDeal(data)
            // return
          // }
          // IMPolyfill.get_role(data, $scope, function (data) {
          //   console.log(data)
          //   vm.agreeDeal(data)
          // })
        }

        vm.agreeDeal = function (data) {
          RscIMService.agreeDeal(data._id, data.role).then(function (res) {
            console.log(res)
            if (res.status == 'success') {
              data.status = 'ACCEPT'
              AuthenticationService.checkToken().then(function (user) {
                RscIMService.companyInfo().then(function (res) {
                  console.log('公司信息', res);
                  if (res.status == 'success') {
                    user.company = res.data
                    $rootScope.currentUser = user
                    Storage.set('userInfo', user);
                    $rootScope.$broadcast('initUserInfo')
                    $rootScope.$broadcast('onReloadSidebar')
                  }
                })
              })
            } else {
              if (res.msg == 'have_company' || res.msg == '已有公司') {
                iAlert.alert('该用户已加入其它公司', function () {

                })
              }
            }
          })
        }

        vm.invite = function () {
          $state.go(IMENV.config.inviteUrl)
        }

        // 二维码
        vm.scanStart = function () {
          if (ionic.Platform.isWebView()) {
            $rootScope.rscScan()
          } else {

          }
        }

        $scope.$on("$ionicView.beforeEnter", function () {
          vm.init()
        })

      }
    ])


})()

