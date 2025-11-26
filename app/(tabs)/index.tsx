import { AppContext } from "@/contexts/appContext";
import { useContext } from "react";
import HomeScreen from "./home";
import Login from "./login";

export default function TabOneScreen() {
  const {
    player: [player],
  } = useContext(AppContext);

  return player.id ? <HomeScreen /> : <Login />;
}
