//
//  NSData+Category.h
//  QuickWallet
//
//  Created by zhoujian on 2019/1/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData (Category)

+(NSData*)dataWithHexString:(NSString*)str;

+(NSString*)hexStringWithData:(NSData*)data;

+ (NSData *)DESEncrypt:(NSData *)data WithKey:(NSString *)key;

+ (NSData *)DESDecrypt:(NSData *)data WithKey:(NSString *)key;

+ (NSData *)threeDESDecrypt:(NSData *)data WithKey:(NSString *)key;

@end

NS_ASSUME_NONNULL_END
