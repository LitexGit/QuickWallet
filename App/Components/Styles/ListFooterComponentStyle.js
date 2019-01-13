import { StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: Colors.textColor,
        padding : Metrics.section,
    }
});
