(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMUserInfo', ['IMMutation', 'IMState', 'IMENV', 'IMUtils',
      function (IMMutation, IMState, IMENV, IMUtils) {
        return {
          formatUserInfo: formatUserInfo,
          onMyInfo: onMyInfo,
          onUserInfo: onUserInfo
        }

        function formatUserInfo(obj) {
          var nim = IMState.nim
          var gender = ''
          switch (obj.gender) {
            case 'male':
              gender = '男'
              break
            case 'female':
              gender = '女'
              break
            case 'unknown':
              gender = ''
              break
          }

          var custom = obj.custom || ''
          try {
            custom = JSON.parse(custom)
          } catch (e) {
            custom = {
              data: custom
            }
          }

          // if (obj.avatar) {
          //   obj.avatar = nim.viewImageSync({
          //     url: obj.avatar, // 必填
          //     thumbnail: { // 生成缩略图， 可选填
          //       width: 40,
          //       height: 40,
          //       mode: 'cover'
          //     }
          //   })
          //   // obj.avatar += '?imageView&thumbnail=40x40&quality=85'
          // } else {
          //   obj.avatar = IMENV.config.defaultUserIcon
          // }

          var result = Object.assign(obj, {
            account: obj.account,
            nick: obj.nick || '',
            avatar: obj.avatar || IMENV.config.defaultUserIcon,
            birth: obj.birth || '',
            email: obj.email || '',
            tel: obj.tel || '',
            gender: gender,
            sign: obj.sign || '',
            custom: custom,
            createTime: obj.createTime || (new Date()).getTime(),
            updateTime: obj.updateTime || (new Date()).getTime()
          })

          return result
        }

        function onMyInfo(obj) {
          obj = IMUtils.mergeObject(IMState.myInfo, obj);
          var myInfo = formatUserInfo(obj)
          IMMutation.updateMyInfo(myInfo)
        }

        function onUserInfo(users) {
          if (!Array.isArray(users)) {
            users = [users]
          }
          // users = users.map(formatUserInfo)
          angular.forEach(users, function (item) {
            item = formatUserInfo(item)
          })
          IMMutation.updateUserInfo(users)
        }

      }
    ])
})()