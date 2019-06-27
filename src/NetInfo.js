import React from "react";
import Toast from "./Toast";
import RNNetInfo from "@react-native-community/netinfo";

/**
 * @typedef {import("rn-notifier").NetInfoProps} Props
 * @extends {React.Component<Props>}
 */
class NetInfo extends React.Component {
  _unsubscribe = null;
  /**
   * @type {Props}
   */
  static defaultProps = {
    title: "Network is not available",
    message: "Your network is not available. Please check and try again."
  };

  componentDidMount() {
    this._unsubscribe = RNNetInfo.addEventListener(this._handleConnectionChange);
  }

  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe();
  }

  _handleConnectionChange = state => {
    const { title, message } = this.props;
    if (state.isConnected) {
      this.toastRef.hide();
    } else {
      this.toastRef.show(title, message, "Error", 0);
    }
  };

  render() {
    const { titleStyle, messageStyle } = this.props;
    return <Toast zIndex={6} titleStyle={titleStyle} messageStyle={messageStyle} ref={r => (this.toastRef = r)} />;
  }
}

export default NetInfo;
