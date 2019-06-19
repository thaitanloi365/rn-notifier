import React from "react";
import Toast from "./Toast";
import { Platform} from "react-native";
import RNNetInfo from "@react-native-community/netinfo";
/**
 * @typedef {import("rn-notifier").NetInfoProps} Props
 * @extends {React.Component<Props>}
 */
class NetInfo extends React.Component {
  /**
   * @type {Props}
   */
  static defaultProps = {
    title: "Network is not available",
    message: "Network is not available"
  };
  componentDidMount() {
    RNNetInfo.isConnected.addEventListener("connectionChange", this._handleConnectionChange);
    if (Platform.OS == "android") {
      RNNetInfo.isConnected.fetch().then(isConnected => {
        this._handleConnectionChange(isConnected);
      });
    }
  }

  componentWillUnmount() {
    RNNetInfo.isConnected.removeEventListener("connectionChange", this._handleConnectionChange);
  }

  _handleConnectionChange = isConnected => {
    const { title, messageStyle } = this.props;
    if (isConnected) {
      this.toastRef.hide();
    } else {
      this.toastRef.show(title, messageStyle, "Error", 0);
    }
  };
  render() {
    const { titleStyle, messageStyle } = this.props;
    return (
      <Toast titleStyle={titleStyle} messageStyle={messageStyle} ref={r => (this.toastRef = r)} />
    );
  }
}

export default NetInfo;
