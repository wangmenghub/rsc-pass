/**
 * Created by ID on 15/12/8.
 * Author:zhoudd
 * email:zhoudd@stark.tm
 *
 *
 * source：traffic 两方物流
 * price_offer_demand 三方物流
 *
 *
 *  煤 吨数
 *  除钢坯是吨数 其他的都是 件数
 *
 */
angular.module('rsc.common.filters', [])

/**
 * 区分订单货物是按吨数计算，还是按件数计算。
 * 两方的一定是按照吨数指派
 */
.filter('orderType', function() {
        return function(type, products) {
            if (type == 'traffic') {
                return false;
            } else if (type == "price_offer_demand") {
                var result = true;
                angular.forEach(products, function(item, index) {
                    //如果是煤，直接返回false
                    if (item.type == 'coal' || item.category == "steel_gangpei") {
                        // || item.category == "steel_luowengang" || item.category == "steel_panluo"
                        result = false;
                    }
                })
                return result;
            } else {
                return false;
            }

        }
    })
    .filter('rsc_address', function() {
        return function(address, place) {
            if (address) {
                if (address.province == address.city) {
                    return address.province + address.district + (place == 'list' ? '' : address.addr);
                } else {
                    return address.province + address.city + address.district + (place == 'list' ? '' : address.addr);
                }
            }
        }
    })
    .filter('steeladdress', function() {
        return function(address) {
            if (address.prov_address == address.city_address) {
                return address.prov_address + address.dist_address;
            } else {
                return address.prov_address + address.city_address + address.dist_address;
            }
            //return address.province + address.city + address.district + address.addr;
        }
    })
    .filter('Storeaddress', function() {
        return function(address) {
            if (address && address.province) {
                if (address.province == address.city) {
                    return address.province + address.district + (address.addr || '');
                } else {
                    return address.province + address.city + address.district + (address.addr || '');
                }
            } else {
                return '';
            }
        }
    })
    .filter('rsctime', function($filter) {
        return function(time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy年MM月dd日');
            } else {
                return '';
            }
        }
    })
    .filter('dynamicTime', function($filter) {
        return function(time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy.MM.dd HH:mm');
            } else {
                return '';
            }
        }
    })
    .filter('statustime', function($filter) {
        return function(time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy/MM/dd');
            } else {
                return '';
            }
        }
    })
    .filter('dynamicRole', function() {
        var role = {
            TRADE_ADMIN: '超管',
            TRADE_PURCHASE: '采购',
            TRADE_SALE: '销售',
            TRADE_MANUFACTURE: '生产',
            TRADE_FINANCE: '财务',
            TRAFFIC_ADMIN: '物流',
            TRAFFIC_DRIVER: '司机',
            TRADE_STORAGE: '库管',
            TRAFFIC_DRIVER_PUBLISH: '自有司机', //公有司机（公司所属）
            TRAFFIC_DRIVER_PRIVATE: '挂靠司机' //私人司机（挂靠司机）
        };
        return function(user) {
            if (user) {
                return user.real_name + '-' + role[user.role];
            } else {
                return '';
            }
        }
    })
    .filter('carType', function() {
        var truck_types = {
            PING_BAN: '平板车',
            GAO_LAN: '高栏车',
            QIAN_SI_HOU_BA: '前四后八',
            BAN_GUA: '半挂',
            XIANG_SHI: '厢式',
            DAN_QIAO: '单桥',
            SI_QIAO: '四桥',
            DI_LAN: '低栏',
            SAN_QIAO: '三桥',
            HOU_BA_LUN: '后八轮',
            CHANG_PENG: '敞篷',
            QUAN_GUA: '全挂',
            ZHONG_LAN: '中栏',
            JIA_CHANG_GUA: '加长挂',
            BU_XIAN: '不限'
        };


        return function(type) {
            return truck_types[type];
        }
    })
    .filter('btnText', function() {
        var btnText = {
            1.5: '等待物流派车',
            3: '等待运输完毕',
            6: '订单已完成',
        };
        return function(type) {
            return btnText[type];
        }
    })
    .filter('carWeight', function() {
        return function(value) {
            if (value) {
                var index = value.indexOf("_");
                if (!value.substring(index + 1)) {
                    //console.log(value)
                    return value.substring(0, index) + '吨以上';
                }
                return value.substring(index + 1) + '吨';
            } else {
                return '';
            }
        }
    })
    .filter('carLongValue', function() {
        return function(value) {
            if (value) {
                var index = value.indexOf("_");
                if (!value.substring(index + 1)) {
                    return value.substring(0, index);
                } else {
                    return value.substring(index + 1);
                }
            } else {
                return '';
            }
        }
    })
    .filter('carDes', function($filter) {
        return function(car) {
            if (car) {
                var des = $filter("carType")(car.type) + ' · ' +
                    (car.long ? ($filter("carLongValue")(car.long) + '米 · 载') : "载") +
                    $filter("carWeight")(car.weight);
                return des;
            } else {
                return '';
            }
        }
    })
    //获取最大载重
    .filter('carMaxWeight', function($filter) {
        return function(value) {
            if (value) {
                var index = value.indexOf("_");
                if (!value.substring(index + 1)) {
                    return parseInt(value.substring(0, index));
                }
                return parseInt(value.substring(index + 1));
            } else {
                return 0;
            }
        }
    })
    .filter('rolefilter', function() {
        var truck_types = {
            TRADE_ADMIN: '超管',
            TRADE_PURCHASE: '采购',
            TRADE_SALE: '销售',
            TRADE_MANUFACTURE: '生产',
            TRADE_FINANCE: '财务',
            TRAFFIC_ADMIN: '物流负责人',
            TRAFFIC_DRIVER: '司机',
            TRADE_STORAGE: '库管',
            TRAFFIC_DRIVER_PUBLISH: '自有司机', //公有司机（公司所属）
            TRAFFIC_DRIVER_PRIVATE: '挂靠司机', //私人司机（挂靠司机）
            OWNER: '货主', //20170406新增邀请人
            SALE: '销售商',
            PURCHASE: '采购商',
            TRAFFIC: '物流企业',
            COLLRAGUES: '同事',
            COLLEAGUE: '我的同事',
            WORK: '合作企业',
            FRIEND: '我的好友',
            ZADMIN: '我的账号',

        };
        return function(type) {
            return truck_types[type];
        }
    })
    .filter('newrolefilter', function() {
        var truck_types = {
            TRADE_ADMIN: '超管',
            TRADE_PURCHASE: '采购',
            TRADE_SALE: '销售',
            TRADE_MANUFACTURE: '生产',
            TRADE_FINANCE: '财务',
            TRAFFIC_ADMIN: '物流',
            TRAFFIC_DRIVER: '司机',
            TRADE_STORAGE: '库管',
            TRAFFIC_DRIVER_PUBLISH: '自有司机', //公有司机（公司所属）
            TRAFFIC_DRIVER_PRIVATE: '挂靠司机', //私人司机（挂靠司机）
            OWNER: '货主', //20170406新增邀请人
            SALE: '合作销售商',
            PURCHASE: '合作采购商',
            TRAFFIC: '物流合作企业',
            COLLRAGUES: '同事',
            COMPANY_INVITE: '同事',
            COLLEAGUE: '我的同事',
            WORK: '合作企业',
            FRIEND: '我的好友',
            ZADMIN: '我的账号'
        };
        return function(type) {
            return truck_types[type];
        }
    })
    .filter('passRolefilter', function() {
        var truck_types = {
            TRADE_ADMIN: '超级管理员',
            TRAFFIC_ADMIN: '物流负责人',
            TRAFFIC_DRIVER: '司机',
            TRADE_STORAGE: '库管',
            TRAFFIC_DRIVER_PUBLISH: '自有司机', //公有司机（公司所属）
            TRAFFIC_DRIVER_PRIVATE: '挂靠司机', //私人司机（挂靠司机）
            PURCHASE: '货主', //20170406新增邀请人
            SALE: '合作销售商',
            TRAFFIC: '物流合作企业',
            COLLRAGUES: '同事',
            COMPANY_INVITE: '同事',
            COLLEAGUE: '我的同事',
            WORK: '合作企业',
            FRIEND: '我的好友',
            ZADMIN: '我的账号'
        };
        return function(type) {
            return truck_types[type];
        }
    })
    .filter('carW', function() {
        var values = {
            "6_10": "6至10吨",
            "11_15": "11至15吨",
            "16_20": "16至20吨",
            "21_25": "21至25吨",
            "26_30": "26至30吨",
            "31_35": "31至35吨",
            "36_40": "36至40吨",
            "40_": "40吨以上",
        }


        return function(value) {
            return values[value];
        }
    })
    .filter('carLong', function() {
        var values = {
            "2_5": "2至5米",
            "6_8": "6至8米",
            "9_10": "9至10米",
            "11_12": "11至12米",
            "13_15": "13至15米",
            "16_17.5": "16至17.5米",
            "17.5_": "17.5米以上"
        }


        return function(value) {
            return values[value];
        }
    })

