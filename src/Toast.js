import React from "react";
import {
  Image,
  Animated,
  Platform,
  Dimensions,
  StatusBar,
  StyleSheet,
  PanResponder,
  Text,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");
const statusBarHeight =
  Platform.OS === "ios"
    ? height === 812 || width === 812 || (height === 896 || width === 896)
      ? 44
      : 20
    : StatusBar.currentHeight;

const typeProps = {
  Warn: {
    // @ts-ignore
    source: require("./images/toastWarn.png"),
    color: "#cd853f"
  },
  Error: {
    // @ts-ignore
    source: require("./images/toastError.png"),
    color: "#cc3232"
  },
  Info: {
    // @ts-ignore
    source: require("./images/toastInfo.png"),
    color: "#2B73B6"
  },
  Success: {
    // @ts-ignore
    source: require("./images/toastSuccess.png"),
    color: "#32A54A"
  }
};

/**
 * @typedef {import("rn-notifier").ToastProps} Props
 * @typedef {import("rn-notifier").ToastState} State
 * @extends {React.Component<Props,State>}
 */
class Toast extends React.Component {
  constructor(props) {
    super(props);
    this._createPanResponder();
  }

  /**
   * @type {State}
   */
  state = {
    type: "Error",
    title: "Error title",
    message: "Message of error",
    animatedValue: new Animated.Value(0),
    activeStatusBarType: "light-content",
    deactiveStatusBarType: "light-content",
    duration: 0,
    showing: false,
    animatedPan: new Animated.ValueXY(),
    contentHeight: 200
  };

  static defaultProps = {
    typeProps: typeProps,
    minmumHeightToClose: 20
  };

  componentWillUnmount() {
    if (this.timoutHandler !== null) {
      clearTimeout(this.timoutHandler);
    }
  }

  show = (
    title,
    message,
    type = "Info",
    duration = 0,
    onShow,
    onClose,
    activeStatusBarType = "light-content",
    deactiveStatusBarType = "dark-content"
  ) => {
    this.setState(
      // @ts-ignore
      {
        title,
        message,
        showing: true,
        activeStatusBarType,
        deactiveStatusBarType,
        type,
        duration
      },
      () => {
        // @ts-ignore
        StatusBar.setBarStyle(activeStatusBarType, true);
        if (duration) {
          this.timoutHandler = setTimeout(() => this.hide(onClose), duration);
        }
        Animated.spring(this.state.animatedValue, {
          toValue: 1,
          friction: 20,
          useNativeDriver: true,
          tension: 10
        }).start(onShow);
      }
    );
  };

  hide = onClose => {
    if (!this.state.showing) return;
    StatusBar.setBarStyle(this.state.deactiveStatusBarType, false);
    Animated.spring(this.state.animatedValue, {
      toValue: 0,
      friction: 9,
      useNativeDriver: true
    }).start(() => {
      this.setState({ showing: false }, onClose);
    });
  };

  _createPanResponder() {
    const { animatedPan } = this.state;
    const { minmumHeightToClose } = this.props;
    const dy = animatedPan.y;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        gestureState.dy > 0 ? null : Animated.event([null, { dy }])(e, gestureState);
      },
      // @ts-ignore
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dy) > minmumHeightToClose) {
          this.hide();
        } else {
          Animated.spring(animatedPan, {
            toValue: { x: 0, y: 0 }
          }).start();
        }
      }
    });
  }

  _getAnimationStyle = () => {
    const { contentHeight, animatedValue } = this.state;
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-contentHeight, 0]
    });

    return {
      transform: [{ translateY }]
    };
  };

  _onLayout = e => {
    const { height } = e.nativeEvent.layout;
    if (height !== this.state.contentHeight) {
      this.setState({ contentHeight: height });
    }
  };

  render() {
    const { type, title = "", message, animatedPan } = this.state;
    const { style, typeProps } = this.props;
    const typeProp = typeProps[type];
    const source = typeProp.source;
    const color = typeProp.color;
    const animationStyle = this._getAnimationStyle();
    const panStyle = {
      transform: animatedPan.getTranslateTransform()
    };
    const displayTitle = title !== "";
    return (
      <Animated.View
        style={[styles.container, panStyle, { backgroundColor: color }, animationStyle, style]}
        {...this.panResponder.panHandlers}
        onLayout={this._onLayout}
      >
        <View style={styles.imageContainer}>
          <Image source={source} />
        </View>
        <View style={styles.contentContainer}>
          {displayTitle && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.text}>{message}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    padding: 8
  },
  contentContainer: {
    flexDirection: "column"
  },
  container: {
    position: "absolute",
    flexDirection: "row",
    paddingTop: statusBarHeight,
    paddingBottom: 10,
    top: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        zIndex: 5
      },
      android: { elevation: 5 }
    })
  },
  content: {
    paddingLeft: 8
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white"
  },
  text: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "500",
    color: "white"
  }
});

export default Toast;
