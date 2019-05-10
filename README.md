#  QuickWallet
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://cn.eslint.org/)
```
QuickWallet is an Ethereum digital currency wallet.
QuickWallet has a relatively low user threshold compared to other Ethereum wallets to make it friendlier to new users of Blockchian. A dapp browser is also embedded in QuickWallet.
More optimizations and updates is on the way, please stay tuned.
```

## :arrow_up: Setup

**Step 1:** `git clone https://github.com/shuaijianjian/QuickWallet.git`

**Step 2:** `npm install`

<!-- **Step 3:** `react-native link` -->

**Step 3:** `cd ios && pod install && cd ..`

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
    * run `npm run bundle:ios`
    * run `react-native run-ios`
    * or  `npm start ipx`

  * for Android
    * 001: `adb reverse tcp:8081 tcp:8081`
    * 002: Android Studio :arrow_forward:

## :satellite: Link

[React](https://reactnative.cn/)

[Redux](https://www.redux.org.cn/s)

[Ignite CLI](https://vuex.vuejs.org/zh/)

[Gomobile](https://github.com/golang/go/wiki/Mobile#sdk-applications-and-generating-bindings)

[ESLint](https://cn.eslint.org/)
