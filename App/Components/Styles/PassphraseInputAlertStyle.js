import { StyleSheet, PixelRatio } from 'react-native';
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
    titleStyle:{
        textAlign:'center',
        fontWeight: '800',
        color:Colors.textColor,
    },
    textInput:{
        margin:Metrics.doubleBaseMargin,
        borderBottomColor: Colors.dividingLineColor,
        borderBottomWidth: 1 / PixelRatio.get(),
        marginBottom: 0,
    },
    bottomSection:{
        flexDirection:'row',
        alignItems:'stretch'
    },
    actionView:{
        flex:1,
    },
    actionStyle:{
        paddingBottom: Metrics.baseMargin,
        paddingTop:Metrics.doubleBaseMargin - 5,
        textAlign:'center',
    }
});
