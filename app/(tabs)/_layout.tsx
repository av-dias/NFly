import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="airplane-outline"
              size={24}
              color={Colors.dark.accent}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={24}
              color={Colors.dark.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons
              name="settings"
              size={24}
              color={Colors.dark.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          headerShown: false,
          href: null, // hides from tab bar
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          href: null, // hides from tab bar
        }}
      />
    </Tabs>
  );
}
