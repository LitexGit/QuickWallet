import { StyleSheet, PixelRatio } from 'react-native'
import { isIphoneX, isBeforeAndroid21 } from '../../Lib/Adapter'
import { Colors, Fonts } from '../../Themes/';

const NAVBARHEIGHT = 44;
const PADDINGTOP = isIphoneX() ? 44 : (isBeforeAndroid21?0:20);

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: NAVBARHEIGHT+PADDINGTOP,
    paddingTop:PADDINGTOP,
    backgroundColor:'white',
    borderBottomColor:Colors.separateLineColor,
    borderWidth: 1 / PixelRatio.get()
  },
  content: {
    flex:1,
    width: '100%',
    height: NAVBARHEIGHT,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cancel: {
    padding: 15,
    color: Colors.textColor
  },
  search: {
    flex: 1,
    height:'80%',
    marginLeft: 15,
    borderRadius:22,
    borderColor:Colors.separateLineColor,
    borderWidth: 1/PixelRatio.get(),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor: '#EEEEEE'
  },
  textInput:{
    flex:1,
    fontSize:Fonts.size.small,
    color:Colors.textColor
}
})
