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
import PreAccountScreen from '../Containers/PreAccountScreen';
import AccountScreen from '../Containers/AccountScreen';
import SearchScreen from '../Containers/SearchScreen';
import MineScreen from '../Containers/MineScreen';
import FoundScreen from '../Containers/FoundScreen';
import styles from './Styles/NavigationStyles';
import Colors from '../Themes/Colors';

const BottomTabNav = createBottomTabNavigator({
    Mine: { screen: MineScreen },
    PreAccount: { screen: PreAccountScreen },
    Found: { screen: FoundScreen },
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
    SearchScreen: { screen: SearchScreen },
    AccountScreen: { screen: AccountScreen },
}, {
    headerMode: 'float',
    cardStyle: {shadowColor: 'transparent'},
    initialRouteName: 'TransferRecordScreen',
    navigationOptions: {
        headerStyle: styles.header,
        headerTitleStyle: {textAlign: 'center', alignSelf: 'center', flex: 1},
        headerTintColor: Colors.darkColor,
    },
});

export default createAppContainer(PrimaryNav);
