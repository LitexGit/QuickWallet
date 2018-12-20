import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    emptycontainer:{
        marginTop:Metrics.screenHeight * 0.3,
    },
    flatList:{
        flex:1,
        padding:Metrics.baseMargin,
    },
    itemContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingVertical:Metrics.baseMargin,
        paddingHorizontal:Metrics.doubleBaseMargin,
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
        color:Colors.separateLineColor,
    },
    rightSection:{
        alignItems:'flex-end',
    },
    headerStyle:{
        padding:Metrics.baseMargin,
    },
    headTitle:{
        color:Colors.darkColor,
        fontWeight:'800',
    }
});
