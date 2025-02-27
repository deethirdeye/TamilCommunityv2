import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { tailwind } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFormContext } from '@/app/context/FormContext'; // Import the form context
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import PageHeader from '@/components/PageHeader'; // Import PageHeader
import { AppConfig } from '@/app/config/AppConfig';
const styles = {
  container: [tailwind.flex1, tailwind.bgBlue200],
  backIcon: [tailwind.mB2],
  title: [tailwind.text3xl, tailwind.fontBold, tailwind.mB1],
  sectionTitle: [tailwind.textBlue800, tailwind.fontBold, tailwind.text2xl, tailwind.mB1],
  subtitle: [tailwind.textLg, tailwind.textGray600, tailwind.mB2],
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
  buttonText: [tailwind.textWhite, tailwind.textLg, tailwind.fontBold]
};

const ProfileForm = () => {
  const router = useRouter();
  const { formData, setFormData } = useFormContext(); // Access form context
  const { t } = useTranslation();

  const [passportNumber, setPassportNumber] = useState(formData.passportDetails?.PassportNumber || '');
  const [surname, setSurname] = useState(formData.passportDetails?.Surname || '');
  const [givenNames, setGivenNames] = useState(formData.passportDetails?.GivenNames || '');
  const [nationality, setNationality] = useState(formData.passportDetails?.Nationality || '');
  const [dateOfIssue, setDateOfIssue] = useState(formData.passportDetails?.DateOfIssue || '');
  const [dateOfExpiry, setDateOfExpiry] = useState(formData.passportDetails?.DateOfExpiry || '');
  const [placeOfIssue, setPlaceOfIssue] = useState(formData.passportDetails?.PlaceOfIssue || '');

  
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert("Error", "You need to login first.");
          router.push('./pages/Login');
        }
      } catch (error) {
        console.error("Failed to retrieve token:", error);
      }
    };
    loadToken();
  }, []);

 
  const handleFormDataUpdate = async () => {
    const newPassportDetails = {
      PassportNumber: passportNumber,
      Surname: surname,
      GivenNames: givenNames,
      Nationality: nationality,
      DateOfIssue: dateOfIssue,
      DateOfExpiry: dateOfExpiry,
      PlaceOfIssue: placeOfIssue
    };

    // Update form data in context
    setFormData((prevData: any) => ({
      ...prevData,
      passportDetails: newPassportDetails
    }));

    const updatedFormData = {
      ...formData,
      passportDetails: newPassportDetails,
    };

    console.log('Full FormData:', updatedFormData);

    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert("Error", "You need to login first.");
      return;
    }

    const postData = {
      basicDetails: updatedFormData.basicDetails,
      nativeDetails: updatedFormData.nativeDetails,
      malaysiaResidenceDetails: updatedFormData.malaysiaResidenceDetails,
      malaysiaWorkDetails: updatedFormData.malaysiaWorkDetails,
      employerDetails: updatedFormData.employerDetails,
      emergencyDetails: updatedFormData.emergencyDetails,
      passportDetails: updatedFormData.passportDetails
    };

    console.log('postData being sent to API:', postData);

    try {
      const apiUrl = `${AppConfig.APIURL}/api/BasicDetails/Add`;


      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Success:', responseData);

      router.push('/pages/completeuser/registeredscreen');


    } catch (error) {
      console.error('Error:', error);
    }
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
        <ScrollView contentContainerStyle={[tailwind.flexGrow, tailwind.p5, tailwind.bgBlue200]}>
          <View style={styles.container}>

            <PageHeader title={t('passportDetails.completeProfile')} /> 
            <View>
              <Text style={styles.sectionTitle}>{t('passportDetails.passportDetails')}</Text>
              <Text style={[tailwind.textBlue600, tailwind.textLg, tailwind.mB4]}>
                {t('passportDetails.passportDetails')}
              </Text>

            </View>
            <View style={tailwind.mB4}>
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.passportNumber')}
                value={passportNumber}
                onChangeText={setPassportNumber}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.surname')}
                value={surname}
                onChangeText={setSurname}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.givenNames')}
                value={givenNames}
                onChangeText={setGivenNames}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.nationality')}
                value={nationality}
                onChangeText={setNationality}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.dateOfIssue')}
                keyboardType="numeric"
                value={dateOfIssue}
                onChangeText={setDateOfIssue}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.dateOfExpiry')}
                value={dateOfExpiry}
                onChangeText={setDateOfExpiry}
              />
              <TextInput
                style={[styles.input, tailwind.mB4]}
                placeholder={t('passportDetails.placeOfIssue')}
                value={placeOfIssue}
                onChangeText={setPlaceOfIssue}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleFormDataUpdate}
            >
              <Text style={styles.buttonText}>{t('passportDetails.next')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ProfileForm;
