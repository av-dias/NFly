import CustomPressable from "@/components/customPressable";
import JobDetails from "@/components/jobDetails";
import JobDetailsCompact from "@/components/jobDetailsCompact";
import ModalCustom from "@/components/modal/modal";
import { NotificationBox } from "@/components/notificationBox/NotificationBox";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { GOOD_TYPE } from "@/constants/GoodType";
import { AppContext } from "@/contexts/appContext";
import { Job } from "@/model/jobType";
import { PlaneJob } from "@/model/planeJobType";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { text } from "@/styling/commonStyle";
import { loadHoursMinutes } from "@/utility/calendar";
import {
  calculateDistanceNm,
  loadEstimatedFlightTime,
} from "@/utility/distance";
import { delay } from "@/utility/timer";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import LoadingIndicator from "../../components/loadingIndicator";

const handleAddJob = async (jobs: Job[], player: Player, server: string) => {
  for (const job of jobs) {
    await fetchWithTimeout(`http://${server}:8080/nf/plane-jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planeId: player.currentPlane, jobId: job.id }),
    });
    await delay(500);
  }
};

const loadRange = (player: Player): number => {
  if (player.maxDistance && player.fuelPercentage)
    return Number((player.maxDistance * player.fuelPercentage).toFixed(0));
  else return 1000;
};

const loadAvailablePayload = (payload: number | undefined, jobs: Job[]) => {
  return Number(
    ((payload || 500) - jobs.reduce((acc, job) => acc + job.weight, 0)).toFixed(
      0
    )
  );
};

const isJobSelected = (job: Job, jobsSelected: Job[]) => {
  return jobsSelected.includes(job);
};

export default function TabTwoScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
  } = useContext(AppContext);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [range, setRange] = useState<number>(loadRange(player));
  const [jobsSelected, setJobsSelected] = useState<Job[]>([]);
  const [freePayload, setFreePayload] = useState<number>(
    loadAvailablePayload(
      player.freePayload ?? player.usablePayload,
      jobsSelected
    )
  );
  const [filter, setFilter] = useState(-1);
  const [activeJobs, setActiveJobs] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);

        // Check active jobs to filter
        const activeJobsJson = await fetchWithTimeout(
          `http://${server}:8080/nf/plane-jobs`
        );

        if (activeJobsJson) {
          const activeJobsData: PlaneJob[] = (await activeJobsJson?.json())
            .data;
          setActiveJobs(activeJobsData.map((a) => a.jobId));
        }

        // Load jobs based on payload available
        let payload = freePayload;

        if (jobsSelected.length > 0) {
          payload = loadAvailablePayload(
            player.freePayload ?? player.usablePayload,
            jobsSelected
          );
          setFreePayload(payload);
        }

        if (!freePayload || isNaN(freePayload)) payload = 1;

        if (payload) {
          const jobsJson = await fetchWithTimeout(
            `http://${server}:8080/nf/jobs?weight=${payload}&dist=${range}`
          );

          if (jobsJson) {
            const jobsData: Job[] = (await jobsJson?.json()).data;
            setJobs(jobsData);

            if (jobsData?.length < 3) {
              const alternativeJobJson = await fetchWithTimeout(
                `http://${server}:8080/nf/jobs?weight=${payload * 2}`
              );

              if (alternativeJobJson) {
                const jobsAlternativeData: Job[] = (
                  await alternativeJobJson?.json()
                ).data;
                setJobs(
                  jobsAlternativeData.sort((j1, j2) => j1.weight - j2.weight)
                );
              }
            }
          }
        }
        setLoading(false);
      }
      if (isServerOnline) fetchData();
    }, [isServerOnline, player, range, jobsSelected, refresh, freePayload])
  );

  return (
    <UsableScreen>
      <LoadingIndicator isLoading={isLoading} />
      <NotificationBox />
      <ModalCustom
        modalVisible={modal}
        setModalVisible={() => setModal(false)}
        size={2}
      >
        <View style={{ padding: 20, gap: 20 }}>
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={text.title}>
              {jobsSelected.map((j) => j.arrival).join(" -> ")}
            </Text>
            <Text>Payload {player.freePayload}lb</Text>
            <Text>
              Pax {jobsSelected.reduce((acc, job) => job.pax + acc, 0)}
            </Text>
            <Text>
              Range {jobsSelected.reduce((acc, job) => job.dist + acc, 0)}lb
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}
          >
            <CustomPressable
              color={Colors.dark.warning}
              text={"Cancel"}
              onPress={() => setModal(false)}
            />
            <CustomPressable
              color={Colors.dark.success}
              text={"Apply"}
              onPress={async () => {
                setLoading(true);
                await handleAddJob(jobsSelected, player, server);
                setModal(false);
                setJobsSelected([]);
                setLoading(false);
              }}
            />
          </View>
        </View>
      </ModalCustom>
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <CustomPressable
            color={Colors.dark.accent}
            text={"Refresh"}
            padding={5}
            onPress={() => {
              const payload = loadAvailablePayload(
                player.freePayload ?? player.usablePayload,
                jobsSelected
              );
              setFreePayload(payload);
              setRefresh((r) => !r);
              setJobsSelected([]);
            }}
          />
        </View>
      </View>
      <View>
        {player.maxSpeed && player.freePayload && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Text>
              Time{" "}
              {loadHoursMinutes(
                loadEstimatedFlightTime(range, player.maxSpeed)
              )}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text>Free Payload</Text>
              <TextInput
                style={{
                  textAlign: "right",
                  backgroundColor: Colors.dark.secundary,
                  borderRadius: 10,
                  padding: 10,
                }}
                value={freePayload.toString() || "0"}
                onChangeText={(t) => {
                  if (t.trim() == "") t = "1";
                  setFreePayload(Number(t));
                }}
                keyboardType="number-pad"
                placeholder="0"
              />
              <Text>lb</Text>
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Range {range}Nm</Text>
        <Slider
          style={{ width: 250, height: 30 }}
          value={range}
          onValueChange={(props) => setRange(Number(props.toFixed(0)))}
          minimumValue={1}
          maximumValue={player.maxDistance}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#c4c4c4ff"
        />
      </View>
      {player.maxSpeed && (
        <View
          style={{
            backgroundColor: Colors.dark.glass,
            borderRadius: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View>
            <Text>{`Flight Time ${loadHoursMinutes(
              loadEstimatedFlightTime(
                jobsSelected.reduce((acc, job, index) => {
                  if (index === 0) {
                    // For the first job, there's no previous job to calculate distance from
                    return acc + job.dist;
                  }

                  const prevJob = jobsSelected[index - 1];
                  let distance;
                  if (prevJob?.airport && job?.airport) {
                    distance = calculateDistanceNm(
                      prevJob.airport.latitude,
                      prevJob.airport.longitude,
                      job.airport.latitude,
                      job.airport.longitude
                    );
                  } else {
                    distance = job.dist;
                  }

                  return acc + distance;
                }, 0),
                player.maxSpeed
              )
            )}`}</Text>
          </View>
          <View>
            <Text>
              {`Earnings ${jobsSelected.reduce((acc, j) => j.reward + acc, 0)}`}
              <Text style={text.symbolSize}>€</Text>
            </Text>
          </View>
          {jobsSelected?.length > 0 && (
            <CustomPressable
              color={Colors.dark.accent}
              text={"Apply"}
              padding={10}
              paddingVertical={5}
              onPress={() => setModal(true)}
            />
          )}
        </View>
      )}
      <View>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {Object.values(GOOD_TYPE).map(
            (details, index) =>
              details?.icon && (
                <Pressable
                  key={details.name}
                  style={{
                    padding: 10,
                    backgroundColor:
                      filter === index
                        ? Colors.dark.secundary
                        : Colors.dark.glass,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    if (filter === index) {
                      setFilter(-1);
                    } else {
                      setFilter(index);
                    }
                  }}
                >
                  {details.icon}
                </Pressable>
              )
          )}
        </ScrollView>
      </View>
      {jobsSelected?.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, maxHeight: 100, alignSelf: "center" }}
          contentContainerStyle={{
            gap: 10,
            padding: 5,
          }}
        >
          {jobsSelected.map((job, index) => (
            <JobDetailsCompact
              key={job.id + job.reward}
              job={job}
              isSelected={isJobSelected(job, jobsSelected)}
              handleSelect={() =>
                setJobsSelected((prev) => {
                  if (prev.includes(job)) {
                    return prev.filter((p) => p.id != job.id);
                  } else {
                    return [...prev, job];
                  }
                })
              }
              departureAirport={
                jobsSelected.length > 1 ? jobsSelected[index - 1] : null
              }
            />
          ))}
        </ScrollView>
      )}
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          borderRadius: 10,
          gap: 15,
        }}
        showsVerticalScrollIndicator={false}
        data={jobs
          .filter((job) => !activeJobs.includes(job.id))
          ?.filter(
            (job) =>
              !jobsSelected.some((j) => j.id === job.id) &&
              !(jobsSelected.length > 0 && job.stackable !== 1)
          )
          .filter((job) => (filter === -1 ? true : job.good?.type === filter))}
        renderItem={(job) => (
          <JobDetails
            key={job.item.id}
            job={job.item}
            freePayload={player.freePayload}
            departureAirport={
              jobsSelected.length > 1
                ? jobsSelected[jobsSelected.length - 1].airport
                : player?.airport
            }
            handleSelect={() =>
              setJobsSelected((prev) => {
                if (prev.includes(job.item)) {
                  return prev.filter((p) => p.id != job.item.id);
                } else {
                  return [...prev, job.item];
                }
              })
            }
            isSmall={true}
          />
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
