(function () {
    angular.module('rsc.routers.traffic_me', [
            'ui.router',
            'rsc.manager'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                // 企业设置页
                .state('rsc.company_manager', {
                    url: '/company_manager',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/company_manager.html',
                            controller: "company_manager_ctrl"
                        }
                    }
                })
                // 企业设置页
                .state('rsc.company_dynamic', {
                    url: '/company_dynamic',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/dynamic/companyDynamic.html',
                            controller: "traffic_company_dynamic_ctrl as vm"
                        }
                    }
                })

                // 企业认证
                .state('rsc.traffic_verify_company', {
                    url: "/traffic_verify_company?new",
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: "js/src/manage/company/join/verifyCompany.html",
                            controller: 'traffic_verify_company_ctrl as vm'
                        }
                    }
                })

                // 加入企业
                .state('rsc.traffic_join', {
                    url: "/traffic_join?name",
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: "js/src/manage/company/join/joinCompany.html",
                            controller: 'traffic_join_company_ctrl as vm'
                        }
                    }
                })

                // 企业日报页
                .state('rsc.traffic_daily', {
                    url: '/traffic_daily',
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/daily/dailyDetail.html',
                            controller: "traffic_daily_detail_ctrl as vm"
                        }
                    }
                })

                // 动态消息提醒
                .state('rsc.traffic_message', {
                    url: '/traffic_message',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/dynamic/newMessage.html',
                            controller: "traffic_dynamic_msg_ctrl as vm"
                        }
                    }
                })

                // 企业主页
                .state('rsc.traffic_company_homepage', {
                    url: '/traffic_company_homepage?id?type',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/homepage/companyHomepage.html',
                            controller: "traffic_company_homepage_ctrl as vm"
                        }
                    }
                })

                .state('rsc.trade_company_homepage', {
                    url: '/trade_company_homepage?id?type',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/homepage/tradeHomepage.html',
                            controller: "traffic_company_homepage_ctrl as vm"
                        }
                    }
                })

                // 企业图片展示
                .state('rsc.traffic_company_display', {
                    url: '/traffic_company_display?photo',
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/homepage/companyDisplay.html',
                            controller: "traffic_company_display_ctrl as vm"
                        }
                    }
                })

                .state('rsc.traffic_show_photo', {
                    url: '/traffic_show_photo?index',
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/homepage/companyPhoto.html',
                            controller: "traffic_company_photo_ctrl as vm"
                        }
                    }
                })

                // 企业设置
                .state('rsc.traffic_company_setting', {
                    url: '/traffic_company_setting?new?buy?sell?enter',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/company/setting/companySetting.html',
                            controller: "traffic_company_setting_ctrl as vm"
                        }
                    }
                })

                // 个人中心(可删)
                .state('rsc.traffic_person_homepage', {
                    url: "/traffic_person_homepage?id?type?sidebar",
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: "js/src/manage/person/person_homepage/personHomepage.html",
                            controller: 'traffic_person_homepage_ctrl as vm'
                        }
                    }
                })

                //个人主页（可删）
                .state('rsc.trade_person_homepage', {
                    url: "/trade_person_homepage?id?type?sidebar",
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: "js/src/manage/person/person_homepage/tradeHomepage.html",
                            controller: 'traffic_person_homepage_ctrl as vm'
                        }
                    }
                })

                // 个人二维码
                .state('rsc.traffic_mycode', {
                    url: "/traffic_mycode?id?type?sidebar?link",
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: "js/traffic/manage/person/person_homepage/mycode.html",
                            controller: 'traffic_mycode_ctrl as vm'
                        }
                    }
                })

                // 个人设置
                .state('rsc.traffic_person_setting', {
                    url: "/traffic_person_setting?enter",
                    views: {
                        'center-content': {
                            templateUrl: "js/src/manage/person/person_setting/personSetting.html",
                            controller: 'traffic_person_setting_ctrl as vm'
                        }
                    }
                })

                // 地址管理
                .state('rsc.traffic_address_manage', {
                    url: '/traffic_address_manage?type&enter',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/person/address_manage/address_manage.html',
                            controller: 'traffic_address_manage_ctrl as vm'
                        }
                    }
                })

                // 地址修改 添加
                .state('rsc.traffic_address_edit', {
                    url: '/traffic_address_edit?id?str?source?name?phone',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/person/address_manage/address_edit.html',
                            controller: 'traffic_address_edit_ctrl as vm'
                        }
                    }
                })

                // 地址详情页
                .state('rsc.traffic_address_details', {
                    url: '/traffic_address_details?source&type',
                    // cache: false,
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/person/address_manage/address_details.html',
                            controller: 'traffic_address_details_ctrl as vm'
                        }
                    }
                })

                // 联系人添加地址
                .state('rsc.traffic_address_contacts', {
                    url: '/traffic_address_contacts?menu&source?rename?id',
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/person/address_manage/address_contacts.html',
                            controller: 'traffic_address_contacts_ctrl as vm'
                        }
                    }
                })

                .state('rsc.traffic_add_map',{
                    url: '/traffic_add_map?province&city&district&addr',
                    views: {
                        'center-content': {
                            templateUrl: 'js/src/manage/map/addMap.html',
                            controller: 'traffic_add_map_ctrl as vm'
                        }
                    }
                })

        }]);
})()
