//
//  OCWeb3Utils.swift
//  QuickWallet
//
//  Created by zhoujian on 2019/1/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import Web3swift

public class OCWeb3Utils:NSObject {
  @objc public static func keccak256(_ data: Data) -> Data?{
    return Web3Utils.keccak256(_:data);
  }
  
  @objc public static func hex(_ data: Data) -> String?{
    return "0x" + data.toHexString();
  }
  
  @objc public static func getFixData(_ data: Data) -> Data?{
    let prefix = "\u{19}Ethereum Signed Message:\n\(data.count)".data(using: .utf8)!
    return prefix;
  }
  
  @objc public static func getConfigurableData(_ data: Data) -> Data?{
    var byte = data;
    byte[64] += 27;
    return byte;
  }
  
  @objc public static func hexToData(_ hex: String) -> Data?{
    return Web3Utils.hexToData(hex);
  }
}

