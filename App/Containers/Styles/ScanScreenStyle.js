import { StyleSheet } from 'react-native';
import { ApplicationStyles } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    scanBeside:{
        flex:1,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    scanSection:{
        height:250,
        flexDirection:'row',
    },
    bottomSection:{
        flex:1.5,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    scanerView:{
        width:250,
    },
    animatedLine:{
        height:2,
        backgroundColor:'#00c050'
    },
    scaner:{
        width:250,
        height:250,
        position:'absolute',
        left: 0,
        top: 0,
    }
});
