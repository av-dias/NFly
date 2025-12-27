import AsyncStorage from "@react-native-async-storage/async-storage";

const IP_KEY = "server_ip";

// Save
export const addIpAddress = async (ip: string) => {
  const ips = await getIpAddresses();

  if (!ips.includes(ip)) {
    ips.push(ip);
    await AsyncStorage.setItem(IP_KEY, JSON.stringify(ips));
  }
};

// Load
export const getIpAddresses = async (): Promise<string[]> => {
  const value = await AsyncStorage.getItem(IP_KEY);
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};


// Remove (optional)
export const removeIpAddress = async (ip: string) => {
  const ips = await getIpAddresses();
  const updated = ips.filter(item => item !== ip);

  await AsyncStorage.setItem(IP_KEY, JSON.stringify(updated));
};

// Remove all (optional)
export const clearIpAddresses = async () => {
  await AsyncStorage.removeItem(IP_KEY);
};
