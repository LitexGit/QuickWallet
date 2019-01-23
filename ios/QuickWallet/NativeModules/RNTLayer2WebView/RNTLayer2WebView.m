//
//  RNTLayer2WebView.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNTLayer2WebView.h"

@implementation RNTLayer2WebView

- (instancetype)initWithFrame:(CGRect)frame{
  if (self = [super initWithFrame:frame]) {
    [self addSubview];
  }
  return self;
}

- (void)addSubview{
  UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 100, 100)];
  view.backgroundColor = [UIColor redColor];
  [self addSubview:view];
}


@end
