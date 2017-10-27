/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controllers.PassSellCar', ['rsc.pass.services'])
    //物流 运 车辆
    .controller('trans_car_ctrl', ['$scope', '$state', '$rootScope', '$log', '$filter', '$ionicSlideBoxDelegate', 'Storage', '$ionicLoading', '$stateParams', 'PassSellService', 'PassService',
        function ($scope, $state, $rootScope, $log, $filter, $ionicSlideBoxDelegate, Storage, $ionicLoading, $stateParams, PassSellService, PassService) {
            var vm = this;
            $scope.query = {
                page: 1,
                verify: true,
                name: '',
                getType: 1
            };
            var run = false;
            $scope.hasMore = false;
            $scope.getAllMsg = function () {
                PassService.getMsg().then(function (response) {
                    $scope.transpmsg = PassService.msgDataFmt(response).data.transportation;
                    $rootScope.RmsgData = PassService.msgDataFmt(response);
                })
            }
            $scope.$on('$ionicView.enter', function () {
                $log.debug('enter')
                $ionicSlideBoxDelegate.$getByHandle("basePage").update();
                $scope.getAllMsg()
            })
            // 挂靠车辆列表
            var queryAction = function (type) {
                $scope.getAllMsg()
                if (!run) {
                    // $ionicLoading.show();
                    run = true;
                    vm.reqcomplete = false;
                    PassSellService.getAllPrivateUserTruck($scope.query).then(function (result) {
                        run = false;
                        vm.reqcomplete = true;
                        if (result.status == 'success') {
                            $log.debug('查询司机', result);
                            $scope.hasMore = result.data.exist;
                            $scope.count = result.data.count;
                            if ($scope.query.getType == 3) {
                                if ($scope.typeList) {
                                    $scope.typeList = $scope.typeList.concat(result.data.users);
                                } else {
                                    $scope.typeList = result.data.users;
                                }
                            } else {
                                $scope.typeList = result.data.users;
                            }
                        } else {
                            $log.error('查询司机', result);
                            $scope.hasMore = false;
                        }
                    }, function () {
                        $scope.hasMore = false;
                    }).finally(function () {
                        vm.reqcomplete = true;
                        $ionicLoading.hide();
                    })
                } else {
                    if ($scope.query.getType == 3) {
                        $scope.query.page -= 1;
                    }
                }
            };
            //$scope.$on('$ionicView.loaded', function () {
            //    $log.debug('loaded')
            //    if (Storage.get('userInfo')) {
            //        if (!$rootScope.baseConfig) {
            //            PageConfig.initPageConfig().then(function (result) {
            //                $log.debug('tab.TrafficMenus 获取配置文', result)
            //                if (result) {
            //                    $scope.pgConfig = result.pages['tab.TrafficMenus'];
            //                    $log.debug('$scope.pgConfig', $scope.pgConfig)
            //
            //                }
            //            })
            //        } else {
            //            $scope.pgConfig = $rootScope.baseConfig.pages['tab.TrafficMenus'];
            //        }
            //    }
            //
            //})
            //无限加载执行的方法
            $scope.loadMore = function () {
                $scope.query.page += 1;
                $scope.query.getType = 3; //刷新
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新执行方法
            $scope.doRefresh = function () {
                //页面在顶部的时候为第一页
                $scope.query.page += 1;
                $scope.query.getType = 3; //刷新
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };
        }])
    //物流 运 挂靠车辆分组
    .controller('car_group_list_ctrl', ['$scope', '$log', '$ionicPopup', 'PassSellService', 'iAlert', '$state', '$stateParams', '$ionicHistory',
        function ($scope, $log, $ionicPopup, PassSellService, iAlert, $state, $stateParams, $ionicHistory) {
            var myPopup;
            $scope.group = {
                type: 'PUBLIC'
            };
            $scope.editValue = {
                name: ''
            };
            $scope.currentType = '';

            var defaultGroup = {
                PUBLIC: {
                    name: '默认组车辆',
                    type: 'PUBLIC'
                },
                PRIVATE: {
                    name: '默认组车辆',
                    type: 'PRIVATE'
                }
            };
            $scope.goBack = function () {
                $ionicHistory.goBack();
            }
            $scope.groupList = [];
            $scope.groupList.push(defaultGroup['PUBLIC']);

            //组类型
            $scope.list = [{
                tips: '自有司机组',
                value: 'PUBLIC'
            }, {
                tips: '挂靠司机组',
                value: 'PRIVATE'
            }];

            $scope.queryAction = function (type) {
                $scope.group.type = $scope.currentType = type;

                // $state.go('tab.car_group_list',{type:type})

                $scope.groupList = [];
                $scope.groupList.push(defaultGroup[type]);
                PassSellService.getTruckGroupList(type).then(function (result) {
                    if (result.status == 'success') {
                        $scope.groupList = $scope.groupList.concat(result.data);

                        PassSellService.getDefaultCount(type).then(function (result) {
                            if (result.status == 'success') {
                                $scope.groupList[0].count = result.data
                            } else {
                                $scope.groupList[0].count = 0;
                            }
                        })

                    }
                    $log.debug(type + '组信息', result);
                })
            };


            $scope.btnQuery = function (type) {

                $state.go('sell_release.car_group_list', {
                    type: type
                }, {
                        notify: false
                    })
                $scope.queryAction(type)
            }
            //load
            $scope.init = function () {
                $scope.queryAction('PRIVATE');
            };

            $scope.add = function () {

                if ($scope.groupList.length >= 11) {
                    iAlert.alert('最多只能添加10个组');
                    return;
                }
                myPopup = $ionicPopup.show({
                    title: '添加分组',
                    templateUrl: './js/directives/template/common/car_group_add.html',
                    scope: $scope
                })

            };
            //弹窗 确认按钮
            $scope.confirm = function () {
                $scope.group.count = 0;
                PassSellService.truckGroupAdd($scope.group).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('添加车辆分组', result);
                        if ($scope.currentType == result.data.type) {
                            result.data.count = 0;
                            $scope.groupList.push(result.data);
                        }
                        myPopup.close();
                    } else {
                        iAlert.alert('添加失败，请稍后再试！')
                        $log.error('添加车辆分组', result);
                    }
                })
            };
            //弹窗 取消按钮
            $scope.cancel = function () {
                myPopup.close();
            };

            $scope.del = function (group) {
                iAlert.confirm('提示', '是否删除分组:' + group.name, function () {
                    PassSellService.delTruckGroup(group._id).then(function (result) {
                        if (result.status == 'success') {
                            iAlert.alert('删除成功!');
                            //从数组中移除
                            $scope.queryAction($scope.group.type)
                            $scope.groupList = $scope.groupList.filter(function (item) {
                                return item._id != group._id;
                            });
                            // $scope.groupList = _.reject($scope.groupList, function (item) {
                            //     return item._id == group._id
                            // })
                        } else {
                            iAlert.alert('删除失败!');
                        }
                    })
                })
            };

            $scope.editName = function () {

                var item = _.find($scope.groupList, function (item) {
                    return item.name == $scope.editValue.name;
                });

                if (item) {
                    iAlert.alert('已存在！');
                } else {
                    PassSellService.editTruckGroup($scope.editGroup._id, $scope.editValue.name).then(function (result) {
                        $log.debug('修改组名', result);
                        if (result.status == 'success') {
                            //iAlert.alert('修改成功!');
                            $scope.editGroup.name = $scope.editValue.name;
                            myPopup.close();
                        } else {
                            iAlert.alert('修改失败!');

                        }
                    })
                }


            };

            $scope.edit = function (item) {
                $scope.editGroup = item;
                myPopup = $ionicPopup.show({
                    title: '修改组名',
                    templateUrl: './js/directives/template/common/inputs.html',
                    scope: $scope
                });

                // AccountInformation.editTruckGroup(item._id, res).then(function (result) {
                //     if (result.status == 'success') {
                //         iAlert.alert('修改成功!');
                //         item.name = res;
                //     } else {
                //         iAlert.alert('修改失败!');
                //     }
                // })

                // $ionicPopup.prompt({
                //     title: '修改组名',
                //     template: '输入新的组名:',
                //     inputType: 'text',
                //     inputPlaceholder: '输入新的组名',
                //     maxLength: 2,
                //     defaultText: 'dd',
                //     scope: $scope,
                //     buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                //         text: 'Cancel',
                //         type: 'button-default',
                //         onTap: function (e) {
                //             // e.preventDefault() will stop the popup from closing when tapped.
                //             // e.preventDefault();
                //         }
                //     }, {
                //             text: 'OK',
                //             type: 'button-positive',
                //             onTap: function (e) {
                //                 // Returning a value will cause the promise to resolve with the given value.
                //                 console.log(e);
                //                 // return scope.data.response;
                //             }
                //         }]
                // })
                // .then(function (res) {
                //     console.log(res);
                //     // AccountInformation.editTruckGroup(item._id, res).then(function (result) {
                //     //     if (result.status == 'success') {
                //     //         iAlert.alert('修改成功!');
                //     //         item.name = res;
                //     //     } else {
                //     //         iAlert.alert('修改失败!');
                //     //     }
                //     // })


                // });


            };

            $scope.goDetail = function (item) {
                $log.debug(item)
                $state.go('sell_release.car_group_detail', {
                    group_id: item._id,
                    type: item.type.toLowerCase()
                })
            };

            $scope.doRefresh = function () {
                $scope.queryAction($scope.currentType);
                $scope.$broadcast('scroll.refreshComplete');
            }
        }
    ])
    //物流 运 挂靠车辆分组列表
    .controller('car_group_detail_ctrl', ['$scope', '$state', '$stateParams', 'PassSellService', '$log', '$ionicPopup', 'iAlert', '$ionicModal', '$timeout',
        function ($scope, $state, $stateParams, PassSellService, $log, $ionicPopup, iAlert, $ionicModal, $timeout) {
            $scope.query = {
                group_id: $stateParams.group_id,
                type: $stateParams.type.toUpperCase(),
                page: 1
            };
            $scope.comModal = null;
            if ($scope.query.group_id != '') {
                $scope.showGroupBtn = true;
            } else {
                $scope.showGroupBtn = true;//[bug:472]
                // $scope.showGroupBtn = false;

            }
            $log.debug($scope.query)
            $scope.navbar = {
                // navRight: $scope.query.group_id == '' ? '分配' : '添加',
                navRight: $scope.query.group_id == '' ? '' : '添加',//[bug:472]
                navRighthide: 'text-red2',
                title: '',
                // navRightClick: $scope.query.group_id == '' ? 'setGroupMulti()' : 'add()'
                navRightClick: $scope.query.group_id == '' ? '' : 'add()',//[bug:472]
            }
            $log.debug('navbar', $scope.navbar)
            // bug #1623
            // $scope.special = true;
            // $scope.gostep = function () {
            //     if ($stateParams.type == 'PRIVATE' || 'PUBLIC') {
            //         $state.go('tab.car_group_list')
            //     }
            // }
            // bug #1623 end
            $scope.add = function () {
                $state.go("sell_release.car_group_detail", { type: $scope.query.type, id: $scope.query.group_id })
            }

            $scope.init = function () {
                $scope.carCount = 0;
                $scope.selectCarList = [];
                $scope.otherGroups = [];
                $scope.groupInfo = {};
                $scope.selectCarListObj = [];

                queryAction();

                PassSellService.getGroupsOther($scope.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('获取其他分组', result)
                        if ($scope.query.group_id) {
                            $scope.otherGroups.push({
                                name: '默认组车辆',
                                _id: undefined,
                                type: $scope.query.type
                            });
                        }
                        $scope.otherGroups = $scope.otherGroups.concat(result.data);
                        $log.debug('$scope.otherGroups', $scope.otherGroups)
                    } else {
                        $log.error('获取其他分组', result)
                    }
                });
                //如果url上没有传group_id的表示默认的组名

                if ($scope.query.group_id) {
                    PassSellService.getGroupById($scope.query.group_id).then(function (result) {
                        $log.debug('分组详情', result);
                        if (result.status == 'success') {
                            $scope.navbar.title = result.data.name;
                        } else {
                            $scope.navbar.title = '分组详情';
                        }
                    })
                } else {
                    $scope.navbar.title = '默认组车辆';
                }
            };

            var queryAction = function () {

                PassSellService.getTrucksByGroup($scope.query).then(function (result) {

                    if (result.status == 'success') {
                        $log.debug('获取分组车辆列表', result)
                        $scope.carCount = result.data.count;
                        $scope.carList = result.data.truck;
                        $scope.groupInfo.pages = result.data.pages
                    } else {
                        $log.error('获取分组车辆列表', result)
                    }
                });
            };

            $scope.operation = function (car) {
                $scope.popup_lists = $scope.otherGroups;
                var object = {
                    templateUrl: './templates/common/popup_radio.html',
                    title: '更换组'
                }
                var objmsg = {
                    type: 'truckGroup',
                    subhead: '分组: '
                }; //type类型有radio,text,number3种类型
                _popup($scope, object, $ionicPopup, objmsg).then(function (res) {
                    if (res) {
                        if (res.item) {
                            PassSellService.addTruckToGroup(res.item._id, $scope.selectCarList).then(function (result) {
                                if (result.status == 'success') {
                                    $scope.selectCarList = [];
                                    $scope.selectCarListObj = []
                                    $log.debug('分配成功', result)
                                } else {
                                    $log.error('分配失败', result)
                                }
                            })
                        }
                    }
                })
            };

            $scope.remove = function () {
                // var cars = [car];


                $scope.popup_lists = $scope.otherGroups;
                var object = {
                    templateUrl: './templates/common/popup_radio.html',
                    title: '更换组'
                }
                var objmsg = {
                    type: 'truckGroup',
                    subhead: '分组: '
                }; //type类型有radio,text,number3种类型
                _popup($scope, object, $ionicPopup, objmsg).then(function (res) {
                    if (res) {
                        if (res.item) {
                            PassSellService.addTruckToGroup(res.item._id, [car._id]).then(function (result) {
                                if (result.status == 'success') {
                                    $log.debug('分配成功', result)
                                } else {
                                    $log.error('分配失败', result)
                                }
                            })
                        }
                    }
                });

                iAlert.confirm('提示', '是否将车辆从该组移除！', function () {
                    PassSellService.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                        if (result.status == 'success') {
                            $log.debug('分配成功', result)
                            $scope.carList = _.difference($scope.carList, cars)
                        } else {
                            $log.error('分配失败', result)
                        }

                    })
                })
            };
            $scope.cancel = function () {
                if (comModal) {
                    comModal.hide();
                }
            }
            $scope.sel = {}
            $scope.confirm = function () {
                var item = $scope.sel
                console.log(item)
                if (item) {
                    if (item._id) {
                        if ($scope.query.group_id) {
                            PassSellService.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                                if (result.status == 'success') {
                                    $log.debug('移除成功', result)

                                    PassSellService.addTruckToGroup(item._id, $scope.selectCarList).then(function (result) {
                                        if (result.status == 'success') {
                                            $log.debug('分配成功', result)

                                            $scope.carList = _.difference($scope.carList, $scope.selectCarListObj);
                                            $scope.selectCarList = [];
                                            $scope.selectCarListObj = []
                                        } else {
                                            if (result.msg == 'Maximum limit') {
                                                iAlert.alert('该分组车辆空间不足，每组最多分配100辆车');
                                            } else {
                                                iAlert.alert('分配失败！');
                                            }
                                            $log.error('分配失败', result)
                                        }
                                    });
                                    // $scope.carList = _.difference($scope.carList, $scope.selectCarList);

                                } else {
                                    $log.error('分配失败', result)
                                }
                            })
                        } else {
                            PassSellService.addTruckToGroup(item._id, $scope.selectCarList).then(function (result) {
                                if (result.status == 'success') {
                                    $log.debug('分配成功', result)

                                    $scope.carList = _.difference($scope.carList, $scope.selectCarListObj);
                                    $scope.selectCarList = [];
                                    $scope.selectCarListObj = []
                                } else {
                                    $log.error('分配失败', result)
                                }
                            })
                        }
                    } else {
                        PassSellService.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                            if (result.status == 'success') {
                                $log.debug('分配成功', result)

                                $scope.carList = _.difference($scope.carList, $scope.selectCarListObj)

                                $scope.selectCarList = [];
                                $scope.selectCarListObj = []
                            } else {
                                $log.error('分配失败', result)
                            }

                        })
                    }


                }

                $scope.cancel()
            }
            $scope.select = function (selected) {
                $scope.sel = selected
            }
            /**
             * 选择车辆
             */
            $scope.selectCar = function (car) {
                // console.log('select car');
                // if (car.isSelect) {
                //     $scope.selectCarList.push(car._id);
                //     $scope.selectCarListObj.push(car);
                //     $log.debug('$scope.selectCarList', $scope.selectCarList)
                // } else {
                //     $scope.selectCarList = _.reject($scope.selectCarList, function (item) {
                //         return item == car._id;
                //     });
                //     $scope.selectCarListObj = _.reject($scope.selectCarListObj, function (item) {
                //         return item._id == car._id;
                //     })
                // }
                // $log.debug('$scope.selectCarList', $scope.selectCarList)
            };
            /**
             * 重新分配车辆
             */
            $scope.setGroupMulti = function () {
                $scope.selectCarList = [];
                angular.forEach($scope.carList, function (item, index) {
                    if (item.isSelect) {
                        $scope.selectCarList.push(item._id);
                        $scope.selectCarListObj.push(item);
                    }
                });

                $log.debug('当前页的车辆', $scope.selectCarList);

                $scope.popup_lists = $scope.otherGroups;
                if ($scope.selectCarList.length > 0) {


                    $scope.popup_lists = $scope.otherGroups;
                    console.log($scope.popup_lists)
                    $ionicModal.fromTemplateUrl('js/directives/template/common/comCarGroup.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                        backdropClickToClose: true,
                        hardwareBackButtonClose: true,
                    }).then(function (modal) {
                        console.log(modal)
                        comModal = modal;

                        $timeout(function () {
                            comModal.show();
                            // vm.initAreaData(vm.defaultAreaData)
                        }, 50)
                    })
                    //var object = {
                    //    templateUrl: './template/common/popup_radio.html',
                    //    title: '更换组'
                    //};
                    //var objmsg = {
                    //    type: 'truckGroup',
                    //    subhead: '分组: '
                    //}; //type类型有radio,text,number3种类型
                    //_popup($scope, object, $ionicPopup, objmsg).then(function (res) {
                    //    if (res) {
                    //        if (res.item) {
                    //            if (res.item._id) {
                    //                if ($scope.query.group_id) {
                    //                    AccountInformation.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                    //                        if (result.status == 'success') {
                    //                            $log.debug('移除成功', result)
                    //
                    //                            AccountInformation.addTruckToGroup(res.item._id, $scope.selectCarList).then(function (result) {
                    //                                if (result.status == 'success') {
                    //                                    $log.debug('分配成功', result)
                    //
                    //                                    $scope.carList = _.difference($scope.carList, $scope.selectCarListObj);
                    //                                    $scope.selectCarList = [];
                    //                                    $scope.selectCarListObj = []
                    //                                } else {
                    //                                    if (result.msg == 'Maximum limit') {
                    //                                        iAlert.alert('该分组车辆空间不足，每组最多分配100辆车');
                    //                                    } else {
                    //                                        iAlert.alert('分配失败！');
                    //                                    }
                    //                                    $log.error('分配失败', result)
                    //                                }
                    //                            });
                    //                            // $scope.carList = _.difference($scope.carList, $scope.selectCarList);
                    //
                    //                        } else {
                    //                            $log.error('分配失败', result)
                    //                        }
                    //                    })
                    //                } else {
                    //                    AccountInformation.addTruckToGroup(res.item._id, $scope.selectCarList).then(function (result) {
                    //                        if (result.status == 'success') {
                    //                            $log.debug('分配成功', result)
                    //
                    //                            $scope.carList = _.difference($scope.carList, $scope.selectCarListObj);
                    //                            $scope.selectCarList = [];
                    //                            $scope.selectCarListObj = []
                    //                        } else {
                    //                            $log.error('分配失败', result)
                    //                        }
                    //                    })
                    //                }
                    //            } else {
                    //                AccountInformation.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                    //                    if (result.status == 'success') {
                    //                        $log.debug('分配成功', result)
                    //
                    //                        $scope.carList = _.difference($scope.carList, $scope.selectCarListObj)
                    //
                    //                        $scope.selectCarList = [];
                    //                        $scope.selectCarListObj = []
                    //                    } else {
                    //                        $log.error('分配失败', result)
                    //                    }
                    //
                    //                })
                    //            }
                    //
                    //
                    //        }
                    //    }
                    //});


                    //AccountInformation.delTruckFromGroup($scope.query.group_id, $scope.selectCarList).then(function (result) {
                    //    if (result.status == 'success') {
                    //        $log.debug('移除成功', result)
                    //        $scope.carList = _.difference($scope.carList, $scope.selectCarList);
                    //    } else {
                    //        $log.error('分配失败', result)
                    //    }
                    //})

                }
                ;
            }
            /**
             * 下一页
             */
            $scope.next = function () {
                $scope.query.page += 1;
                queryAction();
            }
            /**
             * 下一页
             */
            $scope.previous = function () {
                $scope.query.page -= 1;
                queryAction();
            }

            $scope.goPage = function (page) {
                $scope.query.page = page;
                queryAction();
            }

            /**
             *
             * 刷新
             */
            $scope.doRefresh = function () {
                // $scope.query.page = 1;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            }
        }])
    //物流 运 挂靠车辆分组修改
    .controller('car_group_default_ctrl', ['$scope', '$state', '$stateParams', 'PassSellService', '$log', '$ionicPopup', 'iAlert',
        function ($scope, $state, $stateParams, PassSellService, $log, $ionicPopup, iAlert) {
            $scope.query = {
                id: $stateParams.id,
                type: $stateParams.type.toUpperCase(),
                page: 1
            };
            $scope.navbar = {
                navRight: '分配',
                navRighthide: 'text-red2',
                title: '默认组车辆',
                navRightClick: 'setGroupMulti()'
            }

            $scope.init = function () {
                $scope.carCount = 0;
                $scope.selectCarList = [];
                $scope.selectCarListObj = [];
                queryAction();

            };
            //查询分组里的车辆
            var queryAction = function () {

                PassSellService.getTrucksByGroup($scope.query).then(function (result) {

                    if (result.status == 'success') {
                        $log.debug('获取分组车辆列表', result)
                        $scope.carCount = result.data.count;
                        $scope.carList = result.data.truck;
                        $scope.groupInfo.pages = result.data.pages
                    } else {
                        $log.error('获取分组车辆列表', result)
                    }
                });
            };

            /**
             * 选择车辆
             */
            $scope.selectCar = function (car) {
                // console.log('select car');
                // if (car.isSelect) {
                //     $scope.selectCarList.push(car._id);
                //     $scope.selectCarListObj.push(car);
                //     $log.debug('$scope.selectCarList', $scope.selectCarList)
                // } else {
                //     $scope.selectCarList = _.reject($scope.selectCarList, function (item) {
                //         return item == car._id;
                //     });
                //     $scope.selectCarListObj = _.reject($scope.selectCarListObj, function (item) {
                //         return item._id == car._id;
                //     })
                // }
                // $log.debug('$scope.selectCarList', $scope.selectCarList)
            };
            /**
             * 重新分配车辆
             */
            $scope.setGroupMulti = function () {

                /**
                 * 循环列表中的选中车辆
                 */
                $scope.selectCarList = [];
                angular.forEach($scope.carList, function (item, index) {
                    if (item.isSelect) {
                        $scope.selectCarList.push(item._id);
                        $scope.selectCarListObj.push(item);
                    }
                });

                $log.debug('当前页的车辆', $scope.selectCarList);


                if ($scope.selectCarList.length > 0) {
                    PassSellService.addTruckToGroup($scope.query.id, $scope.selectCarList).then(function (result) {
                        if (result.status == 'success') {
                            $log.debug('分配成功', result)
                            $scope.carList = _.difference($scope.carList, $scope.selectCarListObj);
                            $scope.selectCarList = [];
                            $scope.selectCarListObj = []
                            $state.go('sell_release.car_group_detail', { group_id: $scope.query.id, type: $scope.query.type })
                        } else {
                            if (result.msg == 'Maximum limit') {
                                iAlert.alert('该分组车辆空间不足，每组最多分配100辆车');
                            } else {
                                iAlert.alert('分配失败！');
                            }
                            $log.error('分配失败', result)
                        }
                    });

                } else {
                    iAlert.alert('请先选择要分配的车辆！')
                }
            };

            /**
             * 下一页
             */
            $scope.next = function () {
                $scope.query.page += 1;
                queryAction();
            }
            /**
             * 下一页
             */
            $scope.previous = function () {
                $scope.query.page -= 1;
                queryAction();
            }
            /**
             * 刷新
             */
            $scope.doRefresh = function () {
                // $scope.query.page = 1;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            }
        }
    ])
    //运输 车辆 车辆名片
    .controller('driver_name_cared_ctrl', ['$scope', '$stateParams', '$rootScope', 'ionicToast', 'ENV', 'AuthenticationService', 'TrafficPersonService', 'ShareHelpNew', 'TrafficWebIMService', '$log','RscAlert',
        function ($scope, $stateParams, $rootScope, ionicToast, ENV, AuthenticationService, TrafficPersonService, ShareHelpNew, TrafficWebIMService, $log,RscAlert) {
            var vm = $scope.vm = this;
            vm.user_id = $stateParams.user_id;
            vm.role = $stateParams.type
            AuthenticationService.checkToken().then(function (res) {
                // 个人信息
                console.log(res)
                vm.userId = res.user._id
                vm.useRole = res.user.role
                vm.photo_url = res.user.photo_url
                vm.operate = (vm.userId == vm.user_id) ? true : false
            })

            vm.init = function () {

                TrafficPersonService.userInfo(vm.user_id, vm.role).then(function (data) {
                    console.log(data)
                    if (data.status == 'success') {
                        vm.userInfo = data.data
                        console.log(data.data)

                        vm.myUrl = 'http://60.205.146.196:4000/icon-76@2x.png';
                        $scope.shareInfo = {
                            msg: {
                                url: "http://" + ENV.shareHost + '/personHome.html?' + vm.userInfo.user._id + "." + $rootScope.shareAppKey,
                                // description: '',
                                // type: '【物流抢单】',
                                description: '邀请您在线进行交易',
                                tagName: 'rsc',
                                img: vm.userInfo.user.photo_url ? vm.userInfo.user.photo_url : vm.myUrl
                            },
                            opts: {
                                hideSms: false,
                                type: '',
                                params: {}

                            },
                            params: {
                                route: {
                                    // type: 'trafficDemand',
                                    id: vm.userInfo.user._id
                                }
                            }
                        }
                        if (!vm.userInfo.company || !vm.userInfo.company.nick_name) {
                            $scope.shareInfo.msg.title = vm.userInfo.user.real_name;
                        } else {
                            $scope.shareInfo.msg.title = vm.userInfo.company.nick_name + ' ' + vm.userInfo.user.real_name;
                        }

                    }
                }).then(
                    function () {
                        TrafficPersonService.getStatus(vm.user_id).then(function (res) {
                            if (res.status == 'success') {
                                console.log(res)
                                vm.status = res.data.status
                                console.log(vm.status)
                            } else {
                                console.log(res)
                            }

                        })

                    })

                vm.shareAction = function () {
                    ShareHelpNew.initShare($scope, $scope.shareInfo);
                    $scope.show();
                };
            }




            vm.callPhone = function (mobilePhone) {
                if (vm.userInfo.friend) {
                    ionicToast.show('暂不是好友，无法通话', 'middle', false, 2500);
                } else {
                    if(ionic.Platform.isWebView()){
						console.log("拨打:" + mobilePhone);
						window.plugins.CallNumber.callNumber(function (e) {
							console.log(e)
						}, function (e) {
							console.log(e)
						}, mobilePhone, true)
                    }else {
						RscAlert.alert('电话：' + mobilePhone);
                    }

                }

            }


            vm.chat = function () {
                $rootScope.chat('p2p-'+vm.id, 'p2p', vm.role)
            }


            vm.addRelation = function (friend, status) {
                TrafficPersonService.addRelation(vm.user_id, friend, status).then(function (res) {
                    console.log(res)
                    if (res.status == 'success') {
                        ionicToast.show('请等待对方同意', 'middle', false, 2500);
                    } else {
                        ionicToast.show(res, 'middle', false, 2500);
                    }
                })
            }


            $scope.$on("$ionicView.beforeEnter", function () {
                vm.init()
            })


        }])
