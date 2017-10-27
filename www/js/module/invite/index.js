angular.module('rsc.invite', [
    'rsc.config',
    'rsc.common.service.rest',
    'ui.router'
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsc.invite', {
                url: '/invite',
                views: {
                    'center-content': {
                        templateUrl: 'js/module/invite/template/invite.html',
                        controller: "invite_ctrl as vm"
                    }
                }
            })

            .state('rsc.invite_phone', {
                url: '/invite_phone?role',
                views: {
                    'center-content': {
                        templateUrl: 'js/module/invite/template/invite_phone.html',
                        controller: "invite_phone_ctrl as vm"
                    }
                }
            })

            .state('rsc.invite_contact', {
                url: '/invite_contact?role?invite?id',
                views: {
                    'center-content': {
                        templateUrl: 'js/module/invite/template/invite_contacts.html',
                        controller: "invite_contact_ctrl as vm"
                    }
                }
            })

            .state('rsc.invite_success', {
                url: '/invite_success?role&count',
                views: {
                    'center-content': {
                        templateUrl: 'js/module/invite/template/invite_success.html',
                        controller: "invite_success_ctrl as vm"
                    }
                }
            })
    })

    .service('InviteService', ['ENV', 'AccountRestAngular', 'TradeRestAngular', 'ContactAngular',
        function (ENV, AccountRestAngular, TradeRestAngular, ContactAngular) {
            this.getPhoneContact = function (page, uuid) {
                var all = ContactAngular.allUrl('/phone/get_list');
                return all.post({
                    page: page,
                    uuid: uuid
                })
            }

            this.userInvitation = function (users, type, role) {
                var all = AccountRestAngular.allUrl('apply_relation/invite');
                return all.post({
                    users: users,
                    type: type,
                    role: role
                });
            }

            this.getColleague = function () {
                var all = AccountRestAngular.allUrl('user/get_colleague_count');
                return all.post()
            }

            this.addRelation = function (user_id, friend, status) {
                var all = AccountRestAngular.allUrl('apply_relation/homepage_supply');
                return all.post({
                    user_id: user_id,
                    friend: friend,
                    status: status
                });
            }

            /**
             *
             * 邀请单子
             * @param {array} phone_list
             * @param {str} id:没有传''
             * @returns
             */
            // 报价，
            this.offerInvite = function (id, phone_list) {
                var all = TradeRestAngular.allUrl('offer/send_sms');
                return all.post({
                    id: id,
                    phone_list: phone_list
                });
            }
            // 抢单
            this.demandInvite = function (id, phone_list) {
                var all = TradeRestAngular.allUrl('demand/send_sms');
                return all.post({
                    id: id,
                    phone_list: phone_list
                });
            }

        }
    ])

    .factory('InviteFactory', ['AccountService', 'InviteService', '$ionicHistory', '$stateParams', '$state', 'ionicToast', '$log', 'RscAlert',
        function (AccountService, InviteService, $ionicHistory, $stateParams, $state, ionicToast, $log, RscAlert) {
            return {
                roleSort: roleSort,
                roleSortList: roleSortList
            }

            function roleSort(vm) {
                var tmp = {};
                for (var i = 0; i < vm.contact.length; i++) {
                    var role = vm.contact[i].role.toUpperCase()
                    if (tmp[role] == undefined) {
                        tmp[role] = []
                    }
                    tmp[role].push({
                        role: vm.contact[i].role,
                        name: vm.contact[i].real_name,
                        phone: vm.contact[i].phone,
                        photo_url: vm.contact[i].photo_url,
                        invitate: vm.contact[i].invitate,
                        count: vm.contact[i].count,
                        id: vm.contact[i]._id
                    });
                }
                return tmp
            }

            function roleSortList(rolelist, role) {
                var roleArr = [[],[],[]]
                angular.forEach(rolelist, function (data) {
                    if (data.value.indexOf('TRAFFIC_ADMIN') != -1) {
                        roleArr[0].push(data)
                    } else {
                        roleArr[1].push(data)
                    }
                })

                return roleArr
            }

     
    
        }

    ])


    //选择邀请角色
    .controller('invite_ctrl', ['$scope', '$ionicHistory', '$rootScope', '$stateParams', '$log', 'RscAlert', '$state', 'InvitationInfo', 'Storage', 'InviteFactory', '$ionicViewSwitcher', 'InviteService',
        function ($scope, $ionicHistory, $rootScope, $stateParams, $log, RscAlert, $state, InvitationInfo, Storage, InviteFactory, $ionicViewSwitcher, InviteService) {
            var vm = $scope.vm = this

            vm.init = function () {
                vm.user = Storage.get('userInfo').user
                vm.role = vm.user.role
                var type = (vm.role == 'TRAFFIC_ADMIN') ? 'PASS' : 'TRADE'
                if (vm.user.company_id) {
                    vm.rolelist = InvitationInfo[type]
                } else {
                    vm.rolelist = InvitationInfo[('FRIEND_' + type)]
                }

                if (_.isBoolean($rootScope.vip)) {
                    vm.vip = $rootScope.vip
                } else if (!!$rootScope.currentCompanyInfo && _.isBoolean($rootScope.currentCompanyInfo.vip)) {
                    vm.vip = $rootScope.currentCompanyInfo.vip
                } else if (!!Storage.get('userInfo').company) {
                    vm.vip = !!Storage.get('userInfo').company.vip
                } else {
                    vm.vip = false
                }

                vm.roleArr = InviteFactory.roleSortList(vm.rolelist, vm.role)
                if (!vm.vip) {
                    InviteService.getColleague().then(function (res) {
                        console.log(res)
                        if (res.status == 'success') {
                            vm.count = res.data
                        } else {
                            vm.count = {}
                            vm.count.invitate_colleague_count_ = 0
                            vm.count.colleague_count = 0
                        }
                    })
                }
            }


            vm.change = function (item) {
                vm.select = item;
                console.log(item)
            };


            vm.go = function (url) {
                if (!vm.vip && vm.count.invitate_colleague_count_ >= 20) {
                    ionicToast.show('免费版只允许20位同事在线，请开通企业版添加更多同事', 'middle', false, 2500);
                    return false
                }
                if (vm.select) {
                    $state.go(url, {
                        role: vm.select.value
                    })
                } else {
                    RscAlert.alert('请选择邀请人的角色');
                }
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })
        }
    ])

    //输入手机号邀请
    .controller('invite_phone_ctrl', ['$scope', '$rootScope', '$log', 'ionicToast', 'RscAlert', '$state', '$stateParams', 'InviteService', 'Storage', '$ionicLoading',
        function ($scope, $rootScope, $log, ionicToast, RscAlert, $state, $stateParams, InviteService, Storage, $ionicLoading) {
            var vm = $scope.vm = this
            vm.role = $stateParams.role;
            console.log(vm.role)

            vm.init = function () {
                if (vm.role == 'TRADE_SALE' || vm.role == 'TRADE_PURCHASE' || vm.role == 'TRADE_ADMIN') {
                    vm.type = 'COMPANY_INVITE'
                } else {
                    vm.type = 'FRIEND'
                }
                vm.name_phone_list = []; //已选中的个数
                vm.count = 0
                vm.contantList = [{
                    name: '',
                    phone: '',
                    chna: 'a_0',
                    chnb: 'b_0',
                    chnc: 'c_0'
                }];
            }


            // 增加一个空元素
            vm.add = function (e) {
                var length = vm.contantList.length;
                var chna = 'a_' + length;
                var chnb = 'b_' + length;
                var chnc = 'c_' + length;
                vm.contantList.push({
                    name: '',
                    phone: '',
                    chna: chna,
                    chnb: chnb,
                    chnc: chnc
                });
                $log.debug(vm.contantList);
            };
            // 删除当前数组中的值
            vm.del = function (e) {
                $log.debug(e);
                vm.contantList.splice(e, 1)
            };

            vm.inviteImmediately = function () {
                vm.agree = true
                angular.forEach(vm.contantList, function (data) {
                    vm.name_phone_list.push({
                        phone: data.phone,
                        real_name: data.name
                    })
                })
                vm.name_phone_list = _.uniq(vm.name_phone_list)
                angular.forEach(vm.name_phone_list, function (data) {
                    // console.log($rootScope.currentUser.user)
                    if (data.phone == $rootScope.currentUser.user.phone) {
                        ionicToast.show('用户不能邀请自己', 'middle', false, 2500)
                        var index = _.indexOf(vm.name_phone_list, data);
                        vm.name_phone_list.splice(index, 1)
                        vm.agree = false
                    }
                })
                vm.count = vm.name_phone_list.length
                if (vm.agree) {
                    InviteService.userInvitation(vm.name_phone_list, vm.type, vm.role).then(function (res) {
                        console.log(res)
                        if (res.status == 'success') {
                            Storage.set('cache', res.data)
                            $state.go('rsc.invite_success', {
                                role: vm.role,
                                count: vm.count
                            })
                        } else {
                            $log.error('短信通知', res);
                        }
                    })
                }
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })
        }
    ])

    // 通讯录批量导入
    .controller('invite_contact_ctrl', ['$scope', '$rootScope', 'ionicToast', '$stateParams', '$ionicHistory', 'ionicToast', '$log', 'RscAlert', '$state', '$location', '$ionicScrollDelegate', '$stateParams', 'Storage', 'InviteService',
        function ($scope, $rootScope, ionicToast, $stateParams, $ionicHistory, ionicToast, $log, RscAlert, $state, $location, $ionicScrollDelegate, $stateParams, Storage, InviteService) {
            var vm = $scope.vm = this
            if ($stateParams.invite == 'offer' || $stateParams.invite == 'demand' || $stateParams.invite == 'order' || $stateParams.invite == 'offer_c') {
                vm.invite = true
            } else {
                vm.invite = false
            }

            function reset() {
                vm.role = $stateParams.role;
                if (vm.role == 'TRADE_SALE' || vm.role == 'TRADE_PURCHASE' || vm.role == 'TRADE_ADMIN') {
                    vm.type = 'COMPANY_INVITE'
                } else {
                    vm.type = 'FRIEND'
                }
                vm.page = 1
                vm.cache = [] // 搜索缓存
                vm.count = 0
                vm.contact_list = []; // 服务器返回通讯录
                vm.name_phone_list = []; //已选中的个数
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
                vm.click = true
                InviteService.getPhoneContact(vm.page, vm.uuid).then(function (data) {
                    vm.exist = data.data.exist
                    vm.contact_list = vm.contact_list.concat(data.data.list)
                    if (data.data.exist) {
                        vm.page++;
                        vm.init()
                    } else {
                        vm.loading = false
                        vm.contact_list = getObjArr(vm.contact_list, ['_id'])
                        displayList(vm)
                    }
                })
                console.log(vm)
            }

            function getObjArr(data, index) {
                var users = [], uhash = {};
                for (var i = 0, length = data.length; i < length; ++i) {
                    var indexString = '';
                    index.forEach(function (field) {
                        if (_.isArray(data[i][field])) {
                            data[i][index].forEach(function (att) {
                                indexString += att;
                            })
                        } else {
                            indexString += data[i][field];
                        }
                    });
                    if (!uhash[indexString]) {
                        uhash[indexString] = true;
                        users.push(data[i]);
                    }
                }
                return users;
            };



            function displayList(vm) {
                vm.alphabet = sortedUsers(vm).sdic
                vm.sorted_users = sortedUsers(vm).res
                vm.show = _.isEmpty(vm.sorted_users)

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

            //锚点事件
            vm.gotoList = function (id) {
                $location.hash(id);
                $ionicScrollDelegate.anchorScroll();
            }

            vm.select = function ($event, user) {
                if (!user.res) {
                    var checkbox = $event.target;
                    if (checkbox.checked) {
                        vm.count++
                    } else {
                        vm.count--
                    }
                } else if (user.res) {
                    if (!user.friend) {
                        vm.getFriend(user._id)
                    } else {
                        return false
                    }
                }

            };

            vm.inviteImmediately = function () {

                if (!vm.count) {
                    return false
                }
                vm.agree = true
                var phone_list = []
                angular.forEach(vm.sorted_users, function (value, key) {
                    angular.forEach(value, function (data) {
                        if (data.isSelect) {
                            vm.name_phone_list.push({
                                phone: data.phone,
                                real_name: data.name
                            })
                        }
                    })
                    vm.name_phone_list = _.uniq(vm.name_phone_list)
                    vm.count = vm.name_phone_list.length
                })
                angular.forEach(vm.name_phone_list, function (data) {
                    // console.log($rootScope.currentUser.user)
                    if (data.phone == $rootScope.currentUser.user.phone) {
                        ionicToast.show('用户不能邀请自己', 'middle', false, 2500)
                        var index = _.indexOf(vm.name_phone_list, data);
                        vm.name_phone_list.splice(index, 1)
                        vm.agree = false
                    } else {
                        if (vm.invite) {
                            phone_list.push(data.phone)
                        }
                    }
                })
                if (vm.agree) {
                    vm.agree = false
                    if ($stateParams.invite == 'order') {

                        InviteService.offerInvite($stateParams.id, phone_list).then(function (res) {
                            if (res.status == 'success') {
                                ionicToast.show('邀请成功', 'middle', false, 2500)
                            } else {
                                ionicToast.show('邀请失败', 'middle', false, 2500)
                            }
                            $state.go($rootScope.loadState.name, { id: $stateParams.id })
                        })
                    }
                    else if ($stateParams.invite == 'demand') {
                        InviteService.demandInvite($stateParams.id, phone_list).then(function (res) {
                            if (res.status == 'success') {
                                ionicToast.show('邀请成功', 'middle', false, 2500)
                            } else {
                                ionicToast.show('邀请失败', 'middle', false, 2500)
                            }

                            $state.go($rootScope.loadState.name, { id: $stateParams.id })
                        })
                    }
                    else if ($stateParams.invite == 'offer') {

                        InviteService.offerInvite($stateParams.id, phone_list).then(function (res) {
                            if (res.status == 'success') {
                                ionicToast.show('邀请成功', 'middle', false, 2500)
                            } else {
                                ionicToast.show('邀请失败', 'middle', false, 2500)
                            }
                            $state.go($rootScope.loadState.name, { demand_id: $stateParams.id, source: 'grab' })
                        })
                    }
                    else if ($stateParams.invite == 'offer_c') {

                        InviteService.demandInvite($stateParams.id, phone_list).then(function (res) {
                            if (res.status == 'success') {
                                ionicToast.show('邀请成功', 'middle', false, 2500)
                            } else {
                                ionicToast.show('邀请失败', 'middle', false, 2500)
                            }
                            $state.go($rootScope.loadState.name, { id: $stateParams.id, status: "valid" })
                        })
                    }


                    else {
                        InviteService.userInvitation(vm.name_phone_list, vm.type, vm.role).then(function (res) {
                            console.log(res)
                            if (res.status == 'success') {
                                Storage.set('cache', res.data)
                                $state.go('rsc.invite_success', {
                                    role: vm.role,
                                    count: vm.count
                                });
                            } else {
                                if(res.msg == 'users_max'){
                                    ionicToast.show('免费版邀请人数已达到上限', 'middle', false, 2500)
                                    $state.go('rsc.invite')
                                }
                                $log.error('短信通知', res);
                            }
                        })
                    }

                }
            }

            vm.getFriend = function (id) {

                InviteService.addRelation(id, true, '').then(function (res) {
                    console.log(res)
                    if (res.status == 'success') {
                        ionicToast.show('请等待对方同意', 'middle', false, 2500);
                    } else {
                        ionicToast.show(res, 'middle', false, 2500);
                    }
                })
            }

            $scope.$on("$ionicView.beforeEnter", function () {
                vm.loading = true
                reset()
                vm.init()
            })
        }
    ])

    //管邀请-邀请成功
    .controller('invite_success_ctrl', ['$scope', '$state', 'Storage', '$stateParams', '$ionicHistory',
        function ($scope, $state, Storage, $stateParams, $ionicHistory) {
            var vm = $scope.vm = this

            vm.role = $stateParams.role;
            vm.count = $stateParams.count
            vm.data = Storage.get('cache')
            vm.list_count = vm.count - vm.data.list.length;
            if (vm.data.list.length < vm.count) {
                for (var i = 0; i < vm.list_count; i++) {
                    vm.data.list.push('./img/common/infor-face.png');
                }
            }
            Storage.remove('cache')
            vm.goInvite = function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false
                });
                $state.go('rsc.invite')
            }

            vm.success = function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false
                });
                $state.go('rsc.message')
            }

            vm.records2 = [
                {
                    img: './img/common/infor-face1.png',
                },
                {
                    img: './img/common/infor-face2.png',
                },
            ]

        }
    ])

