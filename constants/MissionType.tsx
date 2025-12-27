import {
  AntDesign,
  Entypo,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

interface MissionDetails {
  name: string;
  description: string;
  icon: React.ReactNode;
  notes?: string;
}

const size = 18;
const color = "gray";

export const MISSION_TYPE: Record<number, MissionDetails> = {
  1: {
    name: "Cargo",
    description: "Load cargo and fly it to the destination.",
    icon: <FontAwesome6 name="box-open" size={size - 1} color={color} />,
  },
  2: {
    name: "Express",
    description: "TTL Deadline.",
    icon: <FontAwesome6 name="box-open" size={size - 1} color={color} />,
  },
  3: {
    name: "Sensitive",
    description: "Land <200fpm.",
    icon: <FontAwesome6 name="box-open" size={size - 1} color={color} />,
  },
  6: {
    name: "Emergency",
    description:
      "Fly emergency services to an incident. Land within 3 miles of the emergency for a bonus.",
    icon: (
      <MaterialCommunityIcons name="hospital" size={size + 1} color={color} />
    ),
  },
  8: {
    name: "Sightseeing",
    description: "Circle POI <=1000ft.",
    icon: <FontAwesome5 name="monument" size={size - 2} color={color} />,
  },
  14: {
    name: "Rescue / SAR (Search and Rescue)",
    description:
      "Locate distress beacons and rescue survivors. Land near the emergency or fly to an airport.",
    icon: <Entypo name="lifebuoy" size={size - 1} color={color} />,
  },
  18: {
    name: "Advertising",
    description:
      "Tow a banner between waypoints. Requires the 'Bagolu Cessna 152' and additional download. Use parking brake to drop/release the banner.",
    icon: <FontAwesome5 name="adversal" size={size} color={color} />,
    notes:
      "Download and install the banner mod in your community folder. Press CTRL+W to release the banner.",
  },
  20: {
    name: "Wildfire",
    description:
      "Locate and extinguish fires. Fill water tanks by flying over water (<30ft and parking brake) and drop water on fires. Requires the NeoFly-smokes addon.",
    icon: <AntDesign name="fire" size={size - 1} color={color} />,
    notes:
      "Use the parking brake to fill/drop water. Listen for audio cues (water filling/dropping).",
  },
  22: {
    name: "Transport (PAX)",
    description: "Transport passengers from one airport to another. ",
    icon: <MaterialIcons name="flight-takeoff" size={size} color={color} />,
  },
  25: {
    name: "Hazardouse",
    description: "Land <200fpm.\nPitch <31.\nBank <31.\nVS <500.\n",
    icon: <FontAwesome6 name="box-open" size={size - 1} color={color} />,
  },
  92: {
    name: "Humanitarian",
    description:
      "Fly humanitarian aid to specific areas. Watch out for missile fire in high-risk zones!",
    icon: null,
  },
  97: {
    name: "Express",
    description:
      "Cargo missions with a deadline. Deadline and mail weight are shown in the search table.",
    icon: null,
  },

  99: {
    name: "Live Emergency",
    description:
      "Emergency missions generated using real-life road traffic data (Bing). Not available in all regions.",
    icon: null,
  },
  910: {
    name: "Humanitarian Drops",
    description:
      "Drop humanitarian aid below 1000ft near the target. Avoid missile fire in high-risk areas.",
    icon: null,
  },
  911: {
    name: "Airline",
    description:
      "Scheduled commercial flights between hubs. Requires updated hub database (NeoFly 3.11.2+).",
    icon: null,
  },
  912: {
    name: "Sensitive Cargo",
    description:
      "Fly cargo that requires a soft landing (vertical speed < -200). Harsh landings will ruin the cargo.",
    icon: null,
  },
  915: {
    name: "VIPs",
    description: "Transport VIPs smoothly (avoid banking/pitching > 45°).",
    icon: null,
  },
  916: {
    name: "Interception",
    description:
      "Scramble to intercept unauthorized aircraft. Follow the target and log its ID.",
    icon: null,
  },
  921: {
    name: "Parachuting",
    description:
      "Fly parachutists to a drop zone. Release them with the parking brake, then return to base for more groups.",
    icon: null,
  },
  923: {
    name: "Helicopter VIPs",
    description:
      "Fly VIPs in a helicopter to non-airport destinations (e.g., golf courses, ski resorts).",
    icon: null,
  },
  924: {
    name: "Secret Passenger",
    description:
      "Fly mysterious passengers to their destination. Only available between 01:00 and 03:00 (local time).",
    icon: null,
  },
  925: {
    name: "Pizza",
    description:
      "Fly 'pizza' (suspect cargo) below 1000ft to avoid detection. Drop the cargo at the designated zone.",
    icon: null,
    notes: "Avoid radar detection and fly low!",
  },
};
