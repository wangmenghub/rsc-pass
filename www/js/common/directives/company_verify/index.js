angular.module('rsc.company_verify', [
    'rsc.config',
    'rsc.common.service.rest',
    'ui.router'
])
    .directive('rscCompanyVerify', function ($state, $log, TradeCompanySettingService) {
        return {
            restrict: '',
            replace: true,
            scope: {
                company: '='
            },
            templateUrl: 'js/module/company_verify/template/status.html',
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

                TradeCompanySettingService.getCompanyStatus().then(function (result) {
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

