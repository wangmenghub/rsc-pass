(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMReminder', ['IMState',
      function (IMState) {
        return {
          onCustomSysMsg: onCustomSysMsg
        }

        function onCustomSysMsg(obj){
          var reminder = obj
          $rootScope.$emit('updateReminder', { reminder: reminder })
        }
      }])

})()