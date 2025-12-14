import { Hangar } from "@/model/hangarType";
import { Player } from "@/model/playerType";
import { fetchWithTimeout } from "@/service/serviceUtils";
import { useFocusEffect } from "@react-navigation/native";
import React, { createContext, useCallback, useState } from "react";

interface AppContext {
  serverConfig: [string, React.Dispatch<React.SetStateAction<string>>]; // Dev test only
  server: [boolean, React.Dispatch<React.SetStateAction<boolean>>]; // Dev test only
  player: [Player, React.Dispatch<React.SetStateAction<Player>>]; // Dev test only
  hangar: [Hangar, React.Dispatch<React.SetStateAction<Hangar>>]; // Dev test only
  players: [Player[], React.Dispatch<React.SetStateAction<Player[]>>]; // Dev test only
  setRefreshUser: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContext>({
  serverConfig: ["", () => {}],
  server: [false, () => {}],
  player: [{} as Player, () => {}],
  hangar: [{} as Hangar, () => {}],
  players: [[], () => {}],
  setRefreshUser: () => {},
});

const AppContextProvider = ({ children }: { children: any }) => {
  const [server, setServer] = useState<string>("");
  const [player, setPlayer] = useState<Player>({} as Player);
  const [hangar, setHangar] = useState<Hangar>({} as Hangar);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);
  const [refreshUser, setRefreshUser] = useState(false);

  const value: AppContext = {
    serverConfig: [server, setServer],
    server: [isServerOnline, setIsServerOnline],
    player: [player, setPlayer],
    hangar: [hangar, setHangar],
    players: [players, setPlayers],
    setRefreshUser: setRefreshUser,
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const playersJson = await fetchWithTimeout(
          `http://${server}:8080/nf/players`
        );

        if (playersJson) {
          const players = await playersJson?.json();
          console.log("Reloading players data.");
          setPlayers(players.data);
          setIsServerOnline(true);
        }
      }

      if (server) fetchData();
    }, [server])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const playerJson = await fetchWithTimeout(
          `http://${server}:8080/nf/players/${player.name}`
        );

        if (playerJson) {
          const playerData = (await playerJson?.json()).data;
          console.log(`Reloading player ${player.name} data.`);
          setPlayer(playerData);

          const hangarJson = await fetchWithTimeout(
            `http://${server}:8080/nf/hangar/player/${playerData.name}`
          );

          if (hangarJson) {
            const hangarData = (await hangarJson?.json()).data;
            console.log(hangarData)
            setHangar(hangarData);
          }
        }
      }
      if (player.name) fetchData();
    }, [refreshUser, player.name])
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
