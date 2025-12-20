import CustomPressable from "@/components/customPressable";
import FlightMap from "@/components/flightMap";
import JobActiveDetails from "@/components/jobActiveDetails";
import LoadingIndicator from "@/components/loadingIndicator";
import ModalCustom from "@/components/modal/modal";
import {
  createNotification,
  NotificationBox,
} from "@/components/notificationBox/NotificationBox";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Aircraft } from "@/model/aircraftType";
import { Airport } from "@/model/airportType";
import { Hangar } from "@/model/hangarType";
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
import { eventEmitter, NotificationEvent } from "@/utility/eventEmitter";
import { useFocusEffect } from "expo-router";
import { Dispatch, useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

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
        <Text>Fuel {hangar.currentFuel?.toFixed(0)}lb</Text>
      </View>
      <View style={{ width: "30%", alignItems: "center" }}>
        <Text>Engine {hangar.statusEngine?.toFixed(0)}%</Text>
      </View>
      <View style={{ width: "30%", alignItems: "flex-end" }}>
        <Text>Hull {hangar.statusHull?.toFixed(0)}%</Text>
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

const loadTimetable = (departure: string, jobs: Job[], maxSpeed: number) => {
  let timetable = departure;
  timetable += "  ";

  jobs.forEach((job, index) => {
    let distance;

    if (index === 0) {
      // For the first job, there's no previous job to calculate distance from
      distance = job.dist;
    } else {
      const prevJob = jobs[index - 1];
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
    }

    timetable += loadHoursMinutes(loadEstimatedFlightTime(distance, maxSpeed));
    timetable += "  ";

    timetable += job.arrival;
    timetable += "  ";
  });

  return timetable;
};

export default function HomeScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
    hangar: [hangar, setHangar],
    setRefreshUser: setRefreshUser,
  } = useContext(AppContext);

  const [playerHangar, setPlayerHangar] = useState(hangar);
  const [aircraft, setAircraft] = useState({} as Aircraft);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [freePayload, setFreePayload] = useState(0);
  const [airport, setAirport] = useState({} as Airport);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);

        let fuelWeight = 0;
        if (hangar) {
          fuelWeight = hangar?.currentFuel || 0;
          setPlayerHangar(hangar);

          const airportJson = await fetchWithTimeout(
            `http://${server}:8080/nf/airport/${hangar.location}`
          );

          if (airportJson) {
            const airportData = (await airportJson?.json()).data;
            setAirport(airportData);
          }
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

        const usablePayload = Number(
          (maxPayloadlbs - 170 - fuelWeight).toFixed(0)
        );
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
            `http://${server}:8080/nf/jobs?weight=${usablePayload}`,
            {},
            5000
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

            // TODO IMPROVE FROM SERVER SIDE
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
        setLoading(false);
      }
      if (isServerOnline && hangar?.id) fetchData();
    }, [isServerOnline, hangar, refresh])
  );

  return (
    <UsableScreen>
      <LoadingIndicator isLoading={loading} />
      <NotificationBox />
      <ModalCustom
        padding={0}
        size={10}
        modalVisible={modal}
        setModalVisible={() => setModal(false)}
        hasColor={false}
      >
        <FlightMap
          location={airport}
          jobs={[{ airport: airport } as Job, ...activeJobs]}
        />
      </ModalCustom>
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
          onPress={() => {
            setRefresh((r) => !r);
            setRefreshUser((r) => !r);
          }}
        />
      </View>
      <HangarDetails hangar={playerHangar} />
      <AircraftDetails aircraft={aircraft} />
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Text>
          <Text style={[text.title, { fontSize: 20 }]}>Active Jobs</Text>
          {player.maxSpeed && (
            <Text>{` (${loadHoursMinutes(
              loadEstimatedFlightTime(
                activeJobs.reduce((acc, job, index) => {
                  if (index === 0) {
                    // For the first job, there's no previous job to calculate distance from
                    return acc + job.dist;
                  }

                  const prevJob = activeJobs[index - 1];
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
            )})`}</Text>
          )}
        </Text>
        {player.freePayload && (
          <Text>
            <Text>Free Payload </Text>
            <Text>
              {player.freePayload.toFixed(0)}
              lb
            </Text>
          </Text>
        )}
        {activeJobs.length > 0 && (
          <CustomPressable
            padding={10}
            paddingVertical={5}
            color={Colors.dark.accent}
            text={"Map"}
            onPress={() => setModal(true)}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {player.maxSpeed && playerHangar && (
          <Text>
            {loadTimetable(playerHangar.location, activeJobs, player.maxSpeed)}
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
        {activeJobs.map((job, index) => (
          <JobActiveDetails
            key={job.id}
            job={job}
            visible={visible}
            setVisible={setVisible}
            handleRemoveJob={async () =>
              await handleRemoveJob(job, server, setRefresh)
            }
            departureAirport={
              activeJobs.length > 1 ? activeJobs[index - 1] : null
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