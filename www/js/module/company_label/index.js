angular.module('rsc.company_label', [
    'rsc.config',
    'rsc.common.service.rest',
    'ui.router'
])
    .service('CompanyLabelService', ['ENV', 'AccountRestAngular',
        function (ENV, AccountRestAngular) {
            this.companyInfo = function () {
                var all = AccountRestAngular.allUrl('company/get_one');
                return all.post();
            }
        }
    ])

