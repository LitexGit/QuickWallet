import { StyleSheet, PixelRatio, Platform} from 'react-native';
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

    },
    remindText:{
        color:Colors.darkColor,
        fontSize:Fonts.size.small,
        lineHeight:15,
    },
    privateKeyInput:{
        fontSize:Fonts.size.common,

    },
    sectionView:{
        marginHorizontal : Metrics.baseMargin,
        paddingHorizontal :Metrics.baseMargin,
        marginTop:0,
        borderBottomColor: Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
        paddingBottom: Platform.OS === 'ios' ? Metrics.baseMargin : 0,
    },
    warning:{
        marginLeft: Metrics.smallMargin,
    },
    confirmView:{
        marginHorizontal : Metrics.baseMargin,
        paddingHorizontal : Metrics.baseMargin,
        flexDirection: 'row',
        alignContent:'center',
        marginTop: Platform.OS === 'ios' ? Metrics.baseMargin : 0,
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
        paddingTop: Platform.OS === 'ios' ? Metrics.baseMargin : Metrics.smallMargin,
    },

    spinnerText:{
        fontSize:Fonts.size.medium,
        color:Colors.textColor,
    },

    confirmInput:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pathText:{
        paddingLeft:Platform.OS === 'ios' ? 0 : Metrics.smallMargin,
    }
});
