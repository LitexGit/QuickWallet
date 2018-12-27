import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/';

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
    },
    remind002:{
        fontSize:Fonts.size.small,
        color:'red',
    },
    bottomSectiom:{
        padding:Metrics.baseMargin,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'red',
    },
    btnTitle:{
        color:Colors.backgroundColor,
        fontWeight: '600',
    }
});
