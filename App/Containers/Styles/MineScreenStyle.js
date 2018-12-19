import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics} from '../../Themes';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{
        height:200,
    },
    avatarSection:{
        flex:1,
        width:'100%',
        backgroundColor:Colors.darkColor,
        justifyContent:'center',
        alignItems:'center',
    },
    assetsSection:{
        height:50,
        backgroundColor:Colors.backColor,
        justifyContent:'center',
        alignItems:'center',
    },
    avatar:{
        marginBottom:Metrics.baseMargin,
    },
    bottomSection:{
        flex:1,
    },
    nameText:{
        fontSize:Fonts.size.input,
        color:'#FFFFFF',
    },
    assetsStyle:{
        fontSize:Fonts.size.input,
        color:'#FFFFFF',
    }
});
