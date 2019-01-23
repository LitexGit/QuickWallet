import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../Themes';

export default StyleSheet.create({
    container: {
        height:'60%',
        width:'75%',
        backgroundColor:Colors.backgroundColor,
    },
    topSection:{
        padding:Metrics.baseMargin,
        flexDirection:'row',
        alignItems:'center',
    },
    titleStyle:{
        flex:1,
        textAlign:'center',
        padding: Metrics.baseMargin,
        color:Colors.textColor,
        fontWeight: '800',
        fontSize: Fonts.size.regular,
    },
    scrollView:{
        flex:1,
        padding:Metrics.baseMargin,
    },
    bottomSection:{
        paddingVertical:15,
        backgroundColor:Colors.textColor,
    },
    btnTitle:{
        textAlign:'center',
        color:Colors.backgroundColor,
    },
    bottomContent:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:Metrics.baseMargin,
    },
    remindView:{
        padding:Metrics.baseMargin,
    },
    remind:{
        fontSize: Fonts.size.medium,
    }
});
