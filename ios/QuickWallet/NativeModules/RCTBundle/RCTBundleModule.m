//
//  RCTBundleModule.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/10.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTBundleModule.h"

@interface RCTBundleModule()

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@end


@implementation RCTBundleModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(readWeb3Provider:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)reject) {
  _resolveBlock = resolver;
  _rejectBlock = reject;
  NSError *error =nil;
  
  NSString *bundlePath = [[NSBundle mainBundle]pathForResource:@"AlphaWalletWeb3Provider"ofType:@"bundle"];
  NSBundle *resourceBundle = [NSBundle bundleWithPath:bundlePath];
  NSString *filepath = [resourceBundle pathForResource:@"AlphaWallet-min" ofType:@"js"];
  NSString *web3Provider = [NSString stringWithContentsOfFile:filepath encoding:NSUTF8StringEncoding error:&error];
  if (error) {
    _rejectBlock(@"-2001", @"readWeb3Provider exceptions", error);
    return;
  }
  _resolveBlock(@[@{@"web3Provider":web3Provider}]);
}


@end
