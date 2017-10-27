(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMPolyfill', ['iAlert', 'Storage', 'IMMutation', 'IMState', 'RscIMService', '$rootScope',
      function (iAlert, Storage, IMMutation, IMState, RscIMService, $rootScope) {
        return {
          getRscInfo: getRscInfo,
          getRscRelation: getRscRelation,
          clearRscRead: clearRscRead,
          get_role: get_role,
          rscUnread: rscUnread,
          getCompanyTeam: getCompanyTeam,
          getNewInfo: getNewInfo,
          getContact: getContact,
          contact4IM: contact4IM
        }

        function getRscInfo(sessions) {
          var arr = []
          angular.forEach(sessions, function (data) {
            if (data.to.length == 24) {
              arr.push(data.to)
            }
          })
          RscIMService.getCompanys(arr).then(function (res) {
            if (res.status == 'success') {
              angular.forEach(res.data, function (value, key) {
                angular.forEach(sessions, function (data) {
                  if (data.to == key) {
                    data.companyInfo = value
                  }
                })
              })
            } else {
              angular.forEach(sessions, function (data) {
                data.companyInfo = {}
              })
            }
          })
          return sessions
        }

        function getRscRelation(data) {
          RscIMService.getNewFriend().then(function (res) {
            var unreadMsg = 0
            if (res.status == 'success') {
              unreadMsg = res.data.count
            } else {
              unreadMsg = 0
            }
            if (_.isObject(data)) {
              data.count = unreadMsg
              data.msg = res.data.relation
            }
            $rootScope.unreadMsg = unreadMsg + unreadIMMsg()
          })
        }

        function unreadIMMsg() {
          var unreadMsg = 0
          if (IMState.sessionlist.length) {
            angular.forEach(IMState.sessionlist, function (data) {
              unreadMsg += data.unread
            })
          }
          if (IMState.teamlist.length) {
            angular.forEach(IMState.teamlist, function (data) {
              if (/^team-/.test(data.id)) {
                unreadMsg += data.unread
              }

            })
          }
          return unreadMsg
        }

        function getCompanyTeam(id) {
          RscIMService.getCompanyTeam(id).then(function (res) {
            if (res.status == 'success') {
              IMState.team = rsc2NIMTeam(res.data)
              IMMutation.addTeamMap(IMState.team)
            } else {
              console.log(res)
            }
          })
        }

        function clearRscRead(id) {
          setTimeout(function () {
            RscIMService.messageRead(id, 1).then(function (res) {
              if (res.status != 'success') {
                return false
              }
            })
          }, 2000)
        }
        // 角色弹出框
        function get_role(data, vm, callback) {
          vm.popup_lists = [{
            chn: '采购负责人',
            eng: 'TRADE_PURCHASE'
          }, {
            chn: '销售负责人',
            eng: 'TRADE_SALE'
          }, {
            chn: '超级管理员',
            eng: 'TRADE_ADMIN'
          }
          ];
          var object = {
            templateUrl: 'js/common/template/popupRadio.html',
            title: '选择加入角色'
          };
          var objmsg = {
            type: 'radio'
          };
          iAlert.tPopup(vm, object, objmsg, function (res) {
            if (res) {
              data.role = res.subtype.eng
              callback(data)
            }
          })
        }

        function rscUnread(id, unread) {
          RscIMService.messageRead(id, unread).then(function (res) {
            if (res.status != 'success') {
              return false
            }
          })
        }

        function rsc2NIMTeam(data) {
          var newArr = []
          angular.forEach(data, function (item) {
            var newItem = {}
            newItem.name = item.tname
            newItem.avatar = item.icon
            newItem.teamId = item.tid
            newItem.memberNum = item.members.length
            newItem.owner = item.owner
            newArr.push(newItem)
          })
          return newArr
        }

        function getNewInfo(arr, item) {
          RscIMService.getCompanys(arr).then(function (res) {
            // console.log(res)
            if (res.status == 'success') {
              angular.forEach(res.data, function (value, key) {
                angular.forEach(item, function (data) {
                  if (data.to == key) {
                    data.companyInfo = value
                  }
                })
              })
            } else {
              return null
            }
          })
        }

        function getContact(fn,cb) {
          var arr = []
          var contact = {}
          //获取联系人数据
          RscIMService.getContactList().then(function (data) {
            if (data.status == 'success') {
              contact = data.data
              if (_.isArray(contact['COLLEAGUE'])) {
                contact['COLLEAGUE'].list = JSON.parse(JSON.stringify(contact['COLLEAGUE']))
                contact['COLLEAGUE'].count = contact['COLLEAGUE'].length
              }
              angular.forEach(contact, function (value, key) {
                if (key == 'COLLEAGUE') {
                  angular.forEach(value.list, function (data) {
                    if (data.phone == $rootScope.currentUser.user.phone) {
                      contact['ZADMIN'] = {}
                      contact['ZADMIN'].list = [data]
                      var index = _.indexOf(value.list, data)
                      value.list.splice(index, 1)
                    }
                  })
                }
                // 不同结构数据处理
                if (_.isFunction(fn)) {
                  fn(value,key)
                }

              })
              angular.forEach(contact, function (value, key) {
                arr.push({
                  key: key,
                  value: value
                })
              })
            } else {
            }
          }).then(function(){
            // 不同结构回调处理
            if (_.isFunction(cb)) {
              cb(arr,contact)
            }
          })
        }

        function contact4IM() {
          getContact(function (value) {
            var tmp = []
            angular.forEach(value.list, function (data, i) {
              if (!data.status) {
                tmp.unshift(i)
              }
            })
            angular.forEach(tmp, function (i) {
              value.list.splice(i, 1)
            })
          }, function(arr){
            var newArr = []
            angular.forEach(arr, function(data){
              if(data.value.list&&data.value.list.length != 0){
                data.count = data.value.list.length
                newArr.push(data)
              }
            })
            Storage.set('linkman',newArr)
          })
        }

      }
    ])

})()