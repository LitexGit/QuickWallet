import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles } from '../../Themes/';
import { Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  sectionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor:'white'
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: Colors.separateLineColor,
    borderBottomWidth: 0.5 / PixelRatio.get(),
    backgroundColor:'white'
  },
  itemIndex: {
    paddingRight: 8,
    color: Colors.textColor
  },
  history: {
    fontSize:Fonts.size.small
  }
})
