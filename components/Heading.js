import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, View } from 'react-native';

const propTypes = {
  word: PropTypes.string,
  styles: PropTypes.object,
}

class Heading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      word: props.word,
      styles: props.styles

    };
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 5000,
    }).start()

  }

  render() {
    let { fadeAnim, text, styles } = this.state;
    console.log(text);

    return (
      <View>
        <Animated.View
          style={{
            opacity: fadeAnim}}
        >
        <Text style={styles}>{text}</Text>
        </Animated.View>
      </View>
    );
  }
}

export default Heading;
