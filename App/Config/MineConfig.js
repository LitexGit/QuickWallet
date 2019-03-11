import I18n from '../I18n';

export const MineConfig = {
    setting:{
        key:'setting',
        index:0,
        title: I18n.t('UseSetting'),
        isNext:true,
    },
    help:{
        key:'help',
        index:1,
        title:I18n.t('HelpFeedback'),
        isNext:true,
    },
    agreement:{
        key:'agreement',
        index:2,
        title:I18n.t('UserAgreement'),
        isNext:true,
    },
    share:{
        key:'share',
        index:3,
        title:I18n.t('Share'),
        isNext:false,
    },
};

export const AccountConfig = {
    avatar:{
        key:'avatar',
        index:0,
        title:I18n.t('Avatar'),
        details:'',
        type:1,
    },
    account:{
        key:'account',
        index:1,
        title:I18n.t('AccountName'),
        details:'',
        type:2,
    },
    inviteCode:{
        key:'inviteCode',
        index:2,
        title:I18n.t('InviteCode'),
        details:'',
        type:2,
    }
};

export const SettingConfig = {
    language:{
        key:'language',
        index:0,
        title:I18n.t('Multilingual'),
        details:''
    },
    currency:{
        key:'currency',
        index:1,
        title:I18n.t('MonetaryUnit'),
        details:''
    }
};

export const LanguageConfig = {
    zh:{
        key:'zh',
        title:'简体中文',
        locale:'zh'

    },
    english:{
        key:'english',
        title:'English',
        locale:'en'
    }
};

export const CurrencyConfig = {
    CNY:{
        key:'CNY',
        title:'CNY',
        symbol:'￥'
    },
    USD:{
        key:'USD',
        title:'USD',
        symbol:'$'
    }
};


