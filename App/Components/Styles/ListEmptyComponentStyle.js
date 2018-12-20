import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes';

const IMAGE_SIZE = 70;
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.separateLineColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image:{
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
    },
    text:{
        margin: Metrics.baseMargin,
        fontSize: Fonts.size.medium,
        color: Colors.textColor,
    }
});
