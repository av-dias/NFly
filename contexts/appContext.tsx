import { Player } from "@/model/playerType";
import { useFocusEffect } from "@react-navigation/native";
import React, { createContext, useCallback, useState } from "react";

interface AppContext {
  serverConfig: [string, React.Dispatch<React.SetStateAction<string>>]; // Dev test only
  server: [boolean, React.Dispatch<React.SetStateAction<boolean>>]; // Dev test only
  player: [Player, React.Dispatch<React.SetStateAction<Player>>]; // Dev test only
}

export const AppContext = createContext<AppContext>({
  serverConfig: ["", () => {}],
  server: [false, () => {}],
  player: [{} as Player, () => {}],
});

const AppContextProvider = ({ children }: { children: any }) => {
  const [server, setServer] = useState<string>("");
  const [player, setPlayer] = useState<Player>({} as Player);
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);

  const value: AppContext = {
    serverConfig: [server, setServer],
    server: [isServerOnline, setIsServerOnline],
    player: [player, setPlayer],
  };

  useFocusEffect(
    useCallback(() => {
      async function checkAvailablePlayers() {}

      checkAvailablePlayers();
    }, [value.server])
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
