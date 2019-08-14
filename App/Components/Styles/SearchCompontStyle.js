import { StyleSheet, PixelRatio} from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    container: {
        flex:1
    },
    searchSection:{
        flex:1,
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor:Colors.backgroundColor,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        borderColor:Colors.separateLineColor,
        borderWidth: 1/PixelRatio.get()
    },
    searchIcon:{
        marginHorizontal:Metrics.smallMargin
    },
    textInput:{
        flex:1,
        fontSize:Fonts.size.medium,
        color:Colors.textColor
    },
    scanSection:{
        width: 40,
        height:'100%',
        justifyContent:'center',
        alignContent: 'center'
    }
});





