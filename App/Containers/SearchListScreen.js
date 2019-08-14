import React, { Component } from 'react'
import { View, Text, SectionList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import HeaderComponent from '../Components/HeaderComponent';
import { StackActions } from 'react-navigation';
import styles from './Styles/SearchListScreenStyle'
import { NavigationActions } from 'react-navigation';
import SearchConfig from '../Config/SearchConfig';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-root-toast';

class SearchListScreen extends Component {
  static navigationOptions = ({navigation}) => {
      return {
        header: ()=> <HeaderComponent setValue={navigation.getParam('inputInfo')}
            onPressCancel={navigation.getParam('goBack')}
            onChangeText={navigation.getParam('onChangeText')}
            onSubmitEditing={navigation.getParam('onSubmitEditing')}
                     />
      }
  }

  constructor(props) {
    super(props);
    this.state = {
      input:'',
      historyData: []
    };
  }

  async componentDidMount(){
    const {input} = this.state;
    this.props.navigation.setParams({
      inputInfo: ()=> input,
      goBack: ()=> this.props.pop(),
      onChangeText: (input)=> this.setState({ input }),
      onSubmitEditing: async ()=>{
        const {input} = this.state;

        let history = await DeviceStorage.getItem(Keys.SEARCH_HISTORY) || [];
        const item = {index:history.length, title:'history', url: input}
        history.push(item)
        DeviceStorage.setItem(Keys.SEARCH_HISTORY, history)

        this.props.navigate('Layer2WebScreen', {url: input});
      }
    });

    const { url='', valid=true } = this.props.navigation.state.params;
    if (!valid) {
      this.props.navigation.setParams({inputInfo: url})
    }

    const historyData = await DeviceStorage.getItem(Keys.SEARCH_HISTORY) || [];
    this.setState({historyData})
  }

  _deleteHistory= async ()=>{
    await DeviceStorage.setItem(Keys.SEARCH_HISTORY, [])
    const error = '搜索历史已清空';
    Toast.show(error, {
        shadow:true,
        position: Toast.positions.CENTER
    });
    this.setState({historyData: []})
  }

  _renderItem=({item})=>{
    const {url='', key='', index} = item;
    return (
      <TouchableOpacity onPress={()=>this.props.navigate('Layer2WebScreen', {url})}>
        <View style={styles.item}>
          {key === 'hot' && <Text style={styles.itemIndex}>{index + 1}</Text>}
          <Text style={styles.history}>{url}</Text>
        </View>
      </TouchableOpacity>
      );
  }

  _renderSectionHeader=({section})=>{
    const {key, title} = section;
    return (<View style={styles.sectionHeader}>
      <Text>{title}</Text>
      {key === 'history' && <TouchableOpacity onPress={()=>this._deleteHistory()}>
        <AntDesign name={'delete'}
            size={16}
            color={'#A4A4A4'}
        />
      </TouchableOpacity>}
    </View>);
  }

  render ()  {
    const {historyData} = this.state;
    const hotData = SearchConfig;
    const sections=[
      { key:'hot', title: '热门搜索', data: hotData },
      { key:'history', title: '搜索历史', data: historyData }
    ]
    return (
      <View style={styles.container}>
          <SectionList style={styles.container}
              sections={sections}
              extraData={this.props}
              keyExtractor={(item,index)=>''+index}
              renderSectionHeader={this._renderSectionHeader}
              renderItem={this._renderItem}
          />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pop: () => dispatch(StackActions.pop()),
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchListScreen)
