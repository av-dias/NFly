import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const heightTreshold = 800;

const horizontalScale = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};
const verticalScale = (size: number) => {
  return (height / guidelineBaseHeight) * size;
};

const moderateScale = (size: number, factor = 2) => {
  return size + (horizontalScale(size) - size) * factor;
};

const largeScale = (size: number, factor = 10) => {
  return size + (horizontalScale(size) - size) * factor;
};

const inverseScale = (size: number, factor = 1 / 2) => {
  return size + (horizontalScale(size) - size) * factor;
};

export {
  horizontalScale,
  verticalScale,
  moderateScale,
  largeScale,
  inverseScale,
  heightTreshold,
};
