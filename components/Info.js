import React from 'react';
import PropTypes from 'prop-types';
import { Alert, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
}

class Info extends React.Component {
  _showAlert = () => {
    console.log('alertttt');
    Alert.alert(
      'Mr. Sky',
      '\nA location-based weather app created for you by Lily Sky as a capstone to her academic experience at Ada Developers Academy in 2018. \n\nTechnologies used include: \nReact Native, Expo, Apple Maps, \nand Dark Sky.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')},],
      { cancelable: false }
    )
  }

  render() {
    return (
      <Entypo.Button
        onPress={this._showAlert}
        name='info-with-circle'
        size={20}
        color={this.props.color}
        backgroundColor={this.props.background}
      />

    )
  }
}

export default Info;
