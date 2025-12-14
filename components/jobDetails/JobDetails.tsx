import { AIRPORT_RATING } from "@/constants/AirportRating";
import Colors from "@/constants/Colors";
import { GOOD_TYPE } from "@/constants/GoodType";
import { MISSION_TYPE } from "@/constants/MissionType";
import { Job } from "@/model/jobType";
import { text } from "@/styling/commonStyle";
import { calculateDistanceNm } from "@/utility/distance";
import { eventEmitter, NotificationEvent } from "@/utility/eventEmitter";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { createNotification } from "../notificationBox/NotificationBox";
import { Text, View } from "../Themed";

const JobDetails = ({
  job,
  handleSelect,
  freePayload,
  departureAirport,
  activeOnPress = true,
}: {
  job: Job;
  handleSelect: React.Dispatch<React.SetStateAction<Job[]>>;
  freePayload?: number;
  departureAirport: Job | null;
  activeOnPress?: boolean;
}) => (
  <Pressable
    style={{
      gap: 1,
      backgroundColor: Colors.dark.secundary,
      width: "100%",
      padding: 10,
      borderRadius: 10,
      overflow: "visible",
    }}
    onPress={
      activeOnPress
        ? freePayload && freePayload > job.weight
          ? () => handleSelect((prev) => [...prev, job])
          : () =>
              eventEmitter.emit(
                NotificationEvent,
                createNotification(
                  "Not enough payload available.",
                  Colors.dark.warning
                )
              )
        : null
    }
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ paddingBottom: 10 }}>
        <Text style={text.title}>{`${job.nameAirport} `}</Text>
        <Text>{job.arrival}</Text>
      </Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 1,
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>
          <Text>Cash {job.reward}</Text>
          <Text style={text.symbolSize}>€</Text>
        </Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text
          style={{
            color:
              freePayload !== undefined && freePayload < job.weight
                ? "red"
                : "black",
          }}
        >
          Load {job.weight}lb
        </Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>Pax {job.pax}</Text>
      </View>
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "30%",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={16}
            color={"gray"}
          />
        </View>
        <Text>
          {departureAirport !== null &&
          departureAirport?.airport &&
          job?.airport ? (
            <Text>
              {calculateDistanceNm(
                departureAirport.airport?.latitude,
                departureAirport.airport?.longitude,
                job.airport?.latitude,
                job.airport?.longitude
              )}
              Nm
              <Text style={{ color: "lightgray" }}>{` (${job.dist})`}</Text>
            </Text>
          ) : (
            <Text>{job.dist}Nm</Text>
          )}
        </Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>Rank {job.rank}</Text>
      </View>
      <View
        style={{
          width: "30%",
          justifyContent: "flex-end",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          paddingVertical: 1,
        }}
      >
        {job?.missionType && MISSION_TYPE[job.missionType] ? (
          <View>{MISSION_TYPE[job.missionType].icon}</View>
        ) : (
          <Text>{job?.missionType || "Unkown"}</Text>
        )}
        {job.good && GOOD_TYPE[job.good.type] ? (
          <View>{GOOD_TYPE[job.good.type].icon}</View>
        ) : (
          <Text>{job?.good?.name}</Text>
        )}
        {job.stackable === 1 && (
          <FontAwesome6 name="boxes-stacked" size={15} color="gray" />
        )}
      </View>
    </View>
    {job?.airport && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 2,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <MaterialCommunityIcons
              name="road"
              size={15}
              color={
                job?.airport?.nrRunwayHard > 0
                  ? "gray"
                  : job?.airport?.nrRunwaySoft > 0
                  ? "brown"
                  : "purple"
              }
            />
          </View>
          <Text>{job.airport.longestRunwayLength}Nm</Text>
        </View>
        <View
          style={{
            width: "30%",
            alignItems: "center",
          }}
        >
          <Text>Heading {job.airport.longestRunwayHeading.toFixed(0)}°</Text>
        </View>
        <View
          style={{
            width: "30%",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "row",
            gap: 3,
          }}
        >
          <View style={{ borderRadius: 5, backgroundColor: "gray" }}>
            {AIRPORT_RATING[job?.airport?.rating ?? -1]}
          </View>
          <Text>
            {job?.airport.nrRunwayLight > 0 ? (
              <MaterialCommunityIcons
                name="alarm-light"
                size={16}
                color="orange"
              />
            ) : (
              <MaterialCommunityIcons
                name="alarm-light-off"
                size={16}
                color="gray"
              />
            )}
          </Text>
        </View>
      </View>
    )}
  </Pressable>
);

export default JobDetails;
