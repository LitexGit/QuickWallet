import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/';

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
        marginTop: 10,
    },
    remindSection:{
        margin:Metrics.section,
        marginTop:0,
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
        fontSize:Fonts.size.common,
    },
    bottomSection:{
        flex:1,
        justifyContent:'flex-end',
    },
    btnStyle:{
        marginBottom:Metrics.bottomSpace,
        height:Metrics.bottonBtnHeight,
    },
    skipBtn:{
        position:'absolute',
        right:Metrics.section,
        top:Metrics.section,
    },
    skipTitle:{
        color:Colors.textColor,
        fontWeight:'500',
        fontSize:Fonts.size.common,
    }
});
