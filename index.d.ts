declare module "rn-dialog" {
  import React from "react";
  import { Animated, ViewProps, StyleProp, ViewStyle } from "react-native";

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

  export default class Overlay extends React.Component<OverlayProps, OverlayState> {
    show: (onShow?: () => void) => void;
    hide: (onHide?: () => void) => void;
  }
}
