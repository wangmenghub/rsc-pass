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
angular.module('rsc.service.common', ['rsc.service.phone', 'rsc.service.rest'])
    /**
     * Ionic 弹窗
     */
    .factory('RscAlert', function ($ionicPopup, $ionicPopover, $cordovaDialogs, $log, $ionicModal, $cordovaToast) {
        /**
         * 弹出提示框
         * @param text
         * @param cb
         */

        var showAlert = function (text, cb, title, btnText) {
            //ios 反馈页面导航消失问题。使用原生的弹窗会导致消失

            // if (ionic.Platform.isIOS() && text.indexOf('<') == -1) {
            if (ionic.Platform.isWebView()) {
                $cordovaDialogs.alert(text, title ? title : '提示', btnText ? btnText : '确认')
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
                    buttons: [{
                        text: btnText ? btnText : '确认'
                    }]
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
        var _tipeAlert = function (message, duration, position, title, cb) {
            if (ionic.Platform.isWebView()) {
                $cordovaToast
                    .show(message, duration, position)
                    .then(function (success) {
                        $log.debug('弹窗出错', text)
                    }, function (error) {
                        $log.error('弹窗出错', text)
                    });
            } else {
                var alertPopup = $ionicPopup.show({
                    title: title ? title : '提示',
                    template: message,
                    buttons: [{
                        text: '确定'
                    }]
                });

                alertPopup.then(function (res) {
                    if (cb) {
                        cb();
                    }
                });
            }

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
                    err && err();
                }
            })
        }
        var myPopup = function (title, template, btntexts, cb, cbcancel) {

            $ionicPopup.show({
                template: template,
                title: title,
                buttons: [{
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
                template: text,
                title: title,
                buttons: [{
                    text: '取消'
                }, {
                    text: '确定'
                    ,
                    type: 'button-default',
                    onTap: function (e) {
                        cb(e);
                    }
                }]
            })

        }
        var selectFile = function (title) {
            $ionicPopup.show({
                templateUrl: 'template/common/picture.html',
                title: title,
                buttons: [{
                    text: '取消'
                }, {
                    text: '确定',
                    type: 'button-default',
                    onTap: function (e) {
                        cb(e);
                    }
                }]
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
                templateUrl: object.templateUrl,
                scope: $scope,
                title: object.title,
                cssClass: object.css,
                buttons: [{
                    text: '取消',
                    onTap: function (e) {
                        if (err) {
                            err($scope.data);
                        }
                    }
                }, {
                    text: '确定',
                    type: 'button-positive',
                    onTap: function (e) {
                        cb($scope.data)
                    }
                }]
            });


        };


        return {
            alert: showAlert,
            confirm: confirm,
            popup: _popup,
            selectFile: selectFile,
            popover: popover,
            customConfirm: myPopup,
            log: $log.info,
            iModal: _ionicModal,
            tPopup: _tradePopup,
            tipeAlert: _tipeAlert
        }
    })
    .factory('Jpush', ['$window', '$log', '$timeout','$rootScope','$cordovaBadge', function ($window, $log, $timeout,$rootScope,$cordovaBadge) {
		var config = {
			debug: false,
			onSetTagsWithAlias: function () {
				$log.debug('onSetTagsWithAlias', arguments)
			},
			onOpenNotificationInAndroidCallback: function () {
				$log.debug('onOpenNotificationInAndroidCallback', arguments)
			},
			onGetRegistrationID: function () {
				$log.debug('onGetRegistrationID', arguments)
			}
		}

		var registEvent = function () {

			//当打开通知的时候
			document.addEventListener("jpush.openNotification", function (event) {
				$log.debug('jpush.openNotification', JSON.stringify(event));
				var alertContent;
				if (ionic.Platform.isAndroid()) {
					alertContent = event.alert
				} else {
					alertContent = event.aps.alert
				}
				$log.debug('jpush.openNotification', JSON.stringify(event))

				// window.alert(JSON.stringify(event))

				config.onOpenNotification && config.onOpenNotification(event);

			}, false)

			//接收到通知 只有ios 可以收到
			document.addEventListener("jpush.receiveNotification", function (event) {
				var alertContent;
				if (ionic.Platform.isAndroid()) {
					$log.debug('jpush.receiveNotification android', (event));
					alertContent = event.alert;
				} else {
					// $log.debug('jpush.receiveNotification', JSON.stringify(event));
					$log.debug('jpush.receiveNotification', JSON.stringify(event));

					alertContent = event.aps.alert;

				}

				// $log.debug('jpush.receiveNotification', JSON.stringify(event));

				config.onReceiveNotification && config.onReceiveNotification(event);


				// window.alert(JSON.stringify(alertContent))
			}, false)

		}
		return {
			/**
			 * 初始化极光推送插件，注册事件。
			 */
			init: function (conf) {
				if (conf) {
					config = conf
				}
				window.plugins.jPushPlugin.isPushStopped(function (result) {
					$log.debug('判断是否开启推送', result)
					if (result == 0) {
						//开启
					} else {
						//不开启
						// if (ionic.Platform.isIOS()) {
						//     window.plugins.jPushPlugin.startJPushSDK();
						// }
						window.plugins.jPushPlugin.init();
						if (ionic.Platform.isIOS()) {
							window.plugins.jPushPlugin.startJPushSDK();
							window.plugins.jPushPlugin.setDebugModeFromIos();
							window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
						} else {
							window.plugins.jPushPlugin.setDebugMode(true);
							window.plugins.jPushPlugin.setStatisticsOpen(true);
						}
					}
					//延迟1秒获取RegistrationID
					$timeout(window.plugins.jPushPlugin.getRegistrationID(config.onGetRegistrationID), 1000);

					window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.onOpenNotificationInAndroidCallback;

					window.plugins.jPushPlugin.setDebugMode(config.debug);

					registEvent();
				})


			},
			getRegistrationID: function (cb) {
				window.plugins.jPushPlugin.getRegistrationID(cb);
			}

		}
	}])
    .factory('EventRegister', function ($rootScope, $cordovaDevice, ContactsHelp, ContactService, $log, $ionicPlatform,$cordovaBadge) {

        return {
            init: function () {
                $rootScope.$on('readContacts', function () {
                    $ionicPlatform.ready(function () {
                        //读取通讯录
                        ContactsHelp.getAll().then(function (result) {
                            var leng = result.length / 100;
                            for (var i = 0; i < leng; i++) {
                                var res = result.slice(i * 100, 100 * (i + 1));
                                // $log.debug('添加通讯录 res', i, res.length, new Date());
                                (function (contact) {
                                    ContactService.addContact(contact, $rootScope.device_uuid).then(function (result) {
                                        if (result.status == 'success') {
                                            $log.debug('添加通讯录', JSON.stringify(result))

                                        } else {
                                            $log.error('添加通讯录', JSON.stringify(result))
                                        }
                                    })
                                })(res)
                            }
                        })
                        // }
                    })
                })
				$ionicPlatform.on('resume',function () {
					// alert('切入')
					// serviceMsg.getPushClear().then(function (res) {
					// 	if (res.status == 'success') {
					// 		$log.debug('角标消息提醒', res.data)
					// 		$rootScope.rscBadge = res.data.count;
					// 		alert($rootScope.rscBadge)
					// 		$cordovaBadge.set($rootScope.rscBadge).then(function() {
					// 			// You have permission, badge set.
					// 		}, function(err) {
					// 			// You do not have permission.
					// 		});
					// 	}else{
					// 		$log.error('角标消息提醒失败', res.data)
					// 	}
					// });
					// serviceMsg.getPushCondition(false).then(function (res) {
					// 	if (res.status == 'success') {
					// 		$log.debug('累计推送个数', res.data)
					// 	}else{
					// 		$log.error('累计推送个数', res.data)
					// 	}
					// })
				})
            }
        }

    })

    .service('ContactService', function (ContactAngular) {
        return {

            /**
             * 添加通讯录到服务端
             *
             * @param {any} data
             * @param {any} uuid
             * @returns
             */
            addContact: function (data, uuid) {
                var all = ContactAngular.allUrl('phone/add');
                return all.post({
                    user: data,
                    uuid: uuid
                });
            }
        }
    })

    .service('DynamicService', function (DynamicAngular) {
        return {

            /**
             * 获取动态列表
             *
             * @returns
             */
            GetDynamic: function () {
                var all = DynamicAngular.allUrl('company_dynamic/get_list');
                return all.post();
            },


            /**
             * 点赞
             *
             * @param {any} dynamic_id
             * @returns
             */
            AddPraise: function (dynamic_id) {
                var all = DynamicAngular.allUrl('company_dynamic/add_praise');
                return all.post({
                    dynamic_id: dynamic_id
                });
            },


            /**
             * 获取提示数
             *
             * @returns
             */
            GetCount: function () {
                var all = DynamicAngular.allUrl('company_dynamic/get_tips_count');
                return all.post();
            },


            /**
             * 获取提示信息
             *
             * @returns
             */
            GetTips: function () {
                var all = DynamicAngular.allUrl('company_dynamic/get_tips');
                return all.post();
            }

        }
    })
