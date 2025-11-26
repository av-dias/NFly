import { FlatList, StyleSheet, Text, View } from "react-native";

import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Job } from "@/model/jobType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { text } from "@/styling/commonStyle";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";

export default function TabTwoScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
  } = useContext(AppContext);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [excess, setExcess] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const payload = player.freePayload ?? player.usablePayload;

        if (payload) {
          const jobsJson = await fetchWithTimeout(
            `http://${server}:8080/nf/jobs?weight=${payload}`
          );

          if (jobsJson) {
            const jobsData: Job[] = (await jobsJson?.json()).data;
            setJobs(jobsData);

            if (jobsData.length < 3) {
              setExcess(true);
              const alternativeJobJson = await fetchWithTimeout(
                `http://${server}:8080/nf/jobs?weight=${payload * 2}`
              );

              if (alternativeJobJson) {
                const jobsAlternativeData: Job[] = (
                  await alternativeJobJson?.json()
                ).data;
                setJobs(jobsAlternativeData);
              }
            } else {
              setExcess(false);
            }
          }
        }
      }
      if (isServerOnline) fetchData();
    }, [isServerOnline, refresh])
  );

  return (
    <UsableScreen>
      <View
        style={{
          paddingHorizontal: 5,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={[text.title, text.lgTextSize]}>
          Jobs Available for Payload
        </Text>
        {excess && (
          <Text style={[text.title, text.lgTextSize, { color: "red" }]}>
            Excess
          </Text>
        )}
      </View>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          borderRadius: 10,
          gap: 15,
        }}
        showsVerticalScrollIndicator={false}
        data={jobs}
        renderItem={(job) => (
          <View
            style={{
              gap: 1,
              backgroundColor: Colors.dark.secundary,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ paddingBottom: 10 }}>
              <Text style={text.title}>{job.item.nameAirport}</Text>
              <Text> </Text>
              <Text>{job.item.arrival}</Text>
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: "30%", alignItems: "flex-start" }}>
                <Text>
                  <Text>Cash {job.item.reward}</Text>
                  <Text style={text.symbolSize}>€</Text>
                </Text>
              </View>
              <View style={{ width: "30%", alignItems: "center" }}>
                <Text>Load {job.item.weight}lb</Text>
              </View>
              <View style={{ width: "30%", alignItems: "flex-end" }}>
                <Text>Pax {job.item.pax}</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: "30%", alignItems: "flex-start" }}>
                <Text>{job.item.dist}Nm</Text>
              </View>
              <View style={{ width: "30%", alignItems: "center" }}>
                <Text>Exp {job.item.xp}</Text>
              </View>
              <View style={{ width: "30%", alignItems: "flex-end" }}>
                <Text>Rank {job.item.rank}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()} // or a unique ID from your data
        initialNumToRender={10} // Number of items to render initially
        maxToRenderPerBatch={5} // Number of items to render in each batch
        windowSize={1} // Number of items to render outside the visible area
      />
    </UsableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
