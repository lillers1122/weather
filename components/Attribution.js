import React, { Component } from 'react';
import { Animated } from 'react-native';

class Attribution extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'pink',
    };
  }

  render() {
    
    return (
      <Animated.View />
    );
  }
}

export default Attribution;