.filter('stepCSS', function() {
        return function(currentStep, step) {
            if (step <= currentStep) {
                // return "btn-navbar4-active-c";
                return "button active";
            }
        }
    })
    .filter('driverOrderStatus', function() {
        return function(driver) {
            if (driver.agree) {
                //if(driver.)
            } else {

            }
            if (step <= currentStep) {
                return "btn-navbar4-active-c";
            }
        }
    })




.filter('demandRole', function() {
        return function(value, timeOut) {
            // console.log('timeout', timeOut)
            switch (value) {
                case "TRAFFIC":
                    if (timeOut) {
                        return '抢单结束';
                    } else {
                        return '立即抢单';
                    }
                case "TRADE":
                    if (timeOut) {
                        return '请选单';
                    } else {
                        return '邀请抢单';
                    }
                default:
                    return '未知'
            }
        }
    })
    /**
     * 支付方式过滤器
     */
    .filter('payTypeDes', function($filter) {
        return function(order, type) {
            if (!order) {
                return '';
            }
            var text = '';

            //支付方式
            switch (order.payment_method) {
                case "all_cash":
                    text += "款到发货";
                    break;
                case "all_goods":
                    text += "货到付款";
                    break;
                case "partition":
                    text += "分期付款，首付款比例：" + order.percentage_advance + "%，尾款支付起始日期:货到并完成质检日";

                    // if (order.percentage_advance) {
                    //     //3期 order.percentage_advance + "%,质保款" +
                    //     text += "," + "预付款" + order.percentage_advance + '%,尾款' + (100 - order.percentage_advance) + "%";
                    //     // text += "," + "预付款" + order.percentage_advance + '%';
                    //
                    // } else {
                    //     //2期
                    //     text += "," + "预付款" + order.percentage_advance + "%,尾款" + (100 - order.percentage_advance) + "%,货到并完成质检后" + order.count_day_extension + '日付款';
                    //     // text += "," + "预付款" + order.percentage_advance + "%";//+ ",货到并完成质检后" + order.count_day_extension + '日付款';
                    //     // 货到并完成质检后" + order.count_day_extension + '日付款';
                    // }
                    // text += $filter('payDayDes')(order);
                    break;
                case "credit":
                    text += "信用付款";
                    // text += $filter('payDayDes')(order);
                    break;
                default:

            }
            if (type && type == 'list') {
                return text;
            } else {
                text += ',' + $filter('payDayDes')(order);
                return text;
            }
        }
    })
    .filter('payTypeDesForDriver', function($filter) {
        return function(order) {
            if (!order) {
                return '';
            }
            var text = '';

            //支付方式
            switch (order.driver_payment_method) {
                case "all_cash":
                    text += "款到发货";
                    break;
                case "all_goods":
                    text += "货到付款";
                    break;
                case "partition":
                    text += "分期付款";
                    if (order.driver_percentage_advance) {
                        //3期 order.percentage_advance + "%,质保款" +
                        // text += "," + "预付款" + order.percentage_remain + '%,尾款' + (100 - order.percentage_advance - order.percentage_remain) + "%";
                        text += "," + "预付款" + order.driver_percentage_advance + '%,尾款' + (100 - order.driver_percentage_advance) + '%';

                    } else {
                        //2期
                        // text += "," + "预付款" + order.percentage_advance + "%,尾款" + (100 - order.percentage_advance) + "%,货到并完成质检后" + order.count_day_extension + '日付款';

                        text += "," + "预付款" + order.driver_percentage_advance + "%,尾款" + (100 - order.driver_percentage_advance); //+ ",货到并完成质检后" + order.count_day_extension + '日付款';
                        // 货到并完成质检后" + order.count_day_extension + '日付款';
                    }
                    // text += $filter('payDayDesForDriver')(order);
                    break;
                case "credit":
                    text += "信用付款";
                    // text += $filter('payDayDesForDriver')(order);
                    break;
                default:

            }
            return text;
        }
    })
    /**
     * 付款日期。
     */
    .filter('payDayDesForDriver', function() {
        return function(data) {
            if (data) {
                var text = '';
                switch (data.driver_payment_method) {
                    case "all_cash":
                        // text += "";
                        text += "双方确认订单后立即付款";

                        break;
                    case "all_goods":
                        text += "货到并完成质检5日内付款";
                        break;
                    case "partition":
                        text += "货到并完成质检" + data.driver_count_day_extension + '日内付款';
                        break;
                    case "credit":
                        if (data.ref_day_extension == 'order') {
                            text += "双方确认订单后" + data.driver_count_day_extension + '日内付款';
                            break;
                        } else if (data.driver_ref_day_extension == 'goods') {
                            text += "货到后" + data.driver_count_day_extension + '日内付款';
                        }
                        break;
                    default:
                }
                return text;
            }
        }
    })
    /**
     * 付款日期。
     */
    .filter('payDayDes', function() {
        return function(data) {
            if (data) {
                var text = '';
                switch (data.payment_method) {
                    case "all_cash":
                        // text += "";
                        text += "双方确认订单后立即付款";

                        break;
                    case "all_goods":
                        text += "付款方确认完成运输后5日内付款";
                        break;
                    case "partition":
                        text += "付款方确认完成运输" + data.count_day_extension + '日内付款';
                        break;
                    case "credit":
                        if (data.ref_day_extension == 'order') {
                            text += "双方确认订单后" + data.count_day_extension + '日内付款';
                            break;
                        } else if (data.ref_day_extension == 'goods') {
                            text += "付款方确认完成运输" + data.count_day_extension + '日内付款';
                        }
                        break;
                    default:
                }
                return text;
            }
        }
    })
    /**
     * 司机的订单详情状态
     */
    .filter('driverStatusDetail', function() {
        return function(value) {
            if (value) {
                return '已接单运输中';
            } else {
                return '等待接单'
            }
        }
    })

