import React from "react";
import Overlay from "./Overlay";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const AlertMaxWidth = width * 0.9;
const AlertMinWidth = width * 0.6;
const AlertMaxHeight = height * 0.8;

/**
 * @typedef {import("rn-notifier").AlertProps} Props
 * @extends {React.Component<Props>}
 */
class Alert extends React.Component {
  state = {
    title: "",
    message: "",
    onShow: null,
    onHide: null,
    okButtonText: "OK",
    cancelButtonText: "CANCEL"
  };

  show = (title, message, onShow, onHide, okButtonText, cancelButtonText) => {
    this.setState({ title, message, onShow, onHide, okButtonText, cancelButtonText }, () => this.overlayRef.show());
  };

  hide = () => {
    this.overlayRef.hide(() => {
      const { onShow, onHide } = this.state;
      if (typeof onShow === "function" && onShow !== null) {
        onShow();
      }
      if (typeof onHide === "function" && onHide !== null) {
        onHide();
      }
      this.setState({ title: "", message: "", onShow: null, onHide: null });
    });
  };

  _renderHeader = () => {
    const { HeaderComponent, titleContainerStyle, titleStyle } = this.props;
    const { title } = this.state;
    if (typeof title !== "string" || title === "") return null;
    if (React.isValidElement(HeaderComponent)) {
    }

    return (
      <View style={[{ alignItems: "flex-start", alignSelf: "stretch" }, titleContainerStyle]}>
        <Text style={[styles.header, titleStyle]}>{title}</Text>
      </View>
    );
  };

  _renderBody = () => {
    const { HeaderComponent, messageContainerStyle, messageStyle } = this.props;
    const { message = "Default message" } = this.state;

    if (React.isValidElement(HeaderComponent)) {
    }

    return (
      <View style={[{ alignItems: "flex-start", alignSelf: "stretch" }, messageContainerStyle]}>
        <Text style={[styles.content, messageStyle]}>{message}</Text>
      </View>
    );
  };

  _renderBottom = () => {
    const { onHide, okButtonText, cancelButtonText } = this.state;
    const confirm = typeof onHide === "function" && onHide !== null;
    const {
      buttonContainer,
      positiveButtonStyle,
      positiveButtonTitle = okButtonText || "OK",
      positiveButtonTitleStyle,
      negativeButtonStyle,
      negativeButtonTitle = cancelButtonText || "CANCEL",
      negativeButtonTitleStyle
    } = this.props;

    return (
      <View style={[styles.bottomContainer, buttonContainer]}>
        {confirm && (
          <TouchableOpacity onPress={this.hide} style={[styles.negativeButton, negativeButtonStyle]}>
            <Text style={[styles.negativeButtonTitle, negativeButtonTitleStyle]}>{negativeButtonTitle}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={this.hide} style={[styles.positiveButton, positiveButtonStyle]}>
          <Text style={[styles.positiveButtonTitle, positiveButtonTitleStyle]}>{positiveButtonTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { useModal, animationDuration = 200, animationType = "scale", modalBackgroundColor, style } = this.props;
    return (
      <Overlay
        style={style}
        animationDuration={animationDuration}
        modalBackgroundColor={modalBackgroundColor}
        animationType={animationType}
        contentStyle={{
          minWidth: AlertMinWidth,
          maxWidth: AlertMaxWidth,
          maxHeight: AlertMaxHeight,
          paddingBottom: 0,
          ...styles.overlayContent
        }}
        useModal={useModal}
        ref={r => (this.overlayRef = r)}
      >
        {this._renderHeader()}
        {this._renderBody()}
        {this._renderBottom()}
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginLeft: 25,
    marginTop: 20,
    textAlign: "left"
  },
  overlayContent: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowRadius: 6,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2
      },
      android: {
        elevation: 4
      }
    })
  },
  content: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 25
  },
  bottomContainer: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignSelf: "stretch"
  },
  positiveButton: {
    alignItems: "center",
    minWidth: 80
  },
  positiveButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(0,122,255)",
    paddingVertical: 12
  },
  negativeButton: {
    alignItems: "center",
    minWidth: 80
  },
  negativeButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(255,59,48)",
    paddingVertical: 12
  }
});

export default Alert;
