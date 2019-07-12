import I18n from '../I18n';

export function getMineConfigTitle(key) {
  switch (key) {
    case 'setting':
      return I18n.t('UseSetting');
    case 'help':
      return I18n.t('HelpFeedback');
    case 'agreement':
      return I18n.t('UserAgreement');
    case 'share':
      return I18n.t('Share');

    default:
      return '';
  }
}

export function getAccountConfigTitle(key) {
  switch (key) {
    case 'avatar':
      return I18n.t('Avatar');
    case 'account':
      return I18n.t('AccountName');
    case 'inviteCode':
      return I18n.t('InviteCode');

    default:
      return '';
  }
}

export function getSettingConfigTitle(key) {
  switch (key) {
    case 'language':
      return I18n.t('Multilingual');
    case 'currency':
      return I18n.t('MonetaryUnit');

    default:
      return '';
  }
}

export function getInputConfigTitle(key) {
  switch (key) {
    case 'name':
      return I18n.t('Identity');
    case 'password':
      return I18n.t('Password');
    case 'confirm':
      return I18n.t('ConfirmPassword');

    default:
      return '';
  }
}
