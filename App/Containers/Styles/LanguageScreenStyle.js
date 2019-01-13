import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Metrics } from '../../Themes/';


export default StyleSheet.create({
    ...ApplicationStyles.screen,
    flatList:{
        flex:1,
        marginTop:Metrics.smallMargin,
        marginHorizontal:Metrics.baseMargin,
    },
    itemContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        height:Metrics.itemHeight,
    },
    titleStyle:{
        color:Colors.textColor,
    },

});
