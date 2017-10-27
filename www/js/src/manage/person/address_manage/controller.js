(function () {
    "use strict"

    angular.module('rsc.controller.traffic_address_manage', [])
        .controller('traffic_address_manage_ctrl', ['$scope', '$log', 'AddressManageService', 'RscAlert', '$state', '$stateParams', '$ionicModal','$rootScope',
            function ($scope, $log, AddressManageService, RscAlert, $state, $stateParams, $ionicModal,$rootScope) {
                var vm = this
                vm.address_data = {};
                vm.type = $stateParams.type;
                vm.enter = $stateParams.enter === 'true'
                if (vm.enter && !$rootScope.rootState) {
                    $rootScope.rootState = $rootScope.loadState
                    vm.state = null
                } else {
                    vm.state = $rootScope.rootState
                }
                //状态样式
                vm.isRed = vm.type || 'Pick_up_the_goods';

                vm.getAddressDetails = function (str) {

                    //请求参数：提货地址
                    vm.address_can = {
                        differentiate: str
                    };

                    AddressManageService.getAddressList(vm.address_can).then(function (result) {

                        $log.debug('获得提货地址请求', result);

                        if (result.status == 'success') {
                            //修改获得数据
                            vm.address_data = result.data;
                            if (str == 'Pick_up_the_goods') { //提货地址
                                vm.flag1 = true;
                                vm.flag2 = false;
                            } else if (str == "Delivery_of_the_goods") { //交货地址
                                vm.flag1 = false;
                                vm.flag2 = true;
                            }
                            $log.log(vm.address_data);

                            for (var i = 0; i < vm.address_data.length; i++) {
                                if (vm.address_data[i].is_default) {
                                    vm.data = vm.address_data[i]._id;
                                }
                            }
                        } else {
                            $log.error('获得提货地址请求', result);
                        }
                    });
                };

                //获得提货地址
                vm.init = function () {
                    if (vm.type) {
                        vm.getAddressDetails(vm.type);
                    } else {
                        vm.getAddressDetails('Pick_up_the_goods');
                    }
                };
                vm.init();

                //切换提货，交货地址
                vm.changeState = function (x) {

                    vm.isRed = x.eng;

                    //$state.go('address',({type: x.eng}),{reload:true});//有一个闪动的问题？？？

                    vm.getAddressDetails(x.eng);

                };

                //删除地址按钮
                vm.delAddress = function (id, type) {

                    var del_data = {
                        address_id: id
                    };

                    AddressManageService.delAddress(del_data).then(function (result) {

                        $log.debug("删除提货地址", result);
                        if (result.status == 'success') {
                            vm.getAddressDetails(type);
                        } else {
                            $log.error('删除提货地址请求', result);
                        }
                    })
                };
                //编辑地址按钮
                vm.editAddress = function (id, str) {
                    $state.go("rsc.traffic_address_edit", {
                        id: id,
                        str: str,
                        source: 'pass.traffic_address_manage'
                    });

                };
                //新增地址按钮
                vm.addAddress = function (str) {
                    console.log(str);
                    $state.go("rsc.traffic_address_edit", {
                        str: str,
                        source: 'pass.traffic_address_manage'
                    })

                };
                //修改默认地址
                vm.radio = function (type, id) {
                    var obj = {
                        address_id: id,
                        differentiate: type
                    };

                    console.log(vm.address_data)

                    AddressManageService.setDefaultAddress(obj).then(function (result) {
                        $log.debug('设置默认地址', result);
                        if (result.status == "success") {} else {
                            $log.error('设置默认地址', result);
                        }
                    })
                }
            }
        ])
        /**
         * 修改，新增地址详情页sz
         ***/
        .controller('traffic_address_edit_ctrl', ['$scope', '$log', 'AddressManageService', 'RscAlert', '$stateParams', '$state', '$cordovaContacts', '$ionicPlatform', 'ionicToast', '$ionicHistory',

            function ($scope, $log, AddressManageService, RscAlert, $stateParams, $state, $cordovaContacts, $ionicPlatform, ionicToast, $ionicHistory) {
                var vm = this
                vm.switch = true
                vm.addressOne = {};
                //获得当前页面的路由名称
                vm.currentName = $state.current.name;
                //获得修改的id,类型
                vm.menu = $stateParams.str;
                vm.id = $stateParams.id;
                $stateParams.name ? vm.addressOne.prin_name = $stateParams.name : vm.addressOne.prin_name = null
                $stateParams.phone ? vm.addressOne.prin_phone = $stateParams.phone : vm.addressOne.prin_phone = null
                vm.phone = $stateParams.phone
                //来源地址
                vm.source = $stateParams.source;
                console.log(vm.source)
                vm.detail = $stateParams.detail

                //获得要修改的指定id的收货地址详情;
                vm.getEditCommodityAddress = function () {

                    AddressManageService.editAddress({
                        address_id: vm.id
                    }).then(function (result) {

                        $log.debug("获得要编辑提货地址", result);

                        if (result.status == 'success') {

                            $log.debug("获得要编辑提货地址", result.data);
                            vm.addressOne = result.data;
                            var _tmp = result.data;
                            vm.pickCityPickDataSendNew.areaData = [_tmp.province, _tmp.city, _tmp.district];

                            //$scope.demand.addr = _tmp.addr;

                        } else {
                            $log.error('获得要编辑提货地址', result);
                        }

                    });
                };

                //判断当前是否有id,有就是修改，没有就是新增;
                if (vm.id) {
                    vm.getEditCommodityAddress();
                }

                //保存修改添加的指定id的收货地址;
                vm.saveEditAddress = function () {
                    if (!vm.switch) {
                        return false
                    }
                    //获得请求条件
                    var obj = {
                            province: vm.prov_address,
                            city: vm.city_address,
                            district: vm.dist_address,
                            addr: vm.addressOne.addr,
                            differentiate: vm.menu,
                            prin_name: vm.addressOne.prin_name,
                            prin_phone: vm.addressOne.prin_phone,
                            address_id: vm.id
                        },
                        phoneReg = /(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/;

                    //验证条件是否符合
                    if (!obj.prin_name) {

                        RscAlert.alert('请输入联系人');
                        return false;

                    } else if (!obj.prin_phone || !phoneReg.test(obj.prin_phone)) {

                        RscAlert.alert('请输入正确手机号');
                        return false;

                    } else {

                        //区别是修改地址还是新增地址；
                        if (vm.id) {
                            //修改删除类型属性
                            delete obj.differentiate;
                            $log.debug('编辑条件', obj)
                            vm.switch = false
                            AddressManageService.saveEditAddress(obj).then(function (result) {

                                $log.debug("保存编辑提货地址", result);

                                if (result.status == 'success') {
                                    $log.debug("保存编辑提货地址", result.data);
                                    vm.addressOne = result.data;
                                    ionicToast.show('保存成功', 'middle', false, 1500)

                                    $state.go(vm.source, ({
                                        type: vm.menu,
                                        source: vm.source,
                                        enter: true
                                    }));

                                } else {
                                    vm.switch = true
                                    $log.error('保存编辑提货地址请求', result);
                                }

                            })
                        } else {

                            //新增保存,删除空的id属性
                            delete obj.address_id;
                            if (!obj.district) {
                                RscAlert.alert('请输入所在地区');
                                return false;
                            } else if (!obj.addr) {
                                RscAlert.alert('请输入详细地址');
                                return false;
                            }

                            $log.debug(1, obj);

                            //添加一个地址
                            vm.switch = false
                            AddressManageService.saveAddAddress(obj).then(function (result) {

                                $log.debug("保存新增提货地址", result);

                                if (result.status == 'success') {
                                    $log.debug("保存新增提货地址", result.data);
                                    vm.addressOne = result.data;
                                    ionicToast.show('保存成功', 'middle', false, 1500)
                                    vm.switch = false
                                    $state.go(vm.source, ({
                                        type: vm.menu,
                                        source: vm.source,
                                        enter: true
                                    }));

                                } else {
                                    vm.switch = true
                                    $log.error('保存新增提货地址', result);
                                }

                            })


                        }

                    }

                };

                //地址选择
                vm.pickCityPickDataSendNew = {

                    areaData: [],
                    backdrop: true,
                    backdropClickToClose: true,
                    defaultAreaData: ['请', '选', '择'],

                    buttonClicked: function () {

                        var res = vm.pickCityPickDataSendNew;
                        vm.prov_address = res.currentProvince.ProID; //res.currentProvince.ProID
                        vm.city_address = res.currentArea.CityID;
                        vm.dist_address = res.currentArea.DisID ? res.currentArea.DisID : ''

                    },
                    tag: '',

                    iconClass: '',

                    /*title: $stateParams.differentiate == 'Delivery_of_the_goods' ? '交货地址' : '提货地址',*/

                    title: "所在地区",
                    cssClass: 'item item-icon-right',
                    watchChange: true
                };
            }
        ])
        /**
         * 提货 交货 地址列表详情页sz
         * */
        .controller('traffic_address_details_ctrl', ['$scope', '$log', 'AddressManageService', 'RscAlert', '$state', '$stateParams', 'Storage', 'ionicToast', '$rootScope', '$ionicHistory', '$ionicModal',
            function ($scope, $log, AddressManageService, RscAlert, $state, $stateParams, Storage, ionicToast, $rootScope, $ionicHistory, $ionicModal) {
                var vm = $scope.vm = this;
                //来源
                vm.source = $stateParams.source;
                //条件类型
                vm.type = $stateParams.type;
                vm.getAddressDetails = function (str) {
                    //请求参数：提货地址
                    vm.address_can = {
                        differentiate: str
                    };
                    AddressManageService.getAddressList(vm.address_can).then(function (result) {
                        $log.debug('获得地址请求', result);
                        if (result.status == 'success') {
                            //修改获得数据
                            vm.address_data = result.data;

                        } else {
                            $log.error('获得提货地址请求', result);
                        }
                    });

                };

                //获得提货||交货 地址
                vm.getAddressDetails(vm.type);
                //选择使用地址
                vm.setState = function (item) {


                    var source = vm.source

                    //添加事件处理  zhoudd
                    if (source) {
                        $log.debug('选择地址event', source,item);
                        $rootScope.$broadcast(source, {
                            type: 'select_address',
                            data: item
                        })
                    }

                    $ionicHistory.nextViewOptions({
                        historyRoot: false,
                        disableAnimate: false
                    })

                    $ionicHistory.goBack();


                }

                //新增地址按钮
                vm.addAddress = function (str, source) {
                    $log.log(str);
                    /* $state.go("traffic.traffic_address_edit", {
                         str: str,
                         source: source
                     })*/
                    $scope.openModal()
                }
                vm.modal = function () {
                    $ionicModal.fromTemplateUrl('./js/src/manage/person/address_manage/address_newadd.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {

                        $scope.modal = modal;
                    });
                    $scope.openModal = function () {
                        $scope.modal.show();
                    };

                    $scope.closeModal = function () {
                        $scope.modal.hide();
                    };

                }
                vm.modal()

                //保存新增地址;
                vm.saveEditAddress = function () {

                    //获得请求条件
                    var obj = {
                            province: vm.prov_address,
                            city: vm.city_address,
                            district: vm.dist_address,
                            addr: vm.addressOne.addr,
                            differentiate: vm.type,
                            prin_name: vm.addressOne.prin_name,
                            prin_phone: vm.addressOne.prin_phone

                        },
                        phoneReg = /(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)/;

                    //验证条件是否符合
                    if (!obj.prin_name) {

                        RscAlert.alert('请输入联系人');
                        return false;

                    } else if (!obj.prin_phone || !phoneReg.test(obj.prin_phone)) {

                        RscAlert.alert('请输入正确手机号');
                        return false;

                    } else {
                        //新增保存,删除空的id属性

                        if (!obj.district) {
                            RscAlert.alert('请输入所在地区');
                            return false;
                        } else if (!obj.addr) {
                            RscAlert.alert('请输入详细地址');
                            return false;
                        }
                        $log.debug(1, obj);

                        //添加一个地址
                        /*vm.switch = false*/
                        AddressManageService.saveAddAddress(obj).then(function (result) {

                            $log.debug("保存新增提货地址", result);

                            if (result.status == 'success') {
                                $log.debug("保存新增提货地址", result.data);
                                vm.addressOne = result.data;
                                ionicToast.show('保存成功', 'middle', false, 1500);
                                $scope.closeModal();
                                vm.getAddressDetails(vm.type);

                            } else {
                                /*vm.switch = true*/
                                $log.error('保存新增提货地址', result);
                            }

                        })

                    }

                };

                //地址选择
                vm.pickCityPickDataSendNew = {

                    areaData: [],
                    backdrop: true,
                    backdropClickToClose: true,
                    defaultAreaData: ['请', '选', '择'],

                    buttonClicked: function () {

                        var res = vm.pickCityPickDataSendNew;
                        vm.prov_address = res.currentProvince.ProID; //res.currentProvince.ProID
                        vm.city_address = res.currentArea.CityID;
                        vm.dist_address = res.currentArea.DisID ? res.currentArea.DisID : ''

                    },
                    tag: '',

                    iconClass: '',

                    /*title: $stateParams.differentiate == 'Delivery_of_the_goods' ? '交货地址' : '提货地址',*/

                    title: "所在地区",
                    cssClass: 'item item-icon-right',
                    watchChange: true
                };

            }
        ])


        .controller('traffic_address_contacts_ctrl', ['$scope', '$rootScope', '$log', 'RscAlert', '$state', '$location', '$ionicScrollDelegate', '$stateParams', 'Storage', 'AccountService', 'AddressManageService',
            function ($scope, $rootScope, $log, RscAlert, $state, $location, $ionicScrollDelegate, $stateParams, Storage, AccountService, AddressManageService) {
                var vm = $scope.vm = this
                vm.menu = $stateParams.menu
                vm.source = $stateParams.source
                reset()

                function reset() {
                    vm.page = 1
                    vm.cache = [] // 搜索缓存
                    //导入通讯录
                    vm.contact_list = []; // 服务器返回通讯录
                    vm.name_phone_list = {}; //已选中的个数
                    vm.phone_list = []
                    vm.uuid = $rootScope.device_uuid ? $rootScope.device_uuid : ''
                }

                vm.search = function (name) {
                    if (name) {
                        name = name.replace(/(^\s+)|(\s+$)/g, "")
                        if (!vm.cache.length) {
                            vm.cache = vm.contact_list
                        }
                        vm.name_search_list = []; // 搜索联系人列表
                        angular.forEach(vm.cache, function (data) {
                            if (data.name.indexOf(name) != -1) {
                                vm.name_search_list.push(data)
                            }
                        })
                        vm.contact_list = vm.name_search_list
                        displayList(vm)
                    } else {
                        vm.contact_list = []
                        vm.page = 1
                        vm.init()
                    }
                }
                vm.init = function () {
                    //获取手机数据
                    AddressManageService.get_phone_contact(vm.page, vm.uuid).then(function (data) {
                        vm.exist = data.data.exist
                        vm.contact_list = vm.contact_list.concat(data.data.list)
                        if (data.data.exist) {
                            vm.page++;
                            vm.init()
                        } else {
                            displayList(vm)
                            console.log(vm.sorted_users)
                        }
                    })

                }

                function displayList(vm) {
                    vm.alphabet = sortedUsers(vm).sdic
                    vm.sorted_users = sortedUsers(vm).res

                    // 用户字母排序
                    function sortedUsers(vm) {
                        var tmp = {};
                        var res = {};
                        for (var i = 0; i < vm.contact_list.length; i++) {
                            var letter = vm.contact_list[i].char.toUpperCase()
                            if (tmp[letter] == undefined) {
                                tmp[letter] = []
                            }
                            tmp[letter].push(vm.contact_list[i]);
                        }
                        var sdic = Object.keys(tmp).sort();
                        for (var j = 0; j < sdic.length; j++) {
                            res[sdic[j]] = tmp[sdic[j]]
                        }
                        // 首字母排序数组
                        return {
                            res: res,
                            sdic: sdic
                        }
                    }

                }
                vm.init()
                //锚点事件
                vm.gotoList = function (id) {
                    $location.hash(id);
                    $ionicScrollDelegate.anchorScroll();
                }

                vm.inviteImmediately = function (isSelect) {
                    console.log(isSelect)
                    var obj = isSelect.split('&')
                    if (vm.source == 'relation') {
                        $state.go('traffic.replace_colleague', {
                            phone: obj[1],
                            name: obj[0],
                            rename: $stateParams.rename,
                            id:$stateParams.id
                        })

                    } else {
                        $state.go('rsc.traffic_address_edit', {
                            phone: obj[1],
                            name: obj[0],
                            str: vm.menu,
                            source: vm.source,
                        })
                    }

                }
            }
        ])


})()
