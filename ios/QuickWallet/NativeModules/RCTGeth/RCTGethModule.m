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


static NSString *keyStoreFileDir  = @"keystore_file_dir";
static NSString *rawurlKey  = @"raw_url_key";

#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]

@interface RCTGethModule()

@property(nonatomic, strong) GethAccount *account;

@property(nonatomic, strong) GethKeyStore *keyStore;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@end

@implementation RCTGethModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(BOOL)isLogin rawurl:(NSString *)rawurl) {
  
  [[NSUserDefaults standardUserDefaults] setObject:rawurl forKey:rawurlKey];

  if (!isLogin) return;
  if (!rawurl || !rawurl.length) return;
  if (self.account && self.ethClient) return;
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
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

RCT_EXPORT_METHOD(isUnlockAccount:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    _resolveBlock(@[@{@"isUnlock":@NO}]);
    return;
  }
  _resolveBlock(@[@{@"isUnlock":@YES}]);
}


RCT_EXPORT_METHOD(unlockAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
  
  NSError *error = nil;
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];

  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1001 userInfo:@{@"info":@"keyStore does not exist"}];
    _rejectBlock(@"-1001", @"keyStore does not exist", error);
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&error];
  if (error) {
    _rejectBlock(@"-1002", @"Import keyStore file exception", error);
    return;
  }
  
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[@{@"address":address}]);
}


RCT_EXPORT_METHOD(randomMnemonic:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSError *error =nil;
  
  NSString *mnemonic = GethCreateRandomMnemonic(&error);
  if (error) {
    _rejectBlock(@"-1003", @"Generate mnemonic word exceptions", error);
    return;
  }
  _resolveBlock(@[@{@"mnemonic":mnemonic}]);
}


RCT_EXPORT_METHOD(importPrivateKey:(NSString *)privateKey passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSError * error = nil;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];

  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *ECDSAKey = [self byteStringToData:privateKey];
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  self.account = [self.keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&error];
  if (error) {
    _rejectBlock(@"-1004", @"Import private key exception", error);
    return;
  }
  
  [self saveKeystorePath:self.account];
  
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[@{@"address":address}]);
}

RCT_EXPORT_METHOD(importMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSError *error = nil;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *privateKey = GethGetPrivateKeyFromMnemonic(mnemonic, &error);
  if (error) {
    _rejectBlock(@"-1005", @"Mnemonic words derive private key exceptions", error);
    return;
  }
  
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  self.account = [self.keyStore importECDSAKey:privateKey passphrase:passphrase error:&error];
  if (error) {
    _rejectBlock(@"-1006", @"Import mnemonic key exception", error);
    return;
  }
  
  [self saveKeystorePath:self.account];
  
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[@{@"address":address}]);
}

RCT_EXPORT_METHOD(exportPrivateKey:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSError *error = nil;
  
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1001 userInfo:@{@"info":@"keyStore does not exist"}];
    _rejectBlock(@"-1001", @"keyStore does not exist", error);
    return;
  }
  
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&error];
  if (error) {
    _rejectBlock(@"-1007", @"Import keyStore file exception", error);
    return;
  }

  NSString *privateKey = [self.keyStore exportECSDAKeyHex:self.account passphrase:passphrase error:&error];
  if (error) {
    _rejectBlock(@"-1008", @"Export private key exception", error);
    return;
  }
  
  _resolveBlock(@[@{@"privateKey":privateKey}]);
}

RCT_EXPORT_METHOD(transferEth:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress value:(NSString *)value gas:(NSString *)gas  resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error = nil;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1008 userInfo:@{@"info":@"Wallet not unlocked"}];
    _rejectBlock(@"-1009", @"Wallet not unlocked", error);
    return;
  }
  
  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&error];
  if (!isGet || error) {
    _rejectBlock(@"-1010", @"get Nonce exceptions", error);
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
    _rejectBlock(@"-1011", @"Signature abnormal", error);
    return;
  }

  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1011 userInfo:@{@"info":@"Transaction eth failure"}];
    _rejectBlock(@"-1012", @"Transaction eth failure", error);
    return;
  }
  NSString *txHash = [[signedTx getHash] getHex];
  NSLog(@"txHash ===> %@", txHash);
  
  _resolveBlock(@[@{@"txHash":txHash}]);
}

