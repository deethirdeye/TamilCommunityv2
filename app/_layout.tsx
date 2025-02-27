import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { FormProvider } from "@/app/context/FormContext";
import { UserDataProvider } from "@/app/context/UserDataContext"; // Import your UserDataProvider
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {

  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await AsyncStorage.getItem("isLoggedIn");

        if (data) {
          router.push("./(tabs)/Aid");
        } else {
          router.push("./pages/login");
        }

        console.log(data, "At Index");
        setIsLoggedIn(data ?? ""); // Ensure we always set a string
      } catch (error) {
        console.error("Error fetching login status:", error);
      }
    }

    getData();
  }, []);
  return (

    <FormProvider>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        {/* /*<Stack.Screen name="(Drawer)" /> */}
        <Stack.Screen name="(drawer)" />
      </Stack>
    </FormProvider>

  );
}
