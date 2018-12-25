
import { Colors } from '../Themes';

const InputInfoConfig = {
    name:{
        key:'name',
        placeholder:'身份名',
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'never',
        maxLength:20,
        keyboardType:'default',
        returnKeyType:'next',
    },
    password:{
        key:'password',
        placeholder:'密码',
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'while-editing',
        maxLength:20,
        keyboardType:'default',
        // keyboardType:'number-pad',
        returnKeyType:'next',
    },
    confirm:{
        key:'confirm',
        placeholder:'重复输入密码',
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'while-editing',
        maxLength:20,
        keyboardType:'default',
        // keyboardType:'number-pad',
        returnKeyType:'done',
    }
};
export default InputInfoConfig;
