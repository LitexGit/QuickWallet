//
//  RCTSignerModule.m
//  QuickWallet
//
//  Created by zhoujian on 2018/12/29.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RCTSignerModule.h"

//#import <Geth/Geth.h>
//#import "RCTGethModule.h"
//#import <RCTConvert+RNSVG.h>

@interface RCTSignerModule()

@property(nonatomic, copy) RCTResponseSenderBlock onSignerCallback;

@end

@implementation RCTSignerModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(onSignerCallback:(RCTResponseSenderBlock)signerCallback){
  self.onSignerCallback = signerCallback;
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSString *info = @"我怎么这么";
    NSDictionary *signInfo = @{@"info":info};
    [self signInfo:signInfo];
  });
}

- (void)signInfo:(NSDictionary *)signInfo{
  if (!_onSignerCallback) return;
  self.onSignerCallback(@[[NSNull null], @[signInfo]]);
}

@end
