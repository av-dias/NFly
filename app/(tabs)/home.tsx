import { ScrollView, StyleSheet, Text, View } from "react-native";

import CustomPressable from "@/components/customPressable";
import {
  createNotification,
  NotificationBox,
} from "@/components/notificationBox/NotificationBox";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Aircraft } from "@/model/aircraftType";
import { Hangar } from "@/model/hangarType";
import { Job } from "@/model/jobType";
import { PlaneJob } from "@/model/planeJobType";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { text } from "@/styling/commonStyle";
import { eventEmitter, NotificationEvent } from "@/utility/eventEmitter";
import { useFocusEffect } from "expo-router";
import { Dispatch, useCallback, useContext, useState } from "react";

const PlayerHeader = ({ player }: { player: Player }) => (
  <View
    style={{
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 10,
    }}
  >
    <View
      style={{
        backgroundColor: Colors.dark.glass,
        padding: 5,
        borderRadius: 10,
      }}
    >
      <Text>{player.name}</Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        gap: 10,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.dark.glass,
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>{player.icao}</Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.dark.glass,
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>
          <Text>{player.cash}</Text>
          <Text style={text.symbolSize}>€</Text>
        </Text>
      </View>
      <View
        style={{
          backgroundColor: Colors.dark.glass,
          padding: 5,
          borderRadius: 10,
        }}
      >
        <Text>Exp {player.xp}</Text>
      </View>
    </View>
  </View>
);

const HangarDetails = ({ hangar }: { hangar: Hangar }) => (
  <View
    style={{
      gap: 10,
      backgroundColor: Colors.dark.secundary,
      padding: 10,
      borderRadius: 10,
    }}
  >
    <Text style={text.title}>Hangar Details</Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>{hangar.location}</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>Airframe {hangar.airframe}h</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>
          <Text>{hangar.cost} </Text>
          <Text style={text.symbolSize}>€</Text>
        </Text>
      </View>
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>Fuel {hangar.currentFuel?.toFixed(1)}lb</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>Engine {hangar.statusEngine?.toFixed(0)}</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>Hull {hangar.statusHull?.toFixed(0)}</Text>
      </View>
    </View>
  </View>
);

const AircraftDetails = ({ aircraft }: { aircraft: Aircraft }) => (
  <View
    style={{
      gap: 10,
      backgroundColor: Colors.dark.secundary,
      padding: 10,
      borderRadius: 10,
    }}
  >
    <Text style={text.title}>{aircraft.name}</Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>{aircraft.cruiseSpeedktas} ktas</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>{aircraft.maxPayloadlbs} lbs</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>{aircraft.rangenm} Nm</Text>
      </View>
    </View>
  </View>
);

const ActiveJobsDetails = ({
  job,
  handleRemoveJob,
}: {
  job: Job;
  handleRemoveJob: () => Promise<void>;
}) => (
  <View
    style={{
      gap: 10,
      backgroundColor: Colors.dark.secundary,
      padding: 10,
      borderRadius: 10,
    }}
  >
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={text.title}>{job.nameAirport}</Text>
      <CustomPressable
        color={Colors.dark.accent}
        text={"-"}
        padding={10}
        paddingVertical={5}
        onPress={handleRemoveJob}
      />
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>{job.arrival}</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>{job.dist} Nm</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>{job.reward} €</Text>
      </View>
    </View>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ width: "30%", alignItems: "flex-start" }}>
        <Text>{job.weight} lbs</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>{job.pax} pax</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>{job.xp} xp</Text>
      </View>
    </View>
  </View>
);

const handleRemoveJob = async (
  job: Job,
  server: string,
  setRefresh: Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const resJson = await fetchWithTimeout(
      `http://${server}:8080/nf/plane-jobs/${job.id}`,
      {
        method: "DELETE",
      }
    );

    const res = await resJson?.json();

    if (res.status != 200) {
      console.log(res);
      eventEmitter.emit(
        NotificationEvent,
        createNotification("Failed to remove job.", Colors.dark.warning)
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    setRefresh((r) => !r);
  }
};

export default function HomeScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
  } = useContext(AppContext);

  const [hangar, setHangar] = useState({} as Hangar);
  const [aircraft, setAircraft] = useState({} as Aircraft);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [freePayload, setFreePayload] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const hangarJson = await fetchWithTimeout(
          `http://${server}:8080/nf/hangar/player/${player.name}`
        );

        let fuelWeight = 0;
        if (hangarJson) {
          const hangarData = await hangarJson?.json();
          fuelWeight = (hangarData.data as Hangar).currentFuel;
          setHangar(hangarData.data);
        }

        const aircraftJson = await fetchWithTimeout(
          `http://${server}:8080/nf/aircraft/player/${player.name}`
        );

        let maxPayloadlbs = 0,
          maxDistance = 0,
          maxFuelCap = 0,
          maxSpeed = 0;
        if (aircraftJson) {
          const aircraftData: Aircraft = (await aircraftJson?.json()).data;
          maxPayloadlbs = aircraftData.maxPayloadlbs;
          maxDistance = aircraftData.rangenm;
          maxFuelCap = aircraftData.fuelCaplbs;
          maxSpeed = aircraftData.cruiseSpeedktas;
          setAircraft(aircraftData);
        }

        const usablePayload = maxPayloadlbs - 170 - fuelWeight;
        setPlayer((p) => ({
          ...p,
          usablePayload: usablePayload,
          maxDistance: maxDistance,
          fuelPercentage: fuelWeight / maxFuelCap,
          maxSpeed: maxSpeed * 0.8,
        }));
        let jobsJson;

        if (usablePayload) {
          jobsJson = await fetchWithTimeout(
            `http://${server}:8080/nf/jobs?weight=${usablePayload}`
          );
        } else {
          jobsJson = await fetchWithTimeout(`http://${server}:8080/nf/jobs}`);
        }

        if (jobsJson) {
          const jobsData: Job[] = (await jobsJson?.json()).data;
          setJobs(jobsData);

          const activeJobsJson = await fetchWithTimeout(
            `http://${server}:8080/nf/plane-jobs`
          );

          if (activeJobsJson) {
            const activeJobsData: PlaneJob[] = (await activeJobsJson?.json())
              .data;

            const jobsDetails: Job[] = activeJobsData
              .map((a) => jobsData?.find((j) => j.id == a.jobId))
              .filter((job): job is Job => job !== undefined);
            setActiveJobs(jobsDetails);

            const jobsPayload = jobsDetails.reduce(
              (acc: number, job: Job) => acc + Number(job.weight),
              0
            );

            setPlayer((p) => ({
              ...p,
              freePayload: usablePayload - jobsPayload,
            }));
          }
        }
      }
      if (isServerOnline) fetchData();
    }, [isServerOnline, refresh])
  );

  return (
    <UsableScreen>
      <NotificationBox />
      <PlayerHeader player={player} />
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
          onPress={() => setRefresh((r) => !r)}
        />
      </View>
      <HangarDetails hangar={hangar} />
      <AircraftDetails aircraft={aircraft} />
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[text.title, { fontSize: 20 }]}>Active Jobs</Text>
        {player.freePayload && (
          <Text>
            <Text>Free Payload </Text>
            <Text>
              {player.freePayload.toFixed(0)}
              lb
            </Text>
          </Text>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: "transparent",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {activeJobs.map((job) => (
          <ActiveJobsDetails
            key={job.id}
            job={job}
            handleRemoveJob={async () =>
              await handleRemoveJob(job, server, setRefresh)
            }
          />
        ))}
      </ScrollView>
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
