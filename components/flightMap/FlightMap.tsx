import Colors from "@/constants/Colors";
import { Airport } from "@/model/airportType";
import { Job } from "@/model/jobType";
import { text } from "@/styling/commonStyle";
import { loadHoursMinutes } from "@/utility/calendar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import CustomPressable from "../customPressable";

const calculateBounds = (jobs: Job[]) => {
  if (jobs.length === 0) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  }

  if (!jobs[0].airport) return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  let minLat = jobs[0].airport.latitude;
  let maxLat = jobs[0].airport.latitude;
  let minLon = jobs[0].airport.longitude;
  let maxLon = jobs[0].airport.longitude;

  jobs.forEach((job) => {
    if (job.airport) {
      minLat = Math.min(minLat, job.airport.latitude);
      maxLat = Math.max(maxLat, job.airport.latitude);
      minLon = Math.min(minLon, job.airport.longitude);
      maxLon = Math.max(maxLon, job.airport.longitude);
    }
  });

  return { minLat, maxLat, minLon, maxLon };
};

const toPercentageCoordinates = (
  lat: number,
  lon: number,
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  isSmall: boolean
) => {
  // Convert longitude to percentage (left)
  const leftPercentage =
    ((lon - minLon) / (maxLon - minLon)) * (isSmall ? 50 : 80);

  // Convert latitude to percentage (top)
  // Note: Latitude is inverted because higher lat = lower on the screen
  const topPercentage =
    ((maxLat - lat) / (maxLat - minLat)) * (isSmall ? 40 : 80);

  return { leftPercentage, topPercentage };
};

const toPixelCoordinates = (
  leftPercentage: number,
  topPercentage: number,
  screenWidth: number,
  screenHeight: number
) => {
  const x = (leftPercentage / 100) * (screenWidth * 1);
  const y = (topPercentage / 100) * (screenHeight * 1);

  return { x, y };
};

const FlightMap = ({
  location,
  jobs,
  isSmall = false,
}: {
  location: Airport;
  jobs: Job[];
  isSmall?: boolean;
}) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [disabledList, setDisabledList] = useState<number[]>([]);
  const [coordinates, setCoordenates] = useState<
    ((Job & { leftPercentage: number; topPercentage: number }) | null)[]
  >([]);
  if (!location || !jobs || jobs.length === 0) return null;

  useFocusEffect(
    useCallback(() => {
      // Calculate bounds
      const jobList = jobs.filter((a, index) => !disabledList.includes(index));
      const { minLat, maxLat, minLon, maxLon } = calculateBounds(jobList);

      // Convert coordinates to percentages
      const coordinatesList = jobList.map((job) => {
        const { leftPercentage, topPercentage } = toPercentageCoordinates(
          job?.airport?.latitude ?? 0,
          job?.airport?.longitude ?? 0,
          minLat,
          maxLat,
          minLon,
          maxLon,
          isSmall
        );

        const { x, y } = toPixelCoordinates(
          leftPercentage,
          topPercentage,
          screenWidth,
          screenHeight
        );

        return { ...job, leftPercentage, topPercentage, x, y };
      });

      setCoordenates(coordinatesList);
    }, [disabledList, screenHeight, screenWidth])
  );

  return (
    <View style={styles.container}>
      {/* Black background */}
      <View
        style={styles.map}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setScreenHeight(height);
          setScreenWidth(width);
        }}
      >
        {disabledList.length > 0 && (
          <View
            style={{
              padding: 10,
              alignItems: "center",
            }}
          >
            <CustomPressable
              padding={5}
              text={"Clear"}
              color={Colors.dark.secundary}
              onPress={() => setDisabledList([])}
            />
          </View>
        )}
        {/* Render markers */}
        {coordinates.map(
          (point, index) =>
            point && (
              <Pressable
                key={index}
                style={[
                  styles.marker,
                  {
                    left: `${point.leftPercentage}%`,
                    top: `${point.topPercentage}%`,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: isSmall ? 0 : 15,
                  },
                ]}
                onPress={() => setDisabledList((l) => [...l, index])}
              >
                <View
                  style={{
                    width: 10,
                    aspectRatio: 1,
                    borderRadius: 100,
                    backgroundColor:
                      index === 0 ? Colors.dark.accent : Colors.dark.warning,
                  }}
                />
                {!isSmall && (
                  <Text style={[text.mdTextSize, text.bold]}>
                    {point.airport?.ident}
                  </Text>
                )}
                {!isSmall &&
                  new Date(point.expiration).getDate() ==
                    new Date().getDate() && (
                    <>
                      <Text style={text.mdTextSize}>
                        {new Date(point.expiration).toLocaleTimeString()}
                      </Text>
                      <Text style={text.mdTextSize}>
                        {loadHoursMinutes(
                          (new Date(point.expiration).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60)
                        )}
                      </Text>
                    </>
                  )}
              </Pressable>
            )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
    backgroundColor: Colors.dark.secundaryBackground,
    position: "relative",
  },
  linesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  line: {
    position: "absolute",
    height: 2,
    backgroundColor: "white",
  },
  marker: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default FlightMap;
