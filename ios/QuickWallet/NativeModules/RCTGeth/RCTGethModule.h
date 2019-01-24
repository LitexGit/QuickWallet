//
//  RCTGethModule.h
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


NS_ASSUME_NONNULL_BEGIN

typedef void (^SignerCallBack)(NSString *);

@interface RCTGethModule : NSObject<RCTBridgeModule>

- (void)sendTx:(NSString *)tx signerCallBack:(SignerCallBack)callback;

- (void)signMsg:(NSString *)msg signerCallBack:(SignerCallBack)callback;

@end

NS_ASSUME_NONNULL_END
