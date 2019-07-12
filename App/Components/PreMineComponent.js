import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/PreMineComponentStyle';
import { connect } from 'react-redux';
import { Colors, Fonts } from '../Themes';
import CreatConfig from '../Config/CreatConfig';
import { NavigationActions } from 'react-navigation';
import I18n from '../I18n';


class PreMineComponent extends Component {

  _onPressBtn = (key) => {
    const { navigate } = this.props;
    if (key === 'creat') {
      navigate('NewWalletScreen');
      return;
    }
    navigate('ImportScreen');
  }

  _getBtnTitle = (key) => {
    if (key === 'creat') {
      return I18n.t('CreatAccount');
    }
    return I18n.t('ImportAccount');
  }

  render() {
    const btns = Object.values(CreatConfig).map((config, index) => {
      const { key, backgroundColor, borderRadius } = config;
      const textStyle = key === 'import' ? { color: Colors.textColor } : { color: '#FFFFFF' };
      return (
        <TouchableOpacity key={index}
            onPress={() => this._onPressBtn(key)}
        >
          <View style={[styles.buttonStyle, {backgroundColor}]}
              borderRadius={borderRadius}
          >
            <Text style={[textStyle, {fontSize:Fonts.size.common}]}>{this._getBtnTitle(key)}</Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.titleStyle}>{I18n.t('CreateYourFirst')}</Text>
          <Text style={styles.titleStyle}>{I18n.t('Layer2Account')}</Text>
        </View>
        <View style={styles.bottomSection}>
          {btns}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  navigate: (route) => dispatch(NavigationActions.navigate({ routeName: route }))
});

export default connect(mapStateToProps, mapDispatchToProps)(PreMineComponent);
