import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { tailwind } from 'react-native-tailwindcss';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFormContext } from '@/app/context/FormContext';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from '@/components/PageHeader';

const BasicDetails: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  const router = useRouter();
  const { FullName, Email, mobileNumber } = useLocalSearchParams();
  const { t } = useTranslation();

  const fullNameString = Array.isArray(FullName) ? FullName[0] : FullName || '';
  const emailString = Array.isArray(Email) ? Email[0] : Email || '';
  const mobileNumberString = Array.isArray(mobileNumber) ? mobileNumber[0] : mobileNumber || '';

  const [currentLocation, setCurrentLocation] = useState(formData.basicDetails?.currentLocation || '');
  const [dob, setDob] = useState(formData.basicDetails?.dob || '');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
    })();
  }, []);

  const handleDobChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    let formattedDate = '';
    if (digits.length <= 2) {
      formattedDate = digits;
    } else if (digits.length <= 4) {
      formattedDate = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formattedDate = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    setDob(formattedDate);
  };

  const handleNext = () => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      Alert.alert(t('alert.attention'), t('basicDetails.errorDateFormat'));
      return;
    }

    setFormData(prev => ({
      ...prev,
      basicDetails: {
        fullName: fullNameString,
        email: emailString,
        mobileNumber: mobileNumberString,
        dob,
        currentLocation,
      },
    }));
    router.push('./nativedetails');
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <KeyboardAvoidingView
        style={[tailwind.flex1]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={[tailwind.flex1]}>
          <PageHeader title={t('basicDetails.completeProfile')} />

          <View style={[tailwind.p6]}>
            <View style={[tailwind.mT6]}>
              <Text style={[tailwind.textBlue800, tailwind.fontBold, tailwind.mB4, tailwind.text2xl]}>
                {t('basicDetails.personalDetails')}
              </Text>
            </View>

            <View style={[tailwind.mT4]}>
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('basicDetails.fullName')}
                placeholderTextColor="#718096"
                value={fullNameString}
                editable={false}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('basicDetails.email')}
                placeholderTextColor="#718096"
                value={emailString}
                editable={false}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('basicDetails.mobileNumber')}
                placeholderTextColor="#718096"
                value={mobileNumberString}
                editable={false}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('basicDetails.dobPlaceholder')}
                placeholderTextColor="#718096"
                value={dob}
                onChangeText={handleDobChange}
              />
              <TextInput
                style={[styles.input]}
                placeholder={t('basicDetails.currentLocation')}
                placeholderTextColor="#718096"
                value={currentLocation}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={[tailwind.mT8, styles.button]}
              onPress={handleNext}
            >
              <Text style={[tailwind.textWhite, tailwind.textLg, tailwind.fontBold]}>
                {t('basicDetails.nextButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  input: {
    ...tailwind.bgWhite,
    ...tailwind.p4,
    ...tailwind.roundedLg,
    ...tailwind.textLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    ...tailwind.bgBlue600,
    ...tailwind.p4,
    ...tailwind.roundedLg,
    ...tailwind.itemsCenter,
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

export default BasicDetails;
