import { StyleSheet } from 'react-native';
import { Fonts, Colors } from '../../Themes';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelDes:{
        fontSize:Fonts.size.small,
        color:Colors.textColor,
    },
    section:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
    },
    level:{
        marginTop: 2,
        width:15,
        height:3,
    }

});
