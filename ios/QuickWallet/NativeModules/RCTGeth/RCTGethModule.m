//
//  RCTGethModule.m
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//  https://github.com/ethereum/go-ethereum
//  https://github.com/miguelmota/ethereum-development-with-go-book
//  https://goethereumbook.org/zh/
//  - (BOOL)estimateGas:(GethContext*)ctx msg:(GethCallMsg*)msg gas:(int64_t*)gas error:(NSError**)error;



#import "RCTGethModule.h"
#import <Geth/Geth.h>
#import "FileManager.h"
#import <React/RCTConvert.h>
#import "SignModel.h"
#import <CommonCrypto/CommonDigest.h>
#import "Web3swift-Swift.h"
#import "NSData+Category.h"
#import <Foundation/Foundation.h>

static NSString *keyStoreFileDir  = @"keystore_file_dir";
static NSString *contactIpKey  = @"contact_ip_key";
static NSString *chainIdKey  = @"chain_id_key";


#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]

@interface RCTGethModule()

@property (nonatomic, assign) NSString *errMsg;

@property (nonatomic, strong) NSError *error;

@property(nonatomic, strong) GethAccount *account;

@property(nonatomic, strong) GethKeyStore *keyStore;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@end

@implementation RCTGethModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(BOOL)isLogin contactIp:(NSString *)contactIp chainId:(NSString *)chainId) {
  [[NSUserDefaults standardUserDefaults] setInteger:[chainId integerValue] forKey:chainIdKey];
  [[NSUserDefaults standardUserDefaults] setObject:contactIp forKey:contactIpKey];

  if (!isLogin) return;
  if (!contactIp || !contactIp.length) return;
  if (self.account && self.ethClient) return;
  self.ethClient = [self getEthClient];
  NSLog(@"====init======>%@",self.ethClient);
}

RCT_EXPORT_METHOD(unInit) {
  if (self.account) {
    self.account = nil;
  }
  if (self.keyStore) {
    self.keyStore = nil;
  }
  if (self.ethClient) {
    self.ethClient = nil;
  }
  
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager removeFileAtPath:keyTemp];
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
}


RCT_EXPORT_METHOD(newWallet:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  // mnemonic
  // address
  resolver(@[@{@"mnemonic":@"mnemonic mnemonic mnemonic mnemonic",@"address":@"0xaddress"}]);
}


RCT_EXPORT_METHOD(isUnlockAccount:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    resolver(@[@{@"isUnlock":@NO}]);
    return;
  }
  resolver(@[@{@"isUnlock":@YES}]);
}


