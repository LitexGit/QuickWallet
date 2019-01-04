import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics} from '../../Themes';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{
        height: Metrics.screenHeight * 0.25 + Metrics.statusBarHeight
    },
    avatarSection:{
        flex:1,
        width:'100%',
        backgroundColor:Colors.darkColor,
        alignItems:'center',
        justifyContent:'center',
    },
    assetsSection:{
        height:50,
        backgroundColor:Colors.backColor,
        justifyContent:'center',
        alignItems:'center',
    },
    avatar:{
        marginBottom:Metrics.baseMargin,
        marginTop:Metrics.statusBarHeight,
        width:54,
        height:54,
        borderRadius:27,
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
    },
    flatList:{
        flex:1,
        marginTop:Metrics.smallMargin,
    },
    itemContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginHorizontal:Metrics.baseMargin,
    },
    itemLeft:{
        flexDirection:'row',
        alignItems:'center',
    },
    titleColor:{
        marginLeft:Metrics.smallMargin,
        color:Colors.textColor,
    }
});
