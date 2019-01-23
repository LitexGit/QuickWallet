//
//  RNTLayer2WebViewManager.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/9.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNTLayer2WebViewManager.h"
#import "RNTLayer2WebView.h"

@implementation RNTLayer2WebViewManager

RCT_EXPORT_MODULE()

- (UIView *)view{
  return [[RNTLayer2WebView alloc] init];
}

@end
