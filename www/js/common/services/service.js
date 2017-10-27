angular.module('rsc.common.services.public', ['ionic-toast', 'ion-gallery'])
    .config(function ($provide, ionGalleryConfigProvider) {
        $provide.decorator('ionicToast', function ($delegate) {
            $delegate.alert = function (text) {
                this.show(text, 'middle', false, 1000);
            };
            return $delegate;
        });

        ionGalleryConfigProvider.setGalleryConfig({
            action_label: 'Close',
            template_gallery: 'gallery.html',
            template_slider: 'slider.html',
            toggle: false,
            row_size: 3,
            fixed_row_size: true
        });

        $provide.decorator('ionicDatePicker', function ($delegate, $cordovaDatePicker) {
            $delegate.openDatePickerExtend = function (options) {
                if (ionic.Platform.isWebView()) {
                    var optionsExt = {
                        date: options.inputDate ? options.inputDate : new Date(),
                        mode: 'date', // or 'time'
                        // minDate: new Date(),
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: '确定',
                        doneButtonColor: '#387ef5',
                        cancelButtonLabel: '取消',
                        cancelButtonColor: '#387ef5',
                        locale: 'zh_cn'
                    };
                    $cordovaDatePicker.show(optionsExt).then(function (date) {
                        options.callback(date);
                    });

                } else {
                    // var config = {
                    //     callback: function (val) {
                    //     },
                    //     inputDate: new Date(),
                    //     mondayFirst: true,
                    //     closeOnSelect: false,
                    //     templateType: 'popup'
                    // }
                    // if (options) {
                    //     angular.merge(config, options)
                    // }
                    this.openDatePicker(options);
                }
            };
            return $delegate;
        });

        //  $provide.decorator('ionicDatePicker', function ($delegate, $cordovaDatePicker, $log, $q) {
        //     $delegate.openDatePickerExtend = function (options) {
        //         if (ionic.Platform.isWebView()) {
        //             var optionsExt = {
        //                 date: new Date(),
        //                 mode: 'date', // or 'time'
        //                 // minDate: new Date(),
        //                 allowOldDates: true,
        //                 allowFutureDates: true,
        //                 doneButtonLabel: '确定',
        //                 doneButtonColor: '#387ef5',
        //                 cancelButtonLabel: '取消1',
        //                 cancelButtonColor: '#387ef5',
        //                 locale: 'zh_cn'
        //             };
        //             $log.debug('dddd')


        //         //    return $cordovaDatePicker.show(optionsExt);

        //             $cordovaDatePicker.show(optionsExt).then(function (date) {
        //                 $log.debug('cordovaDatePicker')
        //                 options.callback(date);
        //             });

        //         } else {

        //             var defer = $q.defer();
        //             var config = {
        //                 callback: function (val) {
        //                     defer.resolve(val);
        //                 },
        //                 inputDate: new Date(),
        //                 mondayFirst: true,
        //                 closeOnSelect: false,
        //                 templateType: 'popup'
        //             }
        //             if (options) {
        //                 angular.merge(config, options)
        //             }
        //             this.openDatePicker(config);

        //             // return defer.promise;


        //         }
        //     };
        //     return $delegate;
        // });
    })
    /**
     * http 请求钩子.
     */
    .factory('AuthInterceptor', ['$q', '$location', 'Storage', 'AppVersion',
        function ($q, $location, Storage, AppVersion) {
            var interceptor = {};

            interceptor.request = function (config) {
                var token = Storage.get('userInfo');

                if (token) {
                    //console.log('set Header', token.token);
                    config.headers["x-access-token"] = token.token;
                    config.headers["version"] = AppVersion;


                    // config.headers["x-access-token"] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2ZDUyOWU4YzBmMWYzMzE1NGQ3OGJmZCIsImNvbXBhbnlfaWQiOlsiNTZkNTI5ZThjMGYxZjMzMTU0ZDc4YmZiIl0sInJvbGUiOiJUUkFGRklDX0FETUlOIiwidXNlcl9uYW1lIjoi5rWL6K-VIiwiY29tcGFueV9uYW1lIjoi5rWL6K-V5rWB56iL5LyB5LiaIiwiaWF0IjoxNDU3MzEzMzIyLCJleHAiOjE0NTc5MTgxMjJ9.M5pNNiJVnvzQSCClOTR9HxuO2ymnXdssf-MuL1TzTT8';
                }
                return config;
            };

            interceptor.responseError = function (response) {
                if (response.status == 403) {
                    //console.log(403)
                    Storage.remove('userInfo');
                    $location.path("/login_guide");
                }
                return $q.reject(response);
            };

            interceptor.response = function (response) {
                // console.log('response',response)
                if (response.data.status == 'err' && response.data.msg == 'auth_failed') {
                    // iAlert.alert('请重新登录',function () {
                    //     window.alert('请重新登录')
                    Storage.remove('userInfo');
                    $location.path("/login_guide");
                    // })
                }
                return response;
            }

            return interceptor;
        }])
    /**
     * 浏览器本地存储操作
     */
    .factory('Storage', function (ENV) {
        function Storage(storge) {
            this.set = function (key, data) {
                return storge.setItem(key, window.JSON.stringify(data)); //local

                //return window.sessionStorage.setItem(key, window.JSON.stringify(data)) ; //session
            };
            this.get = function (key) {
                return window.JSON.parse(storge.getItem(key));
                //return window.JSON.parse(window.sessionStorage.getItem(key)) ; //session
            };
            this.remove = function (key) {
                storge.removeItem(key);
                //return window.sessionStorage.removeItem(key) ; //session
            };
            //清楚所有的
            this.clear = function () {
                storge.clear();
            }
        }

        return new Storage(ENV.storage);
    })
    .service('CachServices', function (CacheFactory) {
        var profileCache;

        // Check to make sure the cache doesn't already exist
        if (!CacheFactory.get('pageParams')) {
            profileCache = CacheFactory('pageParams', {
                storageMode: 'localStorage',
                // maxAge: 15 * 60 * 1000
            });
        }

        return {
            put: function (key, value) {
                profileCache.put(key, value);
            },
            get: function (key) {
                return profileCache.get(key);
            }, remove: function (key) {
                profileCache.remove(key);
            }
        }
    })
    /**
     * 分享功能弹窗
     */
    .service('ShareHelpNew', function (RscAlert, $ionicModal, EnumType, ShareWeChat, $state, $cordovaClipboard, SmsHelp, $bottomSheet, ionicToast) {
        return {
            initShare: function ($scope, shareInfo) {
                var alertQR = function () {
                    RscAlert.alert('<img class="center-block" src="./img/QR.png"><h5 class="text-center">扫描二维码下载app</h5>')
                }
                $scope.shareOpts = shareInfo.opts;
                $scope.copyFailed = function (copy) {
                    if (!ionic.Platform.isWebView()) {
                        window.prompt('请请选中文字，手动进行复制!', copy);
                    }
                };

                //手机端copy
                $scope.copyForPhone = function () {
                    $cordovaClipboard
                        .copy($scope.shareInfo.msg.url)
                        // .copy($scope.shareInfo.msg.title + $scope.shareInfo.msg.description + $scope.shareInfo.msg.url)
                        .then(function () {
                            // success
                            ionicToast.show('复制成功!', 'middle', false, 2500);
                            // window.alert(($scope.shareInfo.opts.copy_msg || $scope.shareInfo.msg.description) + '复制成功!');
                        }, function () {
                            // error
                            ionicToast.show('复制失败!', 'middle', false, 2500);
                        });
                }
                //复制成功
                $scope.copySuccess = function () {
                    RscAlert.alert(($scope.shareInfo.opts.copy_msg || (($scope.shareInfo.msg.type ? $scope.shareInfo.msg.type : '') + $scope.shareInfo.msg.title + $scope.shareInfo.msg.description)), function () {
                        $scope.modal.hide();
                    }, '复制成功');
                }
                $scope.show = function () {
                    $bottomSheet.show({
                        buttons: [
                            [
                                { btText: "朋友圈", img: "./img/common/share-icon2.png", btClass: "", btId: "1" },
                                { btText: "微信好友", img: "./img/common/share-icon.png", btClass: "", btId: "2" },
                                { btText: "复制链接", img: "./img/common/share-icon1.png", btClass: "", btId: "3" }
                            ],
                            [
                                { btText: "取消", btClass: "share-cancel", btId: "hide", hideOnClick: true }, //hide the bottomSheet when click
                            ]
                        ],
                        titleText: '',
                        buttonClicked: function (button, scope) {
                            if (button.btId == '1') {
                                $scope.shared('wechat1');
                                scope.cancel()
                                return;
                            } else if (button.btId == '2') {
                                $scope.shared('wechat');
                                scope.cancel()
                                return;
                            } else if (button.btId == '3') {
                                // $scope.copyForPhone();
                                if (ionic.Platform.isWebView()) {
                                    $scope.copyForPhone();
                                }
                                scope.cancel()
                                return;
                            } else {
                                scope.cancel()
                                return;
                            }
                        }
                    });
                }

                $scope.shared = function (type) {
                    switch (type) {
                        case 'sms':
                            if (ionic.Platform.isWebView()) {
                                if ($scope.shareInfo.opts.params.origin == 'newMessage') {
                                    SmsHelp.send($scope.inivitePhoneArr, $scope.shareInfo.msg.description + " " + $scope.shareInfo.msg.url)
                                } else {
                                    $state.go('tab.shareSMS', shareInfo.params.route);
                                }

                            } else {
                                alertQR();
                            }

                            // if (ionic.Platform.isWebView()) {
                            //     $scope.modal.hide();
                            // } else {
                            //     iAlert.alert('jjj')
                            // }
                            break;
                        case 'wechat':
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.TIMELINE, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)
                            } else {
                                alertQR();
                            }
                            break;
                        case 'wechat1':
                            if (ionic.Platform.isWebView()) {
                                ShareWeChat.share(EnumType.shareWeXinType.SESSION, EnumType.shareContentType.LinkLocalImage, shareInfo.msg)
                            } else {
                                alertQR();
                            }
                            break;
                        default:

                    }

                };


                // $scope.share();
            }
        }
    })
    /**
     * 通用性的接口新的
     */
    .factory('TradeServe', ['TradeRestAngular', 'ENV', 'MapServiceAngular', 'AccountRestAngular', 'PassRestAngular', function (TradeRestAngular, ENV, MapServiceAngular, AccountRestAngular, PassRestAngular) {
        return {
            //交易 订单列表
            getTradeOrderList: function (data) {
                var all = TradeRestAngular.allUrl('order/get_list');
                return all.post(data);
            },
            //取消交易订单
            deleTradeOrder: function (data) {
                var all = TradeRestAngular.allUrl('order/del');
                return all.post({ ids: data });
            },
            //交易 订单详情
            getTradeOrderDetail: function (id) {
                var all = TradeRestAngular.allUrl('order/detail');
                return all.post({ id: id });
            },
            // material   交易类型的数组  arr  pid：下一届请求的id
            //根据交易方的买卖的类型去获得后台服务器的参数配置
            getParameterByArr: function (obj) {
                var all = TradeRestAngular.allUrl('productClassify/get');
                return all.post(obj);
            },
            /**
             * 发布报价产品：竞拍，报价
             */
            releaseOrderBySell: function (obj) {
                var all = TradeRestAngular.allUrl('offer/add');
                return all.post(obj);
            },
            /**
             * 发布成功通知认证商和好友
             */
            getBusiness: function (obj) {
                var all = TradeRestAngular.allUrl('');
                return all.post(obj)
            },
            /**
             * 发布报价产品：竞拍，报价
             */
            changeReleaseOrderBySell: function (obj) {
                var all = TradeRestAngular.allUrl('offer/edit');
                return all.post(obj);
            },
            /**
             * 发布采购抢单
             * type : buy,sell
             */
            demandAdd: function (data) {
                var all = TradeRestAngular.allUrl('demand/add');
                return all.post(data);
            },
            /**
             * 销售方获得自己的报价列表
             */
            saleGetOfferListByStatus: function (data) {
                var all = TradeRestAngular.allUrl('offer/get_list');
                return all.post(data);
            },
            /**
             * 销售方获得自己的已发布进行中的数量
             */
            saleGetOfferNum: function () {
                var all = TradeRestAngular.allUrl('offer/get_oneself_count');
                return all.post();
            },
            /**
             * 销售方看自己的报价详情
             */
            publishOfferDetail: function (id) {
                var all = TradeRestAngular.allUrl('offer/detail');
                return all.post({ id: id });
            },
            /**
             * 采购获得钢铁的竞价排名
             * page
             * id
             *
             */
            diddingRankingById: function (id, page) {
                var all = TradeRestAngular.allUrl('offerAgain/get_list');
                return all.post({ id: id, page: page });
            },
            /**
             * 销售取消发布的钢铁的竞价
             * ids arr[]
             * status:true有效  fasle 过期
             */
            saleDelBidding: function (ids) {
                var all = TradeRestAngular.allUrl('offer/del');
                return all.post(ids);
            },
            //获取更新数据信息
            offerGetCountByCompany: function (company_id, type) {
                var all = TradeRestAngular.allUrl('offer/update_count');
                return all.post({ company_id: company_id, type: type });
            },
            //获取小类
            getCategory: function (material) {
                var all = TradeRestAngular.allUrl('configuration/get_material');
                return all.post({ material: material });
            },
            // 报价 认证公司列表
            // category_chn 产品种类中文字段 选填可不传字段
            // material     产品大类        选填可不传字段
            // category     产品种类英文字段 选填可不传字段
            // company_ids  公司id数组
            // city         公司所在地址  市级
            // type         定价或者竞价 定价‘DJ’buyParticipationBidding
            getCertificationList: function (data) {
                var all = TradeRestAngular.allUrl('offer/get_certification_list');
                return all.post(data);
            },
            detailOrder: function (id) {
                var all = TradeRestAngular.allUrl('offer/detail');
                return all.post({ id: id });
            },
            /**
             * 采购参与钢铁的竞价
             * page
             * status:true有效  fasle 过期
             */
            buyParticipationBidding: function (obj) {
                var all = TradeRestAngular.allUrl('offerAgain/add');
                return all.post(obj);
            }
            ,
            /**
             * 采购获得钢铁的竞价排名
             * page
             * id
             *
             */
            diddingRankingById: function (id, page) {
                var all = TradeRestAngular.allUrl('offerAgain/get_list');
                return all.post({ id: id, page: page });
            },
            /**
             * 采购取消参与钢铁的竞价
             * ids arr[]
             * status:true有效  fasle 过期
             */
            buyDelBidding: function (ids) {
                var all = TradeRestAngular.allUrl('offerAgain/del');
                return all.post(ids);
            },
            /**
             * 采购修改参与的竞价
             * page
             * id
             *
             */
            diddingChangeRankingById: function (obj) {
                var all = TradeRestAngular.allUrl('offerAgain/edit');
                return all.post(obj);
            },
            /**
             * 銷售确认竞价订单
             * id
             * 提货地址
             *  type: demand 采购报价  bidding 竞拍   pricing 报价
             */
            orderAdd: function (obj) {
                var all = TradeRestAngular.allUrl('order/add');
                return all.post(obj);
            },
            //交易 确认订单完成
            confirmTradeOrderOver: function (id) {
                var all = TradeRestAngular.allUrl('order/over');
                return all.post({ id: id });
            },
            /**
             * 获取我发布的采购单列表
             * page
             * status:true有效  fasle 过期
             */
            getDemandList: function (data) {
                var all = TradeRestAngular.allUrl('demand/get_list');
                return all.post(data);
            },
            /**
             * 获取进行中和已过期的采购需求单个数
             */
            getDemandCount: function () {
                var all = TradeRestAngular.allUrl('demand/get_oneself_count');
                return all.post();
            },
            /**
             * 获取我发布的采购详情
             *
             * id
             */
            getDemandById: function (id) {
                var all = TradeRestAngular.allUrl('demand/detail');
                return all.post({ id: id });
            },
            /**

             * data {
             * company_ids []
             * page
             * update
             * }
             */
            demandGetCertificationList: function (data) {
                var all = TradeRestAngular.allUrl('demand/get_certification_list');
                return all.post(data);
            },
            /**
             * 根据 采购需求单获取抢单列表
             */
            getOfferListById: function (obj) {
                var all = TradeRestAngular.allUrl('demandOffer/get_list');
                return all.post(obj);
            },
            /**
             * 取消抢单
             * @param ids offer的id数组
             */
            cancelOffer: function (ids) {
                var all = TradeRestAngular.allUrl('demandOffer/del');
                return all.post({ ids: ids });
            },
            /**
             * 获取我的采购的修改次数
             */
            getDemandChangeRemin: function (demand_id) {
                var all = TradeRestAngular.allUrl('demandOffer/get_change_remain');
                return all.post({ id: demand_id });
            }
            ,
            /**
             * 采购 抢单
             */
            demandOffer: function (data) {
                var all = TradeRestAngular.allUrl('demandOffer/add');
                return all.post(data);
            },
            /**
             * 确定抢单详情
             */
            order: function (obj) {
                var all = TradeRestAngular.allUrl('demandOffer/new_order');
                return all.post(obj);
            },


            /**
             * 交易 订单，确认订单
             */
            confirmByOrder: function (id) {
                var all = TradeRestAngular.allUrl('order/confirm');
                return all.post({ id: id });
            },
            /**
             * 交易 订单，提醒确认订单
             */
            remindByOrder: function (data) {
                var all = TradeRestAngular.allUrl('order/push');
                return all.post(data);

            },
            /**
             * 修改我的报价
             */
            offerEdit: function (data) {
                var all = TradeRestAngular.allUrl('demandOffer/edit');
                return all.post(data);
            },
            /**
             * 交易 订单种类的个数
             */
            getOneselfCount: function (type, id) {
                var all = TradeRestAngular.allUrl('order/get_oneself_count');
                return all.post({ type: type, company_id: id });
            },
            /**
             * 买方报价加入计划
             */
            shopAdd: function (data) {
                var all = TradeRestAngular.allUrl('shop/add');
                return all.post(data);
            },
            /**
             * 报价获得要补货的产品
             * location_storage
             * user_id
             *
             */
            buyGetReplenishByUserId: function (user_id, location_storage, payment_style, city, province) {
                var all = TradeRestAngular.allUrl('offer/get_replenish');
                return all.post({ user_id: user_id, location_storage: location_storage, payment_style: payment_style, city: city, province: province });
            },
            //计划列表
            shopGetList: function (page) {
                var all = TradeRestAngular.allUrl('shop/get_list');
                return all.post({ page: page });
            },
            /**
             * 新增计划的个数
             */
            getPlanNews: function () {
                var all = TradeRestAngular.allUrl('count/get_plan_count');
                return all.post();
            },

            /**
             * 计划下单组合，确定能不能一起下单 ids arr  ???
             */
            getOrderCheck: function (arr) {
                var all = TradeRestAngular.allUrl('order/check');
                return all.post({ arr: arr });
            },

            //交易详情
            orderGetOne: function (order_id) {
                var all = TradeRestAngular.allUrl('order/detail');
                return all.post({ id: order_id });
            },
            //交易报价订单列表三种数据总数
            orderGetOneselfCount: function (type) {
                var all = TradeRestAngular.allUrl('order/get_oneself_count');
                return all.post({ type: type });
            },
            //订单的操作步骤
            orderEdit: function (id, step) {
                var all = TradeRestAngular.allUrl('order/edit');
                return all.post({ id: id, step: step });
            },
            /**
             * 采购获得计划-当前竞拍列表
             * page
             *
             */
            diddingPkListById: function (page) {
                var all = TradeRestAngular.allUrl('offer/get_JJ_list');
                return all.post({ page: page });
            },
            /**
             * 买 计划 竞拍的个数
             */
            getOfferAgain: function () {
                var all = TradeRestAngular.allUrl('count/get_offerAgain');
                return all.post();
            },
            /**
             * 修改计划报价
             *  id
             */
            delePlanById: function (ids) {
                var all = TradeRestAngular.allUrl('shop/del');
                return all.post({ ids: ids });
            },
            /**
             * 获取我的抢单列表
             */
            getMyOfferList: function (page) {
                var all = TradeRestAngular.allUrl('demand/get_JJ_list');
                return all.post({ page: page });
            },
            /**
             * 获取进行中和已过期的采购需求单个数
             */
            cancelDemand: function (ids) {
                var all = TradeRestAngular.allUrl('/demand/del');
                return all.post({ ids: ids });
            },
            /**
             * 获取地图中车辆列表
             */
            getMapList: function (data) {
                var all = MapServiceAngular.allUrl('/map_c/get_only_list');
                return all.post({ user_ids: data });
            },
            getCertificationCompany: function (type) {
                var all = AccountRestAngular.allUrl('/company_relation/get_company_verify_all');
                return all.post({ type: type });
            },
            /**
             * 获得某人的手机号  user_id
             */
            getUserInfo: function (user_id) {
                var all = AccountRestAngular.allUrl('/user/get_business_card');
                return all.post({ user_id: user_id });
            },
            /**
             * 批量复制报价 ids []
             */
            offerAddAnotherList: function (ids) {
                var all = TradeRestAngular.allUrl('/offer/add_another_list');
                return all.post({ ids: ids });
            },
            /**
             * 报价的商业智能
             */
            getOfferPush: function (page) {
                var all = TradeRestAngular.allUrl('/offer/get_push');
                return all.post({ page: page });
            },
            /**
             * 采购的商业智能
             */
            getDemandPush: function (page) {
                var all = TradeRestAngular.allUrl('/demand/get_push');
                return all.post({ page: page });
            },
            /**
             *个人名片中货源列表
             */
            getTransportList: function (data) {
                var all = PassRestAngular.allUrl('/stat_c/card_demand_list');
                return all.post(data);
            },
            /**
             *交易的买的认证商红点提示，
             * companies
             */
            getRemind: function (data) {
                var all = TradeRestAngular.allUrl('/offer/get_remind');
                return all.post({ companies: data });
            },
            /**
             *交易的卖的认证商红点提示，
             * companies
             */
            getDemandRemind: function (data) {
                var all = TradeRestAngular.allUrl('/demand/get_remind');
                return all.post({ companies: data });
            },
            /**
             *交易的买卖的新订单提示，
             * companies
             */
            getOrderRemind: function (type) {
                var all = TradeRestAngular.allUrl('/order/get_remind');
                return all.post({ type: type });
            }
        }
    }])

    .service('TradeEbankService', ['AccountRestAngular', 'PassRestAngular', 'TradeRestAngular', 'StatistServiceAngular', 'CreditRestAngular',
        function (AccountRestAngular, PassRestAngular, TradeRestAngular, StatistServiceAngular, CreditRestAngular) {
            return {
                /**
                 * 金融服务器获取信用信息
                 * */
                creditGetAccount: function () {
                    var all = CreditRestAngular.allUrl('credit/get_account');
                    return all.post({});
                },
                /**
                 * 交易财概况页面
                 * */
                getFinancialStatic: function (data) {
                    var all = TradeRestAngular.allUrl('pricing/financial_statistics');
                    return all.post(data);
                }
                /**
                 * 交易 财 概括 统计物流金额
                 * */
                , getPriceStatic: function (data) {
                    var all = PassRestAngular.allUrl('order/get_price_statistics');
                    return all.post(data);
                },
                /**
                 * 交易 财 概括 获取订单详细
                 * */
                getAllOrderList: function (data) {
                    var all = StatistServiceAngular.allUrl('order/get_order_all');
                    return all.post(data);
                },
                /**
                 * 交易 财 采购、供应 获取订单數量
                 * */
                getOrderAll: function (data) {
                    var all = StatistServiceAngular.allUrl('order/get_common_order_all');
                    return all.post(data);
                },
                /**
                 * 交易 财 采购、供应 每日收入金额
                 * type: demand  supply 或者traffic  all
                 * time  今天的时间 比如 2017 05 07
                 * */
                getOrderPrices: function (data) {
                    var all = StatistServiceAngular.allUrl('order/get_price_all');
                    return all.post(data);
                },
                /**
                 * 交易 财 物流 获取订单
                 * */
                getOrderPassAll: function (data) {
                    var all = PassRestAngular.allUrl('order/trade_get');
                    return all.post(data);
                },
                /**
                 * 物流的 财 物流 获取订单
                 * */
                getPassOrderAll: function (data) {
                    var all = PassRestAngular.allUrl('order/traffic_get');
                    return all.post(data);
                },
                /**
                 * 交易的 财 采购,供应 获取订单总数
                 * */
                getOrderAllCount: function (data) {
                    var all = TradeRestAngular.allUrl('order/get_order_count');
                    return all.post(data);
                },
                /**
                 * 交易的 财 采购,供应 获取月订单总数
                 * type:trade;
                 * model:order;
                 * dir:statistical;
                 * time:2017 / 09
                 * */
                getOrderMonthAllCount: function (data) {
                    var all = StatistServiceAngular.allUrl('count/get_order_count');
                    return all.post(data);
                }
            }

        }])


    .service('GlobalService', function ($http, PassRestAngular) {
        this.getMsgCout = function () {
            var all = PassRestAngular.allUrl('stat_c/supply_statis');
            return all.post();
        };
        // 定义常亮, 使用方式：
        // set：GlobalService.es5Const.setConst(obj,key,value)
        // get：GlobalService.es5Const.getConst(obj,key)
        this.es5Const=function () {
            return {
                setConst:function(obj,attr,val){
                    Object.defineProperty(obj, attr, {
                        value: val, //初始值
                        writable: false, //可写
                        configurable: true, //可配置
                        enumerable: true //可枚举
                    })
                },
                getConst:function(obj,attr){
                    return obj[attr];
                }
            }
        }
    })













    // ----------------------以下是基于原型拓展的类方法----------------------------

    //移除数组指定元素
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    // var somearray = ["mon", "tue", "wed", "thur"]
    // somearray.removeByValue("tue");
    //somearray will now have "mon", "wed", "thur"

    //根据某个属性来筛选重构数组
    Array.prototype.removeItemByAttr=function (attr) {
        var that=this;
        var temp=[];
        for(var i=0; i<that.length; i++){
            if(that[i][attr]){
                temp.push(that[i])
            }
        }
        return temp;
    }

    //根据数组的某个属性来重构为一维数组
    Array.prototype.singleDimensionalByAttr=function (attr) {
        var that=this;
        var temp=[];
        for(var i=0; i<that.length; i++){
            temp.push(that[i][attr])
        }
        return temp;
    }


    //根据数组的某些属性来重构为新的多维数组
    Array.prototype.singleDimensionalByAttrArr=function (attrArr) {
        var that=this;
        var temp=[];
        for(var i=0; i<that.length; i++){
            var obj={};
            for(var j=0; j<attrArr.length; j++){
                obj[attrArr[j]]=that[i][attrArr[j]]
            }
            temp.push(obj)
        }
        return temp;
    }

