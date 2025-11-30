import Colors from "@/constants/Colors";
import { ColorValue } from "react-native";
import { Text, View } from "../Themed";

const Badge = ({
  text,
  color = Colors.dark.warning,
}: {
  text: string | number;
  color?: ColorValue;
}) => (
  <View
    style={{
      position: "absolute",
      padding: 2,
      paddingHorizontal: 4,
      borderRadius: 100,
      backgroundColor: color,
      top: -5,
      left: -5,
      zIndex: 10,
    }}
  >
    <Text>{text}</Text>
  </View>
);

export default Badge;
