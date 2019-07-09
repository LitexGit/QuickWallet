import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/';


export default StyleSheet.create({
    overlay:{
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'stretch'
    },
    container: {
        padding:Metrics.doubleBaseMargin,
        backgroundColor:Colors.backgroundColor
    },
    topSection:{

    },
    titleStyle:{
        fontSize:Fonts.size.medium,
        color:Colors.textColor,
        fontWeight:'bold',
        textAlign:'center',
        paddingVertical:Metrics.baseMargin
    },
    direction:{
        flexDirection:'row',
        alignItems:'center'
    },
    separateLine:{
        flex:1,
        height:1 / PixelRatio.get(),
        backgroundColor: Colors.textColor

    },
    bottomSection:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    btnContainer:{
        backgroundColor: Colors.dividingLineColor,
        marginTop: Metrics.baseMargin,
        borderRadius: Metrics.buttonRadius
    },
    btnTitle:{
        textAlign:'center',
        color:Colors.backgroundColor,

        paddingHorizontal:Metrics.baseMargin + 5,
        paddingVertical:Metrics.smallMargin
    },
    addressSection:{

    },
    txSection:{
        borderTopColor: Colors.dividingLineColor,
        borderTopWidth: Metrics.doubleBaseMargin / PixelRatio.get()
    },
    infoItem:{
        paddingVertical:Metrics.smallMargin,
        paddingHorizontal: Metrics.baseMargin,
        borderBottomColor: Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),

        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    itemTitle:{
        fontSize:Fonts.size.medium,
        color:Colors.textColor,
        fontWeight:'bold'
    },
    itemCount:{
        fontSize:Fonts.size.small,
        color:Colors.textColor,
        textAlign:'right'
    },
    itemValue:{
        fontSize:Fonts.size.tiny,
        color:Colors.separateLineColor,
        textAlign:'right'
    },
    dataContent: {
      fontSize:Fonts.size.small,
      color:Colors.textColor,
      textAlign:'left',
      marginVertical: Metrics.smallMargin
    }
});

