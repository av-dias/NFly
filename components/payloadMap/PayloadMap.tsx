import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Player } from "@/model/playerType";
import { text } from "@/styling/commonStyle";
import { MaterialIcons } from "@expo/vector-icons";

const PayloadMap = ({ player }: { player: Player }) => {
  const pilotweight = 180;
  const payload = (player?.usablePayload || 0) - (player?.freePayload || 0);
  let backPayload = 0;

  if (payload - pilotweight > 0) {
    backPayload = payload - pilotweight;
  }

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
        padding: 20,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        backgroundColor: Colors.dark.secundaryBackground,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={[text.title]}>{payload}lb</Text>
      <View
        style={{
          width: "100%",
          padding: 50,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{pilotweight}lb</Text>
        <Text>
          {payload >= pilotweight ? pilotweight : payload}
          lb
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="airplanemode-active" size={150} color="gray" />
      </View>
      <View
        style={{
          width: "100%",
          padding: 50,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>{(backPayload / 2).toFixed(0)}lb</Text>
        <Text>{(backPayload / 2).toFixed(0)}lb</Text>
      </View>
    </View>
  );
};

export default PayloadMap;
