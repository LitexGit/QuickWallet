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

@property (nonatomic, strong) NSString *chainType;

@property (nonatomic, strong) NSString *data;

@property (nonatomic, strong) NSString *from;

@property (nonatomic, strong) NSString *gas;

@property (nonatomic, strong) NSString *gasPrice;

@property (nonatomic, strong) NSString *to;

@property (nonatomic, strong) NSString *value;

- (instancetype)initWithDictionary:(NSDictionary *)dict;

+ (instancetype)provinceWithDictionary:(NSDictionary *)dict;

@end

NS_ASSUME_NONNULL_END
