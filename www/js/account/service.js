angular.module('rsc.common.account.service', ['rsc.common.service.rest', 'rsc.common.service.account'])
    .factory('AccountService', ['$q', 'Restangular', '$window', 'Storage', 'AccountRestAngular', 'TradeRestAngular', 'AccountRestAngularNoToken',
        function ($q, Restangular, $window, Storage, AccountRestAngular, TradeRestAngular, AccountRestAngularNoToken) {
            var h;
            var cbg = function (x, y) {
                h = AccountRestAngular.allUrl(x);
                return h.get(y);
            };
            var cbp = function (x, y) {
                h = AccountRestAngular.allUrl(x);
                return h.post(y);
            };
            var getCompanyinfoById = function (id, type) {
                var data = {
                    company_id: id
                };
                var info = AccountRestAngular.allUrl('company_trade/get_one');
                if (type) {
                    if (angular.lowercase(type) == 'traffic') {
                        info = AccountRestAngular.allUrl('company_traffic/get_one');
                    } else {
                        info = AccountRestAngular.allUrl('company_trade/get_one');
                    }
                } else {
                    info = AccountRestAngular.allUrl('company_trade/get_one');
                }
                return info.post(data);
            };
            return {

                invitationInvite: function (role, users) {
                    return cbp('invitation/invite', {
                        role: role,
                        users: users
                    });
                },

                //检验手机号是否被邀请
                phoneInvitationVerify: function (data) {
                    var all = AccountRestAngular.allUrl('user_trade/invitation_verify');
                    return all.post(data);
                },
                /**
                 * 根据手机号获取注册验证码
                 */
                getCode: function (phone) {
                    var Phone = Restangular.one('/phone/get_verify_code/', phone);
                    var promis = $q.defer();
                    Phone.get().then(function (result) {
                        promis.resolve(result);
                    }, function (error) {
                        promis.reject(error);
                    })
                    return promis.promise;
                },
                /**
                 * 注册
                 */
                registerForInvitation: function (data) {
                    var all = AccountRestAngular.allUrl('/user_trade/signup_by_invitation');
                    return all.post(data);
                },
                /**
                 * 注册
                 */
                signupNew: function (data) {
                    var all = AccountRestAngular.allUrl('/user_trade/signup_new');
                    return all.post(data);
                },
                /**
                 * 获取产品种类
                 */
                getMaterial: function () {
                    var pass = TradeRestAngular.allUrl("productClassify/get");
                    return pass.post();
                },
                /**
                 * 上传到服务器
                 * @param urltype
                 * @param data
                 * @returns {*}
                 * @constructor
                 */
                UploadToServer: function (urltype, data) {
                    var all = AccountRestAngular.allUrl(urltype + 'edit');
                    return all.post(data);
                },
                /**
                 * 用户登录
                 * { phone: phone,password: pwd * }
                 *
                 * {*phone: '', verify_code: ''* }
                 *
                 */
                login: function (data) {
                    var all = AccountRestAngular.allUrl('user/login_traffic');
                    return all.post(data);
                },
                /**
                 * 验证手机验证码是否过期
                 * @param data
                 * @returns {*}
                 */
                checkVerifyCode: function (phone, verify_code) {
                    var all = AccountRestAngular.allUrl('phone/check_verify_code');
                    return all.post({
                        phone: phone,
                        verify_code: verify_code
                    });
                },
                /**
                 * 重置密码
                 * @param data
                 * @returns {*}
                 */
                forGetPassword: function (data) {
                    var all = AccountRestAngular.allUrl('user/forget_password');
                    return all.post(data);
                },
                /**
                 * 手机号是否用过
                 * @param phone
                 * @returns {*}
                 */
                getPhoneExist: function (phone) {
                    var all = AccountRestAngular.allUrl('phone/exist/' + phone);
                    return all.get('');
                },
                getCompanyStatus: function () {
                    var all = AccountRestAngular.allUrl('company/three_if');
                    return all.post();
                }


            }
        }
    ])
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

    .factory('AccountSev', ['AccountRestAngular', 'MsgServiceAngular',
        function (AccountRestAngular, MsgServiceAngular) {
            return {
                login: login,
                register: register,
                getCode: getCode,
                checkCode: checkCode,
                userEdit: userEdit,
                companyInfo: companyInfo,
                phoneExist: phoneExist,
                getAppVersionNumber: getAppVersionNumber,
                code2md5: code2md5
            }


            /**
             *
             * 登陆
             * @param {any} phone
             * @param {any} verify_code
             * @returns
             */
            function login(data) {
                var all = AccountRestAngular.allUrl('user/login_traffic');
                return all.post(data);
            }

            /**
             *
             * 注册
             * @param {any} phone
             * @param {any} verify_code
             * @param {any} type
             * @param {any} real_name
             * @returns
             */
            function register(data) {
                var all = AccountRestAngular.allUrl('user/signup');
                return all.post(data);
            }

            /**
             *
             * 获取验证码
             * @param {object} phone
             * @returns
             */
            function getCode(code, phone) {
                var all = AccountRestAngular.allUrl('phone/get_verify_code_new');
                return all.post({
                    code: code,
                    phone: phone
                });
            }

            function code2md5() {
                var all = AccountRestAngular.allUrl('phone/get_code');
                return all.post({
                    phone: phone
                });
            }

            /**
             *
             * 验证手机验证码是否过期
             * @param {object} data
             * @returns
             */
            function checkCode(data) {
                var all = AccountRestAngular.allUrl('phone/check_verify_code');
                return all.post(data);
            }


            /**
             *
             * 注册个人设置买卖运
             * @param {array} buy
             * @param {array} sell
             * @param {array} transport
             * @returns
             */
            function userEdit(data) {
                var all = AccountRestAngular.allUrl('user/edit');
                return all.post(data);
            }


            /**
             *
             * 获取公司信息
             * @returns
             */
            function companyInfo() {
                var all = AccountRestAngular.allUrl('company/get_one');
                return all.post();
            }

            /**
             *
             * 判断手机号是否注册
             * @returns
             */
            function phoneExist(phone) {
                var all = AccountRestAngular.allUrl('phone/exist');
                return all.post({
                    phone: phone
                });
            }


            function getAppVersionNumber(version) {
                var all = AccountRestAngular.allUrl('version/check_version');
                return all.post({
                    version: version
                });
            }





        }
    ])

    .factory('compatibleService', ['CompatibleServiceAngular', function (CompatibleServiceAngular) {
        return {
			/**
			 * 获取登录背景图
			 */
            getLoginbackgroundimg: function (data) {
                var all = CompatibleServiceAngular.allUrl('/config/get_login_background');
                return all.post(data);
            },
        }
    }])