RCT_EXPORT_METHOD(transferTokens:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress tokenAddress:(NSString *)tokenAddress value:(NSString *)value gas:(NSString *)gas resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error = nil;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1008 userInfo:@{@"info":@"Wallet not unlocked"}];
    _rejectBlock(@"-1009", @"Wallet not unlocked", error);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"-1010", @"get Nonce exceptions", error);
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
    _rejectBlock(@"-1013", @"GethGenerateERC20TransferData", error);
    return;
  }
  [callMsg setData:tokenData];

  int64_t gasLimit = 21000;
  BOOL isLimit = [self.ethClient estimateGas:context msg:callMsg gas:&gasLimit error:&error];
  if (!isLimit || error) {
    _rejectBlock(@"-1014", @"estimateGas", error);
    return;
  }
  gasLimit *= 2;
  
  
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:tokenData];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1011 userInfo:@{@"info":@"Transaction eth failure"}];
    _rejectBlock(@"-1011", @"Signature abnormal", error);
    return;
  }
  
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&error];
  if (!isSend || error) {
    _rejectBlock(@"-1014", @"Transaction token failure", error);
    return;
  }
  NSString *txHash = [[signedTx getHash] getHex];
  NSLog(@"txHash ===> %@", txHash);
  
  _resolveBlock(@[@{@"txHash":txHash}]);
}


- (GethTransaction *)signTxWithKeyStore:(GethKeyStore *)keyStore Account:(GethAccount *)account passphrase:(NSString *)passphrase transaction:(GethTransaction *)transaction{
  int64_t chainId = 4;
  GethBigInt *chainID = [[GethBigInt alloc] init:chainId];
  NSError *error = nil;
  GethTransaction *signedTx = [keyStore signTxPassphrase:account passphrase:passphrase tx:transaction chainID:chainID error:&error];
  if (error) {
    self.rejectBlock(@"-1011", @"Signature abnormal", error);
    return nil;
  }
  return signedTx;
}


RCT_EXPORT_METHOD(signMessage:(NSString *)passphrase message:(NSString *)message resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error = nil;
  
  if (!self.account || !self.keyStore ) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1009 userInfo:@{@"info":@"Wallet not unlocked"}];
    _rejectBlock(@"-1009", @"Wallet not unlocked", error);
    return;
  }
  NSString *output = [self sha256WithStrig:message];
  NSData *hash = [[[GethHash alloc] initFromHex:output] getBytes];
  
  NSData *signData = [self.keyStore signHashPassphrase:self.account passphrase:passphrase hash:hash error:&error];
  if (error) {
    _rejectBlock(@"-1020", @"signMessage abnormal", error);
    return;
  }
  
  NSString *signHash = [self sha256WithData:signData];
  NSString *data = [[[GethHash alloc] initFromHex:signHash] getHex];
  
  _resolveBlock(@[@{@"data":data}]);
  
}


RCT_EXPORT_METHOD(signTransaction:(NSString *)passphrase signInfo:(NSDictionary *)signInfo resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error = nil;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1009 userInfo:@{@"info":@"Wallet not unlocked"}];
    _rejectBlock(@"-1009", @"Wallet not unlocked", error);
    return;
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
    _rejectBlock(@"-1010", @"get Nonce exceptions", error);
    return;
  }
  
  ino64_t gasLimit = [model.gas longLongValue];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1017 userInfo:@{@"info":@"Signature abnormal"}];
    _rejectBlock(@"-1017", @"signTransaction abnormal", error);
  }
  
  NSString *infoHash = [[signedTx getHash] getHex];
  _resolveBlock(@[@{@"data":infoHash}]);
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

- (NSString *)sha256WithStrig:(NSString *)input {
  NSData *data = [input dataUsingEncoding:NSUTF8StringEncoding];
  return [self sha256WithData:data];
}

- (NSString *)sha256WithData:(NSData *)data {
  unsigned char digest[CC_SHA256_DIGEST_LENGTH];
  CC_SHA256( data.bytes, (CC_LONG)data.length, digest );
  NSMutableString *output = [NSMutableString stringWithCapacity:CC_SHA256_DIGEST_LENGTH * 2];
  for( int i = 0; i < CC_SHA256_DIGEST_LENGTH; i++ ){
    [output appendFormat:@"%02x", digest[i]];
  }
  return output;
}

@end







