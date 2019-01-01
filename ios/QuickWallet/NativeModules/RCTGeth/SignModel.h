//
//  SignModel.h
//  QuickWallet
//
//  Created by zhoujian on 2019/1/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SignModel : NSObject

@property (nonatomic, strong) NSNumber *type;

@property (nonatomic, strong) NSString *symbol;

@property (nonatomic, strong) NSNumber *decimal;

@property (nonatomic, strong) NSString *tokenAddress;

@property (nonatomic, strong) NSString *fromAddress;

@property (nonatomic, strong) NSString *toAddress;

@property (nonatomic, assign) long long amount;

@property (nonatomic, assign) long long gas;

@property (nonatomic, strong) NSString *msgInfo;

- (instancetype)initWithDictionary:(NSDictionary *)dict;

+ (instancetype)provinceWithDictionary:(NSDictionary *)dict;

@end

NS_ASSUME_NONNULL_END
