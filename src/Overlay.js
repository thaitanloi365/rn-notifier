import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal
} from "react-native";

const { width, height } = Dimensions.get("window");
/**
 * @typedef {import("rn-notifier").OverlayProps} Props
 * @typedef {import("rn-notifier").OverlayState} State
 * @extends {React.Component<Props,State>}
 */
class Overlay extends React.Component {
  /**
   * @type {Props}
   */
  static defaultProps = {
    modalBackgroundColor: "rgba(35,36,38,0.8)",
    animationType: "none",
    animationDuration: 200
  };
  /**
   * @type {State}
   */
  state = {
    visible: false,
    animatedBackgroundOpacity: new Animated.Value(0),
    animatedValue: new Animated.Value(0),
    showContent: true
  };

  show = onShow => {
    const { animatedBackgroundOpacity, animatedValue } = this.state;
    const { animationDuration: duration, animationType } = this.props;
    if (animationType !== "none") {
      this.setState({ visible: true, showContent: true }, () => {
        Animated.sequence([
          Animated.timing(animatedBackgroundOpacity, {
            toValue: 1,
            useNativeDriver: true,
            duration
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            duration
          })
        ]).start(onShow);
      });
    } else {
      Animated.timing(animatedBackgroundOpacity, {
        toValue: 1,
        useNativeDriver: true,
        duration
      }).start(() => {
        animatedValue.setValue(1);
        this.setState({ visible: true }, onShow);
      });
    }
  };

  hide = onHide => {
    const { animationDuration: duration, animationType } = this.props;
    const { animatedBackgroundOpacity, animatedValue } = this.state;
    if (animationType !== "none") {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
          duration
        }),
        Animated.timing(animatedBackgroundOpacity, {
          toValue: 0,
          useNativeDriver: true,
          duration
        })
      ]).start(() =>
        this.setState({ showContent: false }, () => this.setState({ visible: false }, onHide))
      );
    } else {
      Animated.timing(animatedBackgroundOpacity, {
        toValue: 0,
        useNativeDriver: true,
        duration
      }).start(() => {
        animatedValue.setValue(0);
        this.setState({ visible: false }, onHide);
      });
    }
  };

  _onPressOutside = () => {
    const { onPressOutside } = this.props;
    if (onPressOutside) {
      this.hide(onPressOutside);
    }
  };

  _getModalAnimation = () => {
    const { animatedBackgroundOpacity } = this.state;
    const opacity = animatedBackgroundOpacity.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
      extrapolate: "clamp"
    });
    return { opacity };
  };

  _getContentAnimation = () => {
    const { animatedValue } = this.state;
    const { animationType } = this.props;

    let animationStyle = {};

    switch (animationType) {
      case "fade": {
        animationStyle = {
          opacity: animatedValue
        };
        break;
      }

      case "scale": {
        const scale = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ scale }]
        };
        break;
      }

      case "slideFromLeft": {
        const translateX = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-width, -width / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateX }]
        };
        break;
      }
      case "slideFromRight": {
        const translateX = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [width, width / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateX }]
        };
        break;
      }
      case "slideFromBottom": {
        const translateY = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [height, height / 4, 0],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity: animatedValue,
          transform: [{ translateY }]
        };
        break;
      }
      case "slideFromTop": {
        const translateY = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [-height, -height / 4, 0],
          extrapolate: "clamp"
        });
        const opacity = animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.7, 1],
          extrapolate: "clamp"
        });
        animationStyle = {
          opacity,
          transform: [{ translateY }]
        };
        break;
      }
      default:
        animationStyle = {};
        break;
    }

    return animationStyle;
  };

  _renderContentView = () => {
    const { style, children, contentStyle, modalBackgroundColor, onPressOutside } = this.props;
    const { visible, showContent } = this.state;
    const backgroundColor = showContent ? modalBackgroundColor : "transparent";
    if (!visible) return null;
    const animationContentStyle = this._getContentAnimation();
    const animationStyle = this._getModalAnimation();
    const hasBackProp = onPressOutside !== null;
    return (
      <View style={[styles.modal]}>
        {showContent && (
          <Animated.View style={[styles.fill, style, animationStyle, { backgroundColor }]}>
            {hasBackProp && (
              <TouchableWithoutFeedback onPress={this._onPressOutside}>
                <View style={StyleSheet.absoluteFill} />
              </TouchableWithoutFeedback>
            )}
            <Animated.View style={[styles.container, contentStyle, animationContentStyle]}>
              {children}
            </Animated.View>
          </Animated.View>
        )}
        <KeyboardAvoidingView
          style={{ margin: 0 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          pointerEvents="box-none"
        />
      </View>
    );
  };
  render() {
    const { useModal } = this.props;
    const { visible } = this.state;
    if (useModal) {
      return (
        <Modal visible={visible} transparent animationType="none">
          {this._renderContentView()}
        </Modal>
      );
    }
    return this._renderContentView();
  }
}

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      ios: { zIndex: 6 },
      android: { elevation: 6 }
    })
  },
  fill: {
    flex: 1,
    backgroundColor: "rgba(35,36,38,0.5)",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowRadius: 6,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2
      },
      android: { elevation: 6 }
    })
  }
});

export default Overlay;
