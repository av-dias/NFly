import Colors from "@/constants/Colors";
import { ReactNode } from "react";
import { View } from "react-native";

type PropsWithChildren = {
  children: ReactNode;
};

const UsableScreen: React.FC<PropsWithChildren> = (props) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingTop: 40,
        gap: 10,
        backgroundColor: Colors.dark.background,
      }}
    >
      {props.children}
    </View>
  );
};

export default UsableScreen;
