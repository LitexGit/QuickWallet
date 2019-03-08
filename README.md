#  QuickWallet
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/)
```
QuickWallet introduction
```
## :earth_asia: Environment
### :wrench: 开发工具
```
0.ReactNative[JS]：Visual Studio code V1.32.0
1.iOS：Xcode V10.1
2.Android：Android Studio V3.2.1
```
### :blue_book: 开发环境
```
"react": "16.3.1",
"react-native": "^0.55.3",

npm  6.8.0
node v10.14.2
```

## :arrow_up: Setup

**Step 1:** `git clone` [repo](https://github.com/typicode/husky)

**Step 2:** `npm install`

**Step 3:** `react-native link`

**Step 4:** `cd ios && pod install && cd ..`

## :arrow_forward: Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
    * or  `npm start ipx`
  * for Android (真机调试)
    * 001: `adb reverse tcp:8081 tcp:8081`
    * 002: Android Studio :arrow_forward:

## :arrow_forward: How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
  * for Android
    * Run Genymotion
    * run `react-native run-android`

## :no_entry_sign: Standard Compliant

## :closed_lock_with_key: Secrets
### xcode 10 third-party相关错误解决方案
**Step 1:**
```
cd  node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
```
**Step 2:**
```
cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
```
**Step 3:**
```
cp ios/build/Build/Products/Debug-iphonesimulator/libfishhook.a  node_modules/react-native/Libraries/WebSocket/
```
