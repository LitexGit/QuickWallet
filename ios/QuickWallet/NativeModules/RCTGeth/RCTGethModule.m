//
//  RCTGethModule.m
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTGethModule.h"
#import <Geth/Geth.h>
#import "FileManager.h"
#import <React/RCTConvert.h>
#import "SignModel.h"
#import <CommonCrypto/CommonDigest.h>
#import "Web3swift-Swift.h"

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
    reject(@"-1111", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    reject(@"-1010", @"Failed to unlock wallet", error);
    return;
  }

  NSString *address = [[self.account getAddress] getHex];
  resolver(@[@{@"address":address}]);
}


RCT_EXPORT_METHOD(randomMnemonic:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError *error =nil;
  NSString *mnemonic = GethCreateRandomMnemonic(&error);
  if (error) {
    reject(@"-1003", @"Generate mnemonic word exceptions", error);
    return;
  }
  resolver(@[@{@"mnemonic":mnemonic}]);
}


RCT_EXPORT_METHOD(importPrivateKey:(NSString *)privateKey passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError * error = nil;
  
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }

  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *ECDSAKey = [self byteStringToData:privateKey];
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  self.account = [self.keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&error];
  if (error) {
    reject(@"-1004", @"Import private key exception", error);
    return;
  }
  
  [self saveKeystorePath:self.account];
  
  NSString *address = [[self.account getAddress] getHex];
  resolver(@[@{@"address":address}]);
}

RCT_EXPORT_METHOD(importMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  NSError *error = nil;
  
  if (!self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  
  NSData *privateKey = nil;
  @try {
      privateKey = GethGetPrivateKeyFromMnemonic(mnemonic, &error);
  } @catch (NSException *exception) {
    NSLog(@"exception==> %@",exception);
  } @finally {
    if (error) {
      reject(@"-1005", @"Mnemonic words derive private key exceptions", error);
      return;
    }
  }
  
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  self.account = [self.keyStore importECDSAKey:privateKey passphrase:passphrase error:&error];
  if (error) {
    reject(@"-1006", @"Import mnemonic key exception", error);
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
    reject(@"-1111", self.errMsg, self.error);
    return;
  }
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    reject(@"-1010", @"Failed to unlock wallet", error);
    return;
  }
  
  NSString *privateKey = [self.keyStore exportECSDAKeyHex:self.account passphrase:passphrase error:&error];
  if (error) {
    reject(@"-1008", @"Export private key exception", error);
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
  if (self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  if (!self.account || !self.keyStore) {
    reject(@"-1111", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    reject(@"-1010", @"Failed to unlock wallet", error);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&error];
  if (!isGet || error) {
    reject(@"-1010", @"get Nonce exceptions", error);
    return;
  }

  GethAddress *to = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:[value longLongValue]];
  ino64_t gasLimit = 21000;
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas longLongValue]];;
  
  NSData *data = [NSData data];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1011 userInfo:@{@"info":@"Signature abnormal"}];
    reject(@"-1011", @"Signature abnormal", error);
    return;
  }

  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
    reject(@"-1012", @"Transaction eth failure", error);
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
  if (self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  if (!self.account || !self.keyStore) {
    reject(@"-1111", self.errMsg, self.error);
    return;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    reject(@"-1010", @"Failed to unlock wallet", error);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    reject(@"-1010", @"get Nonce exceptions", error);
    return;
  }
  
  GethAddress *to = [[GethAddress alloc] initFromHex:tokenAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:0];
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas longLongValue]];;

  GethCallMsg *callMsg = [[GethCallMsg alloc] init];
  GethAddress *dataAddress = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *dataAmount = [[GethBigInt alloc] init:[value longLongValue]];
  
  [callMsg setFrom:from];
  [callMsg setGasPrice:gasPrice];
  [callMsg setTo:dataAddress];
  [callMsg setValue:dataAmount];
  
  
  NSData *tokenData = GethGenerateERC20TransferData(dataAddress, dataAmount, &error);
  if (error || !tokenData) {
    reject(@"-1013", @"GethGenerateERC20TransferData", error);
    return;
  }
  [callMsg setData:tokenData];

  int64_t gasLimit = 21000;
  BOOL isLimit = [self.ethClient estimateGas:context msg:callMsg gas:&gasLimit error:&error];
  if (!isLimit || error) {
    reject(@"-1014", @"estimateGas", error);
    return;
  }
  gasLimit *= 2;
  
  
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:tokenData];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1011 userInfo:@{@"info":@"Transaction eth failure"}];
    reject(@"-1011", @"Signature abnormal", error);
    return;
  }
  
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
    reject(@"-1014", @"Transaction token failure", error);
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
    return nil;
  }
  return signedTx;
}


RCT_EXPORT_METHOD(signMessage:(NSString *)from message:(NSString *)message resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
   NSString *hash = [self signMessage:from message:message];
  if (!hash) {
    reject(@"-1020", self.errMsg, self.error);
    return;
  }
  resolver(@[@{@"data":hash}]);
}

RCT_EXPORT_METHOD(signTransaction:(NSString *)passphrase signInfo:(NSDictionary *)signInfo resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
  NSString *hash =  [self sendTransaction:passphrase signInfo:signInfo];
  if (!hash) {
    reject(@"-1020", self.errMsg, self.error);
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
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    self.errMsg = @"keyStore does not exist";
    return nil;
  };
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  
  [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&error];
  if (error) {
    self.error = error;
    self.errMsg = @"Import keyStore file exception";
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
    self.errMsg = @"Import keyStore file exception";
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
  
  NSData *msgData = [message dataUsingEncoding:NSUTF8StringEncoding];
  NSData *hash256 = [OCWeb3Utils keccak256:msgData];
  GethAddress *address = [[GethAddress alloc] initFromHex:from];
  
  NSData *signData = [self.keyStore signHash:address hash:hash256 error:&error];
  if (error) {
    return nil;
  }
  
  NSString *hash = [OCWeb3Utils hex:signData];
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
  if (self.ethClient) {
    self.ethClient = [self getEthClient];
  }
  
  if (!self.account || !self.keyStore) {
    return nil;
  }
  
  BOOL isUnlock = [self.keyStore unlock:self.account passphrase:passphrase error:&error];
  if (!isUnlock || error) {
    self.error = error;
    self.errMsg = @"Failed to unlock wallet";
    return nil;
  }
  
  SignModel *model = [SignModel provinceWithDictionary:signInfo];
  GethAddress *from = [[GethAddress alloc] initFromHex:model.from];
  GethAddress *to = [[GethAddress alloc] initFromHex:model.to];
  GethBigInt *amount = [[GethBigInt alloc] init:[model.value longLongValue]];
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[model.gasPrice longLongValue]];
  NSData *data = [model.data dataUsingEncoding:NSUTF8StringEncoding];
  
  int64_t nonce = 0x0;
  GethContext *context = [[GethContext alloc] init];
  
  int64_t number = -1;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&error];
  if (!isGet || error) {
    self.error = error;
    self.errMsg = @"get Nonce exceptions";
    return nil;
  }
  
  ino64_t gasLimit = [model.gas longLongValue];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1017 userInfo:@{@"info":@"Signature abnormal"}];
    self.error = error;
    self.errMsg = @"signTransaction abnormal";
  }
  
  //  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  //  if (!isSend || error) {
  //    _rejectBlock(@"-1014", @"Transaction signTransaction failure", error);
  //    return;
  //  }
  
  NSString *hash = [[signedTx getHash] getHex];
  return hash;
}



@end
