/**
 * Created by Administrator on 2017/4/17 0017.
 */
angular.module('rsc.pass', [
    'rsc.routers.pass',
    'rsc.directive.pass',
    'rsc.pass.filters',

    // 关系
    'rsc.router.relation_traffic',
    'rsc.factory.traffic_relation',
    'rsc.service.traffic_relation',
    'rsc.controller.traffic_manage',


    // 管理 企业
    'rsc.routers.traffic_me',
    'rsc.service.traffic_company',
    'rsc.service.traffic_me_common',
    'rsc.controller.traffic_company_homepage',
    'rsc.controller.traffic_company_dynamic',
    'rsc.controller.traffic_company_setting',
    'rsc.controller.traffic_company_daily',
    'rsc.controller.traffic_join_company',
    'rsc.controller.traffic_map',

    // 管理 个人
    'rsc.controller.traffic_menu',
    'rsc.controller.traffic_address_manage',
    'rsc.controller.traffic_person',
    'rsc.controller.traffic_person_setting',
    'monospaced.qrcode',


    'rsc.pass.sell.service',
    'rsc.controllers.PassSellCar',
    'rsc.controllers.PassSellOrder',
    'rsc.common.filters',
    'rsc.common.service.account',
    'rsc.pass.services',
    'rsc.controllers.PassSellTrans',
    /*财务*/
    'rsc.pass.finance',
    'rsc.commmon.services.dicitionary',

    //账号
    'rsc.common.account.service'

]).run(function ($rootScope, $state, TrafficContactService, TrafficWebIMService, TrafficCompanyModify, Storage, ionicToast, TrafficCompanySettingService, PassSellService) {


        $rootScope.trafficListen = function () {

            var on_off = true
            if (!$rootScope.currentUser.company || !$rootScope.currentUser.user.company_id) {
                $rootScope.$on('$stateChangeStart', function (event, toState, roParams, fromState, fromParams) {
                    if (toState.url == '/company_dynamic') {
                        console.log($rootScope.currentCompanyInfo)
                        if ($rootScope.currentCompanyInfo) {
                            var agree = $rootScope.currentCompanyInfo.verify_phase == 'PROCESSING' || $rootScope.currentCompanyInfo.verify_phase == 'SUCCESS'
                        } else {
                            var agree = false
                        }
                        console.log(agree)
                        if (!agree) {
                            event.preventDefault();
                            $state.go('rsc.traffic_verify_company', { new: true })
                        } else if (!$rootScope.currentUser.company) {
                            event.preventDefault();
                            $state.go('rsc.traffic_verify_company', { new: true })
                        }
                    }
                    if (on_off) {
                        on_off = false
                        TrafficCompanyModify.listenCompanyStatus().then(function (res) {
                            console.log(res)
                            if (res.status == 'success') {
                                if (res.data.user.company_id != '') {
                                    ionicToast.show('公司认证已通过', 'middle', false, 2500);
                                    Storage.set('userInfo', res.data)
                                    $rootScope.currentCompanyInfo = res.data.company
                                    $rootScope.currentUser = res.data
                                    $rootScope.$broadcast('initUserInfo')
                                } else {

                                }
                            }
                        })

                    }
                });
            }
        }

        //选项卡点击事件
        // $rootScope.transport=function () {
        //     var result=PassSellService.getTransportMsg().data;
        //     $rootScope.transportData={
        //         //运输
        //         transportTotle:result.transport.totle,
        //         transportOngoinge:result.transport.ongoing,
        //         transportExpired:result.transport.expired,
        //         transportCanceled:result.transport.canceled,
        //
        //         //订单
        //         orderTotle:result.order.ongoing,
        //         orderCanceled:result.order.canceled
        //     }
        //     console.log(result)
        // }


})

