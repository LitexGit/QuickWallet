import I18n from '../I18n';

const SignInfoConfig = {
    symbol:{
        key:'symbol',
        title:'ETH',
        count:0,
        fiatValue:'￥0'
    },
    gasPrice:{
        key:'gasPrice',
        title:'Gas',
        count:0,
        fiatValue:'￥0'
    },
    txTotal:{
        key:'txTotal',
        title:I18n.t('Combined'),
        count:0,
        fiatValue:'￥0'
    }
};
export default SignInfoConfig;
