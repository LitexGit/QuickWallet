import { StyleSheet } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    scrollView:{
        flex:1,
    },
    bottomSection:{
        marginBottom:Metrics.bottomSpace + Metrics.baseMargin,
        height:Metrics.bottonBtnHeight,
    },
    titleText:{
        color:Colors.darkColor,
        fontWeight:'800',
    },
    // balance
    balanceText:{
        color:Colors.textColor,
        fontWeight:'600',
        fontSize:Fonts.size.small,
    },
    bananceSection:{
        paddingHorizontal:Metrics.doubleBaseMargin,
        borderTopColor:Colors.dividingLineColor,
        borderTopWidth:Metrics.baseMargin,
    },
    bananceTopView:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:Metrics.smallMargin,
        alignItems:'center',
    },
    balanceInput:{
        paddingVertical:Metrics.smallMargin,
        fontSize:Fonts.size.input,
        color: Colors.textColor,
        flex:1,
    },
    // address
    addressSection:{
        paddingHorizontal:Metrics.doubleBaseMargin,
        borderTopColor:Colors.dividingLineColor,
        borderTopWidth:Metrics.baseMargin,
    },
    addressInput:{
        paddingVertical:Metrics.smallMargin,
        fontSize:Fonts.size.medium,
        paddingBottom:Metrics.doubleBaseMargin,
        color: Colors.textColor,
    },
    // note
    noteSection:{
        flexDirection:'row',
    },
    noteInput:{
        flex:1,
        paddingBottom:Metrics.baseMargin,
        marginLeft:Metrics.smallMargin,
        fontSize:Fonts.size.medium,
        color: Colors.textColor,
    },
    gaseSection:{
        paddingHorizontal:Metrics.baseMargin,
        paddingVertical:Metrics.section,
        borderTopColor:Colors.dividingLineColor,
        borderTopWidth:Metrics.baseMargin,
        borderBottomColor:Colors.dividingLineColor,
        borderBottomWidth:Metrics.baseMargin,
    },
    sliderView:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:Metrics.doubleBaseMargin,
    },
    slider:{
        flex:1,
        marginLeft:Metrics.section,
    },
    gasText:{
        alignSelf:'center',
        textAlign:'center',
    }
});
