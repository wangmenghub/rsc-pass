/**
 * Created by Administrator on 2017/4/17 0017.
 * 物流的 财务
 */
angular.module('rsc.pass.finance', ['rsc.pass.finance.ctr'])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /**
         * 订单>货源
         */
            .state('rsc.finance_logistics', {
                url: '/finance_logistics',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/finance/pass_logistics.html',
                        controller: 'pass_logistics_ctrl as vm'
                    }
                }
            })
            /**
             * 订单>运输
             */
            .state('rsc.transport_order', {
                url: '/transport_order',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/finance/transport_order.html',
                        controller: 'transport_order_ctrl as vm'
                    }
                }
            })
    }])
