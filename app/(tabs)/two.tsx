import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomPressable from "@/components/customPressable";
import ModalCustom from "@/components/modal/modal";
import {
  createNotification,
  NotificationBox,
} from "@/components/notificationBox/NotificationBox";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Job } from "@/model/jobType";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { text } from "@/styling/commonStyle";
import { loadHoursMinutes } from "@/utility/calendar";
import { eventEmitter, NotificationEvent } from "@/utility/eventEmitter";
import { delay } from "@/utility/timer";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import LoadingIndicator from "../../components/loadingIndicator";

const JobDetails = ({
  job,
  isSelected,
  handleSelect,
  isSmall = false,
  freePayload,
}: {
  job: Job;
  isSelected: boolean;
  handleSelect: () => void;
  isSmall?: boolean;
  freePayload?: number;
}) => (
  <Pressable
    style={{
      gap: 1,
      backgroundColor: isSelected ? Colors.dark.accent : Colors.dark.secundary,
      width: isSmall ? 150 : "100%",
      padding: 10,
      borderRadius: 10,
    }}
    onPress={
      (freePayload && freePayload > job.weight) || isSmall
        ? handleSelect
        : () =>
            eventEmitter.emit(
              NotificationEvent,
              createNotification(
                "Not enough payload available.",
                Colors.dark.warning
              )
            )
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
        {!isSmall && <Text style={text.title}>{`${job.nameAirport} `}</Text>}
        <Text style={isSmall && text.title}>{job.arrival}</Text>
      </Text>
    </View>

    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ width: isSmall ? 50 : "30%", alignItems: "flex-start" }}>
        <Text>
          <Text>Cash {job.reward}</Text>
          <Text style={text.symbolSize}>€</Text>
        </Text>
      </View>
      <View style={{ width: isSmall ? 50 : "30%", alignItems: "center" }}>
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
      {!isSmall && (
        <View style={{ width: "30%", alignItems: "flex-end" }}>
          <Text>Pax {job.pax}</Text>
        </View>
      )}
    </View>

    {!isSmall && (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: "30%", alignItems: "flex-start" }}>
          <Text>{job.dist}Nm</Text>
        </View>
        <View style={{ width: "30%", alignItems: "center" }}>
          <Text>Exp {job.xp}</Text>
        </View>
        <View style={{ width: "30%", alignItems: "flex-end" }}>
          <Text>Rank {job.rank}</Text>
        </View>
      </View>
    )}
  </Pressable>
);

const handleAddJob = async (jobs: Job[], player: Player, server: string) => {
  for (const job of jobs) {
    console.log({ planeId: player.currentPlane, jobId: job.id });
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

const loadEstimatedFlightTime = (distance: number, maxSpeed: number) => {
  return distance / maxSpeed;
};

export default function TabTwoScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
  } = useContext(AppContext);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [excess, setExcess] = useState(false);
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [range, setRange] = useState<number>(loadRange(player));
  const [jobsSelected, setJobsSelected] = useState<Job[]>([]);
  const [activeJobsPayload, setActiveJobsPayload] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);
        const payload = loadAvailablePayload(
          player.freePayload ?? player.usablePayload,
          jobsSelected
        );
        setActiveJobsPayload(payload);

        if (payload) {
          const jobsJson = await fetchWithTimeout(
            `http://${server}:8080/nf/jobs?weight=${payload}&dist=${range}`
          );

          if (jobsJson) {
            const jobsData: Job[] = (await jobsJson?.json()).data;
            setJobs(jobsData);

            if (jobsData?.length < 3) {
              setExcess(true);
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
            } else {
              setExcess(false);
            }
          }
        }
        setLoading(false);
      }
      if (isServerOnline) fetchData();
    }, [isServerOnline, player, range, jobsSelected, refresh])
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
            <Text>Free Payload {activeJobsPayload}lb</Text>
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
                jobsSelected.reduce((acc, j) => j.dist + acc, 0),
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
      {jobsSelected?.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, maxHeight: 100, alignSelf: "center" }}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          {jobsSelected.map((job) => (
            <JobDetails
              key={job.id + job.reward}
              job={job}
              isSmall={true}
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
        data={jobs?.filter((job) => !jobsSelected.some((j) => j.id === job.id))}
        renderItem={(job) => (
          <JobDetails
            key={job.item.id}
            job={job.item}
            isSelected={isJobSelected(job.item, jobsSelected)}
            freePayload={activeJobsPayload}
            handleSelect={() =>
              setJobsSelected((prev) => {
                if (prev.includes(job.item)) {
                  return prev.filter((p) => p.id != job.item.id);
                } else {
                  return [...prev, job.item];
                }
              })
            }
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
