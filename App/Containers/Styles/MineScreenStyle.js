import { StyleSheet } from 'react-native';
import { ApplicationStyles, Colors, Fonts} from '../../Themes';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    topSection:{
        height:150,
        backgroundColor:Colors.backColor,
        justifyContent:'center',
        alignItems:'center',
    },
    bottomSection:{
        flex:3,
    },
    buttonStyle:{
        height:40,
        marginTop: 50,
        marginHorizontal:60,
    },
    titleStyle:{
        color:'#FFFFFF',
        fontSize:Fonts.size.h6,
        marginTop: 10,
    },

});
