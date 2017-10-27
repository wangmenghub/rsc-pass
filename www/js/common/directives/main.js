/**
 * 所有公共指令
 */

angular.module('rsc.common.directives', ['ion-BottomSheet'])
    /**
     * 公用二级导航，根据当前路由名称配置
     */
    .directive('rscSubHeader', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                active: '@',
                configName: '@',
                count: '@',
                msgData: '=msg'
            },
            templateUrl: 'js/common/directives/templates/subHeader.html',
            controller: function ($scope, $state, PassBuyService, $log, $rootScope, Storage) {
                var vm = $scope.vm = {};
                //当前选中的tab
                vm.currentTab = {};



                vm.tabArrays = {
                    default: [
                        { text: '货源', link: 'rsc.center_goods', active: false, type: 'goods', count: '0' },
                        { text: 'PK', link: "rsc.pk_processing", active: false, type: 'pk', count: '0' },
                        { text: '订单', link: 'rsc.order_waiting', active: false, type: 'order', count: '0' },
                        { text: '发布线路', link: 'rsc.line', active: false, type: 'line', count: '0' }
                    ],
                    'rsc.buy_offer': [
                        { text: '采购大厅', link: 'rsc.buy_offer', active: false, type: 'goods', count: '0' },
                        { text: '采购计划', link: 'rsc.buy_plan', active: false, type: 'order', count: '0' },
                        /*{ text: 'PK', link: "rsc.buy_pk", active: false, type: 'pk', count: '0' },*/
                        { text: '我的采购', link: 'rsc.buy_publish({params:"true"})', active: false, type: 'line', count: '0' },
                        // { text: '订单', link: 'rsc.buy_order_transit', active: false, type: 'order', count: '0' }
                    ],
                    'rsc.sale_grab': [
                        { text: '销售大厅', link: 'rsc.sale_grab', active: false, type: 'goods', count: '0' },
                        { text: '销售计划', link: "rsc.sale_pk", active: false, type: 'pk', count: '0' },
                        { text: '我的报价', link: 'rsc.sale_price_published({params:"published"})', active: false, type: 'order', count: '0' },
                        // { text: '订单', link: 'rsc.sale_order_transit', active: false, type: 'order', count: '0' }
                    ],
                    'rsc.center_goods': [
                        { text: '指派行情', link: 'rsc.center_goods', active: false, type: 'goods', count: '0' },
                        { text: '我参与的', link: "rsc.pk_processing", active: false, type: 'pk', count: '0' },
                        { text: '已失效', link: "rsc.demand_invalid", active: false, type: 'pk', count: '0' },
                    ],
                    'rsc.transport': [
                        /* { text: '看线路', link: 'rsc.line_list', active: false, type: 'goods', count: '0' },*/
                        { text: '运输计划', link: "rsc.valid", active: false, type: 'good', count: '0' },
                        // { text: '调度中心', link: 'rsc.order_list({status:"effective"})', active: false, type: 'order', count: '0' }

                    ],
                    'rsc.finanice_admin': [
                        // { text: '概况', link: 'rsc.finance_survey', active: false, type: 'goods', count: '0' },
                        { text: '销售', link: 'rsc.finance_supply', active: false, type: 'order', count: '0' },
                        { text: '采购', link: 'rsc.finance_purchase', active: false, type: 'order', count: '0' },
                        { text: '物流', link: "rsc.finance_logistics({status:'effective'})", active: false, type: 'good', count: '0' }

                    ],
                    'rsc.finanice_purchase': [
                        // { text: '概况', link: 'rsc.finance_survey', active: false, type: 'goods', count: '0' },
                        // { text: '销售', link: 'rsc.finance_supply', active: false, type: 'order', count: '0' },
                        { text: '采购', link: 'rsc.finance_purchase', active: false, type: 'order', count: '0' },
                        { text: '物流', link: "rsc.finance_logistics({status:'effective'})", active: false, type: 'good', count: '0' }

                    ],
                    'rsc.finanice_supply': [
                        // { text: '概况', link: 'rsc.finance_survey', active: false, type: 'goods', count: '0' },
                        { text: '销售', link: 'rsc.finance_supply', active: false, type: 'order', count: '0' },
                        // { text: '采购', link: 'rsc.finance_purchase', active: false, type: 'order', count: '0' },
                        { text: '物流', link: "rsc.finance_logistics({status:'effective'})", active: false, type: 'good', count: '0' }

                    ]
                }

                $rootScope.$watch('msgCout', function (oldVal, newVal) {
                    if ($rootScope.msgCout != undefined) {
                        vm.tabArrays['rsc.center_goods'][0].count = $rootScope.msgCout.pass_demand;
                        vm.tabArrays['rsc.center_goods'][1].count = $rootScope.msgCout.pass_plan;
                    }
                })

                //默认以路由名字为key
                var tabConfig = $state.current.name;

                //如果有制定名字，则取指定名字的配置
                if ($scope.configName) {
                    tabConfig = $scope.configName;
                }

                //如果没有找到使用默认配置
                if (!vm.tabArrays[tabConfig]) {
                    tabConfig = 'default';
                }

                vm.tabs = vm.tabArrays[tabConfig]
                vm.tabs[$scope.active - 1 || 0].active = true;

                //新增计划的个获取数
                if (tabConfig == 'rsc.buy_offer') {
                    $rootScope.$on('planNews', function (event, data) {
                        if (data.type == 'offerPlan') {
                            $rootScope.planNews = data.num;
                            vm.tabArrays['rsc.buy_offer'][1].count = $rootScope.planNews;
                        }
                    })
                }
                vm.tabArrays['rsc.buy_offer'][1].count = $rootScope.planNews;
            }

        }
    })
    /**
     * 公用底部导航
     */
    .directive('rscTabs', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                active: '@',
                configName: '@',
                unreadMsg: '@'
            },
            templateUrl: 'js/common/directives/templates/tabs.html',
            controller: function ($scope, $state, PassBuyService, $log, $rootScope, Storage, $timeout) {
                var vm = $scope.vm = this;
                vm.dele = {};
                //当前选中的tab
                vm.currentTab = {};
                vm.user = Storage.get("userInfo").user.role
                var tabArrays = {
                    default: [
                        { text: '货源', link: 'rsc.center_goods', active: false, type: 'goods', count: '0' },
                        { text: 'PK', link: "rsc.center.pk_processing", active: false, type: 'pk', count: '0' },
                        { text: '订单', link: 'rsc.center.order_waiting', active: false, type: 'order', count: '0' },
                        { text: '发布线路', link: 'rsc.center_line', active: false, type: 'line', count: '0' }

                    ],
                    trade: [{}],
                    'rsc.buy_offer': [
                        { text: '交易', link: 'rsc.sale_grab', active: false, type: 'goods', count: '0' },
                        { text: '运输', link: "rsc.valid", active: false, type: 'pk', count: '0' },
                        { text: '关系', link: 'rsc.message', active: false, type: 'order', count: '0' },
                        { text: '订单', link: 'rsc.finance_supply', active: false, type: 'line', count: '0' },
                        { text: '管理', link: 'rsc.company_dynamic', active: false, type: 'order', count: '0' }
                    ],
                    'rsc.center_goods': [
                        { text: '物流', link: 'rsc.center_goods', active: false, type: 'goods', count: '0' },
                        { text: '运输', link: "rsc.trans_grab", active: false, type: 'pk', count: '0' },
                        { text: '关系', link: 'rsc.message', active: false, type: 'order', count: '0' },
                        { text: '订单', link: 'rsc.finance_logistics', active: false, type: 'line', count: '0' },
                        { text: '管理', link: 'rsc.company_manager', active: false, type: 'order', count: '0' },
                    ]
                }



                $rootScope.$watch('msgCout', function (oldVal, newVal) {
                    if ($rootScope.msgCout != undefined) {
                        tabArrays['rsc.center_goods'][0].count = $rootScope.msgCout.pass_demand + $rootScope.msgCout.pass_plan;
                        tabArrays['rsc.center_goods'][1].count = $rootScope.msgCout.pass_order_wait + $rootScope.msgCout.driver_demand;
                        tabArrays['rsc.center_goods'][3].count = $rootScope.msgCout.driver_order + $rootScope.msgCout.pass_order;


                    }
                })




                // $rootScope.$watch('RmsgData',function(){
                //     if(!$rootScope.RmsgData){
                //        return false;
                //     }
                //
                //     var RmsgData=$rootScope.RmsgData.data;
                //     var footNavObj=tabArrays['pass.center_goods'];
                //     var footNav_GoodTotalVal=RmsgData.goods.total;
                //     var footNav_transpTotalVal=RmsgData.transportation.total;
                //     console.log('底部导航栏指令被调用')
                //     for(var i=0; i<footNavObj.length; i++){
                //         if(footNavObj[i].type=='goods'){
                //             footNavObj[i].count=footNav_GoodTotalVal
                //         }else if(footNavObj[i].type=='pk'){
                //             footNavObj[i].count=footNav_transpTotalVal
                //         }
                //     }
                // })

                //默认以路由名字为key
                var tabConfig = $state.current.name;


                //如果有制定名字，则取指定名字的配置
                if ($scope.configName) {
                    tabConfig = $scope.configName;
                }

                //如果没有找到使用默认配置
                if (!tabArrays[tabConfig]) {
                    tabConfig = 'default';
                }

                if (tabConfig == 'rsc.buy_offer') {
                    vm.tabs = tabArrays[tabConfig]
                    vm.dele.user_role = $rootScope.currentUser.user.role;
                    switch (vm.dele.user_role) {
                        case "TRADE_ADMIN":
                            vm.tabs[3].link = 'rsc.finance_supply';//销售
                            break;
                        case "TRADE_SALE":
                            vm.tabs[3].link = 'rsc.finance_supply';//销售
                            break;
                        case "TRADE_PURCHASE":
                            vm.tabs[0].link = 'rsc.buy_offer';//采购
                            vm.tabs[3].link = 'rsc.finance_purchase';//采购

                            break;
                        default:
                            $log.error('未知类型')
                    }
                } else {
                    vm.tabs = tabArrays[tabConfig]
                }

                vm.tabs[$scope.active - 1 || 0].active = true;

            }
        }
    })
    .directive('citysItem', function ($log) {
        return {
            restrict: 'EAC',
            templateUrl: "js/common/directives/templates/city_item.html",
            replace: true,
            scope: {
                data: "="
            },
            controller: function ($scope, areas, ENV, Storage, $http, $ionicScrollDelegate) {

                // $scope.provinces = areas.provinces;
                $scope.provinces = $scope.data.AreaService.provinces;

                $scope.current = 'pro';

                // $scope.apply
                // $scope.currentPro = null;
                $scope.currentCity = null;
                $scope.currentArea = null;

                $log.debug('current', $scope.data)

                $scope.selectPro = function (item) {
                    $scope.current = 'city';
                    //如果选择的不是同一个城市，则重新加载城市的数据。
                    if ($scope.currentPro && $scope.currentPro.ProID != item.ProID) {
                        $scope.currentCity = null;
                        $scope.currentArea = null;
                        $scope.citys = areas.citys[item.ProID]
                        $scope.areas = []
                        $scope.currentCity = { name: "请选择" }
                    } else {
                        if (!$scope.currentCity) {
                            $scope.currentCity = { name: "请选择" }
                        }
                        $scope.citys = areas.citys[item.ProID]
                    }
                    $scope.currentPro = item;
                    $scope.data.province = item;

                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
                }

                $scope.selectCity = function (item) {

                    if (!$scope.data.options.limit || $scope.data.options.limit.indexOf('ares') == -1) {
                        $scope.current = 'ares';
                    }
                    if ($scope.currentCity && $scope.currentCity.CityID != item.CityID) {
                        if (!$scope.data.options.limit || $scope.data.options.limit.indexOf('ares') == -1) {
                            $scope.currentArea = null;
                            $scope.areas = areas.areas[item.CityID]
                            // if($scope.areas.length)
                            $scope.currentArea = { name: "请选择" }
                        }
                    }
                    $scope.currentCity = item;
                    $scope.data.city = item;

                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();

                }

                $scope.selectAres = function (item) {
                    $scope.currentArea = item;
                    $scope.data.area = item;
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
                }
                $scope.currentProClick = function (item) {
                    $scope.current = 'pro';
                }
                $scope.currentCityClick = function (item) {
                    $scope.current = 'city';
                }
                $scope.currentAreaClick = function (item) {
                    $scope.current = 'area';

                }

            }
        }
    })
    /**
     * 省市区三级联动
     * */
    .directive('cityPicker', ['$ionicModal', '$timeout', 'areas', '$log', 'RscAlert', function ($ionicModal, $timeout, areas, $log, RscAlert) {
        function isBoolean(value) {
            return typeof value === 'boolean'
        }

        function isArray(value) {
            return toString.apply(value) === '[object Array]'
        }

        return {
            restrict: 'AE',
            // ./templates/common/cityItem.html
            templateUrl: "js/common/directives/templates/city_picker.html",
            // E:\rsc-mobile\www\js\directives\template\common\cityPicker.html
            scope: {
                options: '=options'
            }, link: function (scope, element, attrs) {
                var vm = scope.vm = {}, so = scope.options, citypickerModel = null;
                vm.options = so;

                vm.title = so.title || ''
                vm.buttonText = so.buttonText || '完成'
                // vm.cssClass = 'ionic-citypicker item' + (angular.isDefined(so.iconClass) ? ' item-icon-left ' : ' ') + (angular.isDefined(so.cssClass) ? so.cssClass : '')
                vm.cssClass = (angular.isDefined(so.cssClass) ? so.cssClass : '')

                vm.iconClass = 'icon ' + (angular.isDefined(so.iconClass) ? so.iconClass : '')
                vm.barCssClass = angular.isDefined(so.barCssClass) ? so.barCssClass : 'bar-stable'
                vm.backdrop = isBoolean(so.backdrop) ? so.backdrop : true
                vm.backdropClickToClose = isBoolean(so.backdropClickToClose) ? so.backdropClickToClose : false
                vm.hardwareBackButtonClose = isBoolean(so.hardwareBackButtonClose) ? so.hardwareBackButtonClose : true
                vm.watchChange = isBoolean(so.watchChange) ? so.watchChange : false
                vm.AreaService = areas
                vm.tag = so.tag //|| "-"
                vm.step = so.step || 36 // 滚动步长 （li的高度）
                if (angular.isDefined(so.defaultAreaData) && so.defaultAreaData.length > 1) {
                    vm.defaultAreaData = so.defaultAreaData
                    vm.areaData = vm.defaultAreaData.join(vm.tag)
                } else {
                    vm.defaultAreaData = ['北京', '东城区']
                    vm.areaData = angular.isDefined(so.areaData) ? so.areaData.join(vm.tag) : '请选择城市'
                }

                vm.returnOk = function () {
                    vm.areaData = "";
                    angular.forEach(['provice', "city", 'area'], function (item) {
                        if (vm[item]) {

                            so[('current' + item[0].toUpperCase() + item.substring(1, item.length))] = vm[item];
                        }
                    })


                    if (vm.area) {
                        if (vm.city) {
                            if (vm.city.CityID != vm.area.CityID) {
                                vm.area = null;
                                so.currentArea = null;
                            }
                        }
                    }

                    if (vm.city) {
                        if (vm.province) {
                            if (vm.city.ProID != vm.province.ProID) {
                                vm.city = null;
                                so.currentCity = null;
                            }
                        }
                    }

                    $log.debug('vm', vm)
                    // $log.debug('所选区域信息',vm.AreaService.areas[vm.city.CityID])

                    if (vm.options.no_check) {
                        // 不检查city 则检查省份

                        if (_.contains(vm.options.no_check, 'city')) {
                            if (!vm.province) {
                                $log.debug('省未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择省份')
                                return;
                            } else {
                                so.currentProvince = vm.province;
                                // vm.areaData += vm.tag + vm.province.name;

                            }
                        }
                        // 不检查area则检查 省份和城市
                        if (_.contains(vm.options.no_check, 'area')) {
                            if (!vm.province) {
                                $log.debug('省未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择省份')
                                $log.debug('vm.areaData', vm.areaData);

                                return;
                            } else {
                                so.currentProvince = vm.province;
                            }

                            if (!vm.city) {
                                $log.debug('市未选择')
                                vm.areaData = '请选择';

                                RscAlert.alert('请选择市')
                                $log.debug('vm.areaData', vm.areaData);

                                return;
                            } else {
                                so.currentCity = vm.city;
                            }
                        }
                        if (vm.province) {
                            vm.areaData += vm.tag + vm.province.name;
                        }
                        if (vm.city) {
                            vm.areaData += vm.tag + vm.city.name;
                        }
                        if (vm.area) {
                            vm.areaData += vm.tag + vm.area.name;
                        }
                        $log.debug('vm.areaData', vm.areaData);

                    } else {
                        //TODO 如果没有市下面确实没有 区域列表，则不验证。
                        if (vm.province) {
                            so.currentProvince = vm.province;
                            if (vm.city) {
                                so.currentCity = vm.city;
                                //如果有区域则检查是否选择区域信息，没有则不检查
                                if (vm.AreaService.areas[vm.city.CityID]) {
                                    if (!vm.area) {
                                        // so.currentArea = vm.area = { DisID: null, name: null };
                                        vm.areaData = '请选择';
                                        RscAlert.alert('请选择区域信息')
                                        return;
                                    } else {
                                        so.currentArea = vm.area;
                                    }
                                } else {
                                    so.currentArea = vm.area = { DisID: '', name: '' };
                                }
                                (vm.city) ? (vm.areaData = vm.province.name + vm.tag + vm.city.name + (vm.area ? vm.tag + vm.area.name : '')) : (vm.areaData = vm.province.name + vm.tag + vm.city.name)
                                $log.debug('所选区域信息', vm.AreaService.areas[vm.city.CityID])
                            } else {
                                vm.areaData = '请选择';
                                RscAlert.alert('请选择市')
                                return;
                            }
                        } else {
                            vm.areaData = '请选择';
                            RscAlert.alert('请选择省')
                            return;
                        }
                    }
                    $log.debug('end')
                    so.text = vm.areaData;

                    citypickerModel && citypickerModel.hide()
                    so.buttonClicked && so.buttonClicked()
                }
                vm.returnCancel = function () {
                    $log.debug('cancel', vm)
                    citypickerModel && citypickerModel.hide()
                    $timeout(function () {
                        so.cancel && so.cancel()
                        // vm.initAreaData(vm.areaData.split(vm.tag))
                    }, 150)
                }
                vm.clickToClose = function () {
                    vm.backdropClickToClose && vm.returnCancel()
                }

                vm.initAreaData = function (AreaData) {
                    console.log('初始化省市');
                    if (AreaData[0]) { // 初始化省
                        console.log(AreaData[0], vm.AreaService.provinces);
                        for (i in vm.AreaService.provinces) {
                            if (vm.AreaService.provinces[i].name == AreaData[0]) {
                                vm.province = vm.AreaService.provinces[i]
                                console.log('currentProvinces', vm.province);

                                // vm.currentPro = vm.province;
                                break;
                            }
                        }
                    }
                    if (AreaData[1] && vm.province) { // 初始化市
                        console.log('vm.AreaService.citys', vm.AreaService.citys[vm.province.ProID]);

                        vm.city = _.find(vm.AreaService.citys[vm.province.ProID], function (item) {
                            return item.name == AreaData[1];
                        })

                        // vm.currentCity = vm.city;
                        $log.debug('currentCity', vm.city)

                    }
                    if (AreaData[2] && vm.city && vm.city.sub) { // 初始化区

                    }
                }
                if (vm.watchChange) {
                    scope.$watch('options.areaData', function (newVal, oldVal) {
                        if (newVal !== oldVal && isArray(newVal) && newVal.length > 1 && newVal.join(vm.tag) !== vm.areaData) {
                            if (vm.isCreated) {
                                $log.debug('newVal', newVal)
                                // vm.initAreaData(newVal)
                            } else {
                                vm.defaultAreaData = newVal
                            }
                            vm.areaData = newVal.join(vm.tag)
                        }
                    })
                }
                element.on("click", function () {
                    // delete scope.options.titleCss;//单击后删除标题颜色(待启用)
                    if (citypickerModel) {
                        citypickerModel.show()
                        return false
                    }
                    vm.isCreated = true
                    // $ionicModal.fromTemplateUrl('lib/ionic-citypicker/src/templates/ionic-citypicker.html', {
                    $ionicModal.fromTemplateUrl('js/common/directives/templates/city_select.html', {
                        scope: scope,
                        animation: 'slide-in-up',

                        backdropClickToClose: false,
                        hardwareBackButtonClose: false,
                    }).then(function (modal) {
                        citypickerModel = modal;
                        $timeout(function () {
                            citypickerModel.show();
                            $log.debug('vm.defaultAreaData', vm.defaultAreaData)

                        }, 50)
                    })
                })
                scope.$on('$destroy', function () {
                    citypickerModel && citypickerModel.remove();
                });
            }
        }
    }])
    /**
     * 交易的 采购 销售的展示 按角色来分
     */
    .directive('rscNavTitle', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                active: '@'
            },
            templateUrl: 'js/common/directives/templates/navTitle.html',
            controller: function ($scope, $state, PassBuyService, $log, TradeServe, $rootScope, Storage) {
                var vm = $scope.vm = this;
                vm.dele = {};
                vm.dele.user_role = $rootScope.currentUser.user.role;
                switch (vm.dele.user_role) {
                    case "TRADE_ADMIN":
                        vm.dele.purchase = true;
                        vm.dele.sale = true;
                        break;
                    case "TRADE_SALE":
                        vm.dele.purchase = false;
                        vm.dele.sale = true; //銷售
                        break;
                    case "TRADE_PURCHASE":
                        vm.dele.purchase = true;//采购
                        vm.dele.sale = false;
                        break;
                    default:
                        $log.error('未知类型')
                }

            }

        }
    })

    .directive("addMap", [function () {
        return {
            restrict: "AE",
            template: "js/common/directives/templates/addMap.html",
            link: function (scope, iElm, iAttrs, controller) {
                var con = angular.element(document.querySelector('container'));
                console.log(con)
                con.style.height = window.screen.height - 44 + 'px';
                var map = new AMap.Map("container", {
                    zoom: 5,
                    center: [116.397428, 39.90923]
                });
                AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.OverView", "AMap.StationSearch"], function () {
                    map.addControl(new AMap.ToolBar());
                });
                if (location.href.indexOf('&guide=1') !== -1) {
                    map.setStatus({ scrollWheel: false })
                }
                var marker = new AMap.Marker({
                    position: [115.476254, 38.87606], //TODO:获取动态经纬度
                    map: map,
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    autoRotation: true
                });
                marker.setAngle();
                map.setFitView();
            }
        }
    }])
    .service('CompanyLabelService', ['ENV', 'AccountRestAngular',
        function (ENV, AccountRestAngular) {
            this.companyInfo = function () {
                var all = AccountRestAngular.allUrl('company/get_one');
                return all.post();
            }
        }
    ])
    .directive('rscCompanyLabel', function (iAlert, Storage, $state) {
        return {
            restrict: '',
            replace: true,
            templateUrl: 'js/common/directives/templates/company_label.html',
            controller: function ($scope, CompanyLabelService, TrafficCompanyModify) {
                function search_company(callback) {
                    var object = {
                        templateUrl: 'js/common/template/companyNickname.html',
                        title: '请输入公司名称'
                    };
                    var objmsg = {
                        type: 'post'
                    };
                    iAlert.tPopup($scope, object, objmsg, function (res) {
                        if (res) {
                            var name = res.post
                            callback(name)
                        }
                    })
                }
                $scope.search_company = function () {
                    search_company(function (name) {
                        if (name) {
                            name = name.replace(/(^\s+)|(\s+$)/g, "")
                            TrafficCompanyModify.verifyCompany(name, 1).then(function (res) {
                                console.log(res.data)
                                if (res.status == 'success') {
                                    $scope.search_list = res.data.list
                                    if ($scope.search_list.length != 0) {
                                        Storage.set('companyList', $scope.search_list);
                                    }
                                    $state.go('rsc.traffic_join', { name: name })
                                } else {
                                    return false
                                }
                            })
                        } else {
                            return false
                        }
                    })
                }
                // var vm = $scope.vm = this;
                // 审核模态框
                // CompanyLabelService.companyInfo().then(function (data) {
                //     console.log('公司信息', data);
                //     if (data.status == 'success') {
                //         vm.company_info = data.data;
                //         // Storage.set('userInfo', vm.user_info)
                //         if (data.data.verify_phase == 'PROCESSING') {
                //             vm.verify = true
                //             vm.loading = false
                //         } else if (data.data.verify_phase == 'FAILED' && vm.user_info.user.company_id != '') {
                //             vm.verify = true
                //             vm.loading = false
                //         } else {
                //             vm.verify = false
                //         }

                //     }
                // })
            }

        }
    })
    .directive('rscJionCompany', function (iAlert, Storage, $state, iAlert, TrafficCompanyModify,$log) {
        return {

            link: function ($scope, element, attr) {
                element.on('click', function () {
                    function search_company(callback) {
                        var object = {
                            templateUrl: 'js/common/template/companyNickname.html',
                            title: '请输入公司名称'
                        };
                        var objmsg = {
                            type: 'post'
                        };
                        iAlert.tPopup($scope, object, objmsg, function (res) {
                            if (res) {
                                var name = res.post
                                if (name) {
                                    name = name.replace(/(^\s+)|(\s+$)/g, "")
                                    TrafficCompanyModify.verifyCompany(name, 1).then(function (res) {
                                        console.log(res.data)
                                        if (res.status == 'success') {
                                            $scope.search_list = res.data.list
                                            if ($scope.search_list.length != 0) {
                                                Storage.set('companyList', $scope.search_list);
                                            }
                                            $state.go('rsc.traffic_join', { name: name })
                                        } else {
                                            return false
                                        }
                                    })
                                } else {
                                    return false
                                }
                            }
                        })
                    }
                    search_company();

                })
            }

        }
    })
    /**
   * 生成二维码弹窗
   */
    .directive('qrCode', function ($rootScope, $ionicModal) {
        return {
            scope: {
            },
            link: function ($scope, element, attr) {
                var vm = $scope.vm = {};
                if ($rootScope.currentUser.user && $rootScope.currentUser.user.length != 0) {
                    vm.user = $rootScope.currentUser.user
                    vm.company = $rootScope.currentCompanyInfo
                    vm.code = vm.user._id + '&' + vm.user.role;
                } else {
                    vm.userInfo = Storage.get('userInfo')
                    vm.user = vm.userInfo.user
                    vm.company = vm.userInfo.company
                    vm.code = vm.user._id + '&' + vm.user.role;
                }
                element.on('click', function () {
                    $scope.modal_code.show();
                })

                //二维码添加模态框
                $ionicModal.fromTemplateUrl('./js/common/directives/templates/mycode.html', {
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
            }
        }
    })

    /**
     * 扫描二维码
     */
    .directive('scan', function ($rootScope, $cordovaBarcodeScanner) {
        return {
            scope: {
                scan: '&'
            },
            link: function ($scope, element, attr) {
                console.log('element', element)
                var vm = $scope.vm = {};
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
                        if (result.text != '') {
                            $scope.scan && $scope.scan();
                            var data = result.text.split("&")
                            console.log(result)
                            if (!data[1]) {
                                data[1] = 'TRAFFIC_DRIVER_PRIVATE'
                            }
                            $rootScope.rootGoDetail(data[1], data[0])
                        }

                    }, function (error) {
                        alert("请重新扫描");
                    })
                };

                if (!ionic.Platform.isWebView()) {
                    element.css('display', 'none')
                }
                element.on('click', function () {
                    vm.scanStart();
                })
            }
        }
    })
    /**
     * 个人名片
     */
    .directive('personCard', function ($rootScope, $log) {
        return {
            templateUrl: 'js/common/directives/templates/personCard.html',
            scope: {
                user: '=',
                company: '=',
                onClick: '&'
            },
            link: function ($scope, element, attr) {
                try {
                    if (!$scope.user) {
                        $scope.user = $rootScope.currentUser.user;
                    }
                    if (!$scope.company) {
                        $scope.company = $rootScope.currentCompanyInfo;
                    }
                } catch (error) {
                    $log.error("personCard.error", error);
                }

                // element.on('click', function () {
                //     $scope.onClick && $scope.onClick($scope.user);
                // })

            }
        }

    })
    .directive('rscCompanyVerify', function ($state, $log, AccountService) {
        return {
            restrict: '',
            replace: true,
            scope: {
                company: '='
            },
            templateUrl: 'js/common/directives/company_verify/template/status.html',
            controller: function ($scope, $cordovaInAppBrowser) {
                //了解更多链接到官网
                $scope.aboutUs = function () {
                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'yes'
                    };
                    $cordovaInAppBrowser.open('http://www.e-wto.com/ ', '_blank', options)
                        .then(function (event) {
                        })
                        .catch(function (event) {
                            // error
                            console.log(event)
                        });
                };

            }, link: function (scope) {
                // scope.$watch("")

                AccountService.getCompanyStatus().then(function (result) {
                    if (result.status == 'success') {
                        $log.debug('【获取认证状态】', result);
                        scope.company_status = result.data;
                    } else {
                        $log.error('【获取认证状态】', result);
                        scope.company_status = null;
                    }
                })

            }

        }
    })
    /**
     * 人个主页和企业主页信息
     */
    .directive('rscOrderList', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                list: '=list',
                goDetail: '&goDetail',
                isPraise: '&isPraise',
                isFabulous: '@'
            },
            templateUrl: 'js/common/directives/templates/list.html',
            controller: function ($scope, $state, $log, TradeServe, $rootScope, Storage, $ionicHistory, $timeout) {
                var vm = $scope.vm = this;


            }

        }
    })
    /**
     * 轮播图
     */
    .directive('rscCarousel', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                tab: '@'
            },
            templateUrl: 'js/common/directives/templates/carousel_figure.html',
            controller: function ($scope, $state, $log, comService, $rootScope, $cordovaInAppBrowser) {
                var vm = $scope.vm = this;
                vm.getCarousel = function () {
                    var data = {
                        type: $rootScope.rscPlatform,
                        name: $rootScope.rscAppName
                    };
                    comService.getCarouselfigure(data).then(function (result) {
                        if (result.status == 'success') {
                            vm.carousel_img = result.data;
                            $log.debug('获取登录背景图', result);
                        } else {
                            $log.error('获取登录背景图', result);
                        }
                    })
                }
                vm.getCarousel();
                vm.aboutUs = function (index) {
                    console.log($cordovaInAppBrowser)
                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'yes'
                    };
                    $cordovaInAppBrowser.open(vm.carousel_img[1].text, '_blank', options)

                        .then(function (event) {
                            // success
                            console.log(event)

                        })

                        .catch(function (event) {
                            // error
                            console.log(event)
                        });
                };
            }

        }
    })
    /**
     * 个人和企业信息
     */
    .directive('rscInfo', function () {
        return {
            restrict: 'ECA',
            replace: false,
            scope: {
                data: '=data',
                order:'=order'
            },
            templateUrl: 'js/common/directives/templates/info.html',
            controller: function ($scope, $state, $log, PassBuyService, $rootScope, Storage, $ionicHistory, $timeout) {
                var vm = $scope.vm = this;
                $scope.$watch('data',function(){
                if(!$scope.data){
                  return false;
                }
                 PassBuyService.getInfo($scope.data).then(function(res){
                        if(res.status == 'success'){
                             $log.debug('用户信息',res)
                             vm.info=res.data;
                        }else{
                             $log.error('用户信息',res)
                        }
                 })
               })
            }

        }
    })
  /**
     * 详情页面头部
     */
    .directive('rscDetailHeader', function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                list: '=list',
                type:'@'
            },
            templateUrl: 'js/common/directives/templates/detail_header.html',
            controller: function ($scope, $state, $log, $rootScope, Storage, $ionicHistory, $timeout) {
                var vm = $scope.vm = this;
                $scope.average_price=0;
                console.log('333333',$scope.list)
//                angular.forEach($scope.list.product_categories,function(data){
//                  $scope.average_pric=$scope.average_pric+data.pass_price;
//                });
              }

        }
    })
   /**
     * 公用个人名片指令
     *
     * @return {Object}  用户信息
     */
    .directive('personCardNew', function (Dicitionary, TradeServe) {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                user: "=user",
                falg:'=falg'
            },
            templateUrl: 'js/common/directives/templates/person_car.html',
            controller: function ($scope, $log,PassSellService) {
           $log.debug('个人信息',$scope.user)
                var vm = $scope.vm = this
                vm.getInfo = function(){
                  PassSellService.getCompanyUserById($scope.user).then(function(res){
                      if(res.status == 'success'){
                         $log.debug('个人信息',res)
                         $scope.user_info = res.data;
                      }else{
                         $log.error('个人信息',res)
                      }
                  })
                }
                $scope.$watch('user', function () {
                    if($scope.user){
                       vm.getInfo();
                    }
                })
            }
        }
    })
    /**
     * 公司信息
     **/
    .directive('companyInfoTrade', [function () {
        return {
            restrict: 'ECA',
            replace: true,
            scope: {
                companyId: '=companyId',
            },
            templateUrl: "js/common/directives/templates/companyInfo.html",
            controller: function ($scope,PassService,$log,$rootScope) {
                var vm = $scope.vm = this;
                vm.getCompanyInfo = function () {
                    var s = ['PURCHASE', 'DJ', 'JJ', 'TRAFFIC_DEMAND']
                    PassService.CompanyInfo($scope.companyId, s).then(function (company) {
                        if (company.status == 'success') {
                            $log.log('公司信息', company)
                            vm.company_info = company.data;
                            vm.company_info.countExt = company.data.count;

                        }else{
                            $log.log('公司信息失败',company)
                        }
                    })
                }
                 $scope.$watch('companyId', function () {
                    if ($scope.companyId) {

                      vm.getCompanyInfo();
                    }
                })
                vm.dian = function(){
                   $rootScope.rootGoDetail(vm.company_info.company.type,vm.company_info.company._id);
                }

            }
        }
    }])
      /**
       * 公用详情页显示产品详情以及补货指令
       * @param {string} type 报价类型：
       * @param {Array} model 产品数组对象
       */
      .directive('productDetail', function (Dicitionary) {
          return {
              restrict: 'ECA',
              replace: true,
              scope: {
                  model: "=",
                  data:'=',
                  type:'='
              },
              templateUrl: 'js/common/directives/templates/product_detail.html',
              controller: function ($scope, $log) {
                  //根据type获取选择项数据源
                  $scope.$watch('model', function () {
                      if ($scope.model) {
                          $scope.products = $scope.model;
                          console.log($scope.products)
                      }

                  })

              }
          }
      })
