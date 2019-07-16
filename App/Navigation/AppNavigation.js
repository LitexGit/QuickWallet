import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import TransferScreen from '../Containers/TransferScreen';
import TransferRecordScreen from '../Containers/TransferRecordScreen';
import CurrencyScreen from '../Containers/CurrencyScreen';
import LanguageScreen from '../Containers/LanguageScreen';
import SettingScreen from '../Containers/SettingScreen';
import AssetsScreen from '../Containers/AssetsScreen';
import BackupScreen from '../Containers/BackupScreen';
import PreBackupScreen from '../Containers/PreBackupScreen';
import ImportScreen from '../Containers/ImportScreen';
import NewWalletScreen from '../Containers/NewWalletScreen';
import AccountScreen from '../Containers/AccountScreen';
import MineScreen from '../Containers/MineScreen';
import FoundScreen from '../Containers/FoundScreen';
import ScanScreen from '../Containers/ScanScreen';
import ExportScreen from '../Containers/ExportScreen';
import WebViewScreen from '../Containers/WebViewScreen';
import Layer2WebScreen from '../Containers/Layer2WebScreen';

import styles from './Styles/NavigationStyles';
import Colors from '../Themes/Colors';

const BottomTabNav = createBottomTabNavigator({
    Found: { screen: FoundScreen },
    Mine: { screen: MineScreen }
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    navigationOptions:{
        header:null
    },
    tabBarOptions: {
        activeTintColor: Colors.activeTintColor,
        inactiveTintColor: Colors.inactiveTintColor,
        tabStyle: styles.tab,
        showIcon: true,
        style: {
            backgroundColor: Colors.backgroundColor
        }
    }

});

const PrimaryNav = createStackNavigator({
    BottomTab: {screen: BottomTabNav},
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
    AccountScreen: { screen: AccountScreen },
    ScanScreen: { screen: ScanScreen },
    ExportScreen: { screen: ExportScreen },
    WebViewScreen: { screen: WebViewScreen },
    Layer2WebScreen: { screen: Layer2WebScreen }
}, {
    headerMode: 'float',
    cardStyle: {shadowColor: 'BottomTab'},
    initialRouteName: 'BottomTab',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTintColor: Colors.darkColor,
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
});

export default createAppContainer(PrimaryNav);
