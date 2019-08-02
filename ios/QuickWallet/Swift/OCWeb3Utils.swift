//
//  OCWeb3Utils.swift
//  QuickWallet
//
//  Created by zhoujian on 2019/1/12.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

public class OCWeb3Utils:NSObject {
  @objc public static func getFixData(_ data: Data) -> Data?{
    let prefix = "\u{19}Ethereum Signed Message:\n\(data.count)".data(using: .utf8)!
    return prefix;
  }
}

