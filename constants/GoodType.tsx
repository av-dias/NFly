import { Entypo, Foundation, MaterialCommunityIcons } from "@expo/vector-icons";

interface MissionDetails {
  name: string;
  description: string;
  icon: React.ReactNode;
  notes?: string;
}

const size = 18;
const color = "gray";

export const GOOD_TYPE: Record<number, MissionDetails> = {
  0: {
    name: "Rare",
    description: "Load cargo and fly it to the destination.",
    icon: (
      <MaterialCommunityIcons
        name="treasure-chest-outline"
        size={size}
        color={color}
      />
    ),
  },
  1: {
    name: "Normal",
    description: "No special requirements.",
    icon: <Entypo name="box" size={size} color={color} />,
  },
  2: {
    name: "Fragile",
    description: "Soft Landing.",
    icon: (
      <MaterialCommunityIcons name="glass-fragile" size={size} color={color} />
    ),
  },
  3: {
    name: "Perishable",
    description: "Deliver before Time to Live (TTL in hours).",
    icon: <Entypo name="time-slot" size={size} color={color} />,
  },
  4: {
    name: "Illegal",
    description: "Altitude below 1000ft to avoid detection.",
    icon: <Foundation name="prohibited" size={size} color={color} />,
  },
  6: {
    name: "Hazardous",
    description:
      "Soft landing with pitch, bank and vertical speed limitations.",
    icon: (
      <MaterialCommunityIcons
        name="radioactive-circle-outline"
        size={size}
        color={color}
      />
    ),
  },
};