.filter('driverStatus', function() {
        return function(route, type) {
            if (type) {
                if (type == 'list') {
                    if (route.agree) {
                        switch (route.status) {
                            case 'ready':
                            case 'not_arrival':
                                return '已经接单';
                            case 'ready_get':
                            case 'driving':
                            case 'ready_give':
                                return '运输中';

                                // case 'cancelled':
                                //     return '取消';

                                // case 'not_used':
                                //     return '未使用';

                                // case 'busy':
                                //     return '忙碌';
                            default:
                                return '运输中'
                        }
                    } else {
                        return '等待接单'
                    }
                }
            } else {
                if (route) {
                    return '正在运输';
                    // return '已接单<br><br>正在运输';
                } else {
                    return '等待接单'
                }
            }

        }
    })
    .filter('routeDriverStatus', function($filter) {
        return function(route, type) {
            if (!route) {
                return;
            } else {
                switch (type) {
                    case 'text':

                        return $filter('routeStatus')(route.status);

                        // if (route.agree) {
                        //     return $filter('routeStatus')(route.status);
                        // } else {
                        //     return '未接单';
                        // }

                    case 'css':
                        return $filter('routeStatusCss')(route.status);

                        // if (route.agree) {
                        //     return $filter('routeStatusCss')(route.status);
                        // } else {
                        //     return 'label-role-red';
                        // }

                    default:
                        break;
                }
            }
        }
    })
    /**
    * 司机的订单状态
        not_ready: 'not_ready',未接单
        ready: 'ready'已确认订单，等待运送
    */
    .filter('routeStatus', function() {
        return function(status) {
            switch (status) {
                case 'not_ready':
                    return '未接单';
                case 'ready':
                    return '已确认';
                case 'not_arrival':
                    return '已发车';

                case 'ready_get':
                    return '提货中';

                case 'driving':
                    return '运送中';

                case 'ready_give':
                    return '准备交货';

                case 'cancelled':
                    return '取消';

                case 'not_used':
                    return '未使用';

                case 'busy':
                    return '忙碌';
                default:
                    return '未知'
            }
        }
    })
    .filter('routeStatusCss', function() {
        return function(status) {
            switch (status) {
                case 'not_ready':
                case 'ready':
                case 'not_arrival':
                case 'ready_get':
                case 'driving':
                case 'ready_give':
                    return 'label-supply-bg-brwon';
                case 'cancelled':
                    return '取消';
                case 'not_used':
                    return 'label-role-green';
                case 'busy':
                    return 'label-role-red';
                default:
                    return 'label-role-green'
            }
        }
    })
    .filter('driverOrderStatus', function() {
        return function(value) {
            switch (value) {
                case 'ready_get':
                    return true;

                case 'driving':
                    return true;

                case '':
                    break;
                case '':
                    break;
                case '':
                    break;
                default:
                    break;
            }
        }
    })
    .filter('driverBtnText', function() {
        return function(value) {
            switch (value) {
                case 'ready_get':
                    return "等待过磅信息";

                case 'not_arrival':
                    return "申请提货";

                case 'ready_get':
                    break;
                case 'driving':
                    return "确认提货信息";

                case '':
                    break;
                default:
                    break;
            }
        }
    })

.filter('timeOut', function() {
        return function(time) {
            return new Date(time) < new Date();
        }
    })
    .filter('imgDefault', function() {
        return function(value, type) {
            if (value) {
                return value;
            }
            switch (type) {
                case "header":
                    value = "./img/common/infor-face.png";
                    break;
                case "car":
                    value = "./img/common/driver-car.png";
                    break;
                case "company":
                    value = "./img/common/logo-icon.png";
                    break;
                default:
                    value = './img/common/imgdefault.png';
                    break;
            }
            return value;
        }
    })
    //车辆分类显示
    .filter('carGroupByType', function($linq) {
        return function(cars) {
            if (cars) {
                var queryResult = $linq.Enumerable().From(cars).GroupBy('$.type', '$._id', function(key, group) {
                    return {
                        type: key,
                        total: group.Count()
                    }
                }, function(key) {
                    return key.toString();
                }).ToArray();
                //console.log('group by ', queryResult);
                return queryResult;
            } else {
                return null;
            }


        }
    })
    .filter('addressText', function() {
        return function(value) {
            //if(value.)
            var text;
            if (value.currentProvince) {
                text = value.currentProvince.name;
                if (value.currentCity) {
                    if (value.currentCity.name == value.currentProvince.name) {

                    } else {
                        text += value.currentCity.name;
                    }
                }

                if (value.currentArea) {
                    text += value.currentArea.name;
                }
            }
            return text;
        }
    })

.filter('authenticationStatus', function() {
    /**
     *  认证状态车辆列表显示
     */
    return function(value, type) {
        switch (type) {
            case 'labelText':
            case '':
            case null:
            case undefined:

                switch (value) {
                    case 'NO':
                    case '':
                        return "未认证";
                    case 'PROCESSING':
                        return "认证中";
                    case 'SUCCESS':
                        return "已认证";
                    case 'FAILED':
                        return "认证失败";
                    default:
                        return '未知';

                }

            case 'btnText':
                //按钮文字
                switch (value) {
                    case 'NO':
                    case '':
                    case null:
                    case undefined:
                        return "申请认证";
                    case 'PROCESSING':
                        return "认证中";
                    case 'SUCCESS':
                        return "认证成功";
                    case 'FAILED':
                        return "认证失败,再次申请认证";
                    default:
                        return '未知';
                }

            case 'btnDisabled':
                //按钮是否禁用 return false 表示禁用 true 为不禁用
                switch (value) {
                    case 'NO':
                    case '':
                    case null:
                    case undefined:
                        return false;
                    case 'PROCESSING':
                        return true;
                    case 'SUCCESS':
                        return true;
                    case 'FAILED':
                        return false;
                    default:
                        return false;
                }


            case 'labelColor':
                //按钮文字
                switch (value) {
                    case 'NO':
                    case '':
                    case 'FAILED':
                        //return "未认证";
                        return "label-role-red";
                    case 'PROCESSING':
                        //return "认证中";
                        return "label-infor-time";
                    case 'SUCCESS':
                        //return "已认证";
                        return "label-role-green";
                    default:
                        return 'label-role-red';

                }
        }

    }
})

