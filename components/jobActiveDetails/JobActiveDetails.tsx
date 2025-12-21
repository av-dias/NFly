import Colors from "@/constants/Colors";
import { MISSION_TYPE } from "@/constants/MissionType";
import { Airport } from "@/model/airportType";
import { Job } from "@/model/jobType";
import { LOCALE } from "@/utility/calendar";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { Dispatch, useCallback, useState } from "react";
import { Animated, Pressable } from "react-native";
import CustomPressable from "../customPressable";
import JobDetails from "../jobDetails";
import { Text, View } from "../Themed";

const JobActiveDetails = ({
  job,
  visible,
  setVisible,
  handleRemoveJob,
  departureAirport,
  activeOnPress = false,
  isSmall = false,
}: {
  job: Job;
  visible: number;
  handleRemoveJob: () => Promise<void>;
  setVisible: Dispatch<React.SetStateAction<number>>;
  departureAirport: Airport | null | undefined;
  activeOnPress?: boolean;
  isSmall?: boolean;
}) => {
  const [message, setMessage] = useState("");
  const fadeAnim = new Animated.Value(0);

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        setMessage(MISSION_TYPE[job.missionType].description);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setVisible(0);
            setMessage("");
          });
        }, 5000);
      }
    }, [visible])
  );

  return (
    <View>
      <Text style={{ fontSize: 12, paddingLeft: 5 }}>
        {new Date(job.expiration).toLocaleString(LOCALE)}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between",
          position: "absolute",
          right: 5,
          top: 20,
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => setVisible(job.id)}
          style={{
            zIndex: 10,
            backgroundColor: Colors.dark.accent,
            borderRadius: 10,
            padding: 3,
          }}
        >
          <Feather name="info" size={20} color={Colors.dark.text} />
        </Pressable>
        <CustomPressable
          color={Colors.dark.accent}
          text={"-"}
          padding={10}
          paddingVertical={4}
          onPress={handleRemoveJob}
        />
      </View>
      {visible === job.id ? (
        <View
          style={{
            backgroundColor: Colors.dark.secundary,
            width: "100%",
            height: 125,
            padding: 10,
            borderRadius: 10,
            overflow: "visible",
            gap: 5,
          }}
        >
          {message.split("\n").map((text) => (
            <View key={job.arrival + text}>
              <Text>{text}</Text>
            </View>
          ))}
        </View>
      ) : (
        <JobDetails
          job={job}
          activeOnPress={activeOnPress}
          handleSelect={() => {}}
          departureAirport={departureAirport}
          isSmall={isSmall}
        />
      )}
    </View>
  );
};

export default JobActiveDetails;
