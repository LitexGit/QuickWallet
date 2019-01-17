/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "ReactNativeConfig.h"
#import "iVersion.h"

@interface AppDelegate()

@end

@implementation AppDelegate

+ (void)initialize{
//  [self checkNewVersion];
}

+ (void)checkNewVersion {
  iVersion *versionUtils = [iVersion sharedInstance];
  NSString *updateURL = [NSString stringWithFormat:@"itms-services://?action=download-manifest&url=%@", [ReactNativeConfig envFor:@"IOS_UPDATE_URL"]];
  versionUtils.updateURL = [NSURL URLWithString: updateURL];
  versionUtils.remoteVersionsPlistURL = [ReactNativeConfig envFor:@"IOS_VERSION_PLIST_URL"];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSArray *imageList = @[@"http://foo.com/bar1.png",
                         @"http://foo.com/bar2.png"];
  
  NSDictionary *props = @{@"images" : imageList};

  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"QuickWallet"
                                               initialProperties:props
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

@end
