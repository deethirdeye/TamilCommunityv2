import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, Dimensions } from "react-native";
import { useRouter, usePathname, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem, DrawerToggleButton } from '@react-navigation/drawer';
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { tailwind } from "react-native-tailwindcss";
import useTranslation from "@/app/i8n/useTranslationHook";
import { AppConfig } from "@/app/config/AppConfig";
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import i18next from "../i8n/i8n.congif";

const { height } = Dimensions.get('window');

const CustomDrawerContent = (props: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLanguageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { t } = useTranslation();

  // const handleLanguageChange = (language: string) => {
  //   setSelectedLanguage(language);
  //   setLanguageSelectorOpen(false);
  // };

  // Language change handler
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem('appLanguage', language); // Save selected language
    i18next.changeLanguage(language);
    setLanguageSelectorOpen(false);
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(Number(storedUserId));
        }
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${AppConfig.APIURL}${TamilCommunityApi.GET_BASIC_DETAILS_BY_USER_ID}/${userId}`);
        const data = await response.json();
        setUserData(data.ResponseData[0]);
      } catch (error) {
        Alert.alert("Error", "Failed to load user details");
      }
    };

    fetchUserDetails();
  }, [userId]);

  // const handleLogout = () => {
  //   Alert.alert(
  //     "Confirm Logout",
  //     "Are you sure you want to logout?",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Logout canceled"),
  //         style: "cancel",
  //       },
  //       {
  //         text: "Logout",
  //         onPress: () => {
  //           console.log("Logged out");
  //           router.push('/Login');
  //         },
  //         style: "destructive",
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); 
      console.log("Logged out, AsyncStorage cleared");
      router.push('/pages/login'); 
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <DrawerContentScrollView {...props} style={[tailwind.flex1]}>
        {/* Profile Section */}
        <View style={[tailwind.p5, tailwind.mB4]}>
        <TouchableOpacity 
              onPress={() => router.push("/pages/EditProfile")}
              style={[tailwind.absolute, tailwind.pT5, tailwind.right0, tailwind.pR4]}
            >
              <View style={[tailwind.bgBlue600, tailwind.rounded, tailwind.p2]}>
                <Ionicons name="person" size={14} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/pages/EditProfile")}> 
          <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue700, tailwind.mB1]}>
          
            {capitalizeWords(userData?.basicDetails?.FullName || 'N/A')}

          </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/pages/EditProfile")}> 
          <Text style={[tailwind.textBase, tailwind.textBlue600]}>
            {userData?.basicDetails?.MobileNumber || '+60123456789'}
          </Text>
          </TouchableOpacity>
        </View>

        {/* Drawer Items */}
        <View style={[tailwind.flex1, tailwind.pX2, tailwind.pT2]}>
          {/* Support Button */}
          <DrawerItem
            icon={({ color }) => (
              <View style={styles.iconBackground}>
                <Ionicons
                  name="help-buoy"
                  size={24}
                  color={pathname === "/(drawer)/(tabs)/Aid" ? "#0369A1" : "#64748B"}
                />
              </View>
            )}
            label={() => { return <Text style={[tailwind.textBase, tailwind.fontBold]}>{t('tabs.aid')}</Text>; }}
            labelStyle={[
              tailwind.textBase,
              tailwind.fontBold,
              { color: pathname === "/(drawer)/(tabs)/Aid" ? "#0369A1" : "#64748B" }
            ]}
            style={[
              styles.drawerItem,
              pathname === "/(drawer)/(tabs)/Aid" && styles.activeDrawerItem
            ]}
            onPress={() => router.push("/(drawer)/(tabs)/Aid")}
          />
          {/* News Button */}
          <DrawerItem
            icon={({ color }) => (
              <View style={styles.iconBackground}>
                <Ionicons
                  name="newspaper"
                  size={24}
                  color={pathname === "/(drawer)/(tabs)/Aid" ? "#0369A1" : "#64748B"}
                />
              </View>
            )}
            label={() => { return <Text  style={[tailwind.textBase, tailwind.fontBold]} >{t('tabs.newsMagazine')}</Text>; }}
            labelStyle={[
              tailwind.textBase,
              tailwind.fontBold,
              { color: pathname === '/NewsMagazine' ? "#0369A1" : "#64748B" }
            ]}
            style={[
              styles.drawerItem,
              pathname === '/NewsMagazine' && styles.activeDrawerItem
            ]}
            onPress={() => router.push("/(drawer)/(tabs)/NewsMagazine")}
          />
          {/* Chat Support Button */}
          <DrawerItem
            icon={({ color }) => (
              <View style={styles.iconBackground}>
                <Ionicons
                  name="chatbubbles"
                  size={24}
                  color={pathname === "/ChatSupport" ? "#0369A1" : "#64748B"}
                />
              </View>
            )}
            label={() => { return <Text  style={[tailwind.textBase, tailwind.fontBold]}>{t('tabs.chat')}</Text>; }}
            labelStyle={[
              tailwind.textBase,
              tailwind.fontBold,
              { color: pathname === "/ChatSupport" ? "#0369A1" : "#64748B" }
            ]}
            style={[
              styles.drawerItem,
              pathname === "/ChatSupport" && styles.activeDrawerItem
            ]}
            onPress={() => router.push("/(drawer)/(tabs)/ChatSupport")}
          />
          {/* Language Selector */}
          <TouchableOpacity
            style={[
              tailwind.flexRow,
              tailwind.itemsCenter,
              tailwind.p4,
              tailwind.mX2,
              tailwind.mY1,
              tailwind.rounded,
              styles.drawerItem
            ]}
            onPress={() => setLanguageSelectorOpen(!isLanguageSelectorOpen)}
          >
            <View style={styles.iconBackground}>
              <Ionicons name="language" size={24} color="#0369A1" />
            </View>
            <Text style={[tailwind.flex1, tailwind.textBase, tailwind.fontBold, tailwind.textBlue700, tailwind.mL3]}>
              {selectedLanguage === 'en' ? 'English' : 'தமிழ்'}
            </Text>
            <Ionicons
              name={isLanguageSelectorOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#0369A1"
            />
          </TouchableOpacity>
          {/* Language Options */}
          {isLanguageSelectorOpen && (
            <View style={[tailwind.mX2, tailwind.rounded, styles.drawerItem]} >
              {['English', 'தமிழ்'].map((lang, index) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    tailwind.p4,
                    index === 0 && tailwind.borderB,
                    tailwind.borderBlue100
                  ]}
                  onPress={() => handleLanguageChange(index === 0 ? 'en' : 'ta')}
                >
                  <Text style={[tailwind.textBase, tailwind.textBlue700]}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, tailwind.p4, tailwind.mT8, tailwind.flexRow, tailwind.itemsCenter]}
            onPress={handleLogout}
          >
            <View style={[styles.iconBackground, { backgroundColor: 'rgba(220, 38, 38, 0.1)' }]}>
              <Ionicons name="log-out" size={24} color="#DC2626" />
            </View>
            <Text style={[tailwind.textBase, tailwind.fontBold, tailwind.textRed600, tailwind.mL3]}>
              {t('app.logout')}
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

export default function Layout() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Map of titles for different routes
  const routeTitleMap: { [key: string]: string } = {
    "/Aid": t('routeTitles.aid'),
    "/NewsMagazine": t('routeTitles.newsMagazine'),
    "/ChatSupport": t('routeTitles.chatSupport'),
    // "/EditProfile": t('routeTitles.editProfile'),
    "/Login": t('routeTitles.login'),
    "/Logout": t('routeTitles.logout'),
    // Add more routes and their titles here
  };

  const getTitle = () => {
    return routeTitleMap[pathname] || "App"; // Default title is "App"
  };
  const navigation = useNavigation();
  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerLeft: () => (
          <View style={{ transform: [{ scale: 1.5 }], marginLeft: 8 }}>
            <DrawerToggleButton tintColor='#0369A1' />
          </View>
        ),
        headerShown: true,
        headerTitle: getTitle(), //() => { return <Text>{getTitle()}</Text> }, // Set dynamic title based on route
        headerLeftContainerStyle: {
          marginLeft: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#E1F2FF',
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          paddingTop: 20,
          maxHeight: 100
        },
        headerTitleStyle: {
          color: '#0369A1',
          fontSize: 26,
          paddingTop: 10,
          marginLeft: 10,
          fontWeight: '700',
        },
        headerTitleAlign: 'left',
        drawerStyle: {
          backgroundColor: '#F0F9FF',
          width: 320,
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  profileImage: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  drawerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDrawerItem: {
    backgroundColor: 'rgba(219, 234, 254, 0.8)',
  },
  iconBackground: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(3, 105, 161, 0.1)',
  },
  logoutButton: {
    backgroundColor: 'rgba(254, 226, 226, 0.8)',
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
