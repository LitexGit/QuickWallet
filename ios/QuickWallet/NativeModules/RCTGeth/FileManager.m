//
//  FileManager.m
//  QuickWallet
//
//  Created by zhoujian on 2018/12/24.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "FileManager.h"

@implementation FileManager
/**
 如果目录不存在, 则创建
 
 @param path 路径
 @return YES 创建成功  NO 创建成功
 */
+ (BOOL)createDirectoryIfNotExists:(NSString *)path{
  NSFileManager *manager = [NSFileManager defaultManager];
  if (![manager fileExistsAtPath:path]) {
    NSError *error;
    [manager createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error];
    if (error) return NO;
  }
  return YES;
}

/**
 文件是否存在
 
 @param path 路径
 @return YES 文件存在  NO 文件不存在
 */
+ (BOOL)fileExistsAtPath:(NSString *)path{
  NSFileManager *manager = [NSFileManager defaultManager];
  return [manager fileExistsAtPath:path];
}

/**
 文件大小
 
 @param path 路径
 @return 文件大小
 */
+ (long long)fileSizeAtPath:(NSString *)path{
  
  if (![self fileExistsAtPath:path]) return 0;
  
  NSFileManager *manager = [NSFileManager defaultManager];
  NSDictionary *fileInfoDic = [manager attributesOfItemAtPath:path error:nil];
  return  [fileInfoDic[NSFileSize] longLongValue];
}

/**
 删除文件
 
 @param path 删除指定文件
 */
+ (void)removeFileAtPath:(NSString *)path{
  if (![self fileExistsAtPath:path]) return;
  NSFileManager *manager = [NSFileManager defaultManager];
  [manager removeItemAtPath:path error:nil];
}


/**
 移动文件
 
 @param sourcePath 源文件路劲
 @param toPath 目标文件路径
 */
+ (void)moveFileWithPath:(NSString *)sourcePath toPath:(NSString *)toPath{
  if (![self fileExistsAtPath:sourcePath]) return;
  NSFileManager *manager = [NSFileManager defaultManager];
  [manager moveItemAtPath:sourcePath toPath:toPath error:nil];
}

@end
