(function () {
    "use strict"
    angular.module('rsc.controller.traffic_company_setting', [])
        .controller('traffic_company_setting_ctrl', ['$scope', '$ionicHistory', '$ionicModal', '$state', '$stateParams', '$http', '$rootScope', '$ionicLoading', '$interval', 'TrafficCompanySettingService', 'iAlert', 'Storage', 'AuthenticationService', 'AccountInformation', 'ENV', 'fileReader', 'ionicToast', 'FileUpload', 'AccountSev', 'AccountService',
            function ($scope, $ionicHistory, $ionicModal, $state, $stateParams, $http, $rootScope, $ionicLoading, $interval, TrafficCompanySettingService, iAlert, Storage, AuthenticationService, AccountInformation, ENV, fileReader, ionicToast, FileUpload, AccountSev, AccountService) {
                var vm = $scope.vm = this
                var newDate = []

                // 初始化
                vm.init = function () {
                    vm.enter = $stateParams.enter
                    vm.new = $stateParams.new
                    vm.url_type = 'company_traffic/'
                    vm.userInfo = $rootScope.currentUser
           
                    vm.isTransport = false
                    vm.setTransport = []
                    if (!!vm.setTransport.length) {
                        vm.com_info = _.uniq(vm.setTransport)
                    } else {
                        vm.com_info = _.uniq(vm.userInfo.user.transport)
                    }
                    if (vm.userInfo.user.company_id == '') {
                        // 散户设置页
                        vm.companyInfo = {
                            url_logo: '',
                            nick_name: '',
                            province: '',
                            city: '',
                            district: '',
                            url_yingyezhizhao: '',
                            des: '',
                            phone_creator: vm.userInfo.user.phone,
                            transport: vm.setTransport
                        }
                        console.log('>>>>>new', vm.companyInfo, vm.com_info)
                        vm.verify = false
                    } else {
                        // 公司设置页
                        vm.companyInfo = vm.userInfo.company
                        if(!!vm.companyInfo){
                            vm.com_info = _.uniq(vm.companyInfo.transport)
                            if (vm.companyInfo.verify_phase == 'SUCCESS' || vm.companyInfo.verify_phase == 'PROCESSING') {
                                vm.verify = true
                            } else {
                                vm.verify = false
                            }
                            var location = [vm.companyInfo.province, vm.companyInfo.city, vm.companyInfo.district]
                        }else{
                            var location = [' ',' ','请选择']
                        }
                        
                    }
                    //地址选择
                    vm.cssClass = vm.verify?'item item-type item-icon-right text-gray':'item item-type item-icon-right'
                    vm.pickCityPickDataSendNew = {
                        areaData: [],
                        backdrop: true,
                        backdropClickToClose: true,
                        defaultAreaData: location,
                        buttonClicked: function () {
                            var res = vm.pickCityPickDataSendNew;
                            vm.prov_address = res.currentProvince.ProID; //res.currentProvince.ProID
                            vm.city_address = res.currentArea.CityID;
                            vm.dist_address = res.currentArea.DisID ? res.currentArea.DisID : ''
                            if (vm.companyInfo.verify_phase == 'PROCESSING') {
                                iAlert.alert('企业认证中，不能随意修改');
                                return false;
                            }
                            if (vm.verify) {
                                iAlert.alert('请重新认证，进行修改');
                                return false;
                            }
                            var _data = {
                                province: vm.prov_address,
                                district: vm.dist_address,
                                city: vm.city_address
                            };
                            vm.companyInfo.province = res.currentProvince.name
                            vm.companyInfo.city = res.currentCity.name
                            vm.companyInfo.district = res.currentArea.name
                            console.log(res)
                            $scope.company_modify(_data)
                        },
                        tag: '',
                        iconClass: '',
                        /*title: $stateParams.differentiate == 'Delivery_of_the_goods' ? '交货地址' : '提货地址',*/
                        title: "所在地区",
                        cssClass: vm.cssClass,
                        watchChange: true
                    };
                }

                // 重置

                function reset(callback) {
                    // 获取公司信息
                    AuthenticationService.checkToken().then(function (user) {
                        TrafficCompanySettingService.companyInfo().then(function (res) {
                            console.log('公司信息', res);
                            if (res.status == 'success') {
                                user.company = res.data
                                Storage.set('userInfo', user);
                                if (!vm.new) {
                                    vm.companyInfo = res.data;
                                }
                                $rootScope.$broadcast('initUserInfo')
                                if (_.isFunction(callback)) {
                                    callback()
                                }

                            }
                        })
                    }, function () {
                        ionicToast.show('获取公司信息失败，请重新登录', 'middle', false, 2500)
                        $state.go('login_guide');
                    })

                }

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

                // 重新认证
                vm.reverify = function () {
                    iAlert.confirm('重新认证', '是否提交新的企业资料进行重新认证', function () {
                        if (vm.verify) {
                            TrafficCompanySettingService.cancelVerify().then(function (data) {
                                console.log(data)
                                if (data.status == 'success') {
                                    vm.verify = false
                                    reset()
                                }
                            })
                        } else {
                            iAlert.alert('该企业清空认证资料！')
                        }
                    })

                }


                // 设置买卖
                // 选择行业模态框
                $ionicModal.fromTemplateUrl('./js/src/manage/company/setting/industryModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal_industry = modal;
                });
                vm.openIndustryModal = function () {
                    if(vm.verify){
                        return false
                    }
                    vm.getIndustry()
                    vm.setTransport = []
                    $scope.modal_industry.show();
                };
                vm.closeIndustryModal = function () {
                    $scope.modal_industry.hide()
                    vm.setTransport = []
                };
                vm.saveIndustryModal = function () {

                    vm.companyInfo.transport = vm.setTransport
                    vm.com_info = _.uniq(vm.setTransport)
                    console.log(vm.companyInfo)
                    console.log(vm.com_info)
                    $scope.modal_industry.hide()
                }
                // 选择种类
                vm.itemSelected = function ($event, product, item) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        product.selected = true;
                        vm.setTransport.push(product.eng);
                    } else {
                        product.selected = false;
                        if (item == 'buy') {
                            vm.setTransport = vm.setTransport.splice(vm.setTransport.indexOf(product.eng), 1)
                        }
                    }
                };

                // 获取行业种类
                vm.getIndustry = function () {
                    AccountService.getMaterial().then(function (result) {
                        console.log(result)
                        if (result.status == 'success') {
                            vm.Industry = result.data;
                            // angular.forEach(vm.Industry, function (data) {
                            //     data.img = './img/general/' + data.eng + '.png'
                            // })
                            vm.TransportList = JSON.parse(JSON.stringify(vm.Industry))
                        }
                    })
                }

                // 修改公司信息
                vm.modify_companyinfo = function (e) {
                    if(vm.verify){
                        return false
                    }
                    if (vm.userInfo.user.role != 'TRAFFIC_ADMIN') {
                        iAlert.alert('您暂无修改权限，请联系超级管理员修改');
                        return false;
                    }
                    if (vm.companyInfo.verify_phase == 'PROCESSING') {
                        iAlert.alert('企业认证中，不能随意修改');
                        return false;
                    }
                    switch (e) {
                        case 'url_logo':
                            $scope.popup_headerimg();
                            break;
                        case 'des':
                            $scope.popup_desc();
                            break;
                        case 'nick_name':
                            $scope.popup_nick()
                            break;
                        case 'licenseimg':
                            $scope.popup_licenseimg();
                            break;
                        case 'submit':
                            $scope.submitCert();
                            break;
                        case 'phone':
                            $scope.popup_phone()
                            break;
                    }
                };
                // 公司昵称弹窗
                $scope.popup_nick = function () {
                    var data = {
                        type: 'nick_name',
                        nick_name: vm.companyInfo.nick_name
                    };
                    var obj = {
                        templateUrl: 'js/common/template/companyNickname.html',
                        title: '公司昵称'
                    };
                    iAlert.tPopup($scope, obj, data, function (res) {
                        if (res) {
                            vm.companyInfo.nick_name = res.nick_name;
                            var _data = {
                                nick_name: vm.companyInfo.nick_name
                            };
                            $scope.company_modify(_data)
                        }
                    })
                };
                // 公司描述弹窗
                $scope.popup_desc = function () {
                    var data = {
                        type: 'company',
                        desc: vm.companyInfo.des
                    };
                    var obj = {
                        templateUrl: 'js/common/template/companyDes.html',
                        title: '公司介绍'
                    };
                    iAlert.tPopup($scope, obj, data, function (res) {
                        console.log(res)
                        if (res) {
                            vm.companyInfo.des = res.desc;
                            var _data = {
                                des: vm.companyInfo.des
                            };
                            $scope.company_modify(_data)
                        }
                    })
                }
                // 公司头像
                $scope.popup_headerimg = function () {
                    $scope.previewImageSrc = '';
                    if (ionic.Platform.isWebView()) {
                        var opt = {
                            params: {'type':'logo'},
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
                                    vm.companyInfo.url_logo = result.data
                                    var _data = {
                                        url_logo: result.data
                                    }
                                    $scope.company_modify(_data)
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
                            title: '上传公司LOGO'
                        }
                        iAlert.tPopup($scope, obj, data, function (res) {
                            if (res) {
                                var _url = ENV.api.account + 'file/upload/';
                                _upimg($scope.file[0], _url, $http).success(function (data) {
                                    console.log(data)
                                    if (data.status == "success") {
                                        console.log('图片上传成功 进入下一步', data.data)
                                        vm.companyInfo.url_logo = data.data
                                        var _data = {
                                            url_logo: data.data
                                        }
                                        $scope.company_modify(_data)
                                    }
                                })
                            }

                        })
                    }
                };
                // 营业执照
                $scope.popup_licenseimg = function () {
                    $scope.previewImageSrc = '';
                    if (ionic.Platform.isWebView()) {
                        var opt = {
                            params: {'type':'ying_ye_zhi_zhao'},
                            url: ENV.api.account + 'file/upload/',
                            headers: {
                                'x-access-token': $rootScope.currentUser.token,
                                "Content-Type": undefined
                            }
                        }
                        FileUpload.upload('resizeImg', opt, function (res) {
                            console.log(res)
                            res.then(function (json) {
                                var result = JSON.parse(json.response);
                                if (result.status == "success") {
                                    $ionicLoading.hide();
                                    vm.companyInfo.url_yingyezhizhao = result.data
                                    // 写入数据库
                                    var _data = {
                                        ying_ye_zhi_zhao: result.data
                                    }
                                    $scope.company_modify(_data)
                                } else {
                                    ionicToast.alert('上传失败!');
                                    $ionicLoading.hide();
                                }

                            }, function (err) {
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
                        };
                        var obj = {
                            templateUrl: 'js/common/template/popupRadio.html',
                            title: '营业执照'
                        };
                        iAlert.tPopup($scope, obj, data, function (res) {
                            if (res) {
                                var _url = ENV.api.account + 'file/upload';
                                _upimg($scope.file[0], _url, $http).success(function (data) {
                                    if (data.status == "success") {
                                        vm.companyInfo.url_yingyezhizhao = data.data;
                                        console.log('图片上传成功 进入下一步', data.data)
                                        var _data = {
                                            url_yingyezhizhao: data.data
                                        }
                                        $scope.company_modify(_data)
                                    }
                                })
                            }
                        })
                    }
                };
                // 超管电话
                $scope.popup_phone = function () {
                    var data = {
                        type: 'phone',
                        phone: vm.companyInfo.phone_creator,
                        btn_text: '获取验证码',
                        send_vertify: function (data) {
                            if (data.phone.length < 11) {
                                return false
                            }
                            AccountSev.getCode(data.phone).then(function (res) {
                                data.isDisabled = true;
                                data.nums = 60;
                                data.timer = $interval(function () {
                                    data.nums--;
                                    data.btn_text = '(' + data.nums + 's)重发';
                                    if (data.nums == 0) {
                                        data.btn_text = '重新获取';
                                        $interval.cancel(data.timer);
                                        data.isDisabled = false;
                                    }
                                }, 1000);
                                if (res.status == 'success') {
                                    data.code = res.data.code
                                } else {
                                    ionicToast.show(res.msg, 'middle', false, 2500);
                                }
                            })
                        }
                    };
                    var obj = {
                        templateUrl: 'js/common/template/companyNickname.html',
                        title: '企业超管手机号'
                    };
                    iAlert.tPopup($scope, obj, data, function (res) {
                        console.log(res)
                        if (res) {
                            vm.companyInfo.phone_creator = res.phone;
                            var _data = {
                                phone_creator: vm.companyInfo.phone_creator
                            };
                            $scope.company_modify(_data)
                        }
                    })
                }
                // 提交认证
                $scope.submitCert = function () {
                    // var temp = {}
                    // angular.forEach(newDate, function (data) {
                    //     _.extend(temp, data)
                    // })
                    // console.log(temp)

                    if (!vm.verify && vm.companyInfo.verify_phase == 'SUCCESS') {
                        iAlert.alert('该企业已认证！请提交新的企业资料选择重新验证！')
                        return false
                    } else if (!vm.verify && vm.companyInfo.verify_phase == 'PROCESSING') {
                        iAlert.alert('该企业正在认证中！暂时无法操作！')
                        return false
                    }
                    if (vm.companyInfo.nick_name) {
                        var bytesCount = 0
                        for (var i = 0; i < vm.companyInfo.nick_name.length; i++) {
                            var c = vm.companyInfo.nick_name.charAt(i);
                            if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
                            {
                                bytesCount += 1;
                            }
                            else {
                                bytesCount += 2;
                            }
                        }
                        if (bytesCount > 12) {
                            iAlert.alert('企业简称过长')
                            return false
                        }
                    }
                    if (!vm.companyInfo.url_logo) {
                        iAlert.alert('缺少企业logo')
                        return false
                    } else if (!vm.companyInfo.nick_name) {
                        iAlert.alert('缺少企业简称')
                        return false
                    } else if (!vm.companyInfo.province) {
                        iAlert.alert('缺少企业所在地区')
                        return false
                    } else if (!vm.companyInfo.url_yingyezhizhao) {
                        iAlert.alert('缺少企业营业执照')
                        return false
                    } else if (!vm.companyInfo.des) {
                        iAlert.alert('缺少企业介绍')
                        return false
                    }
                    else {
                        if (!vm.userInfo.user.company_id || vm.userInfo.user.company_id == '') {
                            vm.companyInfo.transport = (!!vm.setTransport.length ? vm.setTransport : vm.userInfo.user.transport)
                            console.log(vm.companyInfo)
                            TrafficCompanySettingService.creatNewCompany(vm.companyInfo).then(function (res) {
                                console.log(res)
                                if (res.status == 'success') {
                                    iAlert.alert('提交成功，请等待审核', function () {
                                        reset(function () {
                                            $rootScope.$broadcast('onReloadSidebar')
                                            $ionicHistory.nextViewOptions({
                                                historyRoot: true,
                                                disableAnimate: false
                                            });
                                            $state.go('rsc.company_manager')
                                        });

                                    })
                                } else {
                                    iAlert.alert('提交失败，请稍后再提交', function () {
                                        vm.init()
                                        $ionicHistory.nextViewOptions({
                                            historyRoot: true,
                                            disableAnimate: false
                                        });
                                        $state.go('rsc.traffic_verify_company', { new: true })
                                    })
                                }
                            })
                        } else {
                            if (!vm.verify) {
                                TrafficCompanySettingService.editCompany(vm.companyInfo).then(function (data) {
                                    console.log('待完成', data)
                                    if (data.status == 'success') {
                                        iAlert.alert('提交成功，请等待审核', function () {
                                            reset(function () {
                                                $rootScope.$broadcast('onReloadSidebar')
                                                $ionicHistory.nextViewOptions({
                                                    historyRoot: true,
                                                    disableAnimate: false
                                                });
                                                $state.go('rsc.company_manager')
                                            });

                                        })
                                    } else {
                                        iAlert.alert('提交失败，请稍后再提交', function () {
                                            vm.init()
                                            $ionicHistory.nextViewOptions({
                                                historyRoot: true,
                                                disableAnimate: false
                                            });
                                            $state.go('rsc.company_manager')
                                        })
                                    }
                                })
                            } else {
                                iAlert.alert('请点击重新认证后进行资料提交', function () {

                                    vm.init()
                                    vm.verify = true
                                })
                            }
                        }
                    }

                }
                // 修改公司信息
                $scope.company_modify = function (_data) {
                    // 上传到服务器
                    newDate.push(_data)
                }

                // 获取input中files 信息
                $scope.getUploadPic = function (e) {
                    $scope.file = e;
                    $scope.getFile()
                }
                // web端显示上传图片用
                $scope.getFile = function () {
                    fileReader.readAsDataUrl($scope.file[0], $scope).then(function (result) {
                        $scope.previewImageSrc = result;
                    })
                };


                $scope.$on("$ionicView.beforeEnter", function () {
                    reset()
                    vm.init()
                })
            }
        ])
})()
