/**
 * 企业主页 企业关系
 */
angular.module('rsc.src.directive', ['rsc.config', 'ui.router'])
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
                $ionicModal.fromTemplateUrl('./js/src/manage/person/person_homepage/mycode.html', {
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
            templateUrl: 'js/module/directive/template/personCard.html',
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
    .directive('echartLine', function () {
        return {
            template: "<div id='container' style='height: 100%'></div>",
            link: function (scope, element, attr) {
                var myChart = echarts.init(document.getElementById("container"))
                var app = {};
                option = null;
                option = {
                    title: {
                        text: '堆叠区域图'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '视频广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: { normal: {} },
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };
                ;
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        }
    })

