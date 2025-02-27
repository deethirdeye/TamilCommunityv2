import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { tailwind } from 'react-native-tailwindcss';

import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import countriesData from "@/assets/countries+states+cities.json";
import { Country, State, City } from "@/app/context/types";
import { useFormContext } from "@/app/context/FormContext";
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from '@/components/PageHeader';

const ProfileForm = () => {
  const router = useRouter();
  const { formData, setFormData } = useFormContext();
  const { t } = useTranslation();

  const [selectedCountry, setSelectedCountry] = useState<string>(formData.malaysiaWorkDetails?.MalaysiaState || '');
  const [selectedState, setSelectedState] = useState<string>(formData.malaysiaWorkDetails?.MalaysiaState || '');
  const [selectedCity, setSelectedCity] = useState<string>(formData.malaysiaWorkDetails?.MalaysiaCity || '');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const countries: Country[] = countriesData as Country[];
  const [address, setAddress] = useState(formData.malaysiaWorkDetails?.MalaysiaWorkAddress || '');
  const [pinCode, setPinCode] = useState(formData.malaysiaWorkDetails?.MalaysiaPinCode || '');
  const [contactPersonName, setContactPersonName] = useState(formData.malaysiaWorkDetails?.MalaysiaWorkContactPersonName || '');
  const [contactPersonPhone, setContactPersonPhone] = useState(formData.malaysiaWorkDetails?.MalaysiaWorkContactPersonPhone || '');

  useEffect(() => {
    const country = countries.find(c => c.name === "Malaysia");
    setStates(country ? country.states : []);
    setSelectedState('');
    setCities([]);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = states.find(s => s.name === selectedState);
      setCities(state ? state.cities : []);
    }
  }, [selectedState]);

  const handleFormDataUpdate = () => {
    // Validation
    if (!address) {
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorAddress'));
      return false; // Return false if validation fails
    }
    if (!pinCode) { // Assuming pin code should be 5 digits
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorPinCode'));
      return false; // Return false if validation fails
    }
    if (!contactPersonName) {
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorContactPersonName'));
      return false; // Return false if validation fails
    }
    if (!contactPersonPhone) { // Assuming phone number should be 10 digits
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorContactPersonPhone'));
      return false; // Return false if validation fails
    }
    if (!selectedState) {
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorState'));
      return false; // Return false if validation fails
    }
    if (!selectedCity) {
      Alert.alert(t('alert.attention'), t('malaysiaWorkDetails.errorCity'));
      return false; // Return false if validation fails
    }

    // If all validations pass, update form data
    setFormData(prevData => ({
      ...prevData,
      malaysiaWorkDetails: {
        MalaysiaWorkAddress: address,
        MalaysiaState: selectedState,
        MalaysiaCity: selectedCity,
        MalaysiaPinCode: pinCode,
        MalaysiaWorkContactPersonName: contactPersonName,
        MalaysiaWorkContactPersonPhone: contactPersonPhone
      }
    }));

    return true; // Return true if all validations pass
  };

  // Function to handle navigation
  const handleNext = () => {
    const isValid = handleFormDataUpdate(); // Call validation function
    if (isValid) {
      router.push('/pages/completeuser/emergencydetails'); // Navigate only if valid
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <ScrollView style={[tailwind.flex1]} contentContainerStyle={[tailwind.pX4, tailwind.pY8]}>
          <PageHeader title={t('malaysiaWorkDetails.completeProfile')} />

          <View style={[tailwind.mT6]}>
            <Text style={[tailwind.textBlue800, tailwind.fontBold, tailwind.text2xl, tailwind.mB2]}>
              {t('malaysiaWorkDetails.personalDetails')}
            </Text>
            <Text style={[tailwind.textBlue600, tailwind.textLg, tailwind.mB4]}>
              {t('malaysiaWorkDetails.malaysiaWorkDetails')}
            </Text>

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('malaysiaWorkDetails.malaysiaWorkAddress')}
              placeholderTextColor="#718096"
              value={address}
              onChangeText={setAddress}
            />

            <View style={[styles.pickerContainer, tailwind.mB4]}>
              <Picker
                selectedValue={selectedState}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedState(itemValue)}
              >
                <Picker.Item label={t('malaysiaWorkDetails.selectState')} value="" />
                {states.map((state) => (
                  <Picker.Item key={state.id} label={state.name} value={state.name} />
                ))}
              </Picker>
            </View>

            {cities.length > 0 && (
              <View style={[styles.pickerContainer, tailwind.mB4]}>
                <Picker
                  selectedValue={selectedCity}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedCity(itemValue)}
                >
                  <Picker.Item label={t('malaysiaWorkDetails.selectCity')} value="" />
                  {cities.map((city) => (
                    <Picker.Item key={city.id} label={city.name} value={city.name} />
                  ))}
                </Picker>
              </View>
            )}

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('malaysiaWorkDetails.pinCode')}
              placeholderTextColor="#718096"
              keyboardType="numeric"
              value={pinCode}
              onChangeText={setPinCode}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('malaysiaWorkDetails.contactPersonName')}
              placeholderTextColor="#718096"
              value={contactPersonName}
              onChangeText={setContactPersonName}
            />

            <TextInput
              style={[styles.input, tailwind.mB8]}
              placeholder={t('malaysiaWorkDetails.contactPersonPhone')}
              placeholderTextColor="#718096"
              keyboardType="phone-pad"
              value={contactPersonPhone}
              onChangeText={setContactPersonPhone}
            />

            <TouchableOpacity
              style={[styles.button]}
              onPress={handleNext}
            >
              <Text style={[tailwind.textWhite, tailwind.textLg, tailwind.fontBold]}>
                {t('malaysiaWorkDetails.next')}
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
  pickerContainer: {
    ...tailwind.bgWhite,
    ...tailwind.roundedLg,
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
  picker: {
    ...tailwind.p4,
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

export default ProfileForm;
