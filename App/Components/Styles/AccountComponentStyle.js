import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    avatar:{
        backgroundColor:'red',
        width:30,
        height:30,
        borderRadius: 15,
        margin: Metrics.smallMargin,
    },
    content:{
        flex: 1,
        fontSize:Fonts.size.small,
        color:Colors.textColor,
    }
});
