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

static NSString *keyStoreFileDir  = @"keystore_file_dir";
static NSString *rawurlKey  = @"raw_url_key";



#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]

@interface RCTGethModule()
@property(nonatomic, strong) NSString *rawurl;

@property(nonatomic, strong) GethAccount *account;

@property(nonatomic, strong) GethKeyStore *keyStore;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@end


@implementation RCTGethModule
RCT_EXPORT_MODULE();

// 初始化客户端
RCT_EXPORT_METHOD(init:(BOOL)isLogin rawurl:(NSString *)rawurl passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  [[NSUserDefaults standardUserDefaults] setObject:rawurl forKey:rawurlKey];
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  if (!isLogin) return;
  if (!rawurl || !rawurl.length) return;
  if (!passphrase || !passphrase.length) return;
  
  if (self.account && self.ethClient) return;
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
  
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    // TODO  异常流程 登录状态不存在 keystore
    _rejectBlock(@"iOS", @"keydir_isExists", nil);
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  NSError *err = nil;
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
  if (err) {
    // TODO  异常流程 keyStore 导入异常
    _rejectBlock(@"iOS", @"importKey_importKey", err);
    return;
  }
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[address]);
}


RCT_EXPORT_METHOD(newAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
  _resolveBlock(@[@YES]);
  
//  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
//  [FileManager removeFileAtPath:keydir];
//  [FileManager createDirectoryIfNotExists:keydir];
//
//  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
//  NSLog(@"keyStore => %@", self.keyStore);
//  // 创建钱包生成 keyStore
//  NSError * err = nil;
//  self.account = [keyStore newAccount:passphrase error:&err];
//  if (err) {
//    _rejectBlock(@"iOS", @"newAccount", err);
//    return;
//  }
//  [self saveKeystorePath:self.account];
//  NSString *address = [[self.account getAddress] getHex];
//  NSLog(@"newAccount address ====> %@",address);
//  _resolveBlock(@[address]);
}

RCT_EXPORT_METHOD(randomMnemonic:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error =nil;
  NSString *mnemonic = GethCreateRandomMnemonic(&error);
  if (error) {
    _rejectBlock(@"iOS", @"randomMnemonic", error);
    return;
  }
  _resolveBlock(@[mnemonic]);
}



RCT_EXPORT_METHOD(importPrivateKey:(NSString *)privateKey passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];

  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *ECDSAKey = [self byteStringToData:privateKey];
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [self.keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"import_privateKey_newAccount", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
  NSLog(@"importPrivateKey address ====> %@",address);
  _resolveBlock(@[address]);
}

RCT_EXPORT_METHOD(importMnemonic:(NSString *)mnemonic passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *rawurl = [[NSUserDefaults standardUserDefaults] objectForKey:rawurlKey];
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSError *keyErr = nil;
  NSData *privateKey = GethGetPrivateKeyFromMnemonic(mnemonic, &keyErr);
  if (keyErr) {
    _rejectBlock(@"iOS", @"mnemonic_privateKey", keyErr);
    return;
  }
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [self.keyStore importECDSAKey:privateKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"import_privateKey_newAccount", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
  NSLog(@"importMnemonic address ====> %@",address);
  _resolveBlock(@[address]);
}

///**
// * ExportECSDAKey exports as a ECSDA key, encrypted with newPassphrase.
// */
//- (NSData*)exportECSDAKey:(GethAccount*)account passphrase:(NSString*)passphrase error:(NSError**)error;
///**
// * ExportECSDAKeyHex exports as a ECSDA key, encrypted with newPassphrase.
// */
//- (NSString*)exportECSDAKeyHex:(GethAccount*)account passphrase:(NSString*)passphrase error:(NSError**)error;

RCT_EXPORT_METHOD(exportPrivateKey:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    // TODO  异常流程 登录状态不存在 keystore
    _rejectBlock(@"iOS", @"keydir_isExists", nil);
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  NSError *err = nil;
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
  if (err) {
    // TODO  异常流程 keyStore 导入异常
    _rejectBlock(@"iOS", @"importKey_importKey", err);
    return;
  }
  NSError *exportErr = nil;
  NSString *privateKey = [self.keyStore exportECSDAKeyHex:self.account passphrase:passphrase error:&exportErr];
  if (exportErr) {
    // TODO  异常流程 keyStore 导入异常
    _rejectBlock(@"iOS", @"export_privateKey", exportErr);
    return;
  }
  _resolveBlock(@[privateKey]);
}

RCT_EXPORT_METHOD(transferEth:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress value:(nonnull NSNumber *)value gas:(nonnull NSNumber *)gas  resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"iOS", @"getNonceAt", nonceErr);
    return;
  }

  GethAddress *to = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:[value intValue]];
  ino64_t gasLimit = 21000;
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas intValue]];;
  
  NSData *data = [NSData data];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    _rejectBlock(@"iOS", @"signTxWithKeyStore", nil);
  }
  
  NSError *sendErr = nil;
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&sendErr];
  if (!isSend || sendErr) {
    _rejectBlock(@"iOS", @"sendTransaction", sendErr);
    return;
  }
  _resolveBlock(@[@YES]);
}

RCT_EXPORT_METHOD(transferTokens:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress tokenAddress:(NSString *)tokenAddress value:(int64_t)value resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  GethContext *context = [[GethContext alloc] initWithRef:@"transferTokens"];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"iOS", @"getNonceAt", nonceErr);
    return;
  }
  
  GethAddress *to = [[GethAddress alloc] initFromHex:tokenAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:0];
  NSError *gasErr = nil;
  GethBigInt *gasPrice = [self.ethClient suggestGasPrice:context error:&gasErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"iOS", @"suggestGasPrice", gasErr);
    return;
  }
  
  GethCallMsg *callMsg = [[GethCallMsg alloc] init];
  [callMsg setFrom:from];
  [callMsg setGasPrice:gasPrice];
  [callMsg setTo:[[GethAddress alloc] initFromHex:toAddress]];
  [callMsg setValue:[[GethBigInt alloc] init:value]];
  
  NSError *limitErr = nil;
  int64_t gasLimit = 21000;
  BOOL isLimit = [self.ethClient estimateGas:context msg:callMsg gas:&gasLimit error:&limitErr];
  if (!isLimit || limitErr) {
    _rejectBlock(@"iOS", @"estimateGas", limitErr);
    return;
  }
  
  NSData *data = [NSData data];
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:data];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    _rejectBlock(@"iOS", @"signTxWithKeyStore", nil);
  }
  
  NSError *sendErr = nil;
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&sendErr];
  if (!isSend || sendErr) {
    _rejectBlock(@"iOS", @"sendTransaction", sendErr);
    return;
  }
  _resolveBlock(@[@YES]);
}











- (GethTransaction *)signTxWithKeyStore:(GethKeyStore *)keyStore Account:(GethAccount *)account passphrase:(NSString *)passphrase transaction:(GethTransaction *)transaction{
  int64_t chainId = 4;
  GethBigInt *chainID = [[GethBigInt alloc] init:chainId];
  NSError *err = nil;
  GethTransaction *signedTx = [keyStore signTxPassphrase:account passphrase:passphrase tx:transaction chainID:chainID error:&err];
  if (err) {
    return nil;
  }
  return signedTx;
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

@end
