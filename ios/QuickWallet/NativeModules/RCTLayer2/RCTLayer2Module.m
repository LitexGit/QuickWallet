//
//  RCTLayer2Module.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTLayer2Module.h"
#import <Client/Client.h>

static RCTLayer2Module *_instance = nil;

@interface RCTLayer2Module()

@property (nonatomic, strong) ClientL2 *layer2;

@property(nonatomic, copy) RCTResponseSenderBlock initCallback;

@property(nonatomic, copy) RCTResponseSenderBlock callback;

@end

@implementation RCTLayer2Module

RCT_EXPORT_MODULE();

+ (instancetype)sharedInstance{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (!_instance) {
      _instance = [[self alloc] init];
    }
  });
  return _instance;
}


RCT_EXPORT_METHOD(initL2SDK:(NSString*)cpKey address:(NSString*)address socketUrl:(NSString*)socketUrl initCallBack:(RCTResponseSenderBlock)callback){
  _initCallback = callback;
  _instance.layer2 = nil;
  NSString *dataPath = @".................";
  NSDictionary *initParams = @{@"cpKey":cpKey,
                               @"dataPath": dataPath,
                               @"address":address,
                               @"socketUrl":socketUrl};
  
  self.initCallback(@[@[[NSNull null], initParams]]);
};

RCT_EXPORT_METHOD(call:(NSString*)command body:(NSString*)body callback:(RCTResponseSenderBlock)callBack){
  _callback = callBack;
  NSDictionary *callParams = @{@"command":command,
                               @"body": body};
  self.callback(@[@[[NSNull null], callParams]]);
};

@end
