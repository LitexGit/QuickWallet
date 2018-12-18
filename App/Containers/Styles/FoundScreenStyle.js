import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    container: {
        flex: 1,
        backgroundColor: Colors.transparent
    },
    topSection:{
        height: 200,
        width: '100%',
    },
    banner:{
        flex:1,
    },
    searchBar:{
        width: '100%',
        height:48 + 16,
    },
    scrollView:{
        flex:1,
        marginHorizontal:Metrics.baseMargin,
        paddingVertical: Metrics.baseMargin,

    },
    contentContainer:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'flex-start'
    },
    itemBack:{
        width: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5,
        height: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5 + 20,
    },
    itemStyle:{
        flex:1,
        width: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5,
        height: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5 + 20,
    },
    imageItem:{
        width: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5 - 25,
        height: (Metrics.screenWidth - Metrics.baseMargin * 2) / 5 - 25,
        borderRadius: ((Metrics.screenWidth - Metrics.baseMargin * 2) / 5 - 25) * 0.5,
        alignSelf:'center',
    },
    titleItem:{
        textAlign:'center',
        marginTop:Metrics.smallMargin,
    }
});
