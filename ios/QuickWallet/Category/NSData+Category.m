//
//  NSData+Category.m
//  QuickWallet
//
//  Created by zhoujian on 2019/1/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "NSData+Category.h"

@implementation NSData (Category)

#pragma mark-----将十六进制数据转换成NSData
+(NSData*)dataWithHexString:(NSString*)str{
  
  if (!str || [str length] == 0) {
    return nil;
  }
  
  NSMutableData *hexData = [[NSMutableData alloc] initWithCapacity:8];
  NSRange range;
  if ([str length] % 2 == 0) {
    range = NSMakeRange(0, 2);
  } else {
    range = NSMakeRange(0, 1);
  }
  for (NSInteger i = range.location; i < [str length]; i += 2) {
    unsigned int anInt;
    NSString *hexCharStr = [str substringWithRange:range];
    NSScanner *scanner = [[NSScanner alloc] initWithString:hexCharStr];
    
    [scanner scanHexInt:&anInt];
    NSData *entity = [[NSData alloc] initWithBytes:&anInt length:1];
    [hexData appendData:entity];
    
    range.location += range.length;
    range.length = 2;
  }
  return hexData;
  
}

#pragma mark - 将传入的NSData类型转换成NSString并返回
+(NSString *)hexStringWithData:(NSData *)data
{
  const unsigned char* dataBuffer = (const unsigned char*)[data bytes];
  if(!dataBuffer){
    return nil;
  }
  NSUInteger dataLength = [data length];
  NSMutableString* hexString = [NSMutableString stringWithCapacity:(dataLength * 2)];
  for(int i = 0; i < dataLength; i++){
    [hexString appendString:[NSString stringWithFormat:@"%02lx", (unsigned long)dataBuffer[i]]];
  }
  NSString* result = [NSString stringWithString:hexString];
  return result;
  
}

//DES加密
+ (NSData *)DESEncrypt:(NSData *)data WithKey:(NSString *)key
{
//  //    char keyPtr[kCCKeySizeAES256+1];
//  //    bzero(keyPtr, sizeof(keyPtr));
//  //
//  //    [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
//
//  const void *keyPtr = (const void *) [[NSData dataWithHexString:key] bytes];
//
//  NSUInteger dataLength = [data length];
//  //    NSLog(@"%ld",dataLength);
//  size_t bufferSize = dataLength + kCCBlockSizeAES128;
//  void *buffer = malloc(bufferSize);
//  size_t numBytesEncrypted = 0;
//
//  CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt, kCCAlgorithmDES,
//                                        kCCOptionPKCS7Padding | kCCOptionECBMode,
//                                        keyPtr, kCCBlockSizeDES,
//                                        NULL,
//                                        [data bytes], dataLength,
//                                        buffer, bufferSize,
//                                        &numBytesEncrypted);
//  if (cryptStatus == kCCSuccess) {
//    return [NSData dataWithBytesNoCopy:buffer length:8];
//  }
//
//  free(buffer);
  return nil;
}
//DES解密
+ (NSData *)DESDecrypt:(NSData *)data WithKey:(NSString *)key
{
//  //    char keyPtr[kCCKeySizeAES256+1];
//  //    bzero(keyPtr, sizeof(keyPtr));
//  //
//  //    [key getCString:keyPtr maxLength:sizeof(keyPtr) encoding:NSUTF8StringEncoding];
//  const void *keyPtr = (const void *) [[NSData dataWithHexString:key] bytes];
//
//  NSUInteger dataLength = [data length];
//
//  size_t bufferSize = dataLength + kCCBlockSizeAES128;
//  void *buffer = malloc(bufferSize);
//
//  size_t numBytesDecrypted = 0;
//  CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt, kCCAlgorithmDES,
//                                        kCCOptionPKCS7Padding | kCCOptionECBMode,
//                                        keyPtr, kCCBlockSizeDES,
//                                        NULL,
//                                        [data bytes], dataLength,
//                                        buffer, bufferSize,
//                                        &numBytesDecrypted);
//
//  if (cryptStatus == kCCSuccess) {
//    return [NSData dataWithBytesNoCopy:buffer length:numBytesDecrypted];
//  }
//
//  free(buffer);
  return nil;
}

+ (NSData *)threeDESDecrypt:(NSData *)data WithKey:(NSString *)key
{
  NSString *key1 = [key substringWithRange:NSMakeRange(0, 16)];
  NSString *key2 = [key substringFromIndex:key.length-16];
  
  NSData *data1 = [self DESDecrypt:data WithKey:key1];
  NSData *data2 = [self DESEncrypt:data1 WithKey:key2];
  NSData *data3 = [self DESDecrypt:data2 WithKey:key1];
  return data3;
  
}


@end
