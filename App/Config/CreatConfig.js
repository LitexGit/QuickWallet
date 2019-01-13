import { Colors } from '../Themes';
import I18n from '../I18n';

const CreatConfig = {
    import:{
        key:'creat',
        backgroundColor:Colors.textColor,
        title: I18n.t('CreatAccount'),
        borderRadius:20,
    },
    creat:{
        key:'import',
        backgroundColor:Colors.separateLineColor,
        title:I18n.t('ImportAccount'),
        borderRadius:20,
    }
};
export default CreatConfig;
