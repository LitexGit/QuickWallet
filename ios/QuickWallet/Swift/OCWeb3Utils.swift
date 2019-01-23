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
}

