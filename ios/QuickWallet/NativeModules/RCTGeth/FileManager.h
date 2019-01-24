//
//  FileManager.h
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface FileManager : NSObject

/**
 如果目录不存在, 则创建
 
 @param path 路径
 @return YES 创建成功  NO 创建成功
 */
+ (BOOL)createDirectoryIfNotExists:(NSString *)path;

/**
 文件是否存在
 
 @param path 路径
 @return YES 文件存在  NO 文件不存在
 */
+ (BOOL)fileExistsAtPath:(NSString *)path;

/**
 文件大小
 
 @param path 路径
 @return 文件大小
 */
+ (long long)fileSizeAtPath:(NSString *)path;

/**
 删除文件
 
 @param path 删除指定文件
 */
+ (void)removeFileAtPath:(NSString *)path;


/**
 移动文件
 @param sourcePath 源文件路劲
 @param toPath 目标文件路径
 */
+ (void)moveFileWithPath:(NSString *)sourcePath toPath:(NSString *)toPath;

@end

NS_ASSUME_NONNULL_END
