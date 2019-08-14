import { StyleSheet, PixelRatio } from 'react-native'
import { Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    borderRadius:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor:Colors.separateLineColor,
    borderWidth: 1/PixelRatio.get()
  },
  leftSection:{
    flex: 1,
    marginHorizontal: 15,
    justifyContent:'center'
  },
  placeholder: {
    fontSize:Fonts.size.small,
    color:Colors.textColor
  },
  scanner: {
    marginRight: 15
  }
})
