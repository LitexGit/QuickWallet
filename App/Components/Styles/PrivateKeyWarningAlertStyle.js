import { StyleSheet, PixelRatio } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/';

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
    topSection:{
        flexDirection:'row',
        alignItems: 'flex-end',
        justifyContent:'center',
        marginVertical: Metrics.baseMargin,
    },
    centerSection:{
        paddingHorizontal:Metrics.baseMargin,

    },
    remind001:{
        color:'red',
        fontSize: Fonts.size.medium,
        lineHeight:Metrics.icons.small,
    },
    bottomSection:{
        justifyContent:'center',
        alignItems:'center',
    },
    actionView:{
        padding:Metrics.doubleBaseMargin,
        paddingHorizontal:Metrics.section,
    },
    actionStyle:{
        fontSize: Fonts.size.medium,
        color:Colors.textColor,
    }
});
