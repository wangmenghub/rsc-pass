angular.module('rsc.service.traffic_me_common', [])
.factory('TrafficMeUtils', ['$log', '$bottomSheet', '$ionicLoading', 'FileUpload', '$http', '$timeout', '$ionicActionSheet', '$rootScope', '$compile', '$ionicBody', 'fileReader', 'ENV', '$ionicPlatform', '$ionicHistory', 'iAlert',
    function ($log, $bottomSheet, $ionicLoading, FileUpload, $http, $timeout, $ionicActionSheet, $rootScope, $compile, $ionicBody, fileReader, ENV, $ionicPlatform, $ionicHistory, iAlert) {

        return {
            showShare: showShare,
            actionImgShow: actionImgShow,
            upLoadImg: upLoadImg,
            changeImg: changeImg
        }

        function showShare($scope) {

            $scope.invitation = function () {
                // 显示上拉菜单
                $bottomSheet.show({
                    buttons: [
                        [{
                            btText: "微信好友",
                            img: "./img/common/share-icon.png",
                            btClass: "",
                            btId: "1"
                        },
                        {
                            btText: "朋友圈",
                            img: "./img/common/share-icon2.png",
                            btClass: "",
                            btId: "2"
                        },
                        {
                            btText: "复制链接",
                            img: "./img/common/share-icon1.png",
                            btClass: "",
                            btId: "3"
                        }
                        ],
                        [{
                            btText: "取消",
                            btClass: "share-cancel",
                            btId: "hide",
                            hideOnClick: true
                        }, //hide the bottomSheet when click
                        ]
                    ],
                    titleText: '',
                    buttonClicked: function (button, scope) {
                        if (button.btId == '1') {
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.TIMELINE, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)
                            } else {
                                $scope.alertQR();
                            }
                            scope.cancel()
                            return;
                        } else if (button.btId == '2') {
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.SESSION, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)

                            } else {
                                $scope.alertQR();
                            }
                            scope.cancel()
                            return;
                        } else if (button.btId == '3') {
                            $scope.copyForPhone = function () {
                                $cordovaClipboard
                                    .copy($scope.shareInfo.msg.title + $scope.shareInfo.msg.description + $scope.shareInfo.msg.url)
                                    .then(function () {
                                        // success
                                        iAlert.alert(($scope.shareInfo.opts.copy_msg || (($scope.shareInfo.msg.type ? $scope.shareInfo.msg.type : '') + $scope.shareInfo.msg.title + $scope.shareInfo.msg.description)) + '复制成功2!');
                                        // window.alert(($scope.shareInfo.opts.copy_msg || $scope.shareInfo.msg.description) + '复制成功!');
                                    }, function () {
                                        // error
                                        iAlert.alert('复制失败!');
                                    });
                            }
                            scope.cancel()
                            return;
                        }
                    }
                });


            }();

        }

        function actionImgShow() {
            var obj = {
                element: null,
                backbuttonRegistration: null,
                scope: null
            };
            var fns = {
                showLargeImg: function (opts) {
                    var scope = $rootScope.$new(true);
                    angular.extend(scope, {
                        larImgs: null,
                        currentImg: null,
                        imgClose: null
                    }, opts || {});
                    var element = scope.element = $compile('<img-slide-large lar-imgs="larImgs" current-img="{{currentImg}}" img-close="imgClose()"></img-slide-large>')(scope);

                    $ionicBody.append(element);

                    actionImgShow.imgIsShow = true;

                    obj.element = element;
                    obj.scope = scope;
                    /**
                     *自定义一个硬件返回按钮的注册事件，事件的优先级为102，可以优先关闭图片放大层
                     *返回一个注销该后退按钮动作的函数backbuttonRegistration并赋值全局obj变量
                     */
                    obj.backbuttonRegistration = $ionicPlatform.registerBackButtonAction(function (e) {
                        e.preventDefault();
                        if (actionImgShow.imgIsShow) {
                            actionImgShow.close();
                        } else {
                            if ($ionicHistory.backView()) {
                                $ionicHistory.goBack();
                            }
                        }
                    }, 102);
                },

                /**
                 *关闭图片放大层
                 */
                closeLargeImg: function () {
                    this.imgIsShow = false;
                    // 销毁作用域
                    obj.scope.$destroy();

                    obj.element.remove();
                    // 执行该注销该后退按钮动作的函数
                    if (obj.backbuttonRegistration) {
                        obj.backbuttonRegistration();
                    }

                    obj = {
                        element: null,
                        backbuttonRegistration: angular.noop,
                        scope: null
                    };
                },

            };

            /**
             *返回的服务对象
             */
            var actionImgShow = {
                // 图片放大服务的活动状态，true表示已弹出图片放大层，false表示关闭状态
                imgIsShow: false,
                // 图片放大层的弹出展示函数
                show: fns.showLargeImg,
                // 图片放大层的关闭函数
                close: fns.closeLargeImg
            };
            return actionImgShow;
        }

        function upLoadImg(vm, type, cb, obj) {
            vm.previewImageSrc = '';

            var _upimg = function (file, _url, $http) {
                var c = new FormData();
                c.append('file', file);
                c.append('type', 'logo')
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

            if (ionic.Platform.isWebView()) {
                var opt = {
                    params: { 'type': 'logo' },
                    url: ENV.api.account + 'file/upload/',
                    headers: {
                        'x-access-token': $rootScope.currentUser.token,
                        "Content-Type": undefined
                    }
                }
                FileUpload.upload('resizeImg', opt, function (res) {
                    res.then(function (json) {
                        var result = JSON.parse(json.response)
                        console.log(result)
                        if (result.status == "success") {
                            $ionicLoading.hide();
                            // 写入数据库
                            var _data = {}
                            _data[type] = result.data
                            cb(_data)

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
                // var obj = {
                //     templateUrl: 'js/common/template/popupRadio.html',
                //     title: '上传公司LOGO'
                // }
                iAlert.tPopup(vm, obj, data, function (res) {
                    if (res) {
                        var _url = ENV.api.account + 'file/upload/';
                        _upimg(vm.file[0], _url, $http).success(function (data) {
                            console.log(data)
                            if (data.status == "success") {
                                console.log('图片上传成功 进入下一步', data.data)

                                var _data = {}
                                _data[type] = data.data
                                cb(_data)
                            }
                        })
                    }

                })
            }

            // 获取input中files 信息
            vm.getUploadPic = function (e) {
                vm.file = e;
                vm.getFile()
            }
            // web端显示上传图片用
            vm.getFile = function () {
                fileReader.readAsDataUrl(vm.file[0], vm).then(function (result) {
                    vm.previewImageSrc = result;
                })
            };


        }

        function changeImg(vm, type, cb) {
            var previewImageSrc = '';
            var _data = {}
            // 显示上拉菜单
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: "更换主页封面图",
                },
                ],
                // destructiveText: 'Delete',
                // titleText: 'Modify your album',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        // 公司头像
                        var _upimg = function (file, _url, $http) {
                            var c = new FormData();
                            c.append('file', file);
                            c.append('type', 'company_bg_img')
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

                        if (ionic.Platform.isWebView()) {
                            var opt = {
                                params: { 'type': 'logo' },
                                url: ENV.api.account + 'file/upload/',
                                headers: {
                                    'x-access-token': $rootScope.currentUser.token,
                                    "Content-Type": undefined
                                }
                            }
                            FileUpload.upload('resizeImg', opt, function (res) {
                                res.then(function (json) {
                                    var result = JSON.parse(json.response)
                                    console.log(result)
                                    if (result.status == "success") {
                                        $ionicLoading.hide();
                                        // 写入数据库
                                        _data[type] = result.data
                                        cb(_data)
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
                                title: '更换主页封面图'
                            }
                            iAlert.tPopup(vm, obj, data, function (res) {
                                if (res) {
                                    var _url = ENV.api.account + 'file/upload/';
                                    _upimg(vm.file[0], _url, $http).success(function (data) {
                                        console.log(data)
                                        if (data.status == "success") {
                                            console.log('图片上传成功 进入下一步', data.data)
                                            // vm.companyInfo.url_logo = data.data   
                                            _data[type] = data.data
                                            cb(_data)
                                        }
                                    })
                                }

                            })

                        };

                    }
                },
                destructiveButtonClicked: function() {
                    return true;
                },
                cancel: function () {
                    return true;                        
                }

            })

            $timeout(function () {
                hideSheet();
            }, 3000);

            // 获取input中files 信息
            vm.getUploadPic = function (e) {
                vm.file = e;
                vm.getFile()
            }
            // web端显示上传图片用
            vm.getFile = function () {
                fileReader.readAsDataUrl(vm.file[0], vm).then(function (result) {
                    vm.previewImageSrc = result;
                })
            };

            return _data
        }

    }
])
