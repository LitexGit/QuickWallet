import './App/Config/ReactotronConfig';
import { AppRegistry} from 'react-native';
import App from './App/Containers/App';
import './global';

console.disableYellowBox = true;

AppRegistry.registerComponent('QuickWallet', () => App);
