(function () {
  'use strict'

  angular.module('rsc.contact', [
    'ui.router'
  ])
    .config(function ($stateProvider) {
      $stateProvider
        .state('rsc.contact', {
          url: '/contact',
          views: {
            'center-content': {
              templateUrl: 'js/module/contact/template/contact.html',
              controller: "rsc_contact_ctrl as vm"
            }
          }
        })
    })

    .controller('rsc_contact_ctrl', ['$scope', '$rootScope', '$stateParams', 'IMFactory', 'Storage',
      function ($scope, $rootScope, $stateParams, IMFactory, Storage ) {
        var vm = $scope.vm = this
        var cache = {} // 搜索缓存
        vm.contact = {} // 服务器返回通讯录
        vm.arr = []
        if (!!$rootScope.currentUser) {
          vm.user = $rootScope.currentUser.user
        } else {
          vm.user = Storage.get('userInfo').user
        }
        vm.role = vm.user.role
        vm.phone = vm.user.phone
        vm.show = true


        // 搜索
        vm.search = function (name) {
          angular.copy(vm.contact, cache)
          if (name) {
            name = name.replace(/(^\s+)|(\s+$)/g, "")
            vm.name_search_list = []; // 搜索联系人列表
            angular.forEach(vm.contact, function (value, key) {
              vm.list = []
              angular.forEach(value.list, function (data) {
                if (data.name && data.name.indexOf(name) != -1) {
                  vm.list.push(data)
                }
              })
              value.list = vm.list
              value.count = value.list.length
              vm.name_search_list.push({
                key: key,
                value: value
              })
            })
            vm.arr = vm.name_search_list

          } else {
            vm.init()
          }
          return vm.arr
        }

        vm.init = function () {
          vm.loading = true
          if (!vm.contact.length) {
            vm.show = true
            vm.arr = []
            IMFactory.getContact(
              function (value, key) {
                angular.forEach(value.list, function (data) {
                  if (vm.role == 'TRADE_ADMIN') {
                    if (data.status) {
                      data.show = false
                    } else {
                      data.show = true
                    }
                  } else {
                    if (key == 'COLLEAGUE') {
                      data.show = false
                    } else {
                      data.status ? data.show = false : data.show = true
                    }
                  }
                })
              },
              function (arr, contact) {
                vm.loading = false
                vm.arr = arr
                vm.contact = contact
                var kick = true
                angular.forEach(vm.contact, function (value, key) {
                  if (!!value.list&&value.list.length != 0) {
                    kick = false
                  }
                })
                if (kick) {
                  vm.show = false
                }
                console.log(vm.arr)
              }
            )
          } else {
            angular.copy(cache, vm.contact)
            angular.forEach(vm.contact, function (value, key) {
              vm.arr.push({
                key: key,
                value: value
              })
            })
          }
        }

        vm.goDetail = function (user) {
          if (user.show) {
            return false
          } else {
            $rootScope.rootGoDetail(user.role, user._id)
          }
        }

        vm.chat = function (id, type, role) {
          var newId = type+'-'+id
          return $rootScope.chat(newId, type, role)
        }

        $scope.$on("$ionicView.beforeEnter", function () {
          vm.init()
        })

      }
    ])

})()