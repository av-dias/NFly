import Colors from "@/constants/Colors";
import { Airport } from "@/model/airportType";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { View } from "../Themed";

const FlightMap = ({
  location,
  airports,
}: {
  location: Airport;
  airports: Airport[];
}) => {
  if (!location || !airports) return;

  const mapRef = useRef<MapView>(null);
  const coordinates = airports.map((airport) => ({
    latitude: airport.latitude,
    longitude: airport.longitude,
  }));

  useEffect(() => {
    if (mapRef.current && coordinates.length > 0) {
      // Automatically zoom and center the map to fit all coordinates
      (mapRef.current as MapView).fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Padding around the markers
        animated: true, // Smooth zoom animation
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        zoomControlEnabled={true}
      >
        {/* Draw lines between adjacent points */}
        <Polyline
          coordinates={coordinates}
          strokeColor={Colors.dark.accent} // Red line
          strokeWidth={3}
        />

        {/* Render markers for each point */}
        {coordinates.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={`Point ${index + 1}`}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default FlightMap;
