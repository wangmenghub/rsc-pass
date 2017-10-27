angular.module('rsc.controllers.account', ['rsc.common.account.service'])

    /**
     * 登录界面控制器
     */
    .controller('login_in_ctrl', ['$scope', '$log', '$rootScope', '$state', 'iAlert','AccountService', 'AccountSev', 'ENV', 'ionicToast', 'Storage', 'AuthenticationService', '$interval', '$ionicModal', 'compatibleService', 'TrafficContactService', 'IMFactory',
        function ($scope, $log, $rootScope, $state, iAlert,AccountService, AccountSev, ENV, ionicToast, Storage, AuthenticationService, $interval, $ionicModal, compatibleService, TrafficContactService, IMFactory) {
            var vm = $scope.vm = this
            vm.btn_text = '获取验证码';
            vm.autoLogin = false
            vm.user = {
                phone: '',
                verify_code: '',
                package_name: $rootScope.rscAppName
            }
            vm.init = function () {
                var data = {
                    type: $rootScope.rscPlatform,
                    name: $rootScope.rscAppName
                };
                compatibleService.getLoginbackgroundimg(data).then(function (result) {
                    if (result.status == 'success') {
                        vm.background_img = result.data;
                        $log.debug('获取登录背景图', result);
                    } else {
                        $log.error('获取登录背景图', result);
                    }
                })
            }
            // 验证码
            vm.getCode = function () {
                if (!/(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/.test(vm.user.phone)) {
                    ionicToast.show('手机号格式不正确', 'middle', false, 2500);
                    return false
                }
                AccountSev.phoneExist(vm.user.phone).then(function (res) {
                    if (res.status == 'success') {
                        if (res.data.use) {
                            AccountService.getCode(vm.user.phone).then(function (res) {
                                vm.isDisabled = true;
                                vm.nums = 20;
                                vm.timer = $interval(function () {
                                    vm.nums--;
                                    vm.btn_text = '(' + vm.nums + 's)重发';
                                    if (vm.nums <= 0) {
                                        vm.btn_text = '重新获取';
                                        $interval.cancel(vm.timer);
                                        vm.isDisabled = false;
                                    }
                                }, 1000);
                                if (res.status == 'success') {
                                    if (ENV.autoLogin) {
                                        vm.user.verify_code = res.data.code
                                    }
                                } else {
                                    ionicToast.show(res.msg, 'middle', false, 2500);
                                }
                            })
                        } else {
                            ionicToast.show('该手机号未注册', 'middle', false, 2500)
                            return false
                        }


                    } else {
                        ionicToast.show('该手机号未注册', 'middle', false, 2500)
                        return false
                    }
                })

            }
            // 登录
            vm.login = function () {
                // Storage.set('autoLogin', vm.autoLogin)
                if (vm.user.phone.length < 11 || !/[0-9]{6}/.test(vm.user.verify_code)) {
                    ionicToast.show('格式不正确', 'middle', false, 2500);
                }
                AccountSev.login(vm.user).then(function (result) {
                    console.log('用户登录', result)
                    if (result.status == 'success') {
                        $scope.modal.hide();
                        if (!result.data.company) {

                            AccountSev.companyInfo().then(function (res) {
                                if (res.status == 'success') {
                                    result.data.company = res.data
                                    $rootScope.currentCompanyInfo = res.data
                                    $rootScope.currentUser.company = $rootScope.currentCompanyInfo
                                }
                            })
                        }
                        Storage.set('userInfo', result.data)
                        if(!!result.data.trade_config&&_.isArray(result.data.trade_config)){
                            var filterConfig = {}
                            angular.forEach(result.data.trade_config, function(data){
                                filterConfig[data.eng] = data.chn
                            })
                            // console.log(filterConfig)
                            Storage.set('filterConfig',filterConfig)
                        }
                        $rootScope.currentUser = result.data
                        $rootScope.$broadcast('onReloadSidebar')
                        vm.btn_text = '获取验证码';
                        vm.isDisabled = false;
                        $interval.cancel(vm.timer)
                        //关联uuid
                        // $rootScope.$emit('upload_RegistrationID')
                        $rootScope.$emit('initUserInfo')


                        //如果是手机端则读取通讯录存储在本地
                        if (ionic.Platform.isWebView()) {

                            $scope.$emit('readContacts', 'parent');
                        }
                        // 加入公司信息，不存在为空字段
                        AuthenticationService.checkToken().then(function (user) {
                            if (!user.company) {
                                AccountSev.companyInfo().then(function (res) {
                                    if (res.status == 'success') {
                                        user.company = res.data
                                        Storage.set('userInfo', user)
                                    }
                                })
                            }
                        }, function () {
                            $log.error('未登录');
                            $state.go('login');
                        })
                        // $rootScope.$broadcast('initUserInfo')
                       
                        if (result.data.user.company_id == '' || !result.data.user.company_id) {
                            $rootScope.trafficListen()
                        } else {
                            if (!!result.data.company && _.isBoolean(result.data.company.vip)) {
                                $rootScope.vip = result.data.company.vip
                            } else if (!!$rootScope.currentCompanyInfo && _.isBoolean($rootScope.currentCompanyInfo.vip)) {
                                $rootScope.vip = $rootScope.currentCompanyInfo.vip
                            } else {
                                if (!!Storage.get('userInfo').company) {
                                    $rootScope.vip = !!Storage.get('userInfo').company.vip
                                } else {
                                    $rootScope.vip = false
                                }
                            }
                        }

                        getlinkMan()
                        IMFactory.connect({
                            type: 'nim',
                            force: true,
                            uid: Storage.get('userInfo').user._id,
                            sdktoken: 'a11111',
                          })

                        $state.go('rsc.center_goods');

                    } else {
                        ionicToast.show(result.msg, 'middle', false, 2500);
                    }
                });
            }

            $ionicModal.fromTemplateUrl('./js/account/template/login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {

            };
            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
            vm.open = function () {
                vm.init();
                $scope.modal.show();
            }


            vm.closeModal = function () {
                $scope.modal.hide();
            }


            function getlinkMan() {
                var arr = []
                var contact = {}
                //获取联系人数据
                TrafficContactService.userContactList().then(function (data) {
                    if (data.status == 'success') {
                        contact = data.data
                        if (_.isArray(contact['COLLEAGUE'])) {
                            contact['COLLEAGUE'].list = JSON.parse(JSON.stringify(contact['COLLEAGUE']))
                            contact['COLLEAGUE'].count = contact['COLLEAGUE'].length
                        }
                        angular.forEach(contact, function (value, key) {
                            if (key == 'COLLEAGUE') {
                                angular.forEach(value.list, function (data) {
                                    if (data.phone == $rootScope.currentUser.user.phone) {

                                        contact['ZADMIN'] = {}
                                        contact['ZADMIN'].list = [data]
                                        var index = _.indexOf(value.list, data)
                                        value.list.splice(index, 1)
                                    }
                                })
                            }
                            var tmp = []
                            angular.forEach(value.list, function (data, i) {
                                if (!data.status) {
                                    tmp.unshift(i)
                                }
                            })
                            angular.forEach(tmp, function (i) {
                                value.list.splice(i, 1)
                            })

                        })
                        angular.forEach(contact, function (value, key) {
                            arr.push({
                                key: key,
                                value: value
                            })
                        })
                        Storage.set('linkman', arr)

                    } else {

                    }
                })
            }
        }
    ])

    /**
     * 注册
     */
    .controller('register_ctrl', ['$scope', '$rootScope', '$state', 'Storage', 'AccountSev', 'ionicToast', '$interval', 'ENV', 'AccountService',
        function ($scope, $rootScope, $state, Storage, AccountSev, ionicToast, $interval, ENV, AccountService) {
            var vm = $scope.vm = this
            vm.btn_text = '获取验证码';
            var verify = null
            vm.user = {
                phone: '',
                verify_code: '',
                real_name: '',
                type: 'TRAFFIC',
                package_name: $rootScope.rscAppName
            }

            vm.getCode = function () {
                if (!/(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/.test(vm.user.phone)) {
                    ionicToast.show('手机号格式不正确', 'middle', false, 2500);
                    return false
                }
                AccountSev.phoneExist(vm.user.phone).then(function (res) {
                    console.log(res)
                    if (res.status == 'success') {
                        if (!res.data.use) {
                            AccountSev.code2md5(vm.user.phone)
                            .then(function (res) {
                                if(res.status == 'success'){
                                    vm.isDisabled = true;
                                    var nums = 20;
                                    var timer = $interval(function () {
                                        nums--;
                                        vm.btn_text = '(' + nums + 's)重发';
                                        if (nums <= 0) {
                                            $interval.cancel(timer);
                                            vm.btn_text = '重新获取';
                                            vm.isDisabled = false;
                                        }
                                    }, 1000);
                                    vm.md5 = res.data
                                    function md5(arr, k, j) {
                                        arr = _.toArray(arr);
                                        var c = arr[k];
                                        arr[k] = arr[j];
                                        arr[j] = c;
                                        arr=arr.toString().replace(/,/g,"")
                                        return arr
                                    }
                                    vm.md5 = md5(vm.md5,2,8)
                                    AccountSev.getCode(vm.md5, vm.user.phone).then(function(result){
                                        if (result.status == 'success') {
                                            if (ENV.autoLogin) {
                                                vm.user.verify_code = result.data.code
                                                verify = result.data.code
                                            }
                                        } else {
                                            ionicToast.show(res.msg, 'middle', false, 2500);
                                        }
                                    })
                                }else{
                                    ionicToast.show('验证码失效', 'middle', false, 2500)
                                }})
                        } else {
                            ionicToast.show('该手机号已注册', 'middle', false, 2500)
                            return false
                        }
                    } else {
                        ionicToast.show('该手机号已注册', 'middle', false, 2500)
                        return false
                    }
                })
            }
            vm.next = function () {
                if (ENV.autoLogin) {
                    if (vm.user.verify_code == verify) {
                        AccountSev.register(vm.user).then(function (res) {
                            if (res.status == 'success') {
                                console.log(res)
                                var info = res.data.user
                                info.token = res.data.token
                                Storage.set('userInfo', info);
                                if(!!res.data.trade_config&&_.isArray(res.data.trade_config)){
                                    var filterConfig = {}
                                    angular.forEach(res.data.trade_config, function(data){
                                        filterConfig[data.eng] = data.chn
                                    })
                                    // console.log(filterConfig)
                                    Storage.set('filterConfig',filterConfig)
                                }
                                $state.go('reg_buy')
                            } else {
                                ionicToast.show(res.msg, 'middle', false, 2500);
                            }
                        })
                    } else {
                        ionicToast.show('验证码错误', 'middle', false, 2500);
                    }
                } else {
                    AccountService.checkVerifyCode(vm.user.phone, vm.user.verify_code).then(function (res) {
                        console.log(res)
                        if (res.status == 'success') {
                            if (res.data) {
                                AccountSev.register(vm.user).then(function (res) {
                                    if (res.status == 'success') {
                                        console.log(res)
                                        var info = res.data.user
                                        info.token = res.data.token
                                        Storage.set('userInfo', info);
                                        if(!!res.data.trade_config&&_.isArray(res.data.trade_config)){
                                            var filterConfig = {}
                                            angular.forEach(res.data.trade_config, function(data){
                                                filterConfig[data.eng] = data.chn
                                            })
                                            // console.log(filterConfig)
                                            Storage.set('filterConfig',filterConfig)
                                        }
                                        $state.go('reg_buy')
                                    } else {
                                        ionicToast.show(res.msg, 'middle', false, 2500);
                                    }
                                })
                            } else {
                                ionicToast.show('验证码错误', 'middle', false, 2500);
                            }
                        } else {
                            ionicToast.show('验证码错误', 'middle', false, 2500);
                        }
                    })
                }
            }

        }

    ])


    /**
     * 注册设置我要买控制器（物流交易共用）
     */
    .controller('reg_buy_ctrl', ['$scope', '$log', '$rootScope', 'ionicToast', '$stateParams', 'AccountService', '$state', 'Storage', 'AccountSev',
        function ($scope, $log, $rootScope, ionicToast, $stateParams, AccountService, $state, Storage, AccountSev) {
            var vm = $scope.vm = this
            vm.roleType = $stateParams.type;
            var userInfo = {};
            var newuserInfo = {};
            var data;
            //行业类别
            vm.getIndustry = function () {
                AccountService.getMaterial().then(function (result) {
                    console.log(result)
                    if (result.status == 'success') {
                        vm.Industry = result.data;
                        $log.debug('获取行业类别', result);
                    } else {
                        $log.debug('获取行业类别', result);
                    }
                })
            }

            vm.completeIndustry = function () {
                var trafficData = {
                    transport: vm.IndustryProduct
                };

                AccountSev.userEdit(trafficData).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('向服务器存信息', result);
                        userInfo = Storage.get('userInfo');
                        newuserInfo.user = result.data;
                        newuserInfo.token = userInfo.token;
                        newuserInfo.company = userInfo.company
                        if(!!result.data.trade_config&&_.isArray(result.data.trade_config)){
                            var filterConfig = {}
                            angular.forEach(result.data.trade_config, function(data){
                                filterConfig[data.eng] = data.chn
                            })
                            // console.log(filterConfig)
                            Storage.set('filterConfig',filterConfig)
                        }
                        Storage.set('userInfo', newuserInfo);
                        $rootScope.currentUser = newuserInfo
                        $rootScope.trafficListen()
                        $rootScope.$broadcast('onReloadSidebar')
                        if (vm.IndustryProduct.length == 0) {
                            ionicToast.show('请至少选择一种运输货物', 'middle', false, 2500)
                        } else {
                            //关联uuid
                            $rootScope.$emit('upload_RegistrationID')
                            $rootScope.$emit('initUserInfo')
                            //如果是手机端则读取通讯录存储在本地
                            if (ionic.Platform.isWebView()) {

                                $scope.$emit('readContacts', 'parent');
                            }
                           
                            $state.go('rsc.center_goods');
                        }

                    } else {
                        $log.error('向服务器存信息', result);
                    }
                })

            };

            vm.IndustryProduct = [];

            vm.itemSelected = function ($event, product) {
                var checkbox = $event.target;
                if (checkbox.checked) {
                    product.selected = true;
                    vm.IndustryProduct.push(product.eng);
                } else {
                    product.selected = false;
                    var index = _.indexOf(vm.IndustryProduct, product.eng);
                    vm.IndustryProduct.splice(index, 1);
                }
            };
        }
    ])
