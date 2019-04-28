import React from "react";
import Overlay from "./Overlay";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const AlertMaxWidth = width * 0.8;
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
    onHide: null
  };

  show = (title, message, onShow, onHide) => {
    this.setState({ title, message, onShow, onHide }, () => this.overlayRef.show());
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
    const { HeaderComponent } = this.props;
    const { title } = this.state;
    if (typeof title !== "string" || title === "") return null;
    if (React.isValidElement(HeaderComponent)) {
    }

    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.header}>{title}</Text>
      </View>
    );
  };

  _renderBody = () => {
    const { HeaderComponent } = this.props;
    const { message = "Default message" } = this.state;

    if (React.isValidElement(HeaderComponent)) {
    }

    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.content}>{message}</Text>
      </View>
    );
  };

  _renderBottom = () => {
    const { onHide } = this.state;
    const confirm = typeof onHide === "function" && onHide !== null;
    const {
      buttonContainer,
      positiveButtonStyle,
      positiveButtonTitle = "Ok",
      positiveButtonTitleStyle,
      negativeButtonStyle,
      negativeButtonTitle = "Cancel",
      negativeButtonTitleStyle
    } = this.props;

    return (
      <View style={[styles.bottomContainer, buttonContainer]}>
        {confirm && (
          <TouchableOpacity
            onPress={this.hide}
            style={[styles.negativeButton, negativeButtonStyle]}
          >
            <Text style={[styles.negativeButtonTitle, negativeButtonTitleStyle]}>
              {negativeButtonTitle}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={this.hide}
          style={[styles.positiveButton, positiveButtonStyle, { flex: confirm ? 1 : 0.6 }]}
        >
          <Text style={[styles.positiveButtonTitle, positiveButtonTitleStyle]}>
            {positiveButtonTitle}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      useModal,
      animationDuration = 200,
      animationType = "scale",
      modalBackgroundColor,
      style
    } = this.props;
    return (
      <Overlay
        style={style}
        animationDuration={animationDuration}
        modalBackgroundColor={modalBackgroundColor}
        animationType={animationType}
        contentStyle={{
          maxWidth: AlertMaxWidth,
          maxHeight: AlertMaxHeight
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
    marginTop: 20
  },
  content: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    marginVertical: 20
  },
  bottomContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "gray",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  positiveButton: {
    flex: 1,
    alignItems: "center"
  },
  positiveButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(0,122,255)",
    paddingVertical: 12
  },
  negativeButton: {
    flex: 1,
    alignItems: "center"
  },
  negativeButtonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgb(255,59,48)",
    paddingVertical: 12
  }
});

export default Alert;
