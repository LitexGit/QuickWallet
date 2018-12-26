//
//  RCTZJWebView.h
//  AppResearch
//
//  Created by zhoujian on 2018/12/14.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTView.h>
#import <React/RCTDefines.h>
#import <WebKit/WebKit.h>
//#import "Layer2.h"
//#import "RealLayer2.h"

NS_ASSUME_NONNULL_BEGIN

@class RCTZJWebView;

@protocol RCTZJWebViewDelegate <NSObject>

- (BOOL)webView:(RCTZJWebView *)webView
shouldStartLoadForRequest:(NSMutableDictionary<NSString *, id> *)request
   withCallback:(RCTDirectEventBlock)callback;

@end

@interface RCTZJWebView : RCTView

//@property (nonatomic, strong) Layer2 *layer2;
//@property (nonatomic, strong) RealLayer2 *realLayer2;

@property (nonatomic, weak) id<RCTZJWebViewDelegate> delegate;
@property (nonatomic, copy) NSDictionary *source;
@property (nonatomic, assign) BOOL messagingEnabled;
@property (nonatomic, copy) NSString *injectedJavaScript;
@property (nonatomic, assign) BOOL scrollEnabled;
@property (nonatomic, assign) CGFloat decelerationRate;
@property (nonatomic, assign) BOOL allowsInlineMediaPlayback;
@property (nonatomic, assign) BOOL bounces;
@property (nonatomic, assign) BOOL mediaPlaybackRequiresUserAction;
#if WEBKIT_IOS_10_APIS_AVAILABLE
@property (nonatomic, assign) WKDataDetectorTypes dataDetectorTypes;
#endif
@property (nonatomic, assign) UIEdgeInsets contentInset;
@property (nonatomic, assign) BOOL automaticallyAdjustContentInsets;


+ (void)setClientAuthenticationCredential:(nullable NSURLCredential*)credential;
- (void)postMessage:(NSString *)message;
- (void)injectJavaScript:(NSString *)script;
- (void)goForward;
- (void)goBack;
- (void)reload;
- (void)stopLoading;

@end

NS_ASSUME_NONNULL_END
