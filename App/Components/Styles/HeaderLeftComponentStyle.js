import { StyleSheet } from 'react-native';
import { Metrics, Colors, Fonts } from '../../Themes';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding:Metrics.baseMargin,
    },
    backTitle:{
        fontSize:Fonts.size.h6,
        paddingLeft: Metrics.baseMargin,
        alignSelf: 'center',
        paddingTop:3,
    }
});
