import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    contentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:Colors.textColor,
        padding:Metrics.baseMargin,
    },
    titleStyle:{
        color:'#FFFFFF',
        fontSize: Fonts.size.h6,
    }
});
