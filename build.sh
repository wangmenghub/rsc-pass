#! /bin/bash


# find . -name "config.xml" -print

wechatappid='wxe47348d981689e46'
JPUSH_APP_KEY='94910a21122a507c03f03bc5'

# TODO 更改包名

egrep -o '<widget.*id="(.*)"' ./config.xml -A 3

# grep -v '<widget.*id="(.*)"' ./config.xml


# grep -E "^(.*)" ./config.xml


# echo '移除android'
# cordova platform rm android --save
# echo '移除android成功'

# echo '插件处理'

# cordova plugin rm cordova-plugin-wechat
# cordova plugin rm jpush-phonegap-plugin

# cordova plugin add cordova-plugin-wechat --variable wechatappid=${wechatappid} --save
# cordova plugin add jpush-phonegap-plugin --variable APP_KEY=${JPUSH_APP_KEY} --save


# echo '添加android'
# cordova platform add android --save 


# 替换 JavaVersion.VERSION_1_6 JavaVersion.VERSION_1_7 
# com.rsc.rsc
echo '添加android成功'
