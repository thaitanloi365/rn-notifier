import React from "react";
import Overlay from "./Overlay";
import { View, ActivityIndicator, Text, StyleSheet, Platform } from "react-native";
/**
 * @typedef {import("rn-notifier").LoadingProps} Props
 * @extends {React.Component<Props>}
 */

class Loading extends React.Component {
  state = {
    message: ""
  };
  /**
   * @type {Props}
   */
  static defaultProps = {
    rasied: false,
    indicatorProps: {
      color: "white",
      size: "large",
      hidesWhenStopped: true,
      animating: true
    }
  };

  show = (message, onShow) => {
    if (message && message !== "") {
      this.setState({ message }, () => this.overlayRef.show(onShow));
    } else {
      this.overlayRef.show(onShow);
    }
  };

  hide = onHide => {
    this.overlayRef.hide(onHide);
  };

  _renderContent = () => {
    const { ContentComponent, contentContainerStyle, messageTextStyle, rasied } = this.props;
    const { message = "" } = this.state;
    const displayMessage = message !== "";

    if (ContentComponent && typeof ContentComponent === "function") {
      return ContentComponent({ message });
    }

    return (
      <View
        style={[
          styles.row,
          rasied && styles.raised,
          { backgroundColor: displayMessage ? "white" : "transparent" },
          contentContainerStyle
        ]}
      >
        {this._renderIndicator()}
        {displayMessage && <Text style={[styles.text, messageTextStyle]}>{message}</Text>}
      </View>
    );
  };

  _renderIndicator = () => {
    const { IndicatorComponent, indicatorProps } = this.props;
    if (IndicatorComponent && typeof IndicatorComponent === "function") {
      // @ts-ignore
      return IndicatorComponent();
    }
    if (React.isValidElement(IndicatorComponent)) {
      return IndicatorComponent;
    }

    const { message } = this.state;
    const { color: defaultColor, size = "small", style, ...other } = indicatorProps;
    const color = message === "" ? "white" : "black";
    return <ActivityIndicator style={[styles.indicator, style]} color={color} size={size} {...other} />;
  };

  render() {
    const {
      useModal,
      modalBackgroundColor,
      animationDuration = 100,
      animationType = "fade",
      overlayContentStyle,
      overlayStyle
    } = this.props;
    return (
      <Overlay
        ref={r => (this.overlayRef = r)}
        useModal={useModal}
        modalBackgroundColor={modalBackgroundColor}
        animationDuration={animationDuration}
        animationType={animationType}
        contentStyle={overlayContentStyle}
        style={overlayStyle}
      >
        {this._renderContent()}
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    marginVertical: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,

    borderRadius: 4
  },
  raised: {
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowRadius: 6,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2
      },
      android: { elevation: 6 }
    })
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "300",
    color: "black"
  }
});
export default Loading;
