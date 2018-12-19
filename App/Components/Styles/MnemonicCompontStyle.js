import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection:{
        flex:1,
    },
    botttomSection:{
        // backgroundColor:'red',
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
        height: 80,
    },
    infoView:{
        // backgroundColor:'yellow',
    },
    remindText:{
        color:Colors.darkColor,
        fontSize:Fonts.size.small,
    },
    mnemonicInput:{

    },
    sectionView:{
        margin: Metrics.baseMargin,
        padding:Metrics.baseMargin,
        marginTop:0,
        borderBottomColor: Colors.separateLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
    },

    pathTop:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-between',
    },
    nextView:{
        flexDirection:'row',
        alignContent: 'center',
    },
    nextText:{
        color:Colors.textColor,
        lineHeight:Metrics.icons.small,
    },
    pathText:{
        color:Colors.darkColor,
        marginTop: Metrics.smallMargin,
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
    },
    sectionText:{
        flex:1,
    },
    passwordInput:{
        flex:1,
    }
});
