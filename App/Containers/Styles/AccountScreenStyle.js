import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{
        padding: Metrics.baseMargin,
        paddingBottom:0,
    },
    itemView:{
        height:40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:Colors.separateLineColor,
        borderBottomWidth:1 / PixelRatio.get(),
        paddingHorizontal:Metrics.doubleBaseMargin,
    },
    titleStyle:{
        color:Colors.darkColor,
    },
    detailsStyle:{
        color:Colors.textColor,
    },
    centerSection:{
        flex:1,
        borderTopColor:Colors.dividingLineColor,
        borderTopWidth:Metrics.doubleBaseMargin,
        paddingTop:50,
        alignItems:'center',
    },
    addressSection:{
        width: '60%',
        flexWrap:'nowrap',
        flexDirection:'row',
        marginBottom:Metrics.section,
    },
    address:{
        color:Colors.darkColor,
        marginRight:Metrics.baseMargin,
        fontSize: Fonts.size.input,
    },
    bottomSection:{
        marginBottom:Metrics.bottomSpace,
    },
    buttonStyle:{
        borderTopColor:Colors.separateLineColor,
        borderTopWidth: 1 / PixelRatio.get(),
        backgroundColor:Colors.backgroundColor,
        height:Metrics.bottonBtnHeight,
        justifyContent:'center',
        alignItems:'center',
    },
    backupTitle:{
        color:Colors.textColor,
        textAlign:'center',
        fontSize:Fonts.size.input,
    },
    logOutTitle:{
        color:'red',
        textAlign:'center',
        fontSize:Fonts.size.input,
    },
    textInput:{
        height:'100%',
        width:'50%',
        textAlign:'right',
        color:Colors.textColor,
    }
});
