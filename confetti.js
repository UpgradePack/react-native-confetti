import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions
} from 'react-native';

let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;

const shapes = ['rectangle', 'triangle']
class Confetti extends Component {

  static propTypes = {
    shape: PropTypes.oneOf(shapes),
    size: PropTypes.oneOf([1, 2]),
  }

  static defaultProps = {
    duration: 6000,
    colors: [
      "rgb(242.2, 102, 68.8)",
      "rgb(255, 198.9, 91.8)",
      "rgb(122.4, 198.9, 163.2)",
      "rgb(76.5, 193.8, 216.7)",
      "rgb(147.9, 99.4, 140.2)"
    ],
    shape: 'square',
    size: 1,
    bsize: 0
  }

  constructor(props) {
    super(props);
    this._yAnimation = new Animated.Value(-10);
    this.color = this.randomColor(this.props.colors);
    this.left = this.randomValue(0, windowWidth);
    let rotationOutput = this.randomValue(-220, 220) + 'deg';
    this._rotateAnimation = this._yAnimation.interpolate({
      inputRange: [0, windowHeight / 2, windowHeight],
      outputRange: ['0deg', rotationOutput, rotationOutput]
    });

    let xDistance = this.randomIntValue((windowWidth / 3 * -1), windowWidth / 3);
    this._xAnimation = this._yAnimation.interpolate({
      inputRange: [0, windowHeight],
      outputRange: [0, xDistance]
    });
  }

  componentDidMount() {
    let { duration, index } = this.props;
    Animated.timing(this._yAnimation, {
      delay: this.randomIntValue(400, 1600),
      duration: 2000 + (index * 20),
      toValue: windowHeight + 1.25,
      useNativeDriver: true,
    }).start(this.props.onAnimationComplete);
  }

  getTransformStyle() {
    return {
      transform: [
        { translateY: this._yAnimation },
        { translateX: this._xAnimation },
        { rotate: this._rotateAnimation }
      ]
    }
  }

  getConfettiStyle() {
    let { index, size, bsize, shape } = this.props;

    if (shapes.indexOf(shape) < 0) shape = 'rectangle';

    let styles = {
      rectangle: {
        bigConfetti: {
          height: 5.5 * size,
          width: 11 * size,
          borderBottomLeftRadius: 5 * bsize,
          borderBottomRightRadius: 5 * bsize,
          borderTopLeftRadius: 2.6 * bsize,
          borderTopRightRadius: 2.6 * bsize,
          backgroundColor: this.color
        },
        smallConfetti: {
          height: 4.5 * size,
          width: 8 * size,
          borderBottomLeftRadius: 2.5 * bsize,
          borderBottomRightRadius: 2.5 * bsize,
          borderTopLeftRadius: 1.3 * bsize,
          borderTopRightRadius: 1.3 * bsize,
          backgroundColor: this.color
        }
      },
      triangle: {
        bigConfetti: {
          width: 0,
          height: 0,
          borderLeftWidth: 7 * size,
          borderLeftColor: 'transparent',
          borderRightWidth: 7 * size,
          borderRightColor: 'transparent',
          borderBottomWidth: 7 * size,
          borderBottomColor: this.color,
          backgroundColor: 'transparent'
        },
        smallConfetti: {
          width: 0,
          height: 0,
          borderLeftWidth: 5 * size,
          borderLeftColor: 'transparent',
          borderRightWidth: 5 * size,
          borderRightColor: 'transparent',
          borderBottomWidth: 5 * size,
          borderBottomColor: this.color,
          backgroundColor: 'transparent'
        }
      }
    }

    return index % 5 === 0 ? styles[shape].smallConfetti : styles[shape].bigConfetti;
  }

  randomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  randomIntValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  randomColor(colors) {
    return colors[this.randomIntValue(0, colors.length)];
  }

  render() {
    let { left, ...otherProps } = this.props;
    return <Animated.View style={[styles.confetti, this.getConfettiStyle(), this.getTransformStyle(), { marginLeft: this.left }]} {...otherProps} />
  }
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    marginTop: 0
  }
});

export default Confetti;
