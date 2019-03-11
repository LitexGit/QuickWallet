import { StyleSheet, PixelRatio } from 'react-native';
import { ApplicationStyles, Fonts, Colors, Metrics} from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{
        height:110,
        justifyContent:'center',
        alignItems:'center',
    },
    titleStytle:{
        fontSize:Fonts.size.input,
        color:Colors.backColor,
        marginTop: 10,
    },
    bottomSection:{
        flex:1,
        marginBottom:Metrics.bottomSpace,
    },
    tabBarUnderline:{
        backgroundColor:Colors.textColor,
        height:5 / PixelRatio.get(),
    },
    tabBarStyle:{
        flex:1,
    },
    userTermsStyle:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.3)',
        position:'absolute',
        left:0,
        top:0,
        right:0,
        bottom:0,
        justifyContent:'center',
        alignItems:'center'
    }

});
