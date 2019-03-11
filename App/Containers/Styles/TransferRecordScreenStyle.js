import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    emptycontainer:{
        marginTop:Metrics.screenHeight * 0.25,
    },
    // header
    headerContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:Metrics.section,
        marginHorizontal:Metrics.smallMargin,
        borderBottomColor:Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    leftSection:{
        flexDirection:'row',
        alignItems:'center',
    },
    symbolImg:{
        width:Metrics.icons.medium,
        height:Metrics.icons.medium,
    },
    titleStyle:{
        marginLeft:Metrics.baseMargin,
        color:Colors.darkColor,
    },
    countStyle:{

    },
    assetsStyle:{
        fontSize:Fonts.size.small,
        color:'#666666',
    },
    // section
    sectionContainer:{
        flex:1,
        backgroundColor:Colors.dividingLineColor,
        paddingHorizontal:Metrics.section,
        paddingVertical:Metrics.smallMargin,
    },
    sectionTitle:{
        color:Colors.darkColor,
        fontWeight:'800',
    },
    // item
    itemContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:Metrics.baseMargin,
        paddingHorizontal:Metrics.section,
        borderBottomColor:Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    itemLeft:{
        flex:1.5,
        flexDirection:'row',
        alignItems:'center',
    },

    timeStyle:{
        marginLeft:Metrics.baseMargin,
        color:Colors.textColor,
        marginTop:Metrics.smallMargin,
        fontSize:Fonts.size.small,

    },
    itemLeftView:{
        alignItems:'flex-start',
    },
    itemRight:{
        flex:2,
        flexDirection:'row',
        alignItems:'center',
    },
    itemRightView:{
        flex:1,
        alignItems:'flex-end',
    },
    dotStyle:{
        width:8,
        height:8,
        borderRadius:4,
        borderColor:Colors.separateLineColor,
        borderWidth: 1 / PixelRatio.get(),
        backgroundColor:'green',
        marginLeft:Metrics.baseMargin,
    },
    bottomSection:{
        marginBottom:Metrics.bottomSpace,
        height:Metrics.bottonBtnHeight,
    }


});
