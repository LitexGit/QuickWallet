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
    Mine: { screen: MineScreen },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
        activeTintColor: Colors.activeTintColor,
        inactiveTintColor: Colors.inactiveTintColor,
        tabStyle: styles.tab,
        showIcon: true,
        style: {
            backgroundColor: Colors.backgroundColor
        }
    },
    navigationOptions:{
        header:null,
    }
});

const PrimaryNav = createStackNavigator({
    BottomTab: {screen: BottomTabNav},
    TransferScreen: { screen: TransferScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    TransferRecordScreen: { screen: TransferRecordScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    CurrencyScreen: { screen: CurrencyScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    LanguageScreen: { screen: LanguageScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    SettingScreen: { screen: SettingScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    AssetsScreen: { screen: AssetsScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    BackupScreen: { screen: BackupScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    PreBackupScreen: { screen: PreBackupScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    ImportScreen: { screen: ImportScreen,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        } },
    NewWalletScreen: { screen: NewWalletScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    AccountScreen: { screen: AccountScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    ScanScreen: { screen: ScanScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    ExportScreen: { screen: ExportScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    WebViewScreen: { screen: WebViewScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }},
    Layer2WebScreen: { screen: Layer2WebScreen ,
        navigationOptions:{
            headerStyle: styles.header,
            headerTintColor: Colors.darkColor,
        }}
}, {
    headerMode: 'float',
    cardStyle: {shadowColor: 'BottomTab'},
    initialRouteName: 'BottomTab',
    navigationOptions:{
        headerStyle: styles.header,
        headerTintColor: Colors.darkColor,
    }
});

export default createAppContainer(PrimaryNav);
