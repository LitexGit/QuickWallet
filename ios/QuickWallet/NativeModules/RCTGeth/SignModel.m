//
//  SignModel.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/1.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "SignModel.h"

@implementation SignModel

- (instancetype)initWithDictionary:(NSDictionary *)dict{
  if (self = [super init]) {
    [self setValuesForKeysWithDictionary:dict];
  }
  return self;
}

+ (instancetype)provinceWithDictionary:(NSDictionary *)dict{
  return [[self alloc] initWithDictionary:dict];
}

- (void)setValue:(id)value forUndefinedKey:(NSString *)key{
}

@end
