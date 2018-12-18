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
        flex:1
    },
    searchBar:{
        width: '100%',
        height:48 + 16,
    }
});
