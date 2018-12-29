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
    _resolveBlock(@[@NO]);
    return;
  }
  _resolveBlock(@[@YES]);
  return;
}


RCT_EXPORT_METHOD(unlockAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;

  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];

  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    _rejectBlock(@"iOS", @"keyStore does not exist", nil);
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  NSError *err = nil;
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"Import keyStore file exception", err);
    return;
  }
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[address]);
}


RCT_EXPORT_METHOD(randomMnemonic:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error =nil;
  NSString *mnemonic = GethCreateRandomMnemonic(&error);
  if (error) {
    _rejectBlock(@"iOS", @"Generate mnemonic word exceptions", error);
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
    _rejectBlock(@"iOS", @"Import private key exception", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
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
    _rejectBlock(@"iOS", @"Mnemonic words derive private key exceptions", keyErr);
    return;
  }
  self.keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [self.keyStore importECDSAKey:privateKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"Import private key exception", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
  _resolveBlock(@[address]);
}

RCT_EXPORT_METHOD(exportPrivateKey:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  self.keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    _rejectBlock(@"iOS", @"keyStore does not exist", nil);
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  NSError *err = nil;
  self.account = [self.keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
  if (err) {
    // TODO  异常流程 keyStore 导入异常
    _rejectBlock(@"iOS", @"Import keyStore file exception", err);
    return;
  }
  NSError *exportErr = nil;
  NSString *privateKey = [self.keyStore exportECSDAKeyHex:self.account passphrase:passphrase error:&exportErr];
  if (exportErr) {
    // TODO  异常流程 keyStore 导入异常
    _rejectBlock(@"iOS", @"Export private key exception", exportErr);
    return;
  }
  _resolveBlock(@[privateKey]);
}

RCT_EXPORT_METHOD(transferEth:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress value:(nonnull NSNumber *)value gas:(nonnull NSNumber *)gas  resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    _rejectBlock(@"iOS", @"Wallet not unlocked", nil);
    return;
  }
  
  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"iOS", @"get Nonce exceptions", nonceErr);
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
    _rejectBlock(@"iOS", @"Signature abnormal", nil);
    return;
  }
  
  NSError *sendErr = nil;
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&sendErr];
  if (!isSend || sendErr) {
    _rejectBlock(@"iOS", @"Transaction eth failure", sendErr);
    return;
  }
  _resolveBlock(@[@YES]);
}

RCT_EXPORT_METHOD(transferTokens:(NSString *)passphrase fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress tokenAddress:(NSString *)tokenAddress value:(nonnull NSNumber *)value gas:(nonnull NSNumber *)gas resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  if (!self.account || !self.keyStore || !self.ethClient) {
    _rejectBlock(@"iOS", @"Wallet not unlocked", nil);
    return;
  }

  GethContext *context = [[GethContext alloc] init];
  GethAddress *from = [[GethAddress alloc] initFromHex:fromAddress];
  int64_t number = -1;
  int64_t nonce = 0x0;
  NSError *nonceErr = nil;
  BOOL isGet = [self.ethClient getNonceAt:context account:from number:number nonce:&nonce  error:&nonceErr];
  if (!isGet || nonceErr) {
    _rejectBlock(@"iOS", @"get Nonce exceptions", nonceErr);
    return;
  }
  
  GethAddress *to = [[GethAddress alloc] initFromHex:tokenAddress];
  GethBigInt *amount = [[GethBigInt alloc] init:0];
  GethBigInt *gasPrice = [[GethBigInt alloc] init:[gas intValue]];;
  
  GethCallMsg *callMsg = [[GethCallMsg alloc] init];
  GethAddress *dataAddress = [[GethAddress alloc] initFromHex:toAddress];
  GethBigInt *dataAmount = [[GethBigInt alloc] init:[value intValue]];
  
  [callMsg setFrom:from];
  [callMsg setGasPrice:gasPrice];
  [callMsg setTo:dataAddress];
  [callMsg setValue:dataAmount];
  
  
  NSError *error = nil;
  NSData *tokenData = GethGenerateERC20TransferData(dataAddress, dataAmount, &error);
  if (error || !tokenData) {
    _rejectBlock(@"iOS", @"GethGenerateERC20TransferData", error);
    return;
  }
  [callMsg setData:tokenData];

//  NSError *limitErr = nil;
  int64_t gasLimit = 21000;
//  BOOL isLimit = [self.ethClient estimateGas:context msg:callMsg gas:&gasLimit error:&limitErr];
//  if (!isLimit || limitErr) {
//    _rejectBlock(@"iOS", @"estimateGas", limitErr);
//    return;
//  }
  
  GethTransaction *transaction = [[GethTransaction alloc] init:nonce to:to amount:amount gasLimit:gasLimit gasPrice:gasPrice data:tokenData];
  
  GethTransaction *signedTx = [self signTxWithKeyStore:self.keyStore Account:self.account passphrase:passphrase transaction:transaction];
  if (!signedTx) {
    _rejectBlock(@"iOS", @"Signature abnormal", nil);
  }
  
  NSError *sendErr = nil;
  BOOL isSend = [self.ethClient sendTransaction:context tx:signedTx error:&sendErr];
  if (!isSend || sendErr) {
    _rejectBlock(@"iOS", @"Transaction token failure", sendErr);
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
    self.rejectBlock(@"iOS", @"Signature abnormal", err);
    return nil;
  }
  return signedTx;
}

RCT_EXPORT_METHOD(signHash:(NSString*)passphrase hash:(NSData*)hash resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject){
    _resolveBlock = resolver;
    _rejectBlock = reject;
  
    if (!self.account || !self.keyStore || !self.ethClient) {
      _rejectBlock(@"iOS", @"Wallet not unlocked", nil);
      return;
    }
    NSError *error = nil;
    NSData *signInfo = [self.keyStore signHashPassphrase:self.account passphrase:passphrase hash:hash error:&error];
    if (error) {
      _rejectBlock(@"iOS", @"Signature info abnormal", error);
      return;
    }
   _resolveBlock(@[signInfo]);
}


//- (NSData*)signHashPassphrase:(GethAccount*)account passphrase:(NSString*)passphrase hash:(NSData*)hash error:(NSError**)error;

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







