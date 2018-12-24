//
//  RCTGethModule.m
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTGethModule.h"
#import <Geth/Geth.h>

static RCTGethModule *_instance = nil;

@interface RCTGethModule()

@property(nonatomic, strong) NSString *rawurl;

@property(nonatomic, strong) NSString *keydir;

@property(nonatomic, strong) GethEthereumClient *ethClient;

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

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
      _instance.ethClient = [[GethEthereumClient alloc] init:rawurl];
      
      if (rawurl && rawurl.length) {
        _instance.rawurl = rawurl;
      }
//      NSString *documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
//      NSString *keydir = [documentsPath stringByAppendingPathComponent:@"keystore"];
//      if (![FileManager fileExistsAtPath:keydir]) {
//        [FileManager createDirectoryIfNotExists:keydir];
//      }
//      _instance.keydir = keydir;
    }
  });
  return _instance;
}


@end
