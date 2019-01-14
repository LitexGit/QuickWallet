import { StyleSheet, PixelRatio } from 'react-native';
import { Colors } from '../../Themes/';

export default StyleSheet.create({
    header: {
        backgroundColor: Colors.backgroundColor,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderTopColor: Colors.separateLineColor,
    },
    tab: {
        backgroundColor: Colors.backgroundColor,
        borderTopColor: Colors.separateLineColor,
        borderTopWidth: 1 / PixelRatio.get(),
    }
});
