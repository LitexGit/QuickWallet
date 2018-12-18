import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    container: {
        flex:1,
    },
    searchSection:{
        flex:1,
        marginHorizontal: 10,
        marginVertical: 8,
        borderRadius:24,
        borderColor:Colors.separateLineColor,
        borderWidth: 1,

        flexDirection:'row',
        backgroundColor:Colors.backgroundColor,
    },
    searchBar:{
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        borderRadius:24,
    },
    inputStyle:{
        fontSize:Fonts.size.medium,
        backgroundColor: Colors.backgroundColor,
    },
    scanSection:{
        width: 40,
        height:'100%',
        justifyContent:'center',
        alignContent: 'center',
    }
});





