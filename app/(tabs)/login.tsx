import { StyleSheet } from "react-native";

import CustomPressable from "@/components/customPressable";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";

export default function LoginScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline, setIsServerOnline],
    player: [player, setPlayer],
  } = useContext(AppContext);
  const [players, setPlayers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const playersJson = await fetchWithTimeout(
          `http://${server}:8080/nf/players`
        );

        if (playersJson) {
          const player = await playersJson?.json();
          setPlayers(player.data);
          setIsServerOnline(true);
        }
      }

      if (server != "") fetchData();
    }, [server])
  );

  return (
    <UsableScreen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Login</Text>
      </View>
      <View style={{ flex: 3, alignItems: "center", padding: 20 }}>
        {!isServerOnline ? (
          <Text>Server not available</Text>
        ) : (
          players?.map((player: Player) => (
            <View
              key={player.id}
              style={{
                width: "100%",
                height: 100,
                backgroundColor: "#006fb913",
                borderRadius: 10,
                padding: 20,
                paddingHorizontal: 0,
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <View
                style={{
                  backgroundColor: "transparent",
                  justifyContent: "space-evenly",
                }}
              >
                <Text>Name {player.name}</Text>
                <Text>ICAO {player.icao}</Text>
              </View>
              <View style={{ backgroundColor: "transparent" }}>
                <Text>
                  Cash {player.cash}
                  <Text style={{ fontSize: 10 }}>€</Text>
                </Text>
                <Text>Rank {player.rank}</Text>
                <Text>Fly Time {player.totalFlyTime}</Text>
              </View>
              <CustomPressable
                color={Colors.dark.accent}
                text={"Continue"}
                onPress={() => setPlayer(player)}
              />
            </View>
          ))
        )}
      </View>
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
