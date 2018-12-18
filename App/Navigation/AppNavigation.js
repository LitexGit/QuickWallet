import { createStackNavigator, createAppContainer } from 'react-navigation';
import TransferScreen from '../Containers/TransferScreen'
import TransferRecordScreen from '../Containers/TransferRecordScreen'
import CurrencyScreen from '../Containers/CurrencyScreen';
import LanguageScreen from '../Containers/LanguageScreen';
import SettingScreen from '../Containers/SettingScreen';
import AssetsScreen from '../Containers/AssetsScreen';
import BackupScreen from '../Containers/BackupScreen';
import PreBackupScreen from '../Containers/PreBackupScreen';
import ImportScreen from '../Containers/ImportScreen';
import NewWalletScreen from '../Containers/NewWalletScreen';
import PreAccountScreen from '../Containers/PreAccountScreen';
import AccountScreen from '../Containers/AccountScreen';
import SearchScreen from '../Containers/SearchScreen';
import MineScreen from '../Containers/MineScreen';
import FoundScreen from '../Containers/FoundScreen';
import LaunchScreen from '../Containers/LaunchScreen';

import styles from './Styles/NavigationStyles';

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  TransferScreen: { screen: TransferScreen },
  TransferRecordScreen: { screen: TransferRecordScreen },
    CurrencyScreen: { screen: CurrencyScreen },
    LanguageScreen: { screen: LanguageScreen },
    SettingScreen: { screen: SettingScreen },
    AssetsScreen: { screen: AssetsScreen },
    BackupScreen: { screen: BackupScreen },
    PreBackupScreen: { screen: PreBackupScreen },
    ImportScreen: { screen: ImportScreen },
    NewWalletScreen: { screen: NewWalletScreen },
    PreAccountScreen: { screen: PreAccountScreen },
    AccountScreen: { screen: AccountScreen },
    SearchScreen: { screen: SearchScreen },
    MineScreen: { screen: MineScreen },
    FoundScreen: { screen: FoundScreen },
    LaunchScreen: { screen: LaunchScreen }
}, {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'LaunchScreen',
    navigationOptions: {
        headerStyle: styles.header
    }
});

export default createAppContainer(PrimaryNav);
