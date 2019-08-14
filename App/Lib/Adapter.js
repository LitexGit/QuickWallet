import {
  Dimensions,
  Platform
} from 'react-native';

const {width, height} = Dimensions.get('window');
//iphoneX 序列机型的屏幕高宽
//XSM SCREEN_HEIGHTL = 896.000000,SCREEN_WIDTHL = 414.000000  2.1642512077
//XS  SCREEN_HEIGHTL = 812.000000,SCREEN_WIDTHL = 375.000000  2.1653333333
//XR  SCREEN_HEIGHTL = 896.000000,SCREEN_WIDTHL = 414.000000  2.1642512077
//X   SCREEN_HEIGHTL = 812.000000,SCREEN_WIDTHL = 375.000000  2.1653333333

//目前iPhone X序列手机的适配算法：高宽比先转换为字符串，截取前三位，转换为number类型 再乘以100
export function isIphoneX (){
  if (Platform.OS === 'ios' && (Number(((height/width)+'').substr(0,4)) * 100) === 216) return true
  return false
}

export function isBeforeAndroid21 (){
  if (Platform.OS === 'android' && Platform.Version < 21) return true
  return false
}