RCT_EXPORT_METHOD(unlockAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error =nil;
  
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  if (!self.account) {
    self.account = [self getAccount:passphrase];
  }
  if (!self.keyStore) {
    self.keyStore = [self getKeyStore:passphrase];
  }
  if (!self.account || !self.keyStore) {
    reject(@"1001-1002", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
//    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }

  NSString *address = [[self.account getAddress] getHex];
  resolver(@[@{@"address":address}]);
}


RCT_EXPORT_METHOD(randomMnemonic:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError *error =nil;
  NSString *mnemonic = GethCreateRandomMnemonic(&error);
  if (error) {
//    reject(@"1004", [self getLocalizedDescription:error], error);
    reject(@"1004", @"1004", error);
    return;
  }
  resolver(@[@{@"mnemonic":mnemonic}]);
}


RCT_EXPORT_METHOD(importPrivateKey:(NSString *)privateKey passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError * error = nil;
  
//  if (!self.ethClient) {
//    self.ethClient = [self getEthClient];
//  }

  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *ECDSAKey = [self byteStringToData:privateKey];
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN / 2 scryptP:GethStandardScryptP];
  
  self.account = [self.keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&error];
  if (error) {
//    reject(@"-1005", [self getLocalizedDescription:error], error);
    reject(@"-1005", @"1005", error);
    return;
  }
  
  [self saveKeystorePath:self.account];
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    //    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }
  
  NSString *address = [[self.account getAddress] getHex];
  resolver(@[@{@"address":address}]);
}

RCT_EXPORT_METHOD(importMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  mnemonic = @"tag fee recycle palace nominee van dawn mail approve crash opinion scheme";
  
  NSError *error = nil;
  
//  if (!self.ethClient) {
//    self.ethClient = [self getEthClient];
//  }
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  
  NSData *privateKey = GethGetPrivateKeyFromMnemonic(mnemonic, &error);;
  if (error) {
//    reject(@"1006", [self getLocalizedDescription:error], error);
    reject(@"1006", @"1006", error);
    return;
  }
  
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN / 2 scryptP:GethStandardScryptP];
  self.account = [self.keyStore importECDSAKey:privateKey passphrase:passphrase error:&error];
  if (error) {
//    reject(@"1005", [self getLocalizedDescription:error], error);
    reject(@"1005", @"1005", error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    //    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }
  
  [self saveKeystorePath:self.account];
  
  NSString *address = [[self.account getAddress] getHex];
  resolver(@[@{@"address":address}]);
}

RCT_EXPORT_METHOD(exportPrivateKey:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError *error = nil;
  
  if (!self.account) {
    self.account = [self getAccount:passphrase];
  }
  if (!self.keyStore) {
    self.keyStore = [self getKeyStore:passphrase];
  }

  if (!self.account || !self.keyStore) {
    reject(@"1001-1002", self.errMsg, self.error);
    return;
  }
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    //    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }
  
  NSString *privateKey = [self.keyStore exportECSDAKeyHex:self.account passphrase:passphrase error:&error];
  if (error) {
//    reject(@"1007", [self getLocalizedDescription:error], error);
    reject(@"1007", @"1007", error);
    return;
  }
  
  resolver(@[@{@"privateKey":privateKey}]);
}

RCT_EXPORT_METHOD(transferEth:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress value:(NSString *)value gas:(NSString *)gas  resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
  NSError *error = nil;
  
  if (!self.account) {
    self.account = [self getAccount:passphrase];
  }
  if (!self.keyStore) {
    self.keyStore = [self getKeyStore:passphrase];
  }
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  if (!self.account || !self.keyStore) {
    reject(@"1001-1002", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    //    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&error];
  if (!isGet || error) {
//    reject(@"1008", [self getLocalizedDescription:error], error);
    reject(@"1008", @"1008", error);
    return;
  }

  GethAddress *to = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:[value longLongValue]];
  
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas longLongValue]];
  
  NSData *data = [NSData data];
  ino64_t gasLimit = [self getGasLimit:toAddress data:data];
  
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
//    reject(@"1009", self.errMsg, error);
    reject(@"1009", self.errMsg, error);
    return;
  }

  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
//    reject(@"1010", [self getLocalizedDescription:error], error);
    reject(@"1010", @"1010", error);
    return;
  }
  NSString *txHash = [[signedTx getHash] getHex];
  NSLog(@"txHash ===> %@", txHash);
  
  resolver(@[@{@"txHash":txHash}]);
}

RCT_EXPORT_METHOD(transferTokens:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress tokenAddress:(NSString *)tokenAddress value:(NSString *)value gas:(NSString *)gas resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){

  NSError *error = nil;
  
  if (!self.account) {
    self.account = [self getAccount:passphrase];
  }
  if (!self.keyStore) {
    self.keyStore = [self getKeyStore:passphrase];
  }
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  if (!self.account || !self.keyStore) {
    reject(@"1001-1002", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    //    reject(@"1003", [self getLocalizedDescription:error], error);
    reject(@"1003", @"1003", error);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
//    reject(@"1008", [self getLocalizedDescription:error], error);
    reject(@"1008", @"1008", error);
    return;
  }
  
  GethAddress *to = [[GethAddress alloc] initFromHex:tokenAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:0];
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas longLongValue]];;

  GethCallMsg *callMsg = [[GethCallMsg alloc] init];
  GethAddress *dataAddress = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *dataAmount = [[GethBigInt alloc] init:[value longLongValue]];
  [dataAmount setString:value base:(long)10];
  
  [callMsg setFrom:from];
  [callMsg setGasPrice:gasPrice];
  [callMsg setTo:dataAddress];
  [callMsg setValue:dataAmount];
  
  
  NSData *tokenData = GethGenerateERC20TransferData(dataAddress, dataAmount, &error);
  if (error || !tokenData) {
//    reject(@"1011", [self getLocalizedDescription:error], error);
    reject(@"1011", @"1011", error);
    return;
  }
  [callMsg setData:tokenData];

  int64_t gasLimit = [self getGasLimit:tokenAddress data:tokenData];
  
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:tokenData];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
//    reject(@"1009", self.errMsg, error);
    reject(@"1009", self.errMsg, error);
    return;
  }
  
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
//    reject(@"1010", [self getLocalizedDescription:error], error);
    reject(@"1010", @"1010", error);
    return;
  }
  NSString *txHash = [[signedTx getHash] getHex];
  NSLog(@"txHash ===> %@", txHash);
  
  resolver(@[@{@"txHash":txHash}]);
}


