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
    onOk: null,
    onCancel: null,
    okButtonText: "OK",
    cancelButtonText: "CANCEL"
  };

  show = (title, message, onOk, onCancel, okButtonText, cancelButtonText) => {
    this.setState({ title, message, onOk, onCancel, okButtonText, cancelButtonText }, () => this.overlayRef.show());
  };

  _onOk = () => {
    this.overlayRef.hide(() => {
      const { onOk } = this.state;
      if (typeof onOk === "function" && onOk !== null) {
        onOk();
      }
      this.setState({ title: "", message: "", onOk: null, onCancel: null });
    });
  };

  _onCancel = () => {
    this.overlayRef.hide(() => {
      const { onCancel } = this.state;
      if (typeof onCancel === "function" && onCancel !== null) {
        onCancel();
      }
      this.setState({ title: "", message: "", onOk: null, onCancel: null });
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
    const { onCancel, okButtonText, cancelButtonText } = this.state;
    const confirm = typeof onCancel === "function" && onCancel !== null;
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
          <TouchableOpacity onPress={this._onCancel} style={[styles.negativeButton, negativeButtonStyle]}>
            <Text style={[styles.negativeButtonTitle, negativeButtonTitleStyle]}>{negativeButtonTitle}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={this._onOk} style={[styles.positiveButton, positiveButtonStyle]}>
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
    marginHorizontal: 25,
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
    alignItems: "center"
  },
  positiveButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(0,122,255)",
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  negativeButton: {
    alignItems: "center"
  },
  negativeButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(255,59,48)",
    paddingVertical: 12,
    paddingHorizontal: 20
  }
});

export default Alert;
