import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, View } from 'react-native';

const propTypes = {
  source: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}

class Attribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      image: props.source,
      styles: props.styles

    };
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 5000,
      }),
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 0,
          duration: 10000,
      }),

    ]).start()

  }

  render() {
    let { fadeAnim, image, styles } = this.state;

    return (
      <View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: 250,
            height: 50,
            alignItems: 'center',
          }}
        >
        <Image source={image} style={styles}/>
        </Animated.View>
      </View>
    );
  }
}

export default Attribution;