.filter('authenticationStatusText', function() {
        /**
         *  认证状态按钮文字显示
         *  */
        return function(value) {
            switch (value) {
                case 'NO':
                case '':
                    return "申请认证";
                case 'PROCESSING':
                    return "认证中";
                case 'SUCCESS':
                    return "认证成功";
                case 'FAILED':
                    return "认证失败,再次申请认证";
                default:
                    return '请刷新重试';

            }
        }
    })
    .filter('driverMgStatus', function($filter) {
        return function(route) {
            if (route.status) {
                return $filter('routeStatus')(route.status);
            } else {
                return '空闲';
            }
        }
    })
    .filter('driverRoles', function($filter) {
        return function(route) {
            if (route.role) {
                switch (route.role) {
                    case "TRAFFIC_DRIVER_PUBLISH":
                        return {
                            text: '自有',
                            css: 'label-role-red'
                        };
                    case "TRAFFIC_DRIVER_PRIVATE":
                        return {
                            text: '挂靠',
                            css: 'label-role-green'
                        };
                }
            }
        }
    })
    .filter('driverMgStatusCss', function($filter) {
        return function(route) {
            if (route.status) {
                return $filter('routeStatusCss')(route.status);
            } else {
                return 'label-role-green';
            }
        }
    })

.filter('selectCarDriverStatus', function() {
    return function(status) {
        if (status) {
            switch (status) {
                case 'busy':
                    return '忙碌';
                case 'abusy':
                    return '空闲';
            }
        } else {
            return '空闲';
        }
    }
})

.filter('selectCarDriverStatusCSS', function() {
        return function(status) {
            if (status) {
                switch (status) {
                    case 'busy':
                        return 'label-role-red';
                    case 'abusy':
                        return 'label-role-green';
                }
            } else {
                return 'label-role-green';
            }
        }
    })
    //数字 以万进位
    .filter('numberConvert', function($filter) {
        return function(value) {
            if (value) {
                if (angular.isNumber(value)) {
                    if (value > 9999) {
                        return $filter('number')(value / 10000, 0) + '万';
                    } else {
                        return $filter('number')(value, 2);
                    }
                } else if (angular.isString(value)) {
                    if (value.length >= 5) {
                        return parseInt(value) / 10000 + '万'
                    } else {
                        return $filter('number')(value, 2);
                    }
                } else {
                    return $filter('number')(value, 2);
                }
            }
        }
    })
    //短信模板
    .filter('smsTemplate', function($filter) {
        return function(array, type) {
            switch (type) {
                case 'trafficDemand':
                    // return array[0] + "在日升昌平台发布一个物流需求，从" + array[1] + "至" + array[2] + "运送" + array[3] + array[4] + "吨，快来日升昌平台<a href='" + array[5] + "抢单<a/>吧。";
                    return array[0] + "现有" + array[3] + array[4] + "吨从" + array[1] + "至" + array[2] + "需要运输，快来抢单！"
                case 'tradeDemand':
                    // return array[0] + "企业在日升昌平台采购" + array[1] + "吨，邀请您前来报价。快快<a href='" + array[2] + "'>点击查看吧<a/>。";
                    return array[0] + "采购" + array[1] + array[2] + "吨，快来抢单！"

                case 'register':
                    // return array[0] + "邀请您注册日升昌平台，成为他的合作伙伴。<a href='" + array[1] + "'>点击注册<a/>。";

                    return array[0] + "邀请您成为他的合作伙伴，快来注册。";
                case 'tradePlan':
                    // return array[0] + "企业已创建物流计划。<a href='" + array[1] + "'>点击注册<a/>。";
                    return array[0] + "已发布" + array[1] + "月份," + array[2] + "吨物流运输计划，邀请您成为认证物流企业！快来抢单！";
                case 'trade_askprice':
                    // return array[0] + "企业已创建物流计划。<a href='" + array[1] + "'>点击注册<a/>。";
                    return array[0] + "计划采购" + array[1] + "，快来抢单吧！"

                default:
                    return '';
            }
        }
    })

.filter('payBtnText', function() {
        return function(order) {
            var text = "";
            switch (order.payment_method) {

                case "all_cash": //款到付货

                    if (order.step == 2) {
                        text = '支付全款';
                    }
                    break;

                case "credit": //信用

                    if (order.step == 2) {
                        text = '申请信用付款';
                    }
                    break;

                case "all_goods": //货到付款

                    if (order.step == 5) {
                        text = '支付全款';
                    }
                    break;

                case "partition": //分期

                    if (order.step == 2) {
                        text = '支付预付款';
                    } else if (order.step == 4) {
                        text = '支付货到款';
                    } else if (order.step == 5) {
                        text = '支付尾款';
                    }
                    break;
            }
            return text;

        }
    })
    .filter('settlementType', function() {
        return function(value) {
            switch (value) {
                case 'cash':
                    return "现汇结算";
                case 'bill_com':
                    return "商业承兑";
                case 'bill_bank':
                    return "银行承兑";
                default:
                    return "";
            }
        }
    })
    .filter('payType', function() {
        return function(value) {
            switch (value) {
                case 'all_cash':
                    return "款到发货";
                case 'all_goods':
                    return "货到付款";
                case 'partition':
                    return "分期付款";
                case 'credit':
                    return "信用付款";
                default:
                    return "";
            }
        }
    })
    .filter('priceType', function() {
        return function(value) {
            switch (value) {
                case 'fix':
                    return "定价报价";
                case '':
                default:
                    return "撮合参考价";
            }
        }
    })
    .filter('payFilter', function() {
        return function(value, type) {
            var text = '';
            switch (type) {
                case 'payment_choice':
                    switch (value) {
                        case 'cash':
                            text = '现汇结算';
                            break;
                        case 'bill_bank':
                            text = '银行承兑';
                            break;
                        case 'bill_com':
                            text = '商业承兑';
                            break;
                    }
                case 'pricetype':
                default:

            }
            return text;
        }
    })
    .filter('paymentFilter', function() {
        return function(value, type) {
            var text = '';
            switch (type) {
                case 'payment_method':
                    switch (value) {
                        case 'all_cash':
                            text = '款到发货';
                            break;
                        case 'all_goods':
                            text = '货到付款';
                            break;
                        case 'partition':
                            text = '分期付款';
                            break;
                        case 'credit':
                            text = '信用付款';
                            break;
                    }
                case 'pricetype':
                default:

            }
            return text;
        }
    })
    .filter('formatPhone', function() {
        return function(value) {
            console.log('typeof', typeof(value))
            return value.replace(/-/g, '').replace(/(^\s*)|(\s*$)/g, "").replace(' ', '').replace('+86', '');
        }
    })

