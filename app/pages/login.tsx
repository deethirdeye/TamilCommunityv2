import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image, ImageBackground } from "react-native";
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
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import ImageConfig from "../config/ImageConfig";
import SocialLogin from "@/components/SocialLogin";
import { COLORS } from "@/constants/Colors";


GoogleSignin.configure({
  webClientId: '845380231252-e76pc6a6ubtjc9evjh5m7vsm23fr4vbd.apps.googleusercontent.com', // Required for Android
  iosClientId: '872198620379-kb1hi3ek0igket6gnul99k87q8q1apov.apps.googleusercontent.com', // Required for iOS
  offlineAccess: true, // Optional, if you need offline access
  scopes: ['profile', 'email'], // Optional, if you need additional scopes
});

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const { t } = useTranslation();
  
  const countryPrefixes = [
    { value: "+60", flag: "🇲🇾" },
    { value: "+91", flag: "🇮🇳" },
    { value: "+1", flag: "🇺🇸" },
    { value: "+65", flag: "🇸🇬" },
    { value: "+44", flag: "🇬🇧" },
    { value: "+61", flag: "🇦🇺" },
  ];

  const signInWithGoogle = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);

      // Check if Play Services are available
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign out first to ensure a clean state
      await GoogleSignin.signOut();

      // Perform sign in
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);

      if (userInfo) {
        const { id, email } = userInfo;

        // Make API request for Google login
        const response = await fetch(`${AppConfig.APIURL}/api/Account/googlelogin?googleId=${id}&email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Google Login Successful:", data);

          // Store the JWT token, user ID, and other details
          await storeToken(
            data.ResponseData[0].Token,
            data.ResponseData[0].UserID,
            data.ResponseData[0].UserCode,
            data.ResponseData[0].FullName
          );

          const storedUserId = await AsyncStorage.getItem('userId');
          const storedUserCode = await AsyncStorage.getItem('UserCode');
          const storedFullName = await AsyncStorage.getItem('FullName');

          console.log("AsyncUserId:", storedUserId);
          console.log("AsyncUserCode:", storedUserCode);
          console.log("AsyncFullName:", storedFullName);

          // Check UserDetailsFlag value
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
          Alert.alert(t('login.alerts.attention'), data.Message || 'Google Login Failed.');
        }
      }
    } catch (error) {
      console.error('Detailed error:', error);

      if ((error as any).code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign in was cancelled');
      } else if ((error as any).code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Sign in is already in progress');
      } else if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services not available or outdated');
      } else {
        Alert.alert('Error', (error as any).message || 'Sign in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // const storeToken = async (Token: string, UserID: string, UserCode: string, FullName: string) => {
  //   try {
  //     await AsyncStorage.setItem('userToken', Token);
  //     await AsyncStorage.setItem('userId', UserID.toString());
  //     await AsyncStorage.setItem('UserCode', UserCode);
  //     await AsyncStorage.setItem('FullName', FullName);
  //     await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
  //   } catch (error) {
  //     console.error('Error storing token:', error);
  //   }
  // };

  



  // Language change handler
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await AsyncStorage.setItem('appLanguage', language); // Save selected language
    i18next.changeLanguage(language);
    setLanguageSelectorOpen(false);
  };

  // Function to filter out non-numeric characters
  const handleMobileNumberChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setMobileNumber(filteredText);
  };

  // Function to store JWT token and user details
  const storeToken = async (Token: string, UserID: string, UserCode: string, FullName: string) => {
    try {
      await AsyncStorage.setItem('userToken', Token);
      await AsyncStorage.setItem('userId', UserID.toString());
      await AsyncStorage.setItem('UserCode', UserCode); // Store UserCode
      await AsyncStorage.setItem('FullName', FullName); // Store UserName
      await AsyncStorage.setItem('isLoggedIn',JSON.stringify(true))
      const chec = AsyncStorage.getItem('isLoggedIn')
      console.log(chec,"At login")
    } catch (error) {

    }
  };

  const handleLoginButton = async () => {
    // Perform validation

    if ( !password && !mobileNumber ) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillBothFields'));
      return;
    }
    if ( !mobileNumber) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillphone'));
      return;
    }

    if ( !password) {
      Alert.alert(t('login.alerts.attention'), t('login.alerts.fillpassword'));
      return;
    }


    
    // Set loading state
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
        "Invalid credentials.": "apiMessages.invalidCredentials"
      };

      const getTranslatedMessage = (message: string, t: any) => {
        const translationKey = messageMap[message];
        return translationKey ? t(translationKey) : message;
      };
      if (response.ok) {
        console.log("UserId from API:", data.ResponseData[0].UserID);
        console.log("UserCode from API:", data.ResponseData[0].UserCode); // Log the UserCode

        // Store the JWT token, user ID, and user code
        await storeToken(data.ResponseData[0].Token, data.ResponseData[0].UserID, data.ResponseData[0].UserCode, data.ResponseData[0].FullName);

        // Retrieve the stored userId and userCode to confirm they're saved correctly
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserCode = await AsyncStorage.getItem('UserCode'); // Get UserCode from AsyncStorage
        const storedFullName = await AsyncStorage.getItem('FullName'); // Get FullName from AsyncStorage
        console.log("AsyncUserId from AsyncStorage:", storedUserId);
        console.log("AsyncUserCode from AsyncStorage:", storedUserCode); // Log the retrieved UserCode
        console.log("AsyncFullName from AsyncStorage:", storedFullName);
        console.log("Messgae:", data.Message); // Log the retrieved FullName

        // Check UserDetailsFlag value
        if (data.ResponseData[0].UserDetailsFlag === 1) {
          try {
            router.push('../(drawer)/(tabs)/Aid');
          }
          catch (err) {
            Alert.alert('Error', 'Navigating to Aid failed. ' + err);
          }
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
        // Handle errors from API response
        Alert.alert(t('login.alerts.attention'), getTranslatedMessage(data.Message, t));
      }
    } catch (error) {
      // Handle network or other errors
      Alert.alert(t('login.alerts.attention'), t('login.alerts.networkError'));
    } finally {
      setLoading(false);
    }
  };
  
  
  // Define constants for text strings
  const welcomeToText = t('login.welcome_to');
  const tamilCommunityPortalText = t('login.tamil_community_portal');
  const placeForTamilsText = t('login.place_for_tamils');
  const forgotPasswordText = t('login.forgot_password');
  const createAccountText = t('login.create_account');
  const signingInText = t('login.signing_in');
  const signInText = t('login.sign_in');
  const mobileNumberPlaceholder = t('login.mobile_number');
  const passwordPlaceholder = t('login.password');

  // Function to handle country code selection
  const handleCountryCodeSelect = (code: string) => {
    setSelectedCountryCode(code);
    setIsDropdownVisible(false); // Close dropdown after selection
  };


  return (
    <TouchableWithoutFeedback onPress={() => {
      setIsDropdownVisible(false); // Collapse dropdown when touching outside
      Keyboard.dismiss(); // Dismiss keyboard if open
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

          {/* Login Form Container */}
          <View style={[tailwind.bgWhite, tailwind.roundedLg, tailwind.p6, tailwind.shadowLg, tailwind.mB8]}>
            {/* Phone Input */}
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
           

            {/* Render the dropdown outside of the main layout flow */}
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

            {/* Password Input */}
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={[tailwind.selfEnd, tailwind.mB6]}
              onPress={() => router.push('/pages/PasswordReset')}
            >
              <Text style={[tailwind.textBlue600, tailwind.fontMedium]}>
                {t('login.forgot_password')}
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
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
            <View > 
            <SocialLogin
                text={googleLoading ? 'Loading...' : 'Continue with Google'}
                img={ "https://tamilcommunityapi.thirdeyeinfotech.com/images/googlesignin.png"}
                bgColor={COLORS.googleLoginBg}
                textClr={COLORS.googleTextColor}
                onPress={signInWithGoogle}
               
            />
           
                        </View>
          </View>
          
          {/* Create Account Link */}
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

          {/* Language Selector */}
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

          {/* Language Dropdown */}
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
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputShadow: {
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
