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

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@property(nonatomic, copy) RCTResponseSenderBlock senderBlock;

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


RCT_EXPORT_METHOD(initL2SDK:(NSString *)address  socketUrl:(NSString *)socketUrl) {
  NSLog(@"Client Call sendTxFunc signMsgFunc");
  
  NSLog(@"Client Call Native(Android || iOS) sign ===> ???");
  _instance.layer2 = nil;
}

RCT_EXPORT_METHOD(watchEvents:(RCTResponseSenderBlock)senderBlock) {
  _instance.senderBlock = senderBlock;
}


RCT_EXPORT_METHOD(addPN:(NSString *)pnAddresss resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"在⽤用户端添加对payment contract的地址");
  _resolveBlock(@[@{@"isAddPN":@YES}]);
}

RCT_EXPORT_METHOD(deposit:(NSString *)pnAddresss amount:(NSString *)amount resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  int amountValue = [amount intValue];
  
  NSLog(@"用户往payment contract充值 amount:%d", amountValue);
  _resolveBlock(@[@{@"isDeposit":@YES}]);
}

RCT_EXPORT_METHOD(withdraw:(NSString *)pnAddresss amount:(NSString *)amount resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  int amountValue = [amount intValue];
  
  NSLog(@"用户从payment contract中​提现 amount:%d", amountValue);
  _resolveBlock(@[@{@"isWithdraw":@YES}]);
}

RCT_EXPORT_METHOD(forceLeavePN:(NSString *)pnAddresss resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"forceLeavePN pnAddresss:%@", pnAddresss);
  _resolveBlock(@[@{@"isForceLeavePN":@YES}]);
}

RCT_EXPORT_METHOD(sendMsg:(NSString *)msg pnAddress:(NSString *)pnAddress amount:(NSString *)amount resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"sendMsg \n msg:%@ \n pnAddress:%@ \n amount:%@", msg, pnAddress, amount);
  _resolveBlock(@[@{@"isSendMsg":@YES}]);
}

RCT_EXPORT_METHOD(queryUserInfo:(NSString *)pnAddress resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"queryUserInfo \n pnAddress:%@", pnAddress);
  _resolveBlock(@[@{@"userAddress":@"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                    @"balance": @"1000"}
                  ]);
}

RCT_EXPORT_METHOD(queryTransaction:(NSString *)pnAddress resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"queryTransaction \n pnAddress:%@", pnAddress);
  _resolveBlock(@[@{
                    @"id": @1,
                    @"from": @"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                    @"to": @"0xf68b24279c7fdee7cb48f07f8cd088373d49a195",
                    @"additionalHash":@"0xf8417f84702fcf8ed0a0a33ece2e78c2f6598799d056f16571bf03ad48d52321",
                    @"nonce": @1,
                    @"amount": @"20000"
                    },
                  @{
                    @"id": @2,
                    @"from": @"0xf68b24279c7fdee7cb48f07f8cd088373d49a195",
                    @"to": @"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                    @"additionalHash":@"0xfacff981bbfe7a884bafcbfb03207bc1f34015a0a7a65234fcafc35d9e3bc91f",
                    @"nonce": @2,
                    @"amount": @"30000"
                    }
                  ]);
}

RCT_EXPORT_METHOD(queryPN:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  NSLog(@"queryPN");
  _resolveBlock(@[@{
                    @"pnAddress":@"0x833f4fc95ebdb9a9628afb8475d797f2b2df6a486a6cfb3b7a0ac525db972678",
                    @"tokenAddress": @"",
                    @"decimal": @18,
                    @"cpAddress": @"0x6cc5f688a315f3dc28a7781717a9a798a59fda7b",
                    @"cpDeposit": @"10000",
                    @"cpPoolBalance": @"10003",
                    @"userBalance": @"97"},
                  @{
                    @"tokenAddress":@"0x1557e20b6d97beff0529dd2e6981f61ba0c6b9b3",
                    @"decimal": @18,
                    @"cpAddress": @"0x16354752c661f2eda90cc3461d5883f031f25b3d",
                    @"cpDeposit": @"20000",
                    @"cpPoolBalance": @"20005",
                    @"userBalance": @"195"}
                  ]);
  
}

/**
    socket.IO-objc
 
 // MessageReceived
 // Deposit
 // Withdraw
 // ForceLeavePN
 */














@end
