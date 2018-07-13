import React from 'react';
import { Animated, Image } from 'react-native';

class Attribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 10000,
      }
    ).start()
  }

  render() {
    let {fadeAnim } = this.state;

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          width: 250,
          height: 50
        }}
      >
      <Image source={require('../assets/poweredby-darksky.png')} />
      </Animated.View>
    );
  }
}

export default Attribution;
