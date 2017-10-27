(function () {
    angular.module('rsc.controller.traffic_person_setting', [])
        .controller('traffic_person_setting_ctrl', ['$scope', '$window', '$rootScope', '$stateParams', '$ionicLoading', 'Storage', '$state', '$ionicHistory', 'ENV', 'iAlert', 'TrafficPersonService', 'fileReader', '$http', 'auth', 'FileUpload', 'ionicToast', 'IMFactory',
            function ($scope, $window, $rootScope, $stateParams, $ionicLoading, Storage, $state, $ionicHistory, ENV, iAlert, TrafficPersonService, fileReader, $http, auth, FileUpload, ionicToast, IMFactory) {
                var vm = $scope.vm = this
                vm.enter = $stateParams.enter === 'true'
                vm.btn_text = '获取验证码';
                vm.getUserInfo = function () {
                    vm.userInfo = Storage.get('userInfo')
                    vm.user = vm.userInfo.user
                }

                vm.logOut = function () {

                    TrafficPersonService.logOut().then(function (res) {
                        IMFactory.logout()
                        Storage.clear()
                        //清除缓存
                        $ionicHistory.clearHistory()
                        $ionicHistory.clearCache()
                        auth = null
                        // delete $rootScope[prop]; 
                        delete $rootScope.currentUser
                        delete $rootScope.currentCompanyInfo
                        delete $rootScope.unreadMsg
                        $window.location.reload().then(
                            function success() {
                                $state.go('login_guide');
                            },
                            function error(error) {
                                $state.go('login_guide');
                            }
                        );

                    })
                }


                // 及时修改公司信息
                vm.modify_user_info = function (e) {
                    if (e == 'user_img') {
                        return popup_headerimg()
                    } else if (e == 'user_gender') {
                        return get_gender()
                    } else {
                        return popup()
                    }
                }

                function popup() {
                    return function (params, title) {
                        if (params == 'real_name') {
                            var data = {
                                type: 'real_name',
                                real_name: vm.user.real_name
                            }
                            var key = 'real_name'
                        } else if (params == 'phone') {
                            var data = {
                                type: 'phone',
                                phone: vm.user.phone,
                                send_vertify: send_vertify,
                                btn_text: vm.btn_text
                            }
                            var key = 'phone'
                        } else if (params == 'post') {
                            var data = {
                                type: 'post',
                                post: vm.user.post
                            }
                            var key = 'post'
                        }
                        var obj = {
                            templateUrl: 'js/common/template/companyNickname.html',
                            title: title
                        };
                        // _popup($scope, obj, $ionicPopup, data).then(
                        iAlert.tPopup($scope, obj, data, function (res) {
                            console.log(res)
                            var _data = {}
                            if (res.type == 'phone') {
                                _data.phone = res.phone,
                                    _data.verify_code = res.code
                            } else if (res) {
                                _data[key] = res[key]
                            }
                            user_modify(_data)
                        })
                    }
                };

                function get_gender() {
                    //console.log('hangye')
                    $scope.popup_lists = [{
                        chn: '男',
                        eng: 'MALE'
                    }, {
                        chn: '女',
                        eng: 'FEMALE'
                    }];
                    var object = {
                        templateUrl: 'js/common/template/popupRadio.html',
                        title: '选择性别'
                    };
                    var objmsg = {
                        type: 'radio'
                    };
                    // _popup($scope, object, $ionicPopup, objmsg).then(
                    iAlert.tPopup($scope, object, objmsg, function (res) {
                        if (res) {
                            console.log(res)
                            vm.user.gender = res.subtype.eng;
                            var _data = {
                                gender: vm.user.gender
                            };
                            user_modify(_data)
                        }
                    })
                };

                var _upimg = function (file, _url, $http) {
                    var c = new FormData();
                    c.append('file', file);
                    c.append('type', 'tou_xiang')
                    // 上传图片
                    return $http({
                        method: 'POST',
                        url: _url,
                        data: c,
                        headers: {
                            "Content-Type": undefined
                        },
                        transformRequest: angular.identity
                    })
                };

                // 个人头像
                popup_headerimg = function () {
                    $scope.previewImageSrc = '';
                    if (ionic.Platform.isWebView()) {
                        var opt = {
                            params: { 'type': 'tou_xiang' },
                            url: ENV.api.account + 'file/upload/',
                            headers: {
                                'x-access-token': $rootScope.currentUser.token,
                                "Content-Type": undefined
                            }
                        }
                        FileUpload.upload('resizeImg', opt, function (res) {
                            console.log(res)
                            res.then(function (json) {
                                var result = JSON.parse(json.response)
                                console.log(result)
                                if (result.status == "success") {
                                    $ionicLoading.hide();
                                    // 写入数据库
                                    vm.user.photo_url = result.data
                                    var _data = {
                                        photo_url: result.data
                                    }
                                    user_modify(_data)
                                } else {
                                    ionicToast.alert('上传失败!');
                                    $ionicLoading.hide();
                                }
                            }, function (err) {
                                console.log(err)
                                $ionicLoading.hide();
                                ionicToast.alert('上传失败!');
                            }, function (progress) {

                            }).finally(function () {
                                $ionicLoading.hide();

                            });
                        })
                    } else {
                        var data = {
                            type: 'file'
                        }
                        var obj = {
                            templateUrl: 'js/common/template/popupRadio.html',
                            title: '上传个人头像'
                        }
                        iAlert.tPopup($scope, obj, data, function (res) {
                            if (res) {
                                var _url = ENV.api.account + 'file/upload/';
                                _upimg($scope.file[0], _url, $http).success(function (data) {
                                    console.log(data)
                                    if (data.status == "success") {
                                        console.log('图片上传成功 进入下一步', data.data)
                                        vm.user.photo_url = data.data
                                        var _data = {
                                            photo_url: data.data
                                        }
                                        user_modify(_data)
                                    }
                                })
                            }

                        })
                    }
                }

                // 获取input中files 信息
                $scope.getUploadPic = function (e) {
                    $scope.file = e;
                    //console.log($scope.file)
                    $scope.getFile()
                };

                $scope.getFile = function () {
                    fileReader.readAsDataUrl($scope.file[0], $scope).then(function (result) {
                        $scope.previewImageSrc = result;
                        //console.log($scope.previewImageSrc)
                    })
                };

                // 发送验证码
                function send_vertify(data) {
                    TrafficPersonService.sendVertify(data.phone).then(function (res) {
                        if (res.status == 'success') {
                            data.code = res.data.code
                        } else {
                            ionicToast.show(res.msg, 'middle', false, 2500);
                        }
                    })
                }

                // 修改个人信息
                function user_modify(_data) {
                    TrafficPersonService.editUser(_data).then(function (data) {
                        console.log(data)
                        if (data.status == 'success') {
                            vm.getUserInfo()
                            angular.forEach(_data, function (value, key) {
                                vm.userInfo.user[key] = value
                            })
                            Storage.set('userInfo', vm.userInfo)
                            $rootScope.currentUser = vm.userInfo
                            $rootScope.$broadcast('onReloadSidebar')
                        }
                        if (data.msg == "phone_is_used") {
                            iAlert.alert('该号码号已被占用！请更换其他号码进行替换！')
                        }
                    })
                };


            }
        ])

})()
