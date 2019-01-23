
import { Colors } from '../Themes';
import I18n from '../I18n';

const InputInfoConfig = {
    name:{
        key:'name',
        placeholder: I18n.t('Identity'),
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'never',
        maxLength:20,
        keyboardType:'default',
        returnKeyType:'next',
    },
    password:{
        key:'password',
        placeholder: I18n.t('Password'),
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'while-editing',
        maxLength:20,
        keyboardType:'default',
        returnKeyType:'next',
    },
    confirm:{
        key:'confirm',
        placeholder:I18n.t('ConfirmPassword'),
        placeholderTextColor:Colors.separateLineColor,
        clearButtonMode:'while-editing',
        maxLength:20,
        keyboardType:'default',
        returnKeyType:'done',
    }
};
export default InputInfoConfig;
