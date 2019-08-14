import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import HeaderComponent from '../Components/HeaderComponent';
import { StackActions } from 'react-navigation';
import styles from './Styles/SearchListScreenStyle'
import { NavigationActions, NavigationEvents } from 'react-navigation';

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
      input:''
    };
  }

  componentDidMount(){
    const {input} = this.state;
    this.props.navigation.setParams({
      inputInfo: ()=> input,
      goBack: ()=> this.props.pop(),
      onChangeText: (input)=> this.setState({ input }),
      onSubmitEditing: ()=>{
        const {input} = this.state;
        this.props.navigate('Layer2WebScreen', {url: input});
      }
    });

    const { url='', valid=true } = this.props.navigation.state.params;
    if (!valid) {
      this.props.navigation.setParams({inputInfo: url})
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior="position">
          <Text>SearchListScreen</Text>
        </KeyboardAvoidingView>
      </ScrollView>
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
