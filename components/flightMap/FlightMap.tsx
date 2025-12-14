import Colors from "@/constants/Colors";
import { Airport } from "@/model/airportType";
import { Job } from "@/model/jobType";
import { text } from "@/styling/commonStyle";
import { loadHoursMinutes } from "@/utility/calendar";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import CustomPressable from "../customPressable";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  maxLon: number
) => {
  // Convert longitude to percentage (left)
  const leftPercentage = ((lon - minLon) / (maxLon - minLon)) * 80;

  // Convert latitude to percentage (top)
  // Note: Latitude is inverted because higher lat = lower on the screen
  const topPercentage = ((maxLat - lat) / (maxLat - minLat)) * 80;

  return { leftPercentage, topPercentage };
};

const toPixelCoordinates = (
  leftPercentage: number,
  topPercentage: number,
  screenWidth: number,
  screenHeight: number
) => {
  const x = (leftPercentage / 100) * screenWidth;
  const y = (topPercentage / 100) * screenHeight;

  return { x, y };
};

const FlightMap = ({
  location,
  jobs: jobs,
}: {
  location: Airport;
  jobs: Job[];
}) => {
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
          maxLon
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
    }, [disabledList])
  );

  return (
    <View style={styles.container}>
      {/* Black background */}
      <View style={styles.map}>
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
                    width: 60,
                    height: 60,
                    justifyContent: "center",
                    alignItems: "center",
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
                <Text style={[text.mdTextSize, text.bold]}>
                  {point.airport?.ident}
                </Text>
                {new Date(point.expiration).getDate() ==
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
    width: "100%",
    height: "100%",
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
    margin: 15,
  },
});

export default FlightMap;
