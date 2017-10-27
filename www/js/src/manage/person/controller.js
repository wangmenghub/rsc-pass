(function () {
    "use strict"

    angular.module('rsc.controller.traffic_menu', [])
        .controller('traffic_person_ctrl', ['$scope', '$rootScope', '$ionicModal', 'auth', 'Storage', 'TrafficPersonService', '$cordovaBarcodeScanner', '$cordovaInAppBrowser','rscWebTab',
            function ($scope, $rootScope, $ionicModal, auth, Storage, TrafficPersonService, $cordovaBarcodeScanner, $cordovaInAppBrowser,rscWebTab) {
                var vm = $scope.vm = this
                vm.init = function () {
                    if($rootScope.currentUser.user&&$rootScope.currentUser.user.length != 0){
                        vm.user = $rootScope.currentUser.user
                        vm.company = $rootScope.currentCompanyInfo
                        vm.code = vm.user._id + '&' + vm.user.role;
                    } else if (auth.data && auth.data.user) {
                        vm.user = auth.data.user
                        vm.code = vm.user._id + '&' + vm.user.role
                        vm.company = auth.data.company
                        console.log('>>>auth:' + auth)
                    } else{
                        vm.userInfo = Storage.get('userInfo')
                        vm.user = vm.userInfo.user
                        vm.company = vm.userInfo.company
                        vm.code = vm.user._id + '&' + vm.user.role;
                    }

                }

                $rootScope.$on('onReloadSidebar', function(){
                    vm.init()
                })

                //二维码添加模态框
                $ionicModal.fromTemplateUrl('./js/src/manage/person/person_homepage/mycode.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal_code = modal;
                });
                vm.openModalCode = function () {
                    $scope.modal_code.show();
                };
                vm.closeModalCode = function () {
                    $scope.modal_code.hide();
                };

                vm.scanStart = function () {
                    $cordovaBarcodeScanner.scan({
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: true, // iOS and Android
                        showTorchButton: true, // iOS and Android
                        torchOn: false, // Android, launch with the torch switched on (if available)
                        prompt: "扫一扫", // Android
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats: "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                        orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations: true, // iOS
                        disableSuccessBeep: false // iOS
                    }).then(function (result) {
                       if(result.text != ''){
                            var data = result.text.split("&")
                            console.log(result)
                            if(!data[1]){
                                data[1] = 'TRAFFIC_DRIVER_PRIVATE'
                            }
                            $rootScope.rootGoDetail(data[1], data[0])
                        }
                    }, function (error) {
                        alert("请重新扫描");
                    })
                };
                vm.aboutUs = function () {
                    console.log($cordovaInAppBrowser)
                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'yes'
                    };
                    $cordovaInAppBrowser.open('http://www.e-wto.com/', '_blank', options)

                        .then(function (event) {
                            // success
                            console.log(event)

                        })

                        .catch(function (event) {
                            // error
                            console.log(event)
                        });
                };

                vm.phone = function () {
                    window.plugins.CallNumber.callNumber(function (e) {
                        console.log(e)
                    }, function (e) {
                        console.log(e)
                    }, '010-57406666', true)
                }
				vm.menuTabs = rscWebTab.getTabs(Storage.get('userInfo').user.role);
				vm.menuChange = function (num) {
					angular.forEach(vm.menuTabs, function (item, key) {

						if (key == num) {
							item.active = true;
						} else {
							item.active = false;
						}
					}, this);
				}

            }
        ])

})()
