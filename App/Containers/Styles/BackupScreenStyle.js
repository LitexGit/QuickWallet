import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics  } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{

    },
    topView:{
        height:150,
        justifyContent:'center',
        alignItems:'center'
    },
    titleStytle:{
        fontSize:Fonts.size.input,
        color:Colors.backColor,
        marginTop: Metrics.baseMargin,
    },

    remindText:{
        fontSize:Fonts.size.small,
        color:Colors.separateLineColor,
        textAlign:'center',
    },
    mnemonicText:{
        padding:Metrics.doubleBaseMargin,
        backgroundColor:Colors.dividingLineColor,
        color:Colors.textColor,
        fontWeight:'500',
    },
    bottomSection:{
        flex:1,
        justifyContent:'flex-end',
    },
    btnStyle:{
        marginBottom:Metrics.bottomSpace,
        height:Metrics.bottonBtnHeight,
    },
    pressWordView:{
        margin:Metrics.baseMargin,
        padding: Metrics.baseMargin,
        paddingTop:0,
        backgroundColor:Colors.dividingLineColor,
        flexDirection:'row',
        flexWrap:'wrap',
        minHeight:48,
    },
    unPressWordView:{
        padding: Metrics.doubleBaseMargin,
        borderColor:Colors.separateLineColor,
        flexDirection:'row',
        flexWrap:'wrap',
    },
    wordsStyle:{
        borderColor:Colors.separateLineColor,
        borderWidth:2 / PixelRatio.get(),
        borderRadius: Metrics.buttonRadius,
        marginTop:Metrics.baseMargin,
        marginRight:Metrics.baseMargin,
        padding:Metrics.smallMargin,
        backgroundColor:Colors.backgroundColor,
    },
    remindSection:{
    },
    toastView:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:0,
        height:45,
    },
    toastText:{
        color:'red',
        fontSize:Fonts.small,
    },
    wordTitle:{
        fontSize:Fonts.size.common,

    }
});
