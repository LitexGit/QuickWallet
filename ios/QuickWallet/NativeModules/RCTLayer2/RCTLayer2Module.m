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

NSString *const EventMessageReceivedEmitter  = @"MessageReceived";
NSString *const EventDepositEmitter  = @"Deposit";
NSString *const EventWithdrawEmitter  = @"Withdraw";
NSString *const EventForceLeavePNEmitter  = @"ForceLeavePN";


@interface RCTLayer2Module()

@property (nonatomic, assign) BOOL isListening;

@property (nonatomic, strong) ClientL2 *layer2;

@property(nonatomic, copy) RCTPromiseResolveBlock resolveBlock;

@property(nonatomic, copy) RCTPromiseRejectBlock rejectBlock;

@property(nonatomic, copy) RCTResponseSenderBlock startSessionCallBack;

@property(nonatomic, copy) RCTResponseSenderBlock onNewMsgCallBack;

@property(nonatomic, copy) RCTResponseSenderBlock sendMsgCallBack;

@property(nonatomic, copy) RCTResponseSenderBlock eventCallBack;

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

- (NSArray<NSString *> *)supportedEvents {
  return @[EventMessageReceivedEmitter,
           EventDepositEmitter,
           EventWithdrawEmitter,
           EventForceLeavePNEmitter];
}

-(void)startObserving {
  _isListening = YES;
}

-(void)stopObserving {
 _isListening = NO;
}

//sendTxFunc, signMsgFunc
RCT_EXPORT_METHOD(initL2SDK:(NSString *)cpKey address:(NSString *)address socketUrl:(NSString *)socketUrl resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  
  _instance.layer2 = nil;
  if (_instance.layer2) {
    _resolveBlock(@[@{@"isInit":@YES}]);
  } else {
    _resolveBlock(@[@{@"isInit":@NO}]);
  }
}

RCT_EXPORT_METHOD(onWatchEvents:(RCTResponseSenderBlock)callback) {
  _eventCallBack = callback;
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSArray *events = @[@"001", @"002", @"003"];
    self.eventCallBack(@[[NSNull null], events]);
  });
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(10.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    if (self.isListening) {
      NSDictionary *body = @{@"name":@"EventEmitter",
                             @"key001":@"value001"};
      [self sendEventWithName:EventMessageReceivedEmitter body:body];
      [self sendEventWithName:EventDepositEmitter body:body];
      [self sendEventWithName:EventWithdrawEmitter body:body];
      [self sendEventWithName:EventForceLeavePNEmitter body:body];
    }
  });
}


RCT_EXPORT_METHOD(addPN:(NSString *)pnAddresss resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;

  _resolveBlock(@[@{@"isAddPN":@YES}]);
}

RCT_EXPORT_METHOD(deposit:(NSString *)pnAddresss amount:(NSString *)amount resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
//  int amountValue = [amount intValue];
  
  _resolveBlock(@[@{@"isDeposit":@YES}]);
}

RCT_EXPORT_METHOD(withdraw:(NSString *)pnAddresss amount:(NSString *)amount resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
//  int amountValue = [amount intValue];
  

  _resolveBlock(@[@{@"isWithdraw":@YES}]);
}

RCT_EXPORT_METHOD(forceLeavePN:(NSString *)pnAddresss resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;

  
  _resolveBlock(@[@{@"isForceLeavePN":@YES}]);
}

RCT_EXPORT_METHOD(startSession:(RCTResponseSenderBlock)callBack) {
  // getCurrentSession
  _startSessionCallBack = callBack;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSArray *events = @[@{@"start":@"startSession"}];
    self.startSessionCallBack(@[[NSNull null], events]);
  });
}

RCT_EXPORT_METHOD(onNewMsg:(RCTResponseSenderBlock)callBack) {
  // getCurrentSession
  _onNewMsgCallBack = callBack;
  
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSArray *events = @[@{@"onNewMsg":@"onSessionNewMsg"}];
    self.onNewMsgCallBack(@[[NSNull null], events]);
  });
}


RCT_EXPORT_METHOD(sendMsg:(NSString *)msg pnAddress:(NSString *)pnAddress amount:(NSString *)amount callBack:(RCTResponseSenderBlock)callBack) {
  _sendMsgCallBack = callBack;
  // getCurrentSession
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSArray *events = @[@{@"sendMsg":@"onSessionNewMsg"}];
    self.sendMsgCallBack (@[[NSNull null], events]);
  });
}

RCT_EXPORT_METHOD(endSession:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  // getCurrentSession
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  
  _resolveBlock(@[@{@"endSession":@YES}]);
}

RCT_EXPORT_METHOD(queryUserInfo:(NSString *)pnAddress resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;

  NSDictionary *userInfo = @{@"userAddress":@"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                            @"balance": @"1000"};
  _resolveBlock(@[@{@"userInfo":userInfo}]);
}

RCT_EXPORT_METHOD(queryTransaction:(NSString *)pnAddress resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;

  NSDictionary *tx001 = @{@"id": @1,
                       @"from": @"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                       @"to": @"0xf68b24279c7fdee7cb48f07f8cd088373d49a195",
                       @"additionalHash":@"0xf8417f84702fcf8ed0a0a33ece2e78c2f6598799d056f16571bf03ad48d52321",
                       @"nonce": @1,
                          @"amount": @"20000"};
  NSDictionary *tx002 = @{@"id": @2,
                          @"from": @"0x0d0707963952f2fba59dd06f2b425ace40b492fe",
                          @"to": @"0xf68b24279c7fdee7cb48f07f8cd088373d49a195",
                          @"additionalHash":@"0xf8417f84702fcf8ed0a0a33ece2e78c2f6598799d056f16571bf03ad48d52321",
                          @"nonce": @2,
                          @"amount": @"20000"};
  NSArray *txArray = @[tx001, tx002];
                       
  _resolveBlock(@[txArray]);
}

RCT_EXPORT_METHOD(queryPN:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter) {
  _resolveBlock = resolver;
  _rejectBlock = rejecter;
  
  NSDictionary *pn001 = @{@"pnAddress":@"0x833f4fc95ebdb9a9628afb8475d797f2b2df6a486a6cfb3b7a0ac525db972678",
                          @"tokenAddress": @"",
                          @"decimal": @18,
                          @"cpAddress": @"0x6cc5f688a315f3dc28a7781717a9a798a59fda7b",
                          @"cpDeposit": @"10000",
                          @"cpPoolBalance": @"10003",
                          @"userBalance": @"97"};
  NSDictionary *pn002 = @{@"tokenAddress":@"0x1557e20b6d97beff0529dd2e6981f61ba0c6b9b3",
                          @"decimal": @18,
                          @"cpAddress": @"0x16354752c661f2eda90cc3461d5883f031f25b3d",
                          @"cpDeposit": @"20000",
                          @"cpPoolBalance": @"20005",
                          @"userBalance": @"195"};
  NSArray *pnArray = @[pn001, pn002];

  _resolveBlock(@[pnArray]);
}

/**
    delegate
 
 // MessageReceived
 // Deposit
 // Withdraw
 // ForceLeavePN
 */

//  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
//    // 在这里执行长时间的操作
//    // 你可以在任何线程/队列中执行回调函数
//    senderBlock(@[@"watchEvents"]);
//  });















@end
