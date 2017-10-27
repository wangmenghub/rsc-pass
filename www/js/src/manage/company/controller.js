angular.module('rsc.manager', [])
    .run(function () {
    })
    .controller('company_manager_ctrl', ['$scope', '$state', '$timeout', '$location', '$ionicLoading', '$ionicScrollDelegate', '$rootScope', '$ionicModal', 'Storage', '$log', '$cordovaInAppBrowser', 'AccountSev',
        function ($scope, $state, $timeout, $location, $ionicLoading, $ionicScrollDelegate, $rootScope, $ionicModal, Storage, $log, $cordovaInAppBrowser, AccountSev) {
            var vm = $scope.vm = this;
            vm.init = function () {
                AccountSev.companyInfo().then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取公司信息', result)
                        if (result.data._id) {
                            vm.company_info = result.data;
                        } else {
                            vm.company_info = null;
                        }
                    }
                })
            }
            vm.goPersonHome = function (user) {
                $state.go('rsc.person_page', {
                    id: user._id,
                    type: user.role
                })
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })
        }
    ])
