import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/';

export default StyleSheet.create({
    overlay:{
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'stretch',
    },
    container: {
        padding:Metrics.doubleBaseMargin,
        backgroundColor:Colors.backgroundColor,
    },
    topSection:{

    },
    msgSection:{
        borderTopColor: Colors.dividingLineColor,
        borderTopWidth: Metrics.doubleBaseMargin / PixelRatio.get(),
        marginTop: Metrics.baseMargin,
        maxHeight:150,
    },
    addressSection:{

    },
    titleStyle:{
        fontSize:Fonts.size.medium,
        color:Colors.textColor,
        fontWeight:'bold',
        textAlign:'center',
        paddingVertical:Metrics.baseMargin,
    },
    bottomSection:{
        flexDirection:'row',
        justifyContent:'space-around',
    },
    btnContainer:{
        backgroundColor: Colors.dividingLineColor,
        marginTop: Metrics.baseMargin,
        borderRadius: Metrics.buttonRadius,
    },
    btnTitle:{
        textAlign:'center',
        color:Colors.backgroundColor,
        paddingHorizontal:Metrics.baseMargin + 5,
        paddingVertical:Metrics.smallMargin,
    },
    signMsg:{
        textAlign:'center',
        fontSize:Fonts.size.medium,
        color:Colors.darkColor,
    },
    message:{
        fontSize:Fonts.size.small,
        color:Colors.textColor,
        textAlign:'left',
        padding:Metrics.doubleBaseMargin,
    }
});
