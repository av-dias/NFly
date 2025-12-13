import Colors from "@/constants/Colors";
import { Job } from "@/model/jobType";
import { text } from "@/styling/commonStyle";
import { calculateDistanceNm } from "@/utility/distance";
import { Pressable } from "react-native";
import Badge from "../badge";
import { Text, View } from "../Themed";

const JobDetailsCompact = ({
  job,
  isSelected,
  handleSelect,
  freePayload,
  departureAirport,
  index,
}: {
  job: Job;
  isSelected: boolean;
  handleSelect: React.Dispatch<React.SetStateAction<Job[]>>;
  freePayload?: number;
  departureAirport: Job | null;
  index?: number;
}) => (
  <Pressable
    style={{
      gap: 1,
      backgroundColor: isSelected ? Colors.dark.accent : Colors.dark.secundary,
      width: 150,
      padding: 10,
      borderRadius: 10,
      overflow: "visible",
    }}
    onPress={() =>
      handleSelect((prev) => {
        if (prev.includes(job)) {
          return prev.filter((p) => p.id != job.id);
        } else {
          return [...prev, job];
        }
      })
    }
  >
    {index != undefined && <Badge text={index} />}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ paddingBottom: 10 }}>
        <Text style={text.title}>{job.arrival.substring(0, 15)}</Text>
      </Text>
    </View>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 1,
      }}
    >
      <View style={{ width: 50, alignItems: "flex-start" }}>
        <Text>
          <Text>Cash {job.reward}</Text>
          <Text style={text.symbolSize}>€</Text>
        </Text>
      </View>
      <View style={{ width: 50, alignItems: "center" }}>
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
        <Text>
          Nm{" "}
          {departureAirport !== null &&
          departureAirport?.airport &&
          job?.airport
            ? calculateDistanceNm(
                departureAirport.airport?.latitude,
                departureAirport.airport?.longitude,
                job.airport?.latitude,
                job.airport?.longitude
              )
            : job.dist}
        </Text>
      </View>
    </View>
  </Pressable>
);

export default JobDetailsCompact;
