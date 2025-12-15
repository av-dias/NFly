import { FlatList, Pressable, StyleSheet, TextInput } from "react-native";

import Badge from "@/components/badge/Badge";
import CustomPressable from "@/components/customPressable";
import LoadingIndicator from "@/components/loadingIndicator";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Aircraft } from "@/model/aircraftType";
import { Livery } from "@/model/liveryType";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { text } from "@/styling/commonStyle";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";

export default function TabTwoScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [player, setPlayer],
    hangar: [hangar, setHangar],
    setRefreshUser: setRefreshUser,
  } = useContext(AppContext);
  const [playerUI, setPlayerUI] = useState<Player>({ ...player, cash: 0 });
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft>({} as Aircraft);
  const [search, setSearch] = useState<string>("");
  const [selectedPlane, setSelectedPlane] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [liveries, setLiveries] = useState<Livery[]>([]);

  const handleApply = async () => {
    if (server === "") return;

    setLoading(true);

    playerUI.cash = playerUI.cash + player.cash;

    // Update player cash
    if (playerUI.cash !== player.cash) {
      await fetchWithTimeout(
        `http://${server}:8080/nf/players/${player.name}`,
        {
          method: "PUT",
          body: JSON.stringify(playerUI),
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Update player plane
    if (selectedPlane !== 0 && selectedPlane !== hangar.liveryId) {
      const liveryJson = await fetchWithTimeout(
        `http://${server}:8080/nf/aircraft/${selectedPlane}/livery`
      );

      if (liveryJson) {
        const liveryData = (await liveryJson?.json()).data;

        setLiveries(liveryData);
      }
    }

    setLoading(false);
    setRefreshUser((r) => !r);
    playerUI.cash = 0;
  };

  const handleLiveryApply = async (livery: Livery) => {
    setLoading(true);

    if (hangar.liveryId !== livery.id) {
      hangar.liveryId = livery.id;

      await fetchWithTimeout(`http://${server}:8080/nf/hangar/player/${player.name}`, {
        method: "PUT",
        body: JSON.stringify(hangar),
        headers: { "Content-Type": "application/json" },
      });

      setRefreshUser((r) => !r);
      setLiveries([]);
      setSelectedPlane(0);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setLoading(true);

        const aircraftsJson = await fetchWithTimeout(
          `http://${server}:8080/nf/aircraft/price/${500000}`
        );

        if (aircraftsJson) {
          const aircraftsData: Aircraft[] = (await aircraftsJson?.json()).data;
          setAircrafts(aircraftsData);
        }

        const aircraftJson = await fetchWithTimeout(
          `http://${server}:8080/nf/aircraft/livery/${hangar.liveryId}`
        );

        if (aircraftJson) {
          const aircraftsData: Aircraft = (await aircraftJson?.json()).data;
          setAircraft(aircraftsData);
        }
        setLoading(false);
      }

      if (server) fetchData();
    }, [server, hangar.liveryId])
  );

  return (
    <UsableScreen>
      <LoadingIndicator isLoading={loading} />
      <View style={styles.container}>
        <View style={{ paddingBottom: 20, backgroundColor: "transparent" }}>
          <Text style={[text.title, text.lgTextSize]}>Profile</Text>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <Text style={[text.bold, text.mdTextSize]}>{player.name}</Text>
          <View
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: Colors.dark.secundaryBackground,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ flex: 1 }}>Cash</Text>
            <Text>{player.cash} + </Text>
            <View>
              <TextInput
                value={playerUI.cash.toString()}
                placeholder="€"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setPlayerUI({
                    ...playerUI,
                    cash: parseInt(text) || 0,
                  })
                }
                style={{
                  width: 100,
                  backgroundColor: Colors.dark.glass,
                  borderRadius: 5,
                  padding: 5,
                  textAlign: "right",
                }}
              />
            </View>
            <Text>€</Text>
          </View>
          <View
            style={{
              padding: 10,
              paddingHorizontal: 20,
              backgroundColor: Colors.dark.secundaryBackground,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ flex: 1 }}>Plane</Text>
            <Text>{aircraft.name}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: Colors.dark.glass,
            width: "100%",
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 0,
            justifyContent: "space-between",
          }}
        >
          <Text>Search</Text>
          <TextInput
            style={{ textAlign: "right" }}
            value={search}
            onChangeText={setSearch}
            placeholder="Name"
          />
        </View>
        {liveries.length == 0 ? (
          <FlatList
            style={{ flex: 1, width: "100%", borderRadius: 10 }}
            contentContainerStyle={{
              gap: 15,
              padding: 10,
              backgroundColor: Colors.dark.secundary,
            }}
            showsVerticalScrollIndicator={false}
            data={aircrafts.filter((aircraft) =>
              aircraft.name.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={(aircraft) => (
              <Pressable
                style={{
                  backgroundColor: Colors.dark.secundary,
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  selectedPlane === aircraft.item.id
                    ? setSelectedPlane(0)
                    : setSelectedPlane(aircraft.item.id);
                }}
              >
                {selectedPlane === aircraft.item.id && <Badge text={"  "} />}
                <Text>{aircraft.item.name}</Text>
                <Text>
                  {aircraft.item.cost}
                  <Text style={text.symbolSize}>€</Text>
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()} // or a unique ID from your data
            initialNumToRender={10} // Number of items to render initially
            maxToRenderPerBatch={5} // Number of items to render in each batch
            windowSize={1} // Number of items to render outside the visible area
          />
        ) : (
          <FlatList
            style={{
              flex: 1,
              width: "100%",
              borderRadius: 10,
              backgroundColor: Colors.dark.secundary,
            }}
            contentContainerStyle={{
              gap: 15,
              padding: 10,
            }}
            showsVerticalScrollIndicator={false}
            data={liveries}
            renderItem={(livery) => (
              <Pressable
                style={{
                  backgroundColor: Colors.dark.secundary,
                  padding: 10,
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={() => handleLiveryApply(livery.item)}
              >
                <Text>{livery.item.name}</Text>
                <Text>Change</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id.toString()} // or a unique ID from your data
            initialNumToRender={10} // Number of items to render initially
            maxToRenderPerBatch={5} // Number of items to render in each batch
            windowSize={1} // Number of items to render outside the visible area
          />
        )}
        <CustomPressable
          color={Colors.dark.accent}
          text={"Apply"}
          padding={50}
          paddingVertical={10}
          onPress={async () => await handleApply()}
        />
      </View>
    </UsableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingTop: 60,
    padding: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
