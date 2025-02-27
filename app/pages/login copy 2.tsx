import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import i18next from 'i18next';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated } from 'react-native';
import { AppConfig } from "@/app/config/AppConfig";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { signIn } from "./sigincomp";


GoogleSignin.configure({
  webClientId: '845380231252-e76pc6a6ubtjc9evjh5m7vsm23fr4vbd.apps.googleusercontent.com',
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: '845380231252-hb84qo81eg38jrr0c1sn8utqiv2skk3n.apps.googleusercontent.com', 
  androidClientId: '845380231252-1jdltrhi5dkf9usphp0m6r0l3uh3r8p6.apps.googleusercontent.com'// only for iOS
});


const androidClientId = '845380231252-1jdltrhi5dkf9usphp0m6r0l3uh3r8p6.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+60");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language || 'en');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { t } = useTranslation();
  const fadeAnim = new Animated.Value(0);

  const countryPrefixes = [
    { value: "+60", flag: "🇲🇾" },
    { value: "+91", flag: "🇮🇳" },
    { value: "+1", flag: "🇺🇸" },
    { value: "+65", flag: "🇸🇬" },
    { value: "+44", flag: "🇬🇧" },
    { value: "+61", flag: "🇦🇺" },
  ];

  const config = {
    androidClientId,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const getUserProfile = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();
      console.log("Google User Profile:", user);
      setUserDetails(user);
      handleLogin(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleToken = () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log("Access Token:", token);
      getUserProfile(token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem('appLanguage', language);
    i18next.changeLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  const handleMobileNumberChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setMobileNumber(filteredText);
  };

  const storeToken = async (Token: string, UserID: string, UserCode: string, FullName: string) => {
    try {
      await AsyncStorage.setItem('userToken', Token);
      await AsyncStorage.setItem('userId', UserID.toString());
      await AsyncStorage.setItem('UserCode', UserCode);
      await AsyncStorage.setItem('FullName', FullName);
    } catch (error) {
      console.error("Error storing token:", error);
    }
  };

  const handleLoginButton = async () => {
    if (!password && !mobileNumber) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillBothFields'));
      return;
    }
    if (!mobileNumber) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillphone'));
      return;
    }
    if (!password) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillpassword'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${AppConfig.APIURL}/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: selectedCountryCode + mobileNumber,
          password: password,
        }),
      });

      const data = await response.json();
      const messageMap: { [key: string]: string } = {
        "Please confirm your account from the link sent to your mailid": "apiMessages.confirmAccount",
        "Invalid credentials.": "apiMessages.invalidCredentials",
      };

      const getTranslatedMessage = (message: string, t: any) => {
        const translationKey = messageMap[message];
        return translationKey ? t(translationKey) : message;
      };

      if (response.ok) {
        await storeToken(
          data.ResponseData[0].Token,
          data.ResponseData[0].UserID,
          data.ResponseData[0].UserCode,
          data.ResponseData[0].FullName
        );

        if (data.ResponseData[0].UserDetailsFlag === 1) {
          router.push('../(drawer)/(tabs)/Aid');
        } else {
          Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Incomplete Details',
            text2: 'Please fill in your basic details to continue.',
          });
          router.push({
            pathname: '/pages/completeuser/BasicDetails',
            params: {
              FullName: data.ResponseData[0].FullName,
              Email: data.ResponseData[0].Email,
              mobileNumber: selectedCountryCode + mobileNumber,
            },
          });
        }
      } else {
        Alert.alert(t('login.alerts.attention'), getTranslatedMessage(data.Message, t));
      }
    } catch (error) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (googleResponse?: any) => {
    if (googleResponse) {
      const { id, email } = googleResponse;

      try {
        const response = await fetch(
          `${AppConfig.APIURL}/api/Account/googlelogin?googleId=${id}&email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Google Login API Response:", data);

        if (data.ResponseData && data.ResponseData.length > 0) {
          await storeToken(
            data.ResponseData[0].Token,
            data.ResponseData[0].UserID,
            data.ResponseData[0].UserCode,
            data.ResponseData[0].FullName
          );

          if (data.ResponseData[0].UserDetailsFlag === 1) {
            router.push('../(drawer)/(tabs)/Aid');
          } else {
            Toast.show({
              type: 'info',
              position: 'top',
              text1: 'Incomplete Details',
              text2: 'Please fill in your basic details to continue.',
            });
            router.push({
              pathname: '/pages/completeuser/BasicDetails',
              params: {
                FullName: data.ResponseData[0].FullName,
                Email: data.ResponseData[0].Email,
                mobileNumber: '',
              },
            });
          }
        } else {
          Alert.alert(t('login.alerts.attention'), 'Invalid API response');
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        Alert.alert(t('login.alerts.attention'), t('login.alerts.networkError'));
      }
      return;
    }

    // Regular login flow
    if (!mobileNumber || !password) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillBothFields'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${AppConfig.APIURL}/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: selectedCountryCode + mobileNumber,
          password: password,
        }),
      });

      const data = await response.json();

      const messageMap: { [key: string]: string } = {
        "Please confirm your account from the link sent to your mailid": "apiMessages.confirmAccount",
        "Invalid credentials.": "apiMessages.invalidCredentials",
      };

      const getTranslatedMessage = (message: string, t: any) => {
        const translationKey = messageMap[message];
        return translationKey ? t(translationKey) : message;
      };

      if (response.ok) {
        await storeToken(
          data.ResponseData[0].Token,
          data.ResponseData[0].UserID,
          data.ResponseData[0].UserCode,
          data.ResponseData[0].FullName
        );

        if (data.ResponseData[0].UserDetailsFlag === 1) {
          router.push('../(drawer)/(tabs)/Aid');
        } else {
          Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Incomplete Details',
            text2: 'Please fill in your basic details to continue.',
          });
          router.push({
            pathname: '/pages/completeuser/BasicDetails',
            params: {
              FullName: data.ResponseData[0].FullName,
              Email: data.ResponseData[0].Email,
              mobileNumber: selectedCountryCode + mobileNumber,
            },
          });
        }
      } else {
        Alert.alert(t('login.alerts.attention'), getTranslatedMessage(data.Message, t));
      }
    } catch (error) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCountryCodeSelect = (code: string) => {
    setSelectedCountryCode(code);
    setIsDropdownVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      setIsDropdownVisible(false);
      Keyboard.dismiss();
    }}>
      <KeyboardAvoidingView
        style={[tailwind.flex1]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <LinearGradient
          colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
          style={[tailwind.flex1, tailwind.pX4]}
        >
          <ScrollView contentContainerStyle={[tailwind.flexGrow]}>
            <View style={[tailwind.mT12, tailwind.mB8, tailwind.pT10]}>
              <Text style={[tailwind.text4xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB2]}>
                {t('login.welcome_to')}
              </Text>
              <Text style={[tailwind.textXl, tailwind.textBlue700, tailwind.mB2]}>
                {t('login.tamil_community_portal')}
              </Text>
              <Text style={[tailwind.textBase, tailwind.textBlue600]}>
                {t('login.place_for_tamils')}
              </Text>
            </View>

            <View style={[tailwind.bgWhite, tailwind.roundedLg, tailwind.p6, tailwind.shadowLg, tailwind.mB8]}>
              <View style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.bgBlue100, tailwind.roundedLg, tailwind.mB4, tailwind.border, tailwind.borderBlue200]}>
                <View style={[tailwind.w24, tailwind.borderR, tailwind.borderBlue200]}>
                  <TouchableOpacity
                    style={[tailwind.h12, tailwind.bgWhite, tailwind.flexRow, tailwind.itemsCenter, tailwind.pX4, tailwind.border, tailwind.borderGray400]}
                    onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                  >
                    <Text style={[tailwind.textBase]}>
                      {countryPrefixes.find(country => country.value === selectedCountryCode)?.flag} {selectedCountryCode}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[tailwind.flex1, tailwind.h12, tailwind.pX4]}
                  placeholder={t('login.mobile_number')}
                  value={mobileNumber}
                  onChangeText={handleMobileNumberChange}
                  keyboardType="phone-pad"
                  placeholderTextColor="#64748B"
                />
              </View>

              {isDropdownVisible && (
                <View style={[tailwind.absolute, tailwind.bgWhite, tailwind.roundedLg, tailwind.shadowLg, { top: 60, left: '50%', transform: [{ translateX: -100 }], width: '80%', zIndex: 100 }]}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {countryPrefixes.map((country) => (
                      <TouchableOpacity
                        key={country.value}
                        style={[tailwind.p4, tailwind.borderB, tailwind.borderGray200]}
                        onPress={() => handleCountryCodeSelect(country.value)}
                      >
                        <Text style={[tailwind.textGray700]}>
                          {country.flag} {country.value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.bgBlue100, tailwind.roundedLg, tailwind.mB4, tailwind.border, tailwind.borderBlue200]}>
                <TextInput
                  style={[tailwind.flex1, tailwind.h12, tailwind.pX4]}
                  placeholder={t('login.password')}
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity
                  style={[tailwind.pX4]}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={24}
                    color="#0369A1"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[tailwind.selfEnd, tailwind.mB6]}
                onPress={() => router.push('/pages/PasswordReset')}
              >
                <Text style={[tailwind.textBlue600, tailwind.fontMedium]}>
                  {t('login.forgot_password')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tailwind.bgBlue600,
                  tailwind.pY4,
                  tailwind.roundedLg,
                  tailwind.shadowMd,
                  loading && tailwind.bgBlue400,
                  styles.buttonShadow
                ]}
                onPress={handleLoginButton}
                disabled={loading}
              >
                <Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontBold, tailwind.textLg]}>
                  {loading ? t('login.signing_in') : t('login.sign_in')}
                </Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity onPress={() => promptAsync()}>
                  <Text style={[tailwind.textCenter, tailwind.mT5]}>
                  <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[tailwind.itemsCenter, tailwind.mB8]}>
              <Text style={[tailwind.textBlue800]}>
                <Text
                  style={[tailwind.textBlue600, tailwind.fontBold]}
                  onPress={() => router.push('/pages/Signup')}
                >
                  {t('login.create_account')}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[tailwind.bgWhite, tailwind.roundedLg, tailwind.p4, tailwind.flexRow, tailwind.itemsCenter, tailwind.justifyCenter, tailwind.shadowMd]}
              onPress={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <Ionicons name="language" size={24} color="#0369A1" style={[tailwind.mR2]} />
              <Text style={[tailwind.textGray700, tailwind.textBase, tailwind.mR2]}>
                {selectedLanguage === "en" ? 'English' : 'தமிழ்'}
              </Text>
              <Ionicons
                name={isLanguageDropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#0369A1"
              />
            </TouchableOpacity>

            {isLanguageDropdownOpen && (
              <View style={[tailwind.mT2, tailwind.bgWhite, tailwind.roundedLg, tailwind.overflowHidden, tailwind.shadowLg]}>
                <TouchableOpacity
                  style={[tailwind.p4, tailwind.borderB, tailwind.borderGray200]}
                  onPress={() => {
                    handleLanguageChange("en");
                    setIsLanguageDropdownOpen(false);
                  }}
                >
                  <Text style={[tailwind.textGray700]}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[tailwind.p4]}
                  onPress={() => {
                    handleLanguageChange("ta");
                    setIsLanguageDropdownOpen(false);
                  }}
                >
                  <Text style={[tailwind.textGray700]}>தமிழ்</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Login;