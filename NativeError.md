# 错误码

## ios

```
 1001:  keyStore not exist
 1002:  keyStore importKey error
 1003:  unlock error
 1004:  GethCreateRandomMnemonic error
 1005:  importECDSAKey error
 1006:  GethGetPrivateKeyFromMnemonic error
 1007:  exportECSDAKeyHex error
 1008:  getNonceAt error
 1009:  signTxPassphrase error
 1010:  sendTransaction error
 1011:  GethGenerateERC20TransferData error
 1012:  estimateGas error
 1013:  signHash error
```

## android

```
 1001:  unlock error
 1002:  unlockAccount exceptions
 1003:  randomMnemonic exceptions
 1004:  Import private key exception
 1005:  Import mnemonic key exception
 1006:  exportPrivateKey exception
 1007:  Wallet not unlocked
 1008:  Transaction eth exception
 1009:  Transaction token exception
```

# Bug

### 001: Xcode10=>更新到Xcode11就开始报错

`Unknown argument type '__attribute__' in method -[RCTUIManager setJSResponder:blockNativeResponder:]`


解决方案：
项目/node_modules/react-native/React/Base/RCTModuleMethod.mm. (或者.m）文件
找到 static BOOL RCTParseUnused 这个方法
替换成

`
static BOOL RCTParseUnused(const char **input)
{
      return RCTReadString(input, "__unused") || RCTReadString(input, "__attribute__((__unused__))") || RCTReadString(input, "__attribute__((unused))");
}
`
