angular.module('rsc.development.config', [])
    .constant("ENV", {
        api: {
            account: 'http://192.168.3.248:18080/api/',
            pass: 'http://192.168.3.248:18081/api/',//物流
            credit: 'http://192.168.3.248:18084/api/',
            trade: 'http://192.168.3.248:18082/api/',       //交易
            msg: 'http://192.168.3.248:18083/api/',       //消息
            log: 'http://192.168.3.248:18085/',       //日志
            me: 'http://192.168.3.248:18082/',
            admin: 'http://192.168.3.248:18086/api/',
            statist: 'http://192.168.3.248:18088/api/', //统计
            newtrade: 'http://192.168.3.248:16082/api/',      //新交易,
            contact: 'http://192.168.3.248:18089/api/',
            dynamic: 'http://192.168.3.248:18091/api/',     //新动态
            webim: 'http://192.168.3.248:18092/api/',
            map: 'http://192.168.3.248:18093/api/',//地图
			compatible: 'http://192.168.3.248:18094/api/'//平台配置
        },
        // encode: true, // true 加密
        encode: false, // false 不加密
        debug: true,
        version: '0.5.1',
         storage: window.sessionStorage,
        //storage: window.localStorage,
        autoLogin: true,
        scroll: false,
        serverUrl: 'www.e-wto.com',
        serverPort: 3000,
        shareHost: '192.168.3.248:4000/html'
        // shareHost: '192.168.3.100:8101/html'

    });
