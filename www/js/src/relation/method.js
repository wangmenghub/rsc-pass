angular.module('rsc.factory.traffic_relation', [])
    .factory('TrafficInviteFactory', ['AccountService', 'TrafficInviteService', '$ionicLoading', '$ionicHistory', '$stateParams', '$state', '$log', 'ionicToast', 'RscAlert',
        function (AccountService, TrafficInviteService, $ionicLoading, $ionicHistory, $stateParams, $state, $log, ionicToast, RscAlert) {
            return {
                invite: invite,
                roleSort: roleSort,
                goBack: goBack,
                reset: reset,
                inviteImmediately: inviteImmediately,
                roleSortList: roleSortList,
                loadMore: loadMore,
                doRefresh: doRefresh
            }


            function invite(user) {

                if (user.role == 'TRAFFIC_ADMIN') {
                    var type = 'COMPANY_INVITE'
                } else {
                    var type = 'FRIEND'
                }
                var data = {
                    users: [{
                        phone: user.phone,
                        real_name: user.name,
                    }],
                    type: type,
                    role: user.role
                }
                TrafficInviteService.userInvitation(data.users, data.type, data.role).then(function (result) {
                    if (result.status == 'success') {
                        console.log('短信通知', result);
                        ionicToast.show('已通知', 'middle', false, 2000);
                    } else {
                        console.log('短信通知', result);
                        ionicToast.show(result, 'middle', false, 2000);
                    }
                })

            }

            function roleSort(vm) {
                var tmp = {};
                console.log(vm.contact)
                for (var i = 0; i < vm.contact.length; i++) {
                    // console.log(vm.contact[i].role)
                    var role = vm.contact[i].role
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

            function goBack() {
                $ionicHistory.goBack()
            }

            function roleSortList(rolelist, role) {
                var roleArr = [
                    [],
                    [],
                    []
                ]

                angular.forEach(rolelist, function (data) {
                    if (data.value.indexOf('TRAFFIC_ADMIN') != -1) {
                        roleArr[0].push(data)
                    } else {
                        roleArr[1].push(data)
                    }
                })

                return roleArr
            }

            function reset(vm) {
                vm.role = $stateParams.role;
                if (vm.role == 'SALE' || vm.role == 'PURCHASE' || vm.role == 'TRAFFIC') {
                    vm.invite_company = true
                }
                vm.page = 1
                vm.cache = [] // 搜索缓存
                //导入通讯录
                vm.contact_list = []; // 服务器返回通讯录
                vm.name_phone_list = []; //已选中的个数
            }

            function inviteCallback(vm) {
                return function (result) {
                    console.log(vm)
                    if (result.status == 'success') {
                        $log.debug('短信通知', result);
                        result.data ? vm.code = result.data.code : vm.code = ''
                        RscAlert.alert('短信发送成功' + vm.code, function () {
                            $state.go('rsc.traffic_invite_success', {
                                role: vm.role,
                                count: vm.name_phone_list.length
                            });
                            reset(vm)
                        })
                    } else {
                        $log.error('短信通知', result);
                    }
                }
            }

            function inviteImmediately(vm) {
                return function () {
                    angular.forEach(vm.contant_list, function (data) {
                        console.log(data)
                        vm.name_phone_list.push({
                            phone: data.phone,
                            name: data.name,
                            company: data.company || ''
                        })
                    })

                    console.log(vm.role, vm.name_phone_list)
                    AccountService.invitationInvite(vm.role, vm.name_phone_list)
                        .then(inviteCallback(vm))
                        .finally(function () {
                            $ionicLoading.hide();
                        })

                }
            }

            function loadMore(vm) {
                vm.page += 1;
                vm.getType = 3;
                vm.init();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            function doRefresh(vm) {
                vm.page = 1;
                vm.getType = 2;
                vm.init();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }



    ])
