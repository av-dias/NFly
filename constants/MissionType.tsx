import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

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
  92: {
    name: "Humanitarian",
    description:
      "Fly humanitarian aid to specific areas. Watch out for missile fire in high-risk zones!",
    icon: "m8.png",
  },
  97: {
    name: "Express",
    description:
      "Cargo missions with a deadline. Deadline and mail weight are shown in the search table.",
    icon: "m7.png",
  },
  8: {
    name: "Sightseeing",
    description: "Fly to a Point of Interest. Circle the POI below 1000ft.",
    icon: <FontAwesome5 name="monument" size={size - 2} color={color} />,
  },

  99: {
    name: "Live Emergency",
    description:
      "Emergency missions generated using real-life road traffic data (Bing). Not available in all regions.",
    icon: "m9.png",
  },
  910: {
    name: "Humanitarian Drops",
    description:
      "Drop humanitarian aid below 1000ft near the target. Avoid missile fire in high-risk areas.",
    icon: "m8.png",
  },
  911: {
    name: "Airline",
    description:
      "Scheduled commercial flights between hubs. Requires updated hub database (NeoFly 3.11.2+).",
    icon: "m12.png",
  },
  912: {
    name: "Sensitive Cargo",
    description:
      "Fly cargo that requires a soft landing (vertical speed < -200). Harsh landings will ruin the cargo.",
    icon: "heli.png",
  },
  914: {
    name: "Rescue / SAR (Search and Rescue)",
    description:
      "Locate distress beacons and rescue survivors. Land near the emergency or fly to an airport.",
    icon: "r3.png",
  },
  915: {
    name: "VIPs",
    description: "Transport VIPs smoothly (avoid banking/pitching > 45°).",
    icon: "m15.png",
  },
  916: {
    name: "Interception",
    description:
      "Scramble to intercept unauthorized aircraft. Follow the target and log its ID.",
    icon: "r3.png",
  },
  918: {
    name: "Emergency",
    description:
      "Fly emergency services to an incident. Land within 3 miles of the emergency for a bonus.",
    icon: "m18.png",
  },

  920: {
    name: "Advertising",
    description:
      "Tow a banner between waypoints. Requires the 'Bagolu Cessna 152' and additional download. Use parking brake to drop/release the banner.",
    icon: "Parachute.png",
    notes:
      "Download and install the banner mod in your community folder. Press CTRL+W to release the banner.",
  },
  921: {
    name: "Parachuting",
    description:
      "Fly parachutists to a drop zone. Release them with the parking brake, then return to base for more groups.",
    icon: "r1.png",
  },
  22: {
    name: "Transport (PAX)",
    description: "Transport passengers from one airport to another. ",
    icon: <MaterialIcons name="flight-takeoff" size={size} color={color} />,
  },
  923: {
    name: "Helicopter VIPs",
    description:
      "Fly VIPs in a helicopter to non-airport destinations (e.g., golf courses, ski resorts).",
    icon: "heli.png",
  },
  924: {
    name: "Secret Passenger",
    description:
      "Fly mysterious passengers to their destination. Only available between 01:00 and 03:00 (local time).",
    icon: "m16.png",
  },
  925: {
    name: "Pizza",
    description:
      "Fly 'pizza' (suspect cargo) below 1000ft to avoid detection. Drop the cargo at the designated zone.",
    icon: "m16.png",
    notes: "Avoid radar detection and fly low!",
  },
  926: {
    name: "Wildfire",
    description:
      "Locate and extinguish fires. Fill water tanks by flying over water (<30ft) and drop water on fires. Requires the NeoFly-smokes addon.",
    icon: "Fire.png",
    notes:
      "Use the parking brake to fill/drop water. Listen for audio cues (water filling/dropping).",
  },
};
