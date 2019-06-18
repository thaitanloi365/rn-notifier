import React from "react";
import { Image, Animated, Platform, Dimensions, StatusBar, StyleSheet, PanResponder, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");
const statusBarHeight =
  Platform.OS === "ios"
    ? height === 812 || width === 812 || (height === 896 || width === 896)
      ? 44
      : 20
    : StatusBar.currentHeight;

const TypeProps = {
  Warn: {
    source: require("./images/toastWarn.png"),
    color: "#cd853f"
  },
  Error: {
    source: require("./images/toastError.png"),
    color: "#cc3232"
  },
  Info: {
    source: require("./images/toastInfo.png"),
    color: "#2B73B6"
  },
  Success: {
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
    contentHeight: 200,
    isDisableInteraction: false
  };

  static defaultProps = {
    typeProps: TypeProps,
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
    type = "Error",
    duration = 4000,
    onShow,
    onClose,
    isDisableInteraction,
    activeStatusBarType = "light-content",
    deactiveStatusBarType = "dark-content"
  ) => {
    this.setState(
      {
        title,
        message,
        showing: true,
        activeStatusBarType,
        deactiveStatusBarType,
        type,
        duration,
        isDisableInteraction
      },
      () => {
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
    const { type, title = "", message, animatedPan, isDisableInteraction, showing, contentHeight = 0 } = this.state;
    const { style, typeProps } = this.props;

    const typeProp = typeProps[type];
    const source = typeProp.source;
    const color = typeProp.color;
    const animationStyle = this._getAnimationStyle();
    const panStyle = {
      transform: animatedPan.getTranslateTransform()
    };
    const displayTitle = title !== "";
    const hideRestView = showing && isDisableInteraction;
    const restViewHeight = height - contentHeight;
    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[styles.toast, panStyle, animationStyle, { backgroundColor: color }]}
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
        {hideRestView && <View style={{ flex: 1, height: restViewHeight }} pointerEvents="none" />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    padding: 8
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    marginRight: 10
  },
  toast: {
    flexDirection: "row",
    paddingTop: statusBarHeight,
    paddingBottom: 10
  },
  container: {
    position: "absolute",
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
