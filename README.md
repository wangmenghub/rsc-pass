{
  "name": "rsc",
  "version": "1.1.1",
  "description": "rsc-mobile: An Ionic project",
  "dependencies": {
    "angular-image-404": "^0.1.6",
    "angular-qrcode": "^7.2.0",
    "cordova-android": "^6.2.3",
    "cordova-ios": "~4.3.1",
    "cordova-plugin-app-version": "https://github.com/whiteoctober/cordova-plugin-app-version.git",
    "cordova-plugin-audio-recorder-api": "~0.0.1",
    "cordova-plugin-camera": "~2.4.1",
    "cordova-plugin-compat": "^1.1.0",
    "cordova-plugin-console": "~1.0.6",
    "cordova-plugin-contacts": "~2.3.0",
    "cordova-plugin-datepicker": "https://github.com/VitaliiBlagodir/cordova-plugin-datepicker.git",
    "cordova-plugin-device": "~1.1.5",
    "cordova-plugin-file": "~4.3.3",
    "cordova-plugin-file-transfer": "~1.6.3",
    "cordova-plugin-image-picker": "https://github.com/zdd910/cordova-imagePicker",
    "cordova-plugin-image-picker-zh": "git+https://github.com/zdd910/cordova-imagePicker.git",
    "cordova-plugin-splashscreen": "~4.0.3",
    "cordova-plugin-statusbar": "~2.2.3",
    "cordova-plugin-whitelist": "~1.3.2",
    "gulp": "^3.5.6",
    "gulp-concat": "^2.2.0",
    "gulp-minify-css": "^0.3.0",
    "gulp-rename": "^1.2.0",
    "gulp-sass": "^2.0.4",
    "ionic-plugin-keyboard": "~2.2.1",
    "phonegap-plugin-barcodescanner": "git+https://github.com/phonegap/phonegap-plugin-barcodescanner.git"
  },
  "devDependencies": {
    "@ionic/cli-plugin-gulp": "1.0.1",
    "@ionic/cli-plugin-ionic1": "2.0.0",
    "bower": "^1.3.3",
    "gulp-util": "^2.2.14",
    "shelljs": "^0.3.0"
  },
  "cordovaPlugins": [
    "cordova-plugin-whitelist",
    "cordova-plugin-device",
    "cordova-plugin-statusbar",
    "cordova-plugin-splashscreen",
    "cordova-plugin-console",
    "ionic-plugin-keyboard",
    "cordova-plugin-audio-recorder-api",
    "cordova-plugin-file",
    "cordova-plugin-camera@~2.4.1",
    "cordova-plugin-console@~1.0.6",
    "cordova-plugin-contacts@~2.3.0",
    "cordova-plugin-device@~1.1.5",
    "cordova-plugin-file@~4.3.3",
    "cordova-plugin-file-transfer@~1.6.3",
    "cordova-plugin-splashscreen@~4.0.3",
    "cordova-plugin-statusbar@~2.2.3",
    "cordova-plugin-whitelist@~1.3.2",
    "ionic-plugin-keyboard@~2.2.1",
    {
      "id": "http://schemas.android.com/apk/res/android",
      "locator": "/Users/zhoudd/rsc/plugins/rsc-im-cordova-plugin"
    },
    "cordova-plugin-wechat",
    "jpush-phonegap-plugin"
  ],
  "cordovaPlatforms": [
    "ios",
    {
      "platform": "ios",
      "version": "",
      "locator": "ios"
    }
  ],
  "cordova": {
    "platforms": [
      "android",
      "ios"
    ],
    "plugins": {
      "cordova-plugin-app-version": {},
      "cordova-plugin-camera": {
        "CAMERA_USAGE_DESCRIPTION": " ",
        "PHOTOLIBRARY_USAGE_DESCRIPTION": " "
      },
      "cordova-plugin-console": {},
      "cordova-plugin-contacts": {},
      "cordova-plugin-datepicker": {},
      "cordova-plugin-device": {},
      "cordova-plugin-file-transfer": {},
      "cordova-plugin-image-picker": {},
      "cordova-plugin-splashscreen": {},
      "cordova-plugin-whitelist": {},
      "ionic-plugin-keyboard": {},
      "jpush-phonegap-plugin": {
        "APP_KEY": "94910a21122a507c03f03bc5"
      },
      "phonegap-plugin-barcodescanner": {},
      "cordova-plugin-statusbar": {},
      "cordova-plugin-audio-recorder-api": {},
      "cordova-plugin-file": {},
      "cordova-plugin-wechat": {
        "WECHATAPPID": "wxe47348d981689e46"
      }
    }
  }
}