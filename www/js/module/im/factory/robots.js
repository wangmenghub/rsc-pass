(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMRobots', ['IMMutation',
      function (IMMutation) {
        return {
          onRobots: onRobots
        }

        function onRobots(robots) {
          IMMutation.updateRobots(robots)
        }

      }
    ])

})()