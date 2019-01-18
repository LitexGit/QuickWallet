import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    botttomSection:{
        marginTop: 50,
    },
    btnTitle:{
        fontSize:Fonts.size.input,
    },

    remindView:{
        padding: Metrics.baseMargin,
        borderBottomColor: Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    mnemonicView:{
        margin: Metrics.section,
        padding: Metrics.baseMargin,
        borderColor: Colors.separateLineColor,
        borderWidth: 1 / PixelRatio.get(),
    },
    infoView:{
        // backgroundColor:'yellow',
    },
    remindText:{
        color:Colors.darkColor,
        fontSize:Fonts.size.small,
    },
    mnemonicInput:{
        fontSize:Fonts.size.common,
        minHeight:40,

    },
    sectionView:{
        margin: Metrics.baseMargin,
        padding:Metrics.baseMargin,
        marginTop:0,
        borderBottomColor: Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
    },

    warning:{
        marginTop:Metrics.smallMargin,
        marginLeft: Metrics.smallMargin,
    },
    confirmView:{
        marginHorizontal : Metrics.baseMargin,
        paddingHorizontal :Metrics.baseMargin,
        flexDirection: 'row',
        alignContent:'center',
    },

    section:{
        flex:1,
        flexDirection: 'row',
        alignContent: 'center',
        marginTop:Metrics.baseMargin,
    },
    sectionText:{
        flex:1,
    },
    passwordInput:{
        flex:1,
    },
    spinnerText:{
        fontSize:Fonts.size.medium,
        color:Colors.textColor,
    },
    remind002:{
        color:'red',
        fontSize:Fonts.size.small,
        marginTop:Metrics.baseMargin,
    }
});
