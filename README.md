#  QuickWallet
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/)
```
QuickWallet is an Ethereum digital currency wallet.
QuickWallet has a relatively low user threshold compared to other Ethereum wallets to make it friendlier to new users of Blockchian. A dapp browser is also embedded in QuickWallet.
More optimizations and updates is on the way, please stay tuned.
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

**Step 1:** `git clone https://github.com/typicode/husky`

**Step 2:** `npm install`

**Step 3:** `react-native link`

**Step 4:** `cd ios && pod install && cd ..`

## :school_satchel: Rely

###  iOS
1. Geth.framework

###  Android
1. geth.aar

```
External link Geth library: export the IOS and Android library files by compiling the modified ethereum source code using gomobile bind
```
**Step 1:** `git clone https://github.com/litexnetwork/go-ethereum`

**Step 2:** Copy the project to GoPath

`mv go-ethereum $GOPATH/github.com/ethereum/go-ethereum`

**Step 3:** [Installed Gomobile](https://github.com/golang/go/wiki/Mobile#sdk-applications-and-generating-bindings)

**Step 4:** Export Android/IOS library files

## :arrow_forward: Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
    * or  `npm start ipx`
  * for Android (真机调试)
    * 001: `adb reverse tcp:8081 tcp:8081`
    * 002: Android Studio :arrow_forward:

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
## :satellite: Link
[React Native中文网](https://reactnative.cn/)

[Redux 中文文档](https://www.redux.org.cn/s)

[Ignite CLI](https://vuex.vuejs.org/zh/)

[Gomobile](https://github.com/golang/go/wiki/Mobile#sdk-applications-and-generating-bindings)
