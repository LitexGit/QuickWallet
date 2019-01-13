//
//  RCTLayer2Module.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RCTLayer2Module.h"

@interface RCTLayer2Module()

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@end

@implementation RCTLayer2Module

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initLayer2) {
  NSLog(@"init ===> init");
  NSLog(@"init ===> init");
  NSLog(@"init ===> init");
}



@end
