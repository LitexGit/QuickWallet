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

#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]
static RCTGethModule *_instance = nil;

@interface RCTGethModule()

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@property(nonatomic, strong) NSString *keydir;




@property(nonatomic, strong) NSString *rawurl;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@end


@implementation RCTGethModule
RCT_EXPORT_MODULE();

+ (instancetype)sharedInstance:(NSString *)rawurl {
  if ((!rawurl || !rawurl.length) && _instance.rawurl) {
    rawurl = _instance.rawurl;
  }
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (_instance == nil) {
      _instance = [[self alloc] init];
      NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
      [FileManager createDirectoryIfNotExists:keydir];
      _instance.keydir = keydir;
      
//      _instance.ethClient = [[GethEthereumClient alloc] init:rawurl];
//      if (rawurl && rawurl.length) {
//        _instance.rawurl = rawurl;
//      }
    }
  });
  return _instance;
}


RCT_EXPORT_METHOD(newAccount:(NSString *)passphrase resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  // passphrase ==> keyStore ==> importKey ==> account ==> address
  // keydir ==> keyStore
  NSString *keydir = [DOCUMENT_PATH stringByAppendingPathComponent:@"keystore"];
  [FileManager removeFileAtPath:keydir];
  [FileManager createDirectoryIfNotExists:keydir];
  
  _resolveBlock = resolver;
  _rejectBlock = reject;
  GethKeyStore *keyStore = [[GethKeyStore alloc] init:keydir scryptN:GethStandardScryptN scryptP:GethStandardScryptP];
  NSError * err = nil;
  GethAccount *account = [keyStore newAccount:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"newAccount", err);
    return;
  }
  NSString *address = [[account getAddress] getHex];
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
  GethAccount *account = [keyStore importECDSAKey:ECDSAKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"import_privateKey_newAccount", err);
    return;
  }
  NSString *address = [[account getAddress] getHex];
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
  GethAccount *account = [keyStore importECDSAKey:privateKey passphrase:passphrase error:&err];
  if (err) {
    _rejectBlock(@"iOS", @"import_privateKey_newAccount", err);
    return;
  }
  NSString *address = [[account getAddress] getHex];
  _resolveBlock(@[address]);
}

-(NSData*)byteStringToData:(NSString *)byteStr{
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


@end
