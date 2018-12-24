import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../Themes';

export default StyleSheet.create({
    overlay:{
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content:{
        // width:Metrics.screenWidth * 0.85,
        // height:Metrics.screenHeight * 0.7,
        width:'100%',
        height:'70%',
        backgroundColor: 'rgba(0,0,0,0.0)',
    },
    container: {
        flex:1,
        backgroundColor:Colors.backgroundColor,
    },
    topSection:{
        padding:Metrics.baseMargin,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: Metrics.baseMargin,

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
        backgroundColor:'cyan',
    },
    bottomSection:{
        paddingVertical:Metrics.baseMargin,
        backgroundColor:Colors.textColor,
    },
    btnTitle:{
        textAlign:'center',
        color:Colors.backgroundColor,
    },
    contentTop:{
        height:350,
        backgroundColor:'red',
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