.filter('spacePhone', function() {
    return function(value) {
        if (value != "") {
            value = value.replace(/ /g, "");
            var num_1 = value.substring(0, 3);
            var num_2 = value.substring(3, 7);
            var num_3 = value.substring(7);
            return num_1 + " " + num_2 + " " + num_3;
        }
    }
})

.filter('formatString', function() {
        return function(value) {
            var char = ['<b>', '</b>'];
            angular.forEach(char, function(item) {
                value = value.replace(item, '');
            })
            return value; //.replace("").replace(' ', '').replace('+86', '').replace('-', '');
        }
    })
    // trade 维护区 start
    // 格式化年月日时分
    .filter('rscsecond', function() {
        return function(time) {
            return moment(new Date(time)).format('LT');
        }
    })

.filter('canjoin', function() {
        return function(canjoin) {
            if (canjoin) {
                return '可凑单'
            }
            return '不可凑单'
        }
    })
    // 判断报价方式
    // .filter('payment', function () {
    //   return function (pay) {
    //     if (pay == 'FOB') {
    //       return '出厂价'
    //     } else {
    //       return '到岸价'
    //     }
    //   }
    // })
    // 计算时间差
    .filter('dateInterval', function() {
        return function(time, flag) {
            var oldtime = new Date(time);
            var now = new Date();
            var tm = oldtime - now;
            var dd = parseInt(tm / 1000 / 60 / 60 / 24, 10);
            var hh = parseInt(tm / 1000 / 60 / 60 % 24, 10);
            var mm = parseInt(tm / 1000 / 60 % 60, 10);
            var ss = parseInt(tm / 1000 % 60, 10);
            var dhms = dd + '天' + hh + '小时' + mm + '分' + ss + '秒';
            if (flag == 'hs') {
                return now > oldtime ? 0 : dhms
            } else {
                return now > oldtime ? 0 : dd
            }

        }
    })
    // 格式化付款方式
    .filter('choicePayment', function() {
        return function(pay) {
            if (pay == 'url') {
                return '现汇结算'
            } else {
                return '信用'
            }
        }
    })
    // 格式化金额
    .filter('fmoney', function() {
        return function(s, type) {
            if (s !== undefined) {
                // 订单中的金额不进行取舍
                if (s / 100000000 > 1 && type == 'order') {
                    s = (s / 100000000).toFixed(2);
                    w = '亿';
                } else if (s / 10000 > 1 && type == 'order') {
                    s = (s / 10000).toFixed(2);
                    w = '万';
                } else {
                    s = s;
                    w = '';
                }
                //
                if (type == 'noComma') {
                    if (s == 0) return 0;
                    return s >= Math.ceil(s) ? s : s.toFixed(2);
                }
                // 吨数保留3位
                if (type == 'ton') {
                    if (s == 0) return 0;
                    return s >= Math.ceil(s) ? s : String(s).split('.')[1].length > 2 ? s.toFixed(3) : s;
                }
                var sign = s < 0 ? '-' : '';
                s = s < 0 ? Math.abs(s) : s;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                t = "";
                for (i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                //dun 这个应用哪里了
                if (type == 'dun') {
                    return sign + t.split("").reverse().join("") + w;
                }
                return r > 0 ? sign + t.split("").reverse().join("") + "." + r + w : sign + t.split("").reverse().join("") + w;
            }
        }
    })
    // 格式化行业
    .filter('subType', function() {
        var sub_type = {
            TRADE: '交易型企业',
            TRAFFIC: '物流型企业',
            IRON: '炼焦行业',
            COAL: '煤炭行业'
        };
        return function(type) {
            return sub_type[type];
        }
    })
    .filter('fstrLen', function() {
        return function(e) {
            if (e) {
                return e.substring(0, 10) + '...'
            }
        }
    })
    // 判断是否匿名
    .filter('judgeAnonymity', function() {
        return function(arr) {
            // session中的公司id，抢单公司id,挂单公司id
            if (arr[0] == arr[1] || arr[0] == arr[2]) {
                return arr[3]
            } else {
                return '******'
            }
        }
    })
    // 返回向上取整的数字
    .filter('numCeil', function() {
        return function(e) {
            if (e) {
                return Math.ceil(e / 10)
            } else {
                return 0
            }
        }
    })
    // 取绝对值
    .filter('mathabs', function() {
        return function(e) {
            return Math.abs(e).toFixed(2)
        }
    })
    // 数字转大写
    .filter('upDigit', function() {
        return function(n) {
            if (n) {
                var fraction = ['角', '分'];
                var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                var unit = [
                    ['元', '万', '亿', '万亿'],
                    ['', '拾', '佰', '仟']
                ];
                var head = n < 0 ? '欠' : '';
                n = Math.abs(n);
                var s = '';
                for (var i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);

                for (var i = 0; i < unit[0].length && n > 0; i++) {
                    var p = '';
                    for (var j = 0; j < unit[1].length && n > 0; j++) {
                        p = digit[n % 10] + unit[1][j] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            }
        }
    })
    // 数字转大写并且以万元为单位
    .filter('upDigitDit', function() {
        return function(n) {
            n = n * 10000;
            if (n) {
                var fraction = ['角', '分'];
                var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                var unit = [
                    ['元', '万', '亿', '万亿'],
                    ['', '拾', '佰', '仟']
                ];
                var head = n < 0 ? '欠' : '';
                n = Math.abs(n);
                var s = '';
                for (var i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);

                for (var i = 0; i < unit[0].length && n > 0; i++) {
                    var p = '';
                    for (var j = 0; j < unit[1].length && n > 0; j++) {
                        p = digit[n % 10] + unit[1][j] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            }
        }
    })
    // 返回距今时长
    .filter('formvalidity', function() {
        return function(time) {
            var now = new Date();
            var oldtime = new Date(time);
            // var temp = Math.floor((oldtime-now)/1000/24/60/60)
            var temp = Math.ceil((oldtime - now) / 1000 / 24 / 60 / 60);
            if (temp > 180) {
                return 180;
            }
            if ((oldtime - now) < 0) {
                var _tmp = Math.ceil((now - oldtime) / 1000 / 24 / 60 / 60);
                return '已逾期' + _tmp;
            } else if ((oldtime - now) < 86400000) {
                return '1';
            } else {
                return temp;
            }
        }
    })
    //付款时效
    .filter('paymentimelength', function() {
        return function(arr) {
            var now, time, oldtime, temp, days, hours, minus, _tmp1, _oldtime;
            now = (new Date()).getTime();
            time = arr[0];
            if (arr[1] == 2) {
                oldtime = (new Date(time)).getTime() + 259200000;
            }
            if (arr[1] == 5.5) {
                oldtime = (new Date(time)).getTime();
            }
            temp = Math.ceil(Math.abs(oldtime - now) / 86400000);
            if (oldtime < now) {
                return '已逾期' + temp + '天';
            } else if (Math.abs(oldtime - now) < 86400000) {
                return oldtime < now ? '已逾期1天' : '1天';
            } else {
                days = Math.floor((oldtime - now) / 86400000);
                _tmp1 = (oldtime - now) % 86400000;
                hours = Math.floor(_tmp1 / 3600000);
                minus = Math.floor((_tmp1 % 3600000) / 60000);
                return days + '天' + hours + '时' + minus + '分内付款';
            }
        }
    })
    // 设置4种订单状态，
    .filter('tradestep', function() {
        return function(_step) {
            var step = _step[0];
            var side = _step[1] == 'demand' ? 'demand' : 'supply';
            var pmethod = _step[3];
            if (_step[2] == 'cancelled') {
                return '已取消';
            }
            if (_step[2] == 'complete') {
                return '已完成';
            }
            var tmpObj = {
                'demand': {
                    '1': '下订单',
                    '1.5': '待确认',
                    '2': pmethod == 'credit' ? '申请信用' : pmethod == 'partition' ? '付预付款' : '待交易方付全款',
                    '2.5': pmethod == 'credit' ? '待审核' : '待确认',
                    '3': _step[4] == 'FOB' ? '提货中' : '运输中',
                    '3.5': '收货',
                    '4.5': '质检',
                    '5': '待申诉',
                    '5.1': '审核申诉',
                    '5.5': '未支付',
                    '5.6': '等待交割'
                }

                ,
                'supply': {
                    '1': '待确认',
                    '1.5': '确认订单',
                    '2': pmethod == 'partition' ? '待交易方付预付款' : '待交易方付全款',
                    '2.5': pmethod == 'credit' ? '审核信用' : '确认收款',
                    '3': _step[4] == 'FOB' ? '提货中' : '组织运输',
                    '3.5': '待收货',
                    '4.5': '等待质检',
                    '5': '请求申诉',
                    '5.1': '申诉审核',
                    '5.5': '未支付',
                    '5.6': '确认交割'
                }
            };
            return tmpObj[side][step]
        }
    })
    // 20160229新增付款类型，支付方式，延期标准
    .filter('paymentChoice', function() {
        var sub_type = {
            cash: '现汇结算',
            bill_bank: '银行承兑',
            bill_com: '商业承兑',
            all_cash: '款到发货',
            all_goods: '货到付款',
            partition: '分期付款',
            transfer: '银行转账',
            offline: '线下付款',
            credit: '信用付款',
            order: '双方确认订单日',
            orderInfo: '双方确认订单日',
            goods: '货到并完成质检日',
            goodsTraf: '付款方确认完成运输日',
            demand: '采购方',
            supply: '销售方',
            other: '第三方',
            minus: '减少',
            range: '增减',
            plus: '增加',
            FEMALE: '女',
            MALE: '男',
            coal: '煤炭',
            steel: '钢铁',
            gangtie: '钢铁',
            alloy: '合金金属',
            flexible: '撮合报价',
            fix: '定价抢单',
            FOB: '出厂价',
            CIF: '到岸价',
            slag: '矿粉',
            pick_up: '提货',
            arrival: '到货',
            path_loss: '合理路耗',
            farming: '农业',
            car: '车',
            powder: '矿粉'
        };
        return function(type) {
            return sub_type[type];
        }
    })
    .filter('rscPayChoice', function() {
        var sub_type = {
            cash: '现汇结算',
            bill_bank: '银行承兑',
            bill_com: '商业承兑',
            all_cash: '款到发货',
            all_goods: '货到付款 付款方确认完成运输后5日内付款',
            partition: '分期付款',
            transfer: '银行转账',
            offline: '线下付款',
            credit: '信用付款',
            order: '双方确认订单日',
            orderInfo: '双方确认订单日',
            goods: '货到并完成质检日',
            goodsTraf: '付款方确认完成运输日',
            demand: '采购方',
            supply: '销售方',
            other: '第三方',
            minus: '减少',
            range: '增减',
            plus: '增加',
            FEMALE: '女',
            MALE: '男',
            coal: '煤炭',
            steel: '钢铁',
            alloy: '合金金属',
            flexible: '撮合报价',
            fix: '定价抢单',
            FOB: '出厂价',
            CIF: '到岸价',
            slag: '矿粉',
            pick_up: '提货',
            arrival: '到货',
            path_loss: '合理路耗',
            farming: '农业',
            car: '车',
            powder: '矿粉'
        };
        return function(type) {
            return sub_type[type];
        }
    })
    .filter('offerLimit', function() {
        var _offerlimit = {
            all: "全平台",
            limited: "认证企业"
        };
        return function(type) {
            return _offerlimit[type];
        }
    })
    //产品名称
    .filter('coalEnum', function() {
        var sub_type = {
            coal_donglimei: '动力煤',
            coal_wuyanmei: '无烟煤',
            coal_penchuimei: '喷吹煤',
            coal_lianjiaomei: '炼焦煤',
            coal_yuanmei: '原煤',
            steel_gaoxian: '高线',
            steel_panluo: '盘螺',
            steel_puxian: '普线',
            steel_luowengang: '螺纹钢',
            steel_gangpei: '钢坯',
            alloy_tie: '铁合金',
            slag_kuangzha: '矿渣',
            slag_weifen: '微粉',
            slag_kuangzhaweifenS95: '矿渣微粉S95',
            slag_kuangzhaweifenS105: '矿渣微粉S105'
        }
        return function(type) {
            return sub_type[type];
        }
    })
    //产品参数排序;
    .filter('sortProduceAtt', function() {
        return function(att) {
            var data = [];
            var a = ['fareliang', 'shuifen', 'huifafen', 'quanliufen', 'huifen', 'gudingtan', 'rezhi', 'nianjiezhishu',
                'Si', 'Mn', 'S', 'P', 'caizhi', 'guige', 'CaO', 'R2O', 'shaoshiliang', 'bibiaomianji', 'hanshuiliang'
            ];
            for (var i = 0; i < a.length; i++) {
                if (att[a[i]]) {
                    data.push(att[a[i]]);
                }
            }
            return data;
        };
    })
    .filter('steelAddr', function() {
        return function(address) {
            if (address && address.length > 3) {
                if (address[0] == address[1]) {
                    return address[0] + address[2] + (address[3] || '');
                } else {
                    return address[0] + address[1] + address[2] + (address[3] || '');
                }
            } else {
                return '';
            }
        }
    })
    .filter('stringSubStringFilter', function() {
        return function(value) {
            if (value && value.length > 6) {
                return value.substring(0, 6) + '...';
            } else {
                return value;
            }
        }
    })
    .filter('rscDateTime', function($filter) {
        return function(time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy.MM.dd HH:mm');
            } else {
                return '';
            }
        }
    })
    .filter('rscDateOrderTime', function($filter) {
        return function(time) {
            if (time) {
                return $filter('date')(new Date(time), 'yyyy-MM-dd');
            } else {
                return '';
            }
        }
    })
    .filter('menuFilter', function($filter) {
        return function(data) {
            var arrays = [];
            angular.forEach(data, function(value, index) {
                    angular.forEach(value, function(item, index) {
                        arrays.push(item);
                    })
                })
                // console.log(arrays)
                // if (arrays.length == 1) {
                //     // arrays.push({ route: '',text:'',imgUrl:'ddd' });
                //     arrays.push({ index: 0, route: '', text: '', imgUrl: 'tab.' });

            // }
            return arrays
        }
    })
    .filter('categoryArr', function() {
        return function(value) {
            if (value) {
                return value.join(',')
            }
        }
    })

/**
 * 名称过长省略显示，缩写
 */
.filter('abridgeStr', function() {
        return function(value) {
            if (value) {
                return value.length > 4 ? value.slice(0, 4) + "..." : value
            } else {
                return ''
            }
        }
    })
    /**
     * 过滤手机通讯录中的手机号码
     */
    .filter("contactsFormat", function($log, commonString, $filter) {
        return function(result) {
            var arrays = [];
            angular.forEach(result, function(item) {
                if (item.phoneNumbers && (item.displayName || item.name.formatted)) {
                    $log.debug('phone info', JSON.stringify(item));
                    var name = "未知";
                    if (item.displayName || item.name.formatted) {
                        if (item.displayName) {
                            name = item.displayName;
                        } else if (item.name) {
                            name = item.name.formatted;
                        }
                        angular.forEach(item.phoneNumbers, function(phone) {
                            if (phone.value) {
                                var reg = new RegExp(commonString.phoneReg);
                                //处理手机号中存储的字符串
                                var phoneValue = $filter('formatPhone')(phone.value);
                                //校验手机号是否符合规则
                                var res = reg.test(phoneValue);

                                // $log.debug('phone check', res);

                                // if (phone.type == 'mobile' && res) {
                                //如果在手机中存储在 手机标签中且手机号码符合规则
                                if (res) {
                                    //不符合正则验证的 跳过
                                    // $log.debug(phone.value, $filter('formatPhone')(phone.value))
                                    var data = {
                                        phone: phoneValue,
                                        name: !item.displayName ? item.name.formatted : item.displayName,
                                        isSelects: false
                                    };
                                    arrays.push(data);
                                }
                            }
                        })
                    }

                }

            })

            return arrays;
        }

    })
    /**
     * 过滤地址长度
     */
    .filter('rscLimit', function() {
        return function(input, len) {
            var myAddress = '';
            if (!input) {
                return false;
            }
            if (input.length > len) {
                myAddress = input.slice(input, len) + '...';
            } else {
                myAddress = input;
            }
            return myAddress;
        }
    })

/**
 * 计算json对象的sum
 * 用法简介：
 * $scope.jb={"美的":3,"三星":2,"海信":6};
 * 总计：{{jb | getJsonSum}}
 */
.filter('getJsonSum', function() {
    return function(data) {
        var sum = 0;
        for (key in data) {
            sum += data[key]
        }
        return sum;
    }
})

.filter('setPayType', function() {
    return function(order) {
        if ('_id' in order != false) {
            var text = '';
            var payTypeCode = order.att_settlement[0];
            //支付方式
            switch (payTypeCode) {
                case "all_cash":
                    text += "款到提货";
                    break;
                case "all_goods":
                    text += "货到付款";
                    break;
                case "partition":
                    text += "分期付款，首付款比例：" + order.percent_advance[0] + "%，尾款支付起始日期:货到并完成质检日";
                    break;
                case "credit":
                    text += "信用付款";
                    break;
                default:
            }
            return text;
        } else {
            return "";
        }

    }
})


/**
 * 付款日期。
 */
.filter('setPayDay', function() {
    return function(order) {
        if ('_id' in order != false) {
            var text = '';
            var payTypeCode = order.att_settlement[0];
            var payDay = order.delay_day[0];
            var yqjsbz = order.delay_type[0]; //延期计算标准
            switch (payTypeCode) {
                case "all_cash":
                    text += "双方确认订单后立即付款";
                    break;
                case "all_goods":
                    text += "付款方确认完成运输后5日内付款";
                    break;
                case "partition":
                    text += "付款方确认完成运输" + payDay + '日内付款';
                    break;
                case "credit":
                    if (yqjsbz == 'order') {
                        text += "双方确认订单后" + payDay + '日内付款';
                        break;
                    } else if (yqjsbz == 'goods') {
                        text += "付款方确认完成运输" + payDay + '日内付款';
                    }
                    break;
                default:
            }
            return text;
        } else {
            return '';
        }
    }
})






//trade 维护区 end.


.filter('dateformatFilter', function() {
        return function(that, type) {
            that = new Date(that)
            var o = {
                "M+": that.getMonth() + 1, //月份
                "d+": that.getDate(), //日
                "h+": that.getHours() % 12 == 0 ? 12 : that.getHours() % 12, //小时
                "H+": that.getHours(), //小时
                "m+": that.getMinutes(), //分
                "s+": that.getSeconds(), //秒
                "q+": Math.floor((that.getMonth() + 3) / 3), //季度
                "S": that.getMilliseconds() //毫秒
            };
            var week = { "0": "\u65e5", "1": "\u4e00", "2": "\u4e8c", "3": "\u4e09", "4": "\u56db", "5": "\u4e94", "6": "\u516d" };
            if (/(y+)/.test(type)) { type = type.replace(RegExp.$1, (that.getFullYear() + "").substr(4 - RegExp.$1.length)); }
            if (/(E+)/.test(type)) { type = type.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + '周' + week[that.getDay() + ""]); }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(type)) { type = type.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); }
            }
            return type;
        }
    })
    .service('Dicitionary', function() {
        return {
            quality_origin: [
                { key: '以采购方为准', value: 'demand' },
                { key: '以销售方为准', value: 'supply' },
                { key: '以第三方为准', value: 'other' }
            ],
            payment_choice: [{
                    key: '现汇结算',
                    value: 'cash',
                },
                {
                    key: '银行承兑',
                    value: 'bill_bank',
                }, {
                    key: '商业承兑',
                    value: 'bill_com',
                }
            ],
            payment_style: [
                { key: '到岸价', value: 'CIF' },
                { key: '出厂价', value: 'FOB' },
            ],
            payment_method: [
                { key: '款到发货', value: 'all_cash' },
                { key: '货到付款', value: 'all_goods' },
                { key: '分期付款', value: 'partition' },
                { key: '信用付款', value: 'credit' }

            ],
            att_traffic: [
                { key: '按提货吨数结算', value: 'pick_up' },
                { key: '按到货吨数结算', value: 'arrival' },
                { key: '按到实际路耗结算', value: 'path_loss' }
            ],
            material: [
                { key: '煤炭', value: 'coal' },
                { key: '钢铁', value: 'steel' },
                { key: '合金', value: 'alloy' },
                { key: '矿粉', value: 'slag' }
            ],
            offerType: [
                { key: '定价', value: 'DjJJ' },
                { key: '区间', value: 'QjJJ' }
            ],
            quality_origin: [{
                    key: '以采购方为准',
                    value: 'demand'
                },
                {
                    key: '以销售方为准',
                    value: 'supply'
                },
                {
                    key: '以第三方为准',
                    value: 'other'
                }
            ],
            payment_choice: [{
                    key: '现汇结算',
                    value: 'cash',
                },
                {
                    key: '银行承兑',
                    value: 'bill_bank',
                }, {
                    key: '商业承兑',
                    value: 'bill_com',
                }
            ],
            payment_style: [{
                    key: '到岸价',
                    value: 'CIF'
                },
                {
                    key: '出厂价',
                    value: 'FOB'
                },
            ],
            payment_method: [{
                    key: '款到发货',
                    value: 'all_cash'
                },
                {
                    key: '货到付款',
                    value: 'all_goods'
                },
                {
                    key: '分期付款',
                    value: 'partition'
                },
                {
                    key: '信用付款',
                    value: 'credit'
                }

            ],
            delay_type: [{
                key: "货到并完成质检日",
                value: 'goods'
            }, {
                key: "确定订单日",
                value: 'order'
            }],
            att_traffic: [{
                    key: '按提货吨数结算',
                    value: 'pick_up'
                },
                {
                    key: '按到货吨数结算',
                    value: 'arrival'
                },
                {
                    key: '按到实际路耗结算',
                    value: 'path_loss'
                }
            ],
            material: [{
                    key: '煤炭',
                    value: 'coal'
                },
                {
                    key: '钢铁',
                    value: 'steel'
                },
                {
                    key: '合金',
                    value: 'alloy'
                },
                {
                    key: '矿粉',
                    value: 'slag'
                }
            ],
            offerType: [{
                    key: '定价',
                    value: 'DjJJ'
                },
                {
                    key: '区间',
                    value: 'QjJJ'
                }
            ],
            validity_arr: [{
                    key: '3小时',
                    value: 3
                },
                {
                    key: '6小时',
                    value: 6
                },
                {
                    key: '12小时',
                    value: 12
                },
                {
                    key: '24小时',
                    value: 24
                }
            ],
            //我房负责人
            myPerson: [{
                    eng: 'majordomo', //线上总监
                    chn: '线上总监'
                },
                {
                    eng: 'manager', //运营经理
                    chn: '运营经理'
                },
                {
                    eng: 'charge', //线上主管
                    chn: '线上主管'
                },
                {
                    eng: 'service', //线上客服
                    chn: '线上客服'
                },
            ],
            myobj: [{
                    eng: 'majordomo', //客户管理层
                    chn: '客户管理层'
                },
                {
                    eng: 'manager', //企业介绍人
                    chn: '客户介绍人'
                },
            ]

        }
    })
    .filter('product', function(Dicitionary) {
        return function(arrays, key, empty) {
            var temp = '';
            var ps = Dicitionary[key];
            var result = []

            angular.forEach(arrays, function(item, index) {
                angular.forEach(ps, function(itemObj) {
                    if (item == itemObj.value) {

                        result.push(itemObj.key);
                        // temp += itemObj.key;
                        // if (index != (arrays.length - 1)) {
                        //     temp += ','
                        // }
                    }
                })
            })
            if (result.length <= 0) {
                if (empty) {
                    return empty;
                } else {
                    return '无';
                }
            }
            return result.join(',');
        }
    })
    .filter('rscOfferUpDateTime', function($filter) {
        return function(time) {

            if (time) {
                var upTime = $filter('date')(new Date(time), 'yyyy.MM.dd HH:mm'),
                    nowTime = $filter('date')(new Date().getTime(), 'yyyy.MM.dd HH:mm');
                hours = Math.floor(Math.abs(new Date().getTime() - new Date(time).getTime()) / 3600000),
                    min = Math.floor((Math.abs(new Date().getTime() - new Date(time).getTime()) % 3600000) / 60000),
                    text_time = '';

                var chaTime = Math.floor(Math.abs(new Date().getTime() - new Date(time).getTime()) / 3600000) + '小时' + Math.floor((Math.abs(new Date().getTime() - new Date(time).getTime()) % 3600000) / 60000) + "分";
                console.log($filter('date')(new Date(time), 'yyyy.MM.dd HH:mm'), hours, chaTime)
                if (hours >= 84) {
                    //日期
                    text_time = upTime.split(' ')[0]

                } else if (hours < 84 && hours >= 48) {
                    // 两天前
                    text_time = '两天前'

                } else if (24 <= hours && hours < 48) {
                    //昨天前
                    text_time = '昨天' + upTime.split(' ')[1]

                } else if (1 <= hours && hours < 24) {
                    //一天内
                    text_time = hours + '小时前'
                } else if (0 == hours) {
                    if (min == 0) min = 1;
                    text_time = min + '分钟前'
                }
                return text_time;
            } else {
                return '';
            }
        }
    })

