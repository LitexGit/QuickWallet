import { StyleSheet } from 'react-native';
import { Metrics, Colors } from '../../Themes';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding:Metrics.baseMargin,
        paddingRight: Metrics.doubleBaseMargin,
    },
    btnStyle:{
        marginLeft:Metrics.baseMargin,
    }
});
