/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.controller.line', [])
/**
 * 物流 发布线路
 */
    .controller('line_ctrl', ['$scope', '$state', '$ionicLoading', 'AccountInformation', '$rootScope', '$log', 'PassBuyService'
        , function ($scope, $state, $ionicLoading, AccountInformation, $rootScope, $log, PassBuyService) {
            var vm = $scope.vm = this;



            vm.init = function () {
                vm.query = {
                    page: 1,
                    getType: 1,
                    scene: 'self',
                    is_refresh:true
                };
                queryAction();
            };
            $scope.$on('$ionicView.beforeEnter', function () {
                // vm.doRefresh()
                vm.init()
            })
            var run = false;
            vm.hasMore = false;

            vm.reqcomplete=false;
            var queryAction = function () {
                if (!run) {
                    $ionicLoading.show();
                    run = true;
                    vm.reqcomplete=false;
                    PassBuyService.lineList(vm.query).then(function (result) {
                        vm.reqcomplete=true;
                        $log.debug('$scope.query', vm.query);
                        page: vm.query.page
                        if (result.status == 'success') {
                            $log.debug('获取线路信息', result);
                            vm.hasMore = result.data.exist;
                            vm.count = result.data.count
                            if (vm.query.getType == 3) {
                                if (vm.lineLists) {
                                    vm.lineLists = vm.lineLists.concat(result.data.lines);
                                } else {
                                    vm.lineLists = result.data.lines;
                                }
                            } else {
                                vm.lineLists = result.data.lines;
                            }
                        } else {
                            $log.error('获取线路信息', result);
                            vm.hasMore = false;
                        }
                    }).finally(function () {
                        run = false;
                        $ionicLoading.hide();
                    })
                }
            }

            // 线路详情
            vm.lineDetail = function (item) {
                // $state.go('sell_release.add_line',{line_id:item._id})
                $state.go('rsc.line_detail', {line_id: item._id})
            };

            //加载更多
            vm.loadMore = function () {
                vm.query.page += 1;
                vm.query.getType = 3;
                queryAction();
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            //下拉刷新
            vm.doRefresh = function () {
                vm.query.page = 1;
                vm.query.getType = 2;
                vm.query.is_refresh=true;
                queryAction();
                $scope.$broadcast('scroll.refreshComplete');
            };

        }])

    /**
     * 物流 线路详情
     */
    .controller('line_detail_ctrl', ['$scope', '$state', '$ionicLoading', 'AccountInformation', '$rootScope', '$log', '$stateParams','$filter','$ionicHistory', 'PassBuyService','AccountService', 'RscAlert','ionicToast'
        , function ($scope, $state, $ionicLoading, AccountInformation, $rootScope, $log, $stateParams,$filter,$ionicHistory, PassBuyService,AccountService,RscAlert,ionicToast) {

            var vm = $scope.vm = this;

            vm.init=function () {
                getMaterial();
            }

            $scope.$on('$ionicView.beforeEnter', function () {
                vm.init();
            })

            //处理checkBox
            var getMaterial=function () {
                AccountService.getMaterial().then(function (rep) {
                    var result=rep.data;
                    var r1=result.singleDimensionalByAttrArr(['chn','eng']);
                    for(var i=0; i<r1.length; i++){
                        r1[i].checked=false;
                    }
                    r1.push({chn: "不限制", eng: "bxz", checked: false})
                    vm.types=r1;
                    queryAction()

                })
            }


            var queryAction = function () {
                vm.query = {
                    page: 1,
                    getType: 1,
                    line_id: $stateParams.line_id
                };
                PassBuyService.lineDetail(vm.query).then(function (result) {
                    console.log(result)
                    if (result.status == 'success') {
                        vm.count = result.data.count;
                        vm.line = result.data;

                        vm.address.price=vm.line.money;
                        vm.address.unmoney=vm.line.unmoney;
                        vm.address.appendix=vm.line.appendix;

                         vm.pickCityPickDataBegin.areaData=[vm.line.start_province,vm.line.start_city, vm.line.start_district];
                        vm.address.begin.value = {
                            currentProvinceId:vm.line.start_pro_id,
                            currentCityId:vm.line.start_cit_id,
                            currentAreaId:vm.line.start_dis_id
                        };
                        vm.pickCityPickDataEnd.areaData=[vm.line.end_province,vm.line.end_city, vm.line.end_district];
                        vm.address.end.value = {
                            currentProvinceId:vm.line.end_pro_id,
                            currentCityId:vm.line.end_cit_id,
                            currentAreaId:vm.line.end_dis_id
                        };

                        console.log('vm.line:', vm.line);
                        console.log('vm.line.cargo:', vm.line.cargo);
                        if(vm.line.cargo){
                            if(vm.line.cargo.length==0){
                                vm.types[vm.types.length-1]['checked']=true;
                            }else{
                                for(var i=0; i<vm.line.cargo.length; i++){
                                    vm.types[i]['checked']=true;
                                }
                            }
                        }
                    } else {
                        $log.error('获取线路信息', result);
                        vm.hasMore = false;
                    }
                })

            }




            var cargo=[];
            vm.typeChange=function (index,$event,type) {
                var checkbox =$event.target;
                var isCheckd=checkbox.checked;
                vm.types[index].checked=isCheckd;
                if(type.chn=='不限制'&&type.checked){
                    for(var i=0; i<vm.types.length; i++){
                        if(vm.types[i]['chn']=='不限制'){
                            vm.types[i]['checked']=true;
                        }else{
                            vm.types[i]['checked']=false;
                        }
                    }
                }
                if(type.chn!='不限制'){
                    vm.types[vm.types.length-1].checked=false;
                }

            }






            vm.address = {
                begin: {},
                end: {},
                price: ''
            };
            vm.pickCityPickDataBegin = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    var res = vm.pickCityPickDataBegin;
                    vm.address.begin.value = {};
                    vm.address.begin.value.currentProvinceId = res.currentProvince.ProID;
                    vm.address.begin.value.currentCityId = res.currentCity.CityID;
                    vm.address.begin.value.currentAreaId = res.currentArea.DisID;
                    vm.address.begin.text = $filter('addressText')(res);
                    vm.pickCityPickDataBegin.areaData = [vm.address.begin.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-green',
                title: '出发地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }
            vm.pickCityPickDataEnd = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    var res = vm.pickCityPickDataEnd;
                    vm.address.end.value = {};
                     vm.address.end.value.currentProvinceId = res.currentProvince.ProID;
                     vm.address.end.value.currentCityId = res.currentCity.CityID;
                     vm.address.end.value.currentAreaId = res.currentArea.DisID;
                    vm.address.end.text = $filter('addressText')(res);
                    vm.pickCityPickDataEnd.areaData = [vm.address.end.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-brown',
                title: '到达地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }

            vm.add = function () {
                // console.log( vm.pickCityPickDataBegin.currentProvince.ProID)
                for(var i=0; i<vm.types.length; i++){
                    if( vm.types[i]['checked']){
                        //checkBox属性checked为true的list
                        var isSelectItem=vm.types.removeItemByAttr('checked')
                        //重组为一维数组供后端用
                        cargo=isSelectItem.singleDimensionalByAttr('eng');
                    }
                }
                if (!vm.address.begin.value || !vm.address.begin.value.currentCityId || !vm.address.end.value || !vm.address.end.value.currentCityId) {
                    RscAlert.alert('请填写出发地和到达地,具体到区!');
                    return;
                }

                if(!vm.address.price||vm.address.price < 0){
                    RscAlert.alert('线路报价不合法');
                    return;
                }else if(!vm.address.unmoney||vm.address.unmoney < 0){
                    RscAlert.alert('回程报价不合法');
                    return;
                }else if(cargo.length==0){
                    RscAlert.alert('请选择线路运输货物');
                    return;
                }
                var info = {
                    line_id:$stateParams.line_id,
                    start_province: vm.address.begin.value.currentProvinceId,
                    start_city: vm.address.begin.value.currentCityId,
                    start_district: vm.address.begin.value.currentAreaId,
                    end_province: vm.address.end.value.currentProvinceId,
                    end_city: vm.address.end.value.currentCityId,
                    end_district: vm.address.end.value.currentAreaId,
                    money: vm.address.price,
                    unmoney:vm.address.unmoney,
                    cargo:cargo[0]=='bxz'?[]:cargo,
                    appendix:vm.address.appendix
                };


                console.log(info)
                PassBuyService.editLine(info).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('添加线路', result);
                        ionicToast.show('更新成功', 'middle', false, 2500);
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableAnimate: false
                        });
                        $state.go('rsc.line')
                    } else {
                        $log.error('更新失败', result);
                    }
                });

            };




        }])
    /**
     * 物流 编辑线路
     */
    .controller('edit_line_ctrl', ['$scope', '$state', '$ionicLoading', 'AccountInformation', '$rootScope', '$log', '$stateParams', 'PassBuyService', 'RscAlert', '$filter', 'ionicToast', '$ionicHistory'
        , function ($scope, $state, $ionicLoading, AccountInformation, $rootScope, $log, $stateParams, PassBuyService, RscAlert, $filter, ionicToast, $ionicHistory) {
            var vm = $scope.vm = this;
            vm.address = {
                begin: {},
                end: {},
                price: ''
            };
            vm.query = {
                line_id: $stateParams.line_id
            };
            vm.init = function () {
                PassBuyService.lineDetail(vm.query).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('线路详情', result);
                        vm.address.begin.value = {};
                        vm.address.begin.value.currentProvinceId = result.data.line.start_pro_id;
                        vm.address.begin.value.currentCityId = result.data.line.start_cit_id;
                        vm.address.begin.value.currentAreaId = result.data.line.start_dis_id;
                        vm.address.end.value = {};
                        vm.address.end.value.currentProvinceId = result.data.line.end_pro_id;
                        vm.address.end.value.currentCityId = result.data.line.end_cit_id;
                        vm.address.end.value.currentAreaId = result.data.line.end_dis_id;

                        vm.address.begin.text = result.data.line.start_province + result.data.line.start_city + result.data.line.start_district + (result.data.line.start_detail || "");
                        vm.address.end.text = result.data.line.end_province + result.data.line.end_city + result.data.line.end_district + (result.data.line.end_detail || "");
                        vm.pickCityPickDataBegin.areaData = [vm.address.begin.text, ''];
                        vm.pickCityPickDataEnd.areaData = [vm.address.end.text, ''];
                        vm.address.price = result.data.line.money;
                    } else {
                        $log.error('添加线路', result)
                    }
                });
            };
            vm.pickCityPickDataBegin = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    // vm.cb()
                    var res = vm.pickCityPickDataBegin;

                    vm.address.begin.value = {};

                    if (res.currentProvince) {
                        vm.address.begin.value.currentProvinceId = res.currentProvince.ProID;
                    }
                    if (res.currentCity) {
                        vm.address.begin.value.currentCityId = res.currentCity.CityID;
                    }
                    if (res.currentArea) {
                        vm.address.begin.value.currentAreaId = res.currentArea.DisID;
                    }
                    vm.address.begin.text = $filter('addressText')(res);
                    vm.pickCityPickDataBegin.areaData = [vm.address.begin.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-green',
                title: '出发地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }
            vm.pickCityPickDataEnd = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    // vm.cb()
                    var res = vm.pickCityPickDataEnd;

                    vm.address.end.value = {};
                    if (res.currentProvince) {
                        vm.address.end.value.currentProvinceId = res.currentProvince.ProID;
                    }
                    if (res.currentCity) {
                        vm.address.end.value.currentCityId = res.currentCity.CityID;
                    }
                    if (res.currentArea) {
                        vm.address.end.value.currentAreaId = res.currentArea.DisID;
                    }
                    vm.address.end.text = $filter('addressText')(res);
                    vm.pickCityPickDataEnd.areaData = [vm.address.end.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-brown',
                title: '到达地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }

            vm.edit = function () {
                $log.debug('添加线路', vm.address.price);
                if (!vm.address.begin.value || !vm.address.begin.value.currentCityId || !vm.address.end.value || !vm.address.end.value.currentCityId) {
                    RscAlert.alert('请填写出发地和到达地,具体到区!');
                    return;
                }

                if (!vm.address.price) {
                    RscAlert.alert('物流报价不能为空,且大于0');
                    return;
                } else {
                    if (vm.address.price < 0) {
                        RscAlert.alert('物流报价必须大于0');
                        return;
                    }
                }
                var info = {
                    start_province: vm.address.begin.value.currentProvinceId,
                    start_city: vm.address.begin.value.currentCityId,
                    start_district: vm.address.begin.value.currentAreaId,
                    end_province: vm.address.end.value.currentProvinceId,
                    end_city: vm.address.end.value.currentCityId,
                    end_district: vm.address.end.value.currentAreaId,
                    line_id: $stateParams.line_id,
                    money: vm.address.price
                };
                PassBuyService.editLine(info).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('添加线路', result);
                        ionicToast.show('保存成功', 'middle', false, 2500);
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableAnimate: false
                        });
                        $state.go('rsc.line')
                    } else {
                        $log.error('添加线路价格失败', result);
                    }
                });


            };

            vm.delLine = function () {
                RscAlert.popup('提示', '确认删除此线路？', function (res) {
                    PassBuyService.closeLine($stateParams.line_id).then(function (result) {
                        if (result.status == 'success') {
                            $log.debug('删除成功', result);
                            $ionicHistory.nextViewOptions({
                                historyRoot: true,
                                disableAnimate: false
                            });
                            $state.go('rsc.line')
                        } else {
                            //修改失败
                            $log.error('删除失败', result);
                        }
                    })
                });
            };

        }])
    /**
     * 物流 发布线路
     *
     */
    .controller('add_line_ctrl', ['$scope', '$ionicPopup', 'AccountInformation', '$log', '$state', 'RscAlert', '$filter', '$stateParams', '$ionicHistory', 'PassBuyService', 'ionicToast','AccountService',
        function ($scope, $ionicPopup, AccountInformation, $log, $state, RscAlert, $filter, $stateParams, $ionicHistory, PassBuyService, ionicToast,AccountService) {
            var vm = $scope.vm = this;


            //处理checkBox
            AccountService.getMaterial().then(function (rep) {
                var result=rep.data;
                var r1=result.singleDimensionalByAttrArr(['chn','eng']);
                for(var i=0; i<r1.length; i++){
                    r1[i].checked=false;
                }
                r1.push({chn: "不限制", eng: "bxz", checked: false})
                vm.types=r1;
            })
            var cargo=[];
            vm.typeChange=function (index,$event,type) {
                var checkbox =$event.target;
                var isCheckd=checkbox.checked;
                vm.types[index].checked=isCheckd;
                if(type.chn=='不限制'&&type.checked){
                    for(var i=0; i<vm.types.length; i++){
                        if(vm.types[i]['chn']=='不限制'){
                            vm.types[i]['checked']=true;
                        }else{
                            vm.types[i]['checked']=false;
                        }
                    }
                }
                if(type.chn!='不限制'){
                    vm.types[vm.types.length-1].checked=false;
                }
                //checkBox属性checked为true的list
                var isSelectItem=vm.types.removeItemByAttr('checked')
                //重组为一维数组供后端用
                cargo=isSelectItem.singleDimensionalByAttr('eng');
            }


            vm.address = {
                begin: {},
                end: {},
                price: ''
            };
            vm.pickCityPickDataBegin = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    // vm.cb()
                    var res = vm.pickCityPickDataBegin;

                    vm.address.begin.value = {};

                    if (res.currentProvince) {
                        vm.address.begin.value.currentProvinceId = res.currentProvince.ProID;
                    }
                    if (res.currentCity) {
                        vm.address.begin.value.currentCityId = res.currentCity.CityID;
                    }
                    if (res.currentArea) {
                        vm.address.begin.value.currentAreaId = res.currentArea.DisID;
                    }
                    vm.address.begin.text = $filter('addressText')(res);
                    vm.pickCityPickDataBegin.areaData = [vm.address.begin.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-green',
                title: '出发地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }
            vm.pickCityPickDataEnd = {
                areaData: [],
                backdrop: true,
                backdropClickToClose: true,
                defaultAreaData: ['请', '选', '择'],
                buttonClicked: function () {
                    // vm.cb()
                    var res = vm.pickCityPickDataEnd;

                    vm.address.end.value = {};
                    if (res.currentProvince) {
                        vm.address.end.value.currentProvinceId = res.currentProvince.ProID;
                    }
                    if (res.currentCity) {
                        vm.address.end.value.currentCityId = res.currentCity.CityID;
                    }
                    if (res.currentArea) {
                        vm.address.end.value.currentAreaId = res.currentArea.DisID;
                    }
                    vm.address.end.text = $filter('addressText')(res);
                    vm.pickCityPickDataEnd.areaData = [vm.address.end.text, '']

                },
                tag: '',
                iconClass: 'icon ion-ios-location text-orange',
                title: '到达地:',
                cssClass: 'item item-icon-left item-icon-right',
                watchChange: true
            }

            vm.add = function () {
                if (!vm.address.begin.value || !vm.address.begin.value.currentCityId || !vm.address.end.value || !vm.address.end.value.currentCityId) {
                    RscAlert.alert('请填写出发地和到达地,具体到区!');
                    return;
                }

                 if(!vm.address.price||vm.address.price < 0){
                    RscAlert.alert('线路报价不合法');
                    return;
                }else if(!vm.address.unmoney||vm.address.unmoney < 0){
                    RscAlert.alert('回程报价不合法');
                    return;
                }else if(cargo.length==0){
                     RscAlert.alert('请选择线路运输货物');
                     return;
                 }
                var info = {
                    start_province: vm.address.begin.value.currentProvinceId,
                    start_city: vm.address.begin.value.currentCityId,
                    start_district: vm.address.begin.value.currentAreaId,
                    end_province: vm.address.end.value.currentProvinceId,
                    end_city: vm.address.end.value.currentCityId,
                    end_district: vm.address.end.value.currentAreaId,
                    money: vm.address.price,
                    unmoney:vm.address.unmoney,
                    cargo:cargo[0]=='bxz'?[]:cargo,
                    appendix:vm.address.appendix
                };


                PassBuyService.addLine(info).then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('添加线路', result);
                        ionicToast.show('保存成功', 'middle', false, 2500);
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableAnimate: false
                        });
                        $state.go('rsc.line')

                    } else {
                        $log.error('添加线路价格失败', result);
                        if (result.msg == 'line_number_max') {
                            RscAlert.alert('最多添加30条线路')
                        } else {
                            $log.error('添加线路', result)
                        }
                    }
                })

            };

        }])
