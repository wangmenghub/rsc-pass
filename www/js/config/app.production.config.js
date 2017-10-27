angular.module('rsc.production.config', [])

	.constant("ENV", {
		api: {
			account: 'http://www.rsc365.com:18010/api/',//账号
			pass: 'http://www.rsc365.com:18011/api/',   //物流
			credit: 'http://www.rsc365.com:18014/api/', //信用
			trade: 'http://www.rsc365.com:18012/api/',  //交易
			msg: 'http://www.rsc365.com:18013/api/',    //消息
			log: 'http://www.rsc365.com:18015/',        //日志
			admin: 'http://www.rsc365.com:18016/api/',    // 运营后台
			statist: 'http://www.rsc365.com:18018/api/', //统计
			contact: 'http://www.rsc365.com:18019/api/',    // 通讯录
			dynamic: 'http://www.rsc365.com:18021/api/',     //新动态
			webim: 'http://www.rsc365.com:18022/api/',
			map: 'http://www.rsc365.com:18023/api/', //地图
			compatible: 'http://192.168.3.248:18094/api/'//平台配置

		},
		debug: false,
		version: '1.0.0',
		storage: window.localStorage,
		// storage: window.sessionStorage,
		autoLogin: false, 
		// scroll: true,
		serverUrl: 'www.rsc365.com',
		shareHost: 'www.rsc365.com:4200/html',
		serverPort: 80
	});