/**
 * Created by ID on 15/12/15.
 * Author:zhoudd
 * email:zhoudd@stark.tm
 *
 *
 *
 *   TRADE_ADMIN: '企业管理员',
 TRADE_PURCHASE: '采购负责人',
 TRADE_SALE: '销售负责人',
 TRADE_MANUFACTURE: '生产负责人',
 TRADE_FINANCE: '财务负责人',
 TRAFFIC_ADMIN: '物流负责人',
 TRAFFIC_DRIVER: '司机',
 *
 */
angular.module('rsc.service.common.bak', [])

    .constant("commonString", {
        phoneReg: '(^13[0-9]{9}$)|(^15[0-9]{9}$)|(^17[0-9]{9}$)|(^18[012356789][0-9]{8}$)'
    })
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

    // .factory('DBStorage', function ($q) {

    //     var _db;
    //     var _store;
    //     return {
    //         initDB: initDB,
    //         getStorage: getStorage,
    //         addStorage: addStorage,
    //         updateStorage: updateStorage,
    //         deleteStorage: deleteStorage
    //     };

    //     function initDB() {
    //         // Creates the database or opens if it already exists
    //         _db = new PouchDB('db', { adapter: 'websql' });
    //     };

    //     function addStorage(data) {
    //         return $q.when(_db.post(data));
    //     };

    //     function updateStorage(data) {
    //         return $q.when(_db.put(data));
    //     };

    //     function deleteStorage(data) {
    //         return $q.when(_db.remove(data));
    //     };

    //     function getStorage() {
    //         if (!_store) {
    //             return $q.when(_db.allDocs({ include_docs: true }))
    //                 .then(function (docs) {
    //                     _store = docs.rows.map(function (row) {
    //                         row.doc.Date = new Date();
    //                         return row.doc;
    //                     });

    //                     // Listen for changes on the database.
    //                     _db.changes({ live: true, since: 'now', include_docs: true })
    //                         .on('change', onDatabaseChange);

    //                     return _store
    //                 });
    //         } else {
    //             // Return cached data as a promise
    //             return $q.when(_store);
    //         }
    //     };

    //     function onDatabaseChange(change) {
    //         var index = findIndex(_store, change.id);
    //         var data = _store[index];

    //         if (change.deleted) {
    //             if (data) {
    //                 _store.splice(index, 1); // delete
    //             }
    //         } else {
    //             if (data && data._id === change.id) {
    //                 _store[index] = change.doc; // update
    //             } else {
    //                 _store.splice(index, 0, change.doc) // insert
    //             }
    //         }
    //     }

    //     // Binary search, the array is by default sorted by _id.
    //     function findIndex(array, id) {
    //         var low = 0, high = array.length, mid;
    //         while (low < high) {
    //             mid = (low + high) >>> 1;
    //             array[mid]._id < id ? low = mid + 1 : high = mid
    //         }
    //         return low;
    //     }

    //     function getObjArr(data, index) {
    //         var users = [], uhash = {};
    //         for (var i = 0, length = data.length; i < length; ++i) {
    //             var indexString = '';
    //             index.forEach(function (field) {
    //                 if (_.isArray(data[i][field])) {
    //                     data[i][index].forEach(function (att) {
    //                         indexString += att;
    //                     })
    //                 } else {
    //                     indexString += data[i][field];
    //                 }
    //             });
    //             if (!uhash[indexString]) {
    //                 uhash[indexString] = true;
    //                 users.push(data[i]);
    //             }
    //         }
    //         return users;
    //     };
    // })

    /**
     * Ionic 弹窗
     */
    .factory('iAlert', function ($ionicPopup, $ionicPopover, $cordovaDialogs, $log, $ionicModal) {
        /**
         * 弹出提示框
         * @param text
         * @param cb
         */

        var showAlert = function (text, cb, title) {
            //ios 反馈页面导航消失问题。使用原生的弹窗会导致消失

            // if (ionic.Platform.isIOS() && text.indexOf('<') == -1) {
            if (ionic.Platform.isWebView()) {
                $cordovaDialogs.alert(text, title ? title : '提示', '确定')
                    .then(function () {
                        // callback success

                        if (cb) {
                            cb();
                        }
                    });

            } else {
                var alertPopup = $ionicPopup.show({
                    title: title ? title : '提示',
                    template: text,
                    buttons: [
                        { text: '确定' }
                    ]
                });

                alertPopup.then(function (res) {
                    if (cb) {
                        cb();
                    }
                });
            }

            // var alertPopup = $ionicPopup.show({
            //     title: title ? title : '提示',
            //     template: text,
            //     buttons: [
            //         { text: '确定' }
            //     ]
            // });

            // alertPopup.then(function (res) {
            //     if (cb) {
            //         cb();
            //     }
            // });

        };
        var confirm = function (title, msg, cb, err, obj) {
            var alertPopup = $ionicPopup.confirm({
                title: title,
                template: msg,
                cancelText: obj && obj.exit ? obj.exit : '取消',
                cancelType: '', //
                okText: obj && obj.save ? obj.save : '确定', //
                okType: 'button-default', //
            })
            alertPopup.then(function (res) {
                if (res) {
                    cb(res);
                } else {
                    err()
                }
            })
        }
        var myPopup = function (title, template, btntexts, cb, cbcancel) {

            $ionicPopup.show({
                template: template,
                title: title,
                buttons: [
                    {
                        text: btntexts[1] ? btntexts[1] : '取消',
                        // type: 'button-positive',
                        onTap: function (e) {
                            // if (!$scope.data.wifi) {
                            //     //don't allow the user to close unless he enters wifi password
                            //     e.preventDefault();
                            // } else {
                            //     return $scope.data.wifi;
                            // }
                            // e.preventDefault();
                            // cbcancel();
                            return false;
                        }
                    },
                    {
                        text: btntexts[0] ? btntexts[0] : '确定',
                        type: 'button-default',
                        onTap: function (e) {
                            // return true;
                            cb(e);
                        }
                    }
                ]
            })
        };

        var _popup = function (title, text, cb) {
            var myPopup = $ionicPopup.show({
                template: text
                , title: title
                , buttons: [
                    { text: '取消' }
                    , {
                        text: '确定'
                        , type: 'button-default'
                        , onTap: function (e) {
                            cb(e);
                        }
                    }
                ]
            })

        }
        var selectFile = function (title) {
            $ionicPopup.show({
                templateUrl: 'template/common/picture.html'
                , title: title
                , buttons: [
                    { text: '取消' }
                    , {
                        text: '确定'
                        , type: 'button-default'
                        , onTap: function (e) {
                            cb(e);
                        }
                    }
                ]
            })
        }
        var popover = function ($scope, templateUrl) {

        }
        var _ionicModal = function ($scope, template) {
            return $ionicModal.fromTemplateUrl(template, {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: true,
                hardwareBackButtonClose: true
            })
        };
        var _tradePopup = function ($scope, object, objmsg, cb, err) {
            $scope.data = objmsg;
            $ionicPopup.show({
                templateUrl: object.templateUrl
                , scope: $scope
                , title: object.title
                , cssClass: object.css
                , buttons: [
                    {
                        text: '取消', onTap: function (e) {
                            if (err) { err($scope.data); }
                        }
                    }
                    , {
                        text: '确定'
                        , type: 'button-positive'
                        , onTap: function (e) {
                            cb($scope.data)
                        }
                    }
                ]
            });


        };



        return {
            alert: showAlert,
            confirm: confirm,
            myPopup: myPopup,
            popup: _popup,
            selectFile: selectFile,
            popover: popover,
            customConfirm: myPopup,
            log: $log.info,
            iModal: _ionicModal,
            tPopup: _tradePopup
        }
    })
    /**
     * http 请求钩子.
     */
    // .factory('AuthInterceptor', ['$q', '$location', 'Storage', 'AppVersion',
    //     function ($q, $location, Storage, AppVersion) {
    //         var interceptor = {};

    //         interceptor.request = function (config) {
    //             var token = Storage.get('userInfo');
    //             if (token) {
    //                 //console.log('set Header', token.token);
    //                 config.headers["x-access-token"] = token.token;
    //                 config.headers["version"] = AppVersion;


    //                 // config.headers["x-access-token"] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2ZDUyOWU4YzBmMWYzMzE1NGQ3OGJmZCIsImNvbXBhbnlfaWQiOlsiNTZkNTI5ZThjMGYxZjMzMTU0ZDc4YmZiIl0sInJvbGUiOiJUUkFGRklDX0FETUlOIiwidXNlcl9uYW1lIjoi5rWL6K-VIiwiY29tcGFueV9uYW1lIjoi5rWL6K-V5rWB56iL5LyB5LiaIiwiaWF0IjoxNDU3MzEzMzIyLCJleHAiOjE0NTc5MTgxMjJ9.M5pNNiJVnvzQSCClOTR9HxuO2ymnXdssf-MuL1TzTT8';
    //             }
    //             return config;
    //         };

    //         interceptor.responseError = function (response) {
    //             if (response.status == 403) {
    //                 //console.log(403)
    //                 Storage.remove('userInfo');
    //                 $location.path("/login");
    //             }
    //             return $q.reject(response);
    //         };

    //         interceptor.response = function (response) {
    //             // console.log('response',response)
    //             if (response.data.status == 'err' && response.data.msg == 'auth_failed') {
    //                 // iAlert.alert('请重新登录',function () {
    //                 //     window.alert('请重新登录')
    //                 Storage.remove('userInfo');
    //                 $location.path("/login");
    //                 // })
    //             }
    //             return response;
    //         }

    //         return interceptor;
    //     }])


    /**
     * 物流需求单搜索条件控制
     */
    .value('PassSearchCondition', {
        areas: [
            {
                text: '全国',
                value: null,
                default: true
            }, {
                text: '北京',
                value: '北京',
                default: false

            },
            {
                text: '山西',
                value: '山西市',
                default: false
            },
            {
                text: '河北',
                value: '河北市',
                default: false
            },
        ],
        amount: [
            {
                text: '不限',
                max: null,
                min: null,
                default: true
            },
            {
                text: '0-200吨',
                max: 200,
                min: 0,
                default: false
            }, {
                text: '200-500吨',
                max: 500,
                min: 200,
                default: false
            }, {
                text: '500-1000吨',
                max: 1000,
                min: 500,
                default: false
            }, {
                text: '1000-2000吨',
                max: 2000,
                min: 1000,
                default: false
            }, {
                text: '2000吨以上',
                max: null,
                min: 2000,
                default: false
            }
        ],
        payType: [
            {
                text: '不限',
                value: null,
                default: true
            },
            {
                text: '现汇结算',
                value: 'cash',
                default: false

            }, {
                text: '银行承兑',
                value: 'bill_bank',
                default: false
            }, {
                text: '商业承兑',
                value: 'bill_com',
                default: false
            }
        ],
        payTypes: [
            {
                text: '不限',
                value: null,
                default: true
            },
            {
                text: '款到发货',
                value: 'all_cash',
                default: false

            }, {
                text: '货到付款',
                value: 'all_goods',
                default: false
            }, {
                text: '分期',
                value: 'partition',
                default: false
            }, {
                text: '信用',
                value: 'credit',
                default: false
            }
        ]
    })
    /**
     * 数据加载等待提示
     */
    .constant('$ionicLoadingConfig', {
        template: '数据加载中...'
    })
    /**
     * 邀请注册的列表
     */
    .value('InvitationInfo', {
        TRADE: [
            {
                btnText: '立即邀请',
                value: 'TRADE_ADMIN',
                tips: '同事 - 超管',
                type: 'TRADE'
            }, {
                btnText: '立即邀请',
                value: 'TRADE_PURCHASE',
                tips: '同事 - 采购',
                type: 'TRADE'
            }, {
                btnText: '立即邀请',
                value: 'TRADE_SALE',
                tips: '同事 - 销售',
                type: 'TRADE'
            }, {
                value: 'PURCHASE',
                tips: '好友 - 采购商',
                type: 'TRADE'

            },
            {
                value: 'SALE',
                tips: '好友 - 销售商',
                type: 'TRADE'

            }, {
                value: 'TRAFFIC',
                tips: '好友 - 物流方',
                type: 'TRADE'
            }
        ],
        TRAFFIC: [
            {
                btnText: '立即邀请',
                value: 'TRAFFIC_ADMIN',
                tips: '物流负责人',
                type: 'TRAFFIC'

            }, {
                btnText: '立即邀请',
                value: 'TRAFFIC_DRIVER_PUBLISH',
                tips: '自有司机',
                type: 'TRAFFIC'
            }
            , {
                btnText: '立即邀请',
                value: 'TRAFFIC_DRIVER_PRIVATE',
                tips: '挂靠司机',
                type: 'TRAFFIC'
            }
        ],
        PASS: [
            {
                btnText: '立即邀请',
                value: 'TRAFFIC_ADMIN',
                tips: '同事 - 物流负责人',
                type: 'TRAFFIC'

            }, {
                btnText: '立即邀请',
                value: 'OWNER',
                tips: '好友 - 货主',
                type: 'TRAFFIC'
            }
            , {
                btnText: '立即邀请',
                value: 'TRAFFIC_DRIVER_PRIVATE',
                tips: '好友 - 挂靠司机',
                type: 'TRAFFIC'
            }
        ],
        FRIEND_TRADE: [
            {
                value: 'PURCHASE',
                tips: '好友 - 采购商',
                type: 'TRADE'

            },
            {
                value: 'SALE',
                tips: '好友 - 销售商',
                type: 'TRADE'

            }, {
                value: 'TRAFFIC',
                tips: '好友 - 物流方',
                type: 'TRADE'
            }
        ],
        FRIEND_PASS: [
            {
                btnText: '立即邀请',
                value: 'OWNER',
                tips: '好友 - 货主',
                type: 'TRAFFIC'
            }
            , {
                btnText: '立即邀请',
                value: 'TRAFFIC_DRIVER_PRIVATE',
                tips: '好友 - 挂靠司机',
                type: 'TRAFFIC'
            }
        ]

    })

    /**
     * 显示选择的图像
     * trade 维护区 start
     * */
    .factory('fileReader', ['$q', '$log', function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result)
                })
            }
        };
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result)
                })
            }
        };
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader

        };
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer()
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file)
            return deferred.promise
        };
        return {
            readAsDataUrl: readAsDataURL
        }

    }])
    /**
     * 金财弹窗
     * */
    .factory('PublicPopups', function (iAlert) {
        var obj = { templateUrl: './js/src/sell/popup_radio.html', title: '付款类型' };
        return {
            paymentChoice: function (e, cb, er) {
                obj.title = '付款类型';
                console.log(e, cb, er)
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'cash', chn: '现汇结算' }, { eng: 'bill_bank', chn: '银行承兑' }
                    , { eng: 'bill_com', chn: '商业承兑' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , refDayExtension: function (e, cb, er) {
                // obj.title=e.demand.payment_method=='partition' ? '尾款计算标准':'延期计算标准';
                obj.title = '延期计算标准';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'order', chn: '双方确认订单日' }, { eng: 'goods', chn: e.pubSource == 'pass' ? '付款方完成运输日' : '货到并完成质检日' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , paymentMethod: function (e, cb, er) {
                obj.title = '付款方式';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'all_cash', chn: '款到发货' }, { eng: 'all_goods', chn: '货到付款' }
                    , { eng: 'partition', chn: '分期付款' }, { eng: 'credit', chn: '信用付款' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , qualityOrigin: function (e, cb, er) {
                obj.title = '质检方选择';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = e.pubSource == 'CIF' ? [{ eng: 'demand', chn: '以采购方的质检结果为准' }, { eng: 'supply', chn: '以销售方的质检结果为准' }, { eng: 'other', chn: '以第三方的质检结果为准' }] : [{ eng: 'demand', chn: '以采购方的质检结果为准' }, { eng: 'supply', chn: '以销售方的质检结果为准' }, { eng: 'other', chn: '以第三方的质检结果为准' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , offerLimit: function (e, cb, er) {
                obj.title = '发布范围';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'all', chn: '全平台' }, { eng: 'limited', chn: '认证企业（只针对您认证的企业发布）' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , industry: function (e, cb, er) {
                obj.title = '行业类别';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'coal', chn: '煤焦' }, { eng: 'steel', chn: '钢铁' }, { eng: 'alloy', chn: '合金金属' }, { eng: 'slag', chn: '矿粉' }];
                //
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , offerType: function (e, cb, er) {
                obj.title = '报价类型';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'CIF', chn: '到岸价' }, { eng: 'FOB', chn: '出厂价' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , inventory: function (e, cb, er) {
                obj.title = '库存量';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'a', chn: '充足' }, { eng: 'b', chn: '货少' }, { eng: 'c', chn: '缺货' }, { eng: 'd', chn: '生产' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
            , passRules: function (e, cb, er) {
                obj.title = '物流细则';
                var data = !e.iSearch ? { type: 'radio2' } : { type: 'radio2', msg: '备注：点击“取消”按钮自动默认为全选搜索条件', msgCss: 'text-red' };
                data.popup_lists = [{ eng: 'fact', chn: '按到货吨数结算' }, { eng: 'get', chn: '按提货吨数结算' }];
                iAlert.tPopup(e, obj, data, function (res) { if (res && res.subtype) { cb(res) } }, er);
            }
        }
    })
    // .se
    .factory('PublicGroup', function (iAlert, AccountInformation, $ionicModal, $timeout, $log) {
        var comModal = {}
        return {
            cancel: function (s, cb) {
                current = null;
                s.cancel = function () {
                    console.log('ddd');
                    if (comModal) {
                        comModal.hide();
                    }
                }
                s.confirm = function () {
                    if (current) {
                        if (comModal) {
                            comModal.hide();
                        }
                        cb && cb(current);
                    }

                }
                s.select = function (item) {
                    current = item;
                    s.cur = current;
                }
                $ionicModal.fromTemplateUrl('js/directives/template/common/comDriverGroup.html', {
                    scope: s,//,
                    animation: 'slide-in-up',
                    backdropClickToClose: true,
                    hardwareBackButtonClose: true,
                }).then(function (modal) {
                    comModal = modal;

                    $timeout(function () {
                        comModal.show();
                        // vm.initAreaData(vm.defaultAreaData)
                    }, 50)
                })

            },
        }
    })
    .factory('PageConfig', function ($rootScope, Account, Storage, $q, $log) {
        return {
            initPageConfig: function () {
                $log.debug('PageConfig.initPageConfig')
                var d = $q.defer();
                if (Storage.get('userInfo')) {

                    Account.getUserConfig().then(function (result) {
                        if (result.status == 'success') {
                            $rootScope.baseConfig = JSON.parse(result.data);
                            $rootScope.roles = $rootScope.baseConfig.navigations;
                            Storage.set('baseConfigs', result.data);
                            d.resolve($rootScope.baseConfig);
                        } else {
                            $log.error('获取配置文件失败', result)
                            d.resolve(null);
                        }
                    })
                } else {
                    $log.error('获取配置失败,未登录')
                    d.resolve(null);
                }
                return d.promise;
            }
        }
    })
