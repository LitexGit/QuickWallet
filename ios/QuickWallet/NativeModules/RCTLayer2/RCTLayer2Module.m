//
//  RCTLayer2Module.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTLayer2Module.h"
#import <L2mobile/L2mobile.h>

#define DOCUMENT_PATH   [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]

static RCTLayer2Module *_instance = nil;

@interface RCTLayer2Module()<L2mobileSignHandler, L2mobileCallback>

@property (nonatomic, strong) L2mobileL2 *layer2;

@property(nonatomic, copy) RCTResponseSenderBlock callback;

@end

@implementation RCTLayer2Module

RCT_EXPORT_MODULE();

+ (instancetype)sharedInstance{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    if (!_instance) {
      _instance = [[self alloc] init];
//      _instance.layer2 = [[L2mobileL2 alloc] init];
    }
  });
  return _instance;
}


RCT_EXPORT_METHOD(initL2SDK:(NSString*)cpKey address:(NSString*)address socketUrl:(NSString*)socketUrl initCallBack:(RCTResponseSenderBlock)callback){
  
  NSError *error = nil;
  NSString *dataPath = @".................";
  BOOL isInit = [_instance.layer2 initL2SDK:cpKey dataPath:dataPath address:address socketUrl:socketUrl signHandler:self error:&error];
  if (!isInit || error) {
    callback(@[@[error, [NSNull null]]]);
    return;
  }
  
  NSDictionary *initParams = @{@"cpKey":cpKey,
                               @"dataPath": dataPath,
                               @"address":address,
                               @"socketUrl":socketUrl};
  callback(@[@[[NSNull null], initParams]]);
  
};

RCT_EXPORT_METHOD(call:(NSString*)command body:(NSString*)body callback:(RCTResponseSenderBlock)callback){
  _callback = callback;
  NSError *error = nil;
  BOOL isCall = [_instance.layer2 call:command body:body callback:self error:&error];
  if (!isCall || error) {
    callback(@[@[error, [NSNull null]]]);
    return;
  }
};

#pragma mark --- L2mobileSignHandler ---
- (void)sendTx:(NSString *)tx callback:(id<L2mobileCallback>)callback {
  // SignTX
  NSString *error = @"callback-error-msg";
  NSDictionary *info = @{@"isSend":@YES};
  NSString *json = [self dictToJsonStr:info];
  [callback onResult:error info:json];
  
}

- (void)signMsg:(NSString *)msg callback:(id<L2mobileCallback>)callback {
  // SignTX
  NSString *error = @"callback-error-msg";
  NSDictionary *info = @{@"data":@"0XBKHSJCKSCBSKCSJACNB"};
  NSString *json = [self dictToJsonStr:info];
  [callback onResult:error info:json];
}

#pragma mark --- L2mobileCallback ---
- (void)onResult:(NSString *)err info:(NSString *)info {
  NSError *error = [NSError errorWithDomain:NSCocoaErrorDomain code:-1111 userInfo:@{@"err":err}];
  self.callback(@[@[error, info]]);
}

/**
 *  dict转换成json字符串
 *
 *  @param dict dict
 *  @return json
 */
-(NSString *)dictToJsonStr:(NSDictionary *)dict{
  NSString *jsonString = nil;
  if ([NSJSONSerialization isValidJSONObject:dict]){
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:&error];
    jsonString =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    if (error) {
      NSLog(@"Error:%@" , error);
      return @"";
    }
  }
  return jsonString;
}


@end
