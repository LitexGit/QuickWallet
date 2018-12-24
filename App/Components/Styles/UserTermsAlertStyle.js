import { StyleSheet } from 'react-native';
import { Metrics, Colors } from '../../Themes';

export default StyleSheet.create({
    overlay:{
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content:{
        width:'100%',
        height:'80%',
        backgroundColor: 'rgba(0,0,0,0.0)',
    },
    container: {
        width:'100%',
        height:'100%',
        backgroundColor:Colors.backgroundColor,
    },
    topSection:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: Metrics.baseMargin,
    },
    titleStyle:{
        flex:1,
        textAlign:'center',
        padding: Metrics.baseMargin,
    },
    scrollView:{
        flex:1,
    },
    bottomSection:{
        paddingVertical:Metrics.baseMargin,
    },
    btnTitle:{
        textAlign:'center',
    }

});
