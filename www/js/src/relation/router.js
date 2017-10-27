angular.module('rsc.router.relation_traffic', [
        'ui.router'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider    

            // .state('rsc.contact', {
            //     url: '/contact',
            //     // cache: false,
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/relation/contact/contact.html',
            //             controller: "traffic_contact_ctrl as vm"
            //         }
            //     }
            // })


            .state('rsc.replace_colleague', {
                url: '/replace_colleague?id?rename?phone?name',
                views: {
                    'center-content': {
                        templateUrl: 'js/src/relation/manage/replace_colleague.html',
                        controller: "traffic_replace_colleague_ctrl as vm"
                    }
                }
            })


            .state('rsc.partnership', {
                url: '/partnership?company_id?type',
                // cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/relation/manage/partnership.html',
                        controller: "traffic_partnership_ctrl as vm"
                    }
                }
            })

            .state('rsc.allocation', {
                url: '/allocation?company_id?user_id?type',
                // cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/src/relation/manage/reassignment.html',
                        controller: "traffic_allocation_ctrl as vm"
                    }
                }
            })

            // .state('rsc.traffic_invite', {
            //     url: '/traffic_invite?enter',
            //     // cache: false,
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/relation/invite/invite.html',
            //             controller: "traffic_invite_ctrl as vm"
            //         }
            //     }
            // })

            // .state('rsc.traffic_invite_phone', {
            //     url: '/traffic_invite_phone?role',
            //     // cache: false,
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/relation/invite/invite_phone.html',
            //             controller: "traffic_invite_phone_ctrl as vm"
            //         }
            //     }
            // })

            // .state('rsc.traffic_invite_contact', {
            //     url: '/traffic_invite_contact?role?invite?id',
            //     // cache: false,
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/relation/invite/invite_contacts.html',
            //             controller: "traffic_invite_contact_ctrl as vm"
            //         }
            //     }
            // })

            // .state('rsc.traffic_invite_success', {
            //     url: '/traffic_invite_success?role&count',
            //     // cache: false,
            //     views: {
            //         'center-content': {
            //             templateUrl: 'js/src/relation/invite/invite_success.html',
            //             controller: "traffic_invite_success_ctrl as vm"
            //         }
            //     }
            // })

    }]);
