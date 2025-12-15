
import CustomPressable from "@/components/customPressable";
import { Text, View } from "@/components/Themed";
import UsableScreen from "@/components/usableScreen";
import Colors from "@/constants/Colors";
import { AppContext } from "@/contexts/appContext";
import { ServerSyncContainer } from "@/demo/serverSyncContainer";
import { Player } from "@/model/playerType";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext } from "react";

export default function LoginScreen() {
  const {
    serverConfig: [server],
    server: [isServerOnline],
    player: [, setPlayer],
    players: [players],
    setRefreshUser: setRefreshUser,
  } = useContext(AppContext);

  useFocusEffect(
    useCallback(() => {
      console.log("Server: " + server);
      if (server != "") setRefreshUser((r) => !r);
    }, [server])
  );

  return (
    <UsableScreen>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Setup</Text>
      </View>
      <View style={{ flex: 3, alignItems: "center", padding: 20 }}>
        {!isServerOnline ? (
          <View style={{ alignItems: "center" }}>
            <View style={{ paddingBottom: 40 }}>
              <Text>Server not available</Text>
            </View>
            <ServerSyncContainer />
          </View>
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