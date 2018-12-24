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


#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]

@interface RCTGethModule()

@property(nonatomic, strong) GethAccount *account;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@end


@implementation RCTGethModule
RCT_EXPORT_MODULE();

// 初始化客户端
RCT_EXPORT_METHOD(init:(BOOL)isLogin rawurl:(NSString *)rawurl passphrase:(NSString *)passphrase) {
  if (!isLogin) return;
  if (!rawurl || !rawurl.length) return;
  if (!passphrase || !passphrase.length) return;
  
  if (self.account && self.ethClient) return;
  NSString *keyTemp = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystoreTemp"];
  [FileManager createDirectoryIfNotExists:keyTemp];
  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keyTemp scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  
  NSString *keydir = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  BOOL isExists = [FileManager fileExistsAtPath:keydir];
  if (!isExists) {
    // TODO  异常流程 登录状态不存在 keystore
//    UTC--2018-12-24T10-12-35.102375000Z--b5538753f2641a83409d2786790b42ac857c5340
//    UTC--2018-12-24T10-12-35.102375000Z--b5538753f2641a83409d2786790b42ac857c5340
    return;
  }
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keydir];
  NSError *err = nil;
  self.account = [keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
  if (err) {
    // TODO  异常流程 keyStore 导入异常
    return;
  }
  NSString *address = [[self.account getAddress] getHex];
  NSLog(@"init address ====> %@",address);
  self.ethClient = [[GethEthereumClient alloc] init:rawurl];
}


RCT_EXPORT_METHOD(newAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [keyStore newAccount:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"newAccount", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
  NSLog(@"newAccount address ====> %@",address);
  _resolveBlock(@[address]);
  
}

RCT_EXPORT_METHOD(importPrivateKey:(NSString *)privateKey passphrase:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  
  _resolveBlock = resolver;
  _rejectBlock = reject;

  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSData *ECDSAKey = [self byteStringToData:privateKey];
  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&err];
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
  
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  NSError *keyErr = nil;
  NSData *privateKey = GethGetPrivateKeyFromMnemonic(mnemonic, &keyErr);
  if (keyErr) {
    _rejectBlock(@"iOS", @"mnemonic_privateKey", keyErr);
    return;
  }
  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  self.account = [keyStore importECDSAKey:privateKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"import_privateKey_newAccount", err);
    return;
  }
  [self saveKeystorePath:self.account];
  NSString *address = [[self.account getAddress] getHex];
  NSLog(@"importMnemonic address ====> %@",address);
  _resolveBlock(@[address]);
}

RCT_EXPORT_METHOD(exportPrivateKey:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSString *keyPath = [[NSUserDefaults standardUserDefaults] objectForKey:keyStoreFileDir];
  NSData *data = [[NSFileManager defaultManager] contentsAtPath:keyPath];
  if (!data) {
    _rejectBlock(@"iOS", @"keyStore_data", nil);
    return;
  }
  
  NSString *keyStoreJson = [self dataToJson:data];
  NSLog(@"keystoreJson==> %@",keyStoreJson);
  NSError * jsonErr = nil;
  if (!keyStoreJson) {
    _rejectBlock(@"iOS", @"keyStore_toJson", jsonErr);
    return;
  }
  _resolveBlock(@[keyStoreJson]);
  
  
//  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
//  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
//  NSError *err = nil;
//  self.account = [keyStore importKey:data passphrase:passphrase newPassphrase:passphrase error:&err];
//  if (err) {
//    _rejectBlock(@"iOS", @"importKey", err);
//    return;
//  }
//
//  NSError *exportErr = nil;
//  NSData *keyData = [keyStore exportKey:self.account passphrase:passphrase newPassphrase:passphrase error:&exportErr];
//  if (exportErr) {
//    _rejectBlock(@"iOS", @"exportKey", err);
//    return;
//  }
//  NSString *keyStoreJson = [self dataToJson:keyData];
//    if (!keyStoreJson) {
//      _rejectBlock(@"iOS", @"keyStore_toJson", nil);
//      return;
//    }
//    _resolveBlock(@[keyStoreJson]);
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
