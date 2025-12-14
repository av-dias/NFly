import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "./Colors";

interface RankDetails {
  name: string;
  icon: React.ReactNode;
}

const size = 18;
const color = Colors.dark.accent;

export const RANK_TYPE: Record<number, RankDetails> = {
  1: {
    name: "Cadet",
    icon: (
      <View>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={size - 1}
          color={"gray"}
        />
      </View>
    ),
  },
  2: {
    name: "Second-Officer",
    icon: (
      <View>
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 1}
          color={color}
        />
      </View>
    ),
  },
  3: {
    name: "Officer",
    icon: (
      <View>
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 2}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 2}
          color={color}
        />
      </View>
    ),
  },
  4: {
    name: "Captain",
    icon: (
      <View>
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 3}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 3}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 3}
          color={color}
        />
      </View>
    ),
  },
  5: {
    name: "Senior-Captain",
    icon: (
      <View>
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 4}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 4}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 4}
          color={color}
        />
        <MaterialIcons
          name="keyboard-double-arrow-down"
          size={size - 4}
          color={color}
        />
      </View>
    ),
  },
};
