/**
 * Created by Administrator on 2017/3/28 0028.
 */
angular.module('rsc.pass.filters', [])
    .filter('carStatusFilter', function () {
        var values = {
            effective:'进行中',
            ineffective:'待接单',
            old_ineffective:'逾期未接单',
            complete:'已完成',
            wait_assign:'待派货'
        }

        return function (type) {
            return values[type];
        }
    })
    .filter('getGoodInfCountFilter', function () {
        return function (that,passDemandInfo) {
            if(passDemandInfo&&passDemandInfo.length>0){
                for(var i=0; i<passDemandInfo.length; i++){
                    if(passDemandInfo[i].company_id==that){
                        return passDemandInfo[i].count;
                    }
                }
            }

        }

    })
    //产品种类过滤器
    .filter('typeName', function () {
        var name = {
            coal_donglimei: '动力煤',
            coal_wuyanmei: '无烟煤',
            coal_lianjiaomei: '喷吹煤',
            coal_yuanmei: '炼焦煤',
            coal_penchuimei: '原煤',
            steel_gaoxian: '高线',
            steel_panluo: '盘螺',
            steel_puxian: '普线',
            steel_luowengang: '螺纹钢',
            steel_gangpei: '钢坯',
            alloy_tie: '铁合金',
            slag_kuangzha: '矿渣',
            slag_weifen: '微粉',
            slag_kuangzhaweifenS95: '矿渣微粉S95',
            slag_kuangzhaweifenS105: '矿渣微粉S105',
            all_cash: '款到发货',
            all_goods: '货到付款',
            partition: '分期付款',
            credit: '信用付款',
            cash: '现汇结算',
            bill_bank: '银行承兑',
            bill_com: '商业承兑',
            coal: '煤炭',
            steel: '钢铁',
            alloy: '合金',
            slag: '矿粉',
            demand: '以采购方质检结果为准',
            supply: '以销售方质检结果为准',
            other: '以第三方质检结果为准',
            effective:'运输中',
            complete:'完成',
            FOB:'出厂价',
            CIF:'到岸价',
            gangtie:'钢铁',
            kuangshi:'矿石',
            meijiao:'煤焦'
        };
        return function (type) {
            return name[type];
        }
    })
