import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image, ImageBackground } from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Toast from 'react-native-toast-message'; // Importing Toast for notifications
import i18next from 'i18next';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated } from 'react-native';
import { AppConfig } from "@/app/config/AppConfig";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import ImageConfig from "../config/ImageConfig";

const webClientId = '872198620379-i4igt6cg79hho53hnotmt2oc593pajol.apps.googleusercontent.com';
const iosClientId = '872198620379-kb1hi3ek0igket6gnul99k87q8q1apov.apps.googleusercontent.com';
const androidClientId = '872198620379-b9u4ev192s6pgf5ed9emhiajub3a9bg0.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

const Login: React.FC = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+60");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState(""); // State for password
  const [loading, setLoading] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false); // Track dropdown state
  const [isLanguageSelectorOpen, setLanguageSelectorOpen] = useState(false); // State for toggling language selector
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language || 'en'); // Track selected language
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userDetails, setuserDetails]=useState<any>(null)
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
    webClientId,
    iosClientId,
    androidClientId,
  };
  // // Google Auth Hook
  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   clientId: Platform.OS === "ios" ? iosClientId : androidClientId,
  // });

const [request,response,promptAsync] = Google.useAuthRequest(config)


const getUserProfile = async (token:any) =>
{
  if (!token) return;
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {Authorization: `Bearer ${token}`}
    });

    const user = await response.json();
    console.log(user)
    setuserDetails(user)

    handleLogin(user)
  }
  catch(error)
  {console.log(error)

  }


}

  const handleToken = () => {
    
    if(response?.type ==="success") {
      const {authentication} = response;
      const token = authentication?.accessToken;
      console.log("access token", token)
      getUserProfile(token)
    }
  }
useEffect(()=> {
  handleToken();
},[response])
  // // Handle Google login response
  // React.useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     handleGoogleLogin(id_token);
  //   }
  // }, [response]);


  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
      // Log UserCode
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
        await AsyncStorage.setItem('isLoggedIn',JSON.stringify(true))
        const chec = AsyncStorage.getItem('isLoggedIn')
        console.log(chec,"At login")
        console.log("Messgae:", data.Message); // Log the retrieved FullName

        // Check UserDetailsFlag value
        if (data.ResponseData[0].UserDetailsFlag === 1) {
          // Navigate to /Aid page if UserDetailsFlag is equal to 1
          // Alert.alert(t('login.alerts.attention'), t('login.alerts.loginSuccess'));
          try {
            router.push('../(drawer)/(tabs)/Aid');
          }
          catch (err) {
            Alert.alert('Error', 'Navigating to Aid failed. ' + err);
          }
        } else {
          // Navigate to /completeuser/BasicDetails if UserDetailsFlag is not equal to 1
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
  const handleLogin = async (googleResponse?: any) => {
    // Check if this is a Google login
    if (googleResponse) {
      // Extract information from the Google response
      const { id, email } = googleResponse;
  
      try {
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
      } catch (error) {
        Alert.alert(t('login.alerts.attention'), t('login.alerts.networkError'));
      }
      return; // Exit the function for Google login
    }
  
    // Perform regular login if no Google response is provided
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
        console.log("UserId from API:", data.ResponseData[0].UserID);
        console.log("UserCode from API:", data.ResponseData[0].UserCode);
  
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
            <TouchableOpacity onPress={() => promptAsync()}>
  <Text style={[tailwind.textCenter, tailwind.mT5]}>
    <Image
      source={{
        //uri: "https://developers.google.com/static/identity/images/branding_guideline_sample_nt_sq_lg.svg",
        uri:"https://tamilcommunityapi.thirdeyeinfotech.com/images/googlesignin.png"
      }}
      style={{
        width: 250,
        height: 55,
        borderRadius: 5, // Optional for rounded corners
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        //elevation: 5, // For Android shadow
      }}
    />
  </Text>
</TouchableOpacity>

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
