import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactElement } from "react";

const size = 18;
const color = "white";

export const AIRPORT_RATING: Record<number, ReactElement> = {
  "-1": <FontAwesome name="question" size={size - 1} color={color} />,
  "0": <MaterialCommunityIcons name="size-xs" size={size} color={color} />,
  "1": <MaterialCommunityIcons name="size-s" size={size} color={color} />,
  "2": <MaterialCommunityIcons name="size-m" size={size} color={color} />,
  "3": <MaterialCommunityIcons name="size-l" size={size} color={color} />,
  "4": <MaterialCommunityIcons name="size-l" size={size} color={color} />,
  "5": <MaterialCommunityIcons name="size-xxl" size={size} color={color} />,
};