- (GethTransaction *)signTxWithKeyStore:(GethKeyStore *)keyStore Account:(GethAccount *)account passphrase:(NSString *)passphrase transaction:(GethTransaction *)transaction{
  int64_t chainId = [[[NSUserDefaults standardUserDefaults] objectForKey:chainIdKey] intValue];
  
  GethBigInt *chainID = [[GethBigInt alloc] init:chainId];
  NSError *error = nil;
  GethTransaction *signedTx = [keyStore signTxPassphrase:account passphrase:passphrase tx:transaction chainID:chainID error:&error];
  if (error) {
    self.error = error;
//    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1009";
    return nil;
  }
  return signedTx;
}


RCT_EXPORT_METHOD(signMessage:(NSString *)from message:(NSString *)message resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
   NSString *hash = [self signMessage:from message:message];
    if (!hash) {
      reject(@"1001-1002-1013", self.errMsg, self.error);
      return;
    }
    resolver(@[@{@"data":hash}]);
}

RCT_EXPORT_METHOD(signPersonalMessage:(NSString *)from message:(NSString *)message resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
  NSString *hash = [self signPersonalMessage:from message:message];
  if (!hash) {
    reject(@"1001-1002-1013", self.errMsg, self.error);
    return;
  }
  resolver(@[@{@"data":hash}]);
}


RCT_EXPORT_METHOD(signTransaction:(NSString *)passphrase signInfo:(NSDictionary *)signInfo resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
  NSString *hash =  [self sendTransaction:passphrase signInfo:signInfo];
  if (!hash) {
    reject(@"1001-1002-1008-1009-1010", self.errMsg, self.error);
    return;
  }
  resolver(@[@{@"data":hash}]);
  
}

- (GethEthereumClient *)getEthClient{
  NSString *contactIp = [[NSUserDefaults standardUserDefaults] objectForKey:contactIpKey];
  return [[GethEthereumClient alloc] init:contactIp];
}

- (GethKeyStore *)getKeyStore:(NSString *)passphrase{
  
  NSError *error = nil;
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN / 2 scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
//    self.errMsg = @"keyStore not exist";
    self.errMsg = @"1001";
    return nil;
  };
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  
  [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&error];
  if (error) {
    self.error = error;
//    self.errMsg = @"keyStore importKey error";
    self.errMsg = @"1002";
    return nil;
  }
  return self.keyStore;
}

- (GethAccount *)getAccount:(NSString *)passphrase{
  NSError *error = nil;
  self.keyStore = [self getKeyStore:passphrase];
  if (!self.keyStore) return nil;
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) return nil;
  
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&error];
  if (error) {
    self.error = error;
    //    self.errMsg = @"keyStore importKey error";
    self.errMsg = @"1002";
    return nil;
  }
  return self.account;
}

- (NSData*)byteStringToData:(NSString *)byteStr{
  NSMutableData *data = [NSMutableData data];
  int index;
  for (index = 0; index + 2 <= byteStr.length; index += 2) {
    NSRange range = NSMakeRange(index, 2);
    NSString* hexStr = [byteStr substringWithRange:range];
    NSScanner* scanner = [NSScanner scannerWithString:hexStr];
    unsigned int intValue;
    [scanner scanHexInt:&intValue];
    [data appendBytes:&intValue length:1];
  }
  return data;
}

- (NSString *)dataToJson:(id)data{
  NSString *jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  if (jsonStr.length > 0) {
    return jsonStr;
  }else{
    return nil;
  }
}

- (void)saveKeystorePath:(GethAccount *)account{
  NSString *url = [account getURL];
  NSString *fileName = [url lastPathComponent];
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  NSString *filedir = [keydir stringByAppendingPathComponent:fileName];
  [[NSUserDefaults standardUserDefaults] setObject:filedir forKey:keyStoreFileDir];
}

- (void)sendTx:(NSString *)tx signerCallBack:(SignerCallBack)callback{
  NSString *from = @"from-----------------from";
  NSString *message = @"message-----------------message";
  NSString *hash = [self signMessage:from message:message];
  callback(hash);
}

- (void)signMsg:(NSString *)msg signerCallBack:(SignerCallBack)callback{
  
  NSString *passphrase = @"passphrase-----------------passphrase";
  NSDictionary *signInfo = @{@"signInfo":@"signInfo"};
  NSString *hash = [self sendTransaction:passphrase signInfo:signInfo];
  callback(hash);
}

- (NSString *)signMessage:(NSString *)from message:(NSString *)message{
  
  NSError *error = nil;
  if (!self.account || !self.keyStore) {
    return nil;
  }
  
  NSString *hex = [self hexToHexString: message];
  NSData *hexData = [OCWeb3Utils hexToData:hex];
  GethAddress *address = [[GethAddress alloc] initFromHex:from];
  NSData *signData = [self.keyStore signHash:address hash:hexData error:&error];

  if (error) {
    self.error = error;
//    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1013";
    return nil;
  }
  NSData *configData = [OCWeb3Utils getConfigurableData:signData];
  NSString *hash = [OCWeb3Utils hex:configData];
  return hash;
}

