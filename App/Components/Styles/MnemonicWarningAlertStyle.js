import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    overlay:{
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'stretch',
    },
    container: {
        paddingTop:Metrics.doubleBaseMargin,
        backgroundColor:Colors.backgroundColor,
        borderRadius: Metrics.buttonRadius,
    },
    topSectiom:{
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:Metrics.baseMargin,
    },
    centerSectiom:{
        paddingHorizontal:Metrics.doubleBaseMargin,
        marginVertical: Metrics.baseMargin,
    },
    remind001:{
        fontSize:Fonts.size.small,
        color:Colors.darkColor,
        lineHeight:15,
    },
    remind002:{
        fontSize:Fonts.size.small,
        color:'red',
        lineHeight:15,
        marginTop:Metrics.smallMargin,
    },
    bottomSectiom:{
        padding:Metrics.baseMargin,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'red',
        borderBottomRightRadius: Metrics.buttonRadius,
        borderBottomLeftRadius: Metrics.buttonRadius,
    },
    btnTitle:{
        color:Colors.backgroundColor,
        fontWeight: '600',
    },
    titleStyle:{
        fontSize:Fonts.size.input,
        color:Colors.textColor,
        marginTop: Metrics.baseMargin,
    }
});
