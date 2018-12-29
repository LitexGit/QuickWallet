//
//  RCTSignerModule.h
//  QuickWallet
//
//  Created by zhoujian on 2018/12/29.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTSignerModule : NSObject<RCTBridgeModule>

- (void)signInfo:(NSString *)signInfo;

@end

NS_ASSUME_NONNULL_END