- (NSString *)signPersonalMessage:(NSString *)from message:(NSString *)message{
  
  NSError *error = nil;
  if (!self.account || !self.keyStore) {
    return nil;
  }
  
  NSString *hex = [self hexToHexString: message];
  NSData *info = [NSData dataWithHexString:hex];
  NSData *fixData = [OCWeb3Utils getFixData:info];
  
  NSMutableData *data = [NSMutableData dataWithData:fixData];
  [data appendData:info];
  
  NSData *hash256 = [OCWeb3Utils keccak256:data];
  
  GethAddress *address = [[GethAddress alloc] initFromHex:from];
  NSData *signData = [self.keyStore signHash:address hash:hash256 error:&error];
  
  if (error) {
    self.error = error;
    //    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1013";
    return nil;
  }
  NSData *configData = [OCWeb3Utils getConfigurableData:signData];
  NSString *hash = [OCWeb3Utils hex:configData];
  return hash;
}


- (NSString *)sendTransaction:(NSString *)passphrase signInfo:(NSDictionary *)signInfo{
  
  NSError *error = nil;
  
  if (!self.account) {
    self.account = [self getAccount:passphrase];
  }
  if (!self.keyStore) {
    self.keyStore = [self getKeyStore:passphrase];
  }
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  if (!self.account || !self.keyStore) {
    return nil;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    self.error = error;
//    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1003";
    return nil;
  }
  
  SignModel *model = [SignModel provinceWithDictionary:signInfo];
  GethAddress *from = [[GethAddress alloc] initFromHex:model.from];
  GethAddress *to = [[GethAddress alloc] initFromHex:model.to];
  GethBigInt *amount = [[GethBigInt alloc] init:[model.value longLongValue]];
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[model.gasPrice longLongValue]];
  NSString *hex = [self hexToHexString: model.data];
  NSData *data = [NSData dataWithHexString:hex];

  int64_t nonce = 0x0;
  GethContext *context = [[GethContext alloc] init];
  
  int64_t number = -1;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&error];
  if (!isGet || error) {
    self.error = error;
//    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1008";
    return nil;
  }
  
  ino64_t gasLimit = [model.gasLimit longLongValue];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    self.error = error;
//    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1017 userInfo:@{@"info":@"Signature abnormal"}];
//    self.errMsg = [self getLocalizedDescription:error];
    self.errMsg = @"1009";
    return nil;
  }
  
    BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
    if (!isSend || error) {
      self.error = error;
      self.errMsg = @"1010";
      return nil;
    }
  
  NSString *hash = [[signedTx getHash] getHex];
  return hash;
}

/**
 估计燃气上限
 
 @param to toAddress
 @param data data
 @return 燃气上限
 */
- (int64_t)getGasLimit:(NSString *)to data:(NSData *)data{
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  GethContext *context = [[GethContext alloc] init];
  GethCallMsg *msg = [[GethCallMsg alloc] init];
  GethAddress *address = [[GethAddress alloc] initFromHex:to];
  [msg setTo:address];
  [msg setData:data];

  NSError *err = nil;
  int64_t gasLimit = 21000;
  BOOL isLimit = [self.ethClient estimateGas:context msg:msg gas:&gasLimit error:&err];
  if (!isLimit) {
    return 21000;
  }
  return gasLimit;
}

/**
 hex转hexString : 删除0x

 @param hex 0xhexString
 @return hexString
 */
- (NSString *)hexToHexString:(NSString *)hex{
  NSMutableString *muHex = [[NSMutableString alloc] initWithString:hex];
  NSRange range = NSMakeRange(0, 2);
  [muHex deleteCharactersInRange:range];
  return muHex;
}

@end


//- (NSString*)serializeDeviceToken:(NSData*) deviceToken{
//  NSMutableString *str = [NSMutableString stringWithCapacity:64];
//  NSUInteger length = [deviceToken length];
//  char *bytes = malloc(sizeof(char) * length);
//
//  [deviceToken getBytes:bytes length:length];
//  for (int i = 0; i < length; i++){
//    [str appendFormat:@"%02.2hhX", bytes[i]];
//  }
//  free(bytes);
//  return str;
//}

//- (NSString *)getLocalizedDescription:(NSError *)error{
//  NSString *msg = @"get LocalizedDescription exceptions";
//  @try {
//    NSDictionary *userInfo = error.userInfo;
//    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:0];
//    NSString *dataStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
//    msg = dataStr;
//  } @catch (NSException *exception) {
//  } @finally {
//    return msg;
//  }
//}

