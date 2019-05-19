declare module "rn-notifier" {
  import React from "react";
  import {
    Animated,
    ViewProps,
    StyleProp,
    ViewStyle,
    TextStyle,
    ActivityIndicatorProps,
    StatusBarStyle
  } from "react-native";

  type AnimationType =
    | "none"
    | "fade"
    | "scale"
    | "slideFromLeft"
    | "slideFromRight"
    | "slideFromBottom"
    | "slideFromTop";

  interface OverlayState {
    visible: boolean;
    animatedBackgroundOpacity: Animated.Value;
    animatedValue: Animated.Value;
    showContent: boolean;
  }

  interface OverlayProps extends ViewProps {
    onPressOutside?: () => void;
    modalBackgroundColor?: string;
    useModal?: boolean;
    animationDuration?: number;
    animationType?: AnimationType;
    contentStyle?: StyleProp<ViewStyle>;
  }

  interface AlertProps extends OverlayProps {
    HeaderComponent?: React.FunctionComponent | React.ReactElement;
    BodyComponent?: React.FunctionComponent | React.ReactElement;
    buttonContainer?: StyleProp<ViewStyle>;
    positiveButtonTitle?: string;
    positiveButtonTitleStyle?: StyleProp<TextStyle>;
    positiveButtonStyle?: StyleProp<ViewStyle>;
    negativeButtonTitle?: string;
    negativeButtonTitleStyle?: StyleProp<TextStyle>;
    negativeButtonStyle?: StyleProp<ViewStyle>;
  }

  interface LoadingProps extends OverlayProps {
    ContentComponent?: React.FunctionComponent<{ message: string }>;
    IndicatorComponent?: React.FunctionComponent | React.ReactElement;
    contentContainerStyle?: StyleProp<ViewStyle>;
    messageTextStyle?: StyleProp<TextStyle>;
    indicatorProps?: ActivityIndicatorProps;
  }

  type ToastMapTypes = {
    [key in ToastType]: {
      source: ImageSourcePropType;
      color: string;
    }
  };

  export type ToastType = "Info" | "Success" | "Error" | "Warn" | "Error";

  interface ToastState {
    type: ToastType;
    title: string;
    message: string;
    animatedValue: Animated.Value;
    activeStatusBarType: StatusBarStyle;
    deactiveStatusBarType: StatusBarStyle;
    duration: number;
    showing: boolean;
    animatedPan: Animated.ValueXY;
    contentHeight: number;
  }
  interface ToastProps extends ViewProps {
    typeProps?: ToastMapTypes;
    minmumHeightToClose?: number;
    titleStyle?: StyleProp<TextStyle>;
    messageStyle?: StyleProp<TextStyle>;
  }

  interface NetInfoProps extends ViewProps {
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    message?: string;
    messageStyle?: StyleProp<TextStyle>;
  }

  export class Overlay extends React.Component<OverlayProps, OverlayState> {
    show: (onShow?: () => void) => void;
    hide: (onHide?: () => void) => void;
  }

  export class Alert extends React.Component<AlertProps, any> {
    show: (title: string, message: string, onOK?: () => void, onCancel?: () => void) => void;
  }

  export class Loading extends React.Component<LoadingProps, any> {
    show: (message?: string, onShow?: () => void) => void;
    hide: (onHide?: () => void) => void;
  }

  export class Toast extends React.Component<ToastProps, ToastState> {
    show: (
      title: string,
      message: string,
      type: ToastType = "Info",
      duration: number = 0,
      onShow?: () => void,
      onClose?: () => void,
      activeStatusBarType: StatusBarStyle = "light-content",
      deactiveStatusBarType: StatusBarStyle = "dark-content"
    ) => void;
    hide: (onClose?: () => void) => void;
  }

  export class NetInfo extends React.Component<NetInfoProps, any> {}
}
