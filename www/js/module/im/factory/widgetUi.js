(function () {
  'use strict'

  angular.module('rsc.im.factory')
    .factory('IMWidgetUi', ['IMMutation',
      function (IMMutation) {
        return {
          showLoading: showLoading,
          hideLoading: hideLoading,
          showFullscreenImg: showFullscreenImg,
          hideFullscreenImg: hideFullscreenImg
        }

        // 显示加载中进度条
        function showLoading() {
          IMMutation.updateLoading(true)
        }

        // 隐藏加载中进度条
        function hideLoading() {
          IMMutation.updateLoading(false)
        }

        // 显示原图片
        function showFullscreenImg(obj) {
          if (obj) {
            obj.type = 'show'
            IMMutation.updateFullscreenImage(obj)
          }
        }

        // 隐藏原图片
        function hideFullscreenImg() {
          IMMutation.updateFullscreenImage({
            type: 'hide'
          })
        }

      }
    ])
})()