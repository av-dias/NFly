import { moderateScale, verticalScale } from "@/utility/responsive";
import { StatusBar, TextStyle } from "react-native";

const properties = {
  mainPaddingHorizontal: 5,
  paddingHorizontal: moderateScale(15),
  borderRadius: 10,
  boxPaddingVertical: moderateScale(10),
  boxPaddingHorizontal: moderateScale(0),
  naviagtionBarHeight: verticalScale(110),
  statusBarHeight: verticalScale(StatusBar.currentHeight || 0),
  onPressBounce: (
    pressed: any,
    style: any,
    onPressCallback: any,
    padding = 2
  ) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && padding : null,
    },
  ],
  onBarPressBounce: (pressed: any, style: any, onPressCallback: any) => [
    {
      ...style,
      opacity: pressed ? onPressCallback && 0.8 : 1,
      paddingHorizontal: pressed ? onPressCallback && 1 : null,
    },
  ],
};

const text: { [name: string]: TextStyle } = {
  text: {},
  title: { fontSize: 16, fontWeight: "bold" },
  textSecundary: {},
  symbolSize: { fontSize: verticalScale(8) },
  smTextSize: { fontSize: verticalScale(9) },
  mdTextSize: { fontSize: verticalScale(10) },
  lgTextSize: { fontSize: verticalScale(16) },
  bold: { fontWeight: "bold" },
};

export { properties as commonStyles, text };
