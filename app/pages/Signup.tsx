import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import { AppConfig } from "@/app/config/AppConfig";

const Signup: React.FC = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+60");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // State for dropdown visibility

  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const countryPrefixes = [
    { value: "+60", flag: "🇲🇾" },
    { value: "+91", flag: "🇮🇳" },
    { value: "+1", flag: "🇺🇸" },
    { value: "+65", flag: "🇸🇬" },
    { value: "+44", flag: "🇬🇧" },
    { value: "+61", flag: "🇦🇺" },
  ];

  const handleMobileNumberChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, "");
    setMobileNumber(filteredText);
  };

  const validateFields = () => {
    const newErrors = { fullName: "", email: "", mobileNumber: "", password: "" };

    if (!fullName.trim()) {
      newErrors.fullName = t('signup.fullNameRequired');
    }
    if (!email.trim()) {
      newErrors.email = t('signup.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('signup.invalidEmail');
    }
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = t('signup.mobileNumberRequired');
    }
    if (!password.trim()) {
      newErrors.password = t('signup.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('signup.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSignup = async () => {
    if (!validateFields()) {
      Alert.alert(t('alert.attention'), t('signup.pleaseFixErrors'));
      return;
    }

    const url = `${AppConfig.APIURL}/api/Account/Signup`;

    const payload = {
      FullName: fullName,
      Email: email,
      MobileNumber: `${selectedCountryCode}${mobileNumber}`,
      Password: password,
    };

    try {
      setIsLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert(t('login.alerts.success'), t('signup.accountCreated'));
        router.push({
          pathname: './sendmail',
          params: { email, fullName, mobileNumber: `${selectedCountryCode}${mobileNumber}`, password },
        });
      } else if (responseData.ResponseCode === 2) {
        Alert.alert("Error", responseData.Message || t('signup.userAlreadyExists'));
      } else {
        Alert.alert("Error", responseData.Message || t('signup.somethingWentWrong'));
      }
    } catch (error) {
      Alert.alert(t('alert.attention'), t('signup.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <TouchableWithoutFeedback onPress={() => {
      setIsDropdownVisible(false); // Collapse dropdown when touching outside
      Keyboard.dismiss(); // Dismiss keyboard if open
    }}>
      <KeyboardAvoidingView
        style={[tailwind.flex1]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <LinearGradient
          colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
          style={[tailwind.flex1, tailwind.pX4]}
        >
            <ScrollView contentContainerStyle={[tailwind.flexGrow]}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={[tailwind.mB4, tailwind.mT10]}>
            <View style={[tailwind.bgWhite, tailwind.roundedFull, tailwind.p2, tailwind.shadowMd, { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="arrow-back" size={24} color="#0369A1" />
            </View>
          </TouchableOpacity>

          {/* Title Section */}
          <View style={[tailwind.mT8, tailwind.mB8]}>
            <Text style={[tailwind.text4xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB2]}>
              {t('signup.welcome')}
            </Text>
            <Text style={[tailwind.textXl, tailwind.textBlue700, tailwind.mB2]}>
              {t('signup.portalTitle')}
            </Text>
          </View>

          {/* Input Section */}
          <View style={[tailwind.bgWhite, tailwind.roundedLg, tailwind.p6, tailwind.shadowLg, tailwind.mB8]}>
            {/* Full Name Input */}
            <View style={[styles.inputContainer, tailwind.mB4]}>
              <TextInput
                style={[tailwind.flex1, tailwind.h12, tailwind.pX4]}
                placeholder={t('signup.fullNamePlaceholder')}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#64748B"
              />
            </View>
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            {/* Email Input */}
            <View style={[styles.inputContainer, tailwind.mB4]}>
              <TextInput
                // style={[tailwind.flex1, tailwind.h12, tailwind.pX4]}
                // placeholder={t('signup.emailPlaceholder')}
                // value={email}
                // onChangeText={setEmail}
                // keyboardType="email-address"
                // placeholderTextColor="#64748B"

                style={[tailwind.flex1, tailwind.h12, tailwind.pX4]}
                placeholder={t('signup.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#64748B"
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            {/* Mobile Number Input */}
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
                placeholder={t('signup.mobileNumberPlaceholder')}
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                keyboardType="phone-pad"
                placeholderTextColor="#64748B"
              />
            </View>
            {errors.mobileNumber ? <Text style={styles.errorText}>{errors.mobileNumber}</Text> : null}

            {/* Country Code Dropdown */}
            {isDropdownVisible && (
              <View style={[tailwind.absolute, tailwind.bgWhite, tailwind.roundedLg, tailwind.shadowLg, { top: 60, left: '50%', transform: [{ translateX: -100 }], width: '80%', zIndex: 999 }]}>
                <ScrollView style={{ maxHeight: 200 }}>
                  {countryPrefixes.map((country) => (
                    <TouchableOpacity
                      key={country.value}
                      style={[tailwind.p4, tailwind.borderB, tailwind.borderGray200]}
                      onPress={() => {
                        setSelectedCountryCode(country.value);
                        setIsDropdownVisible(false); // Close dropdown after selection
                      }}
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
                placeholder={t('signup.passwordPlaceholder')}
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
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* Signup Button */}
            <TouchableOpacity
              style={[
                tailwind.bgBlue600,
                tailwind.pY4,
                tailwind.roundedLg,
                tailwind.shadowMd,
                isLoading && tailwind.bgBlue400,
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontBold, tailwind.textLg]}>
                {isLoading ? t('signup.creatingAccount') : t('signup.createAccount')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Create Account Link */}
          <View style={[tailwind.itemsCenter, tailwind.mB8]}>
            <Text style={[tailwind.textBlue800]}>
              {t('signup.alreadyHaveAccount')}{' '}
              <Text
                style={[tailwind.textBlue600, tailwind.fontBold]}
                onPress={() => router.push("/")}
              >
                {t('signup.signIn')}
              </Text>
            </Text>
          </View>
          </ScrollView>
        </LinearGradient>
       
      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Signup;