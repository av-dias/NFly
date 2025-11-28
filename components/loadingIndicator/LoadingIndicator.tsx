import { Text, View } from "@/components/Themed";

const LoadingIndicator = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: "60%",
        right: "45%",
        backgroundColor: isLoading ? "gray" : "transparent",
        padding: 10,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <Text>{isLoading ? "Loading..." : ""}</Text>
    </View>
  );
};

export default LoadingIndicator;
