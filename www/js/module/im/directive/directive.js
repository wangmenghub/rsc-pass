(function () {
  'use strict'
  angular.module('rsc.im.directive', [])

    .directive('scrollBottom', function () {
      return {
        scope: {
          scrollBottom: "="
        },
        link: function (scope, element) {
          scope.$watchCollection('scrollBottom', function (newValue) {
            if (newValue) {
              $(element).scrollTop($(element)[0].scrollHeight);
            }
          });
        }
      }
    })

    .directive('ngEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.ngEnter);
            });

            event.preventDefault();
          }
        });
      };
    })

    .directive("fileread", [function () {
      return {
        scope: {
          fileread: "="
        },
        link: function (scope, element, attributes) {
          element.bind("change", function (changeEvent) {
            var reader = new FileReader();
            reader.onload = function (loadEvent) {
              scope.$apply(function () {
                scope.fileread = loadEvent.target
              });
            }
            reader.readAsDataURL(changeEvent.target.files[0]);
          });
        }
      }
    }]);

})()
