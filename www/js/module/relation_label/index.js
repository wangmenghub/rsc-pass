/**
 * 企业主页 企业关系
 */
angular.module('rsc.relation_label', ['rsc.config', 'rsc.common.service.rest', 'ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rsc.manage_colleague', {
                url: '/manage_colleague?source',
                // cache: false,
                views: {
                    'center-content': {
                        templateUrl: 'js/module/relation_label/template/colleague.html',
                        controller: "traffic_manage_colleague_ctrl as vm"
                    }
                }
            })

            .state('rsc.manage_traffic', {
                url: '/manage_traffic?type?source',
                views: {
                    'center-content': {
                        templateUrl: 'js/module/relation_label/template/detail.html',
                        controller: "traffic_manage_detail_ctrl as vm"
                    }
                }
            })
    
    })
    .service('RelationLabelService', ['ENV', 'AccountRestAngular',
        function (ENV, AccountRestAngular) {
            this.getCompanyInfoCount = function (id) {
                var all = AccountRestAngular.allUrl('company_relation/recommond_get_company_verify_count');
                return all.post({
                    company_id: id
                });
            }
        }
    ])
    .directive('rscRelation', function ($log, RelationLabelService, $rootScope) {
        return {
            restrict: 'ECA',
            replace: true,
            templateUrl: 'js/module/relation_label/template/template.html',
            scope: {
                company: '='
            },
            controller: function ($scope) {

            },
            link: function ($scope, element, attrs) {
                //非管理员不显示
                $log.debug('rscRelation', $rootScope.currentUser.user.role)

                if (($rootScope.currentUser.user.role != "TRADE_ADMIN" && $rootScope.currentUser.user.role != "TRAFFIC_ADMIN")) {
                    element.css('display', 'none')
                } else {
                    $scope.$watch('company', function (value) {
                        if (!$scope.company) {
                            element.css('display', 'none')
                        } else if ($scope.company.verify_phase != 'SUCCESS') {
                            element.css('display', 'none')
                        } else {
                            $log.debug('rscRelation，company', $scope.company)
                            if ($scope.company._id) {
                                RelationLabelService.getCompanyInfoCount($scope.company._id).then(function (result) {
                                    if (result.status == 'success') {
                                        $log.debug('rscRelation，获取企业信息个数', result.data)
                                        $scope.companyInfo_count = result.data;
                                    } else {
                                        $log.error('rscRelation，获取企业信息个数', result)
                                    }
                                })
                            }
                            element.css('display', 'inherit')
                        }
                    })
                }
            }
        }
    })