// function getTimeLongStr(time1, time2){
//     time1=new Date(time1);
//     if(!time2){time2 = new Date();}
//     var milliseconds = Math.abs(time1.getTime() - time2.getTime());
//     var seconds = Math.ceil(milliseconds/1000);
//     var minutes = Math.ceil(seconds/60);
//     if(minutes < 60){
//         return minutes + '分钟前';
//     }
//     var hours = Math.ceil(minutes/60);
//     if(hours < 24){
//         return hours + '小时前';
//     }
//     var days = Math.ceil(hours/24);
//     if(days < 30){
//         return days + '天前';
//     }
//     var months = Math.ceil(days/30);
//     if(months < 12){
//         return months + '个月前';
//     }
//     var years = Math.ceil(months/12);
//     return years + '年前';
// };
//
//
//
//
// var tt=getTimeLongStr('2017-09-22T02:20:34.781Z');
// console.log(tt)


/**
 * 产品名称
 */
.filter('categoryFilter', ['Storage', function(Storage) {
        function filter(type) {
            var names = {
                coal: '煤炭',
                steel: '钢铁',
                alloy: '合金金属',
                slag: '矿粉',
                farming: '农业',
                car: '车',
                powder: '矿粉'
            }
            var filterConfig = Storage.get('filterConfig')
            names = _.extend(names, filterConfig)
                // console.log(names)
            if (type) {
                return names[type];
            }
        }
        return filter
    }])
    /**
     * 仓库
     */
    .filter('storeType', function() {
        var types = {
            PU_TONG: '普通库',
            LENG_CANG: '冷藏库',
            HENG_WEN: '恒温库',
            WEI_XIAN_PIN: '危险品库'
        };
        return function(type) {
            return types[type];
        }
    })