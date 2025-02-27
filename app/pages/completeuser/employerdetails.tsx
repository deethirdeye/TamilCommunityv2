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
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import countriesData from '@/assets/countries+states+cities.json';
import { Country, State, City } from '@/app/context/types';
import { useFormContext } from '@/app/context/FormContext';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from '@/components/PageHeader';

const EmployerDetails = () => {
  const router = useRouter();
  const { formData, setFormData } = useFormContext();
  const { t } = useTranslation();

  const [employerFullName, setEmployerFullName] = useState(formData.employerDetails?.EmployerFullName || '');
  const [companyName, setCompanyName] = useState(formData.employerDetails?.CompanyName || '');
  const [mobileNumber, setMobileNumber] = useState(formData.employerDetails?.MobileNumber || '');
  const [idNumber, setIdNumber] = useState(formData.employerDetails?.IDNumber || '');
  const [employerAddress, setEmployerAddress] = useState(formData.employerDetails?.EmployerAddress || '');
  const [selectedState, setSelectedState] = useState(formData.employerDetails?.State || '');
  const [selectedCity, setSelectedCity] = useState(formData.employerDetails?.City || '');
  const [pinCode, setPinCode] = useState(formData.employerDetails?.PinCode || '');

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const countries: Country[] = countriesData as Country[];

  useEffect(() => {
    const country = countries.find(c => c.name === "Malaysia");
    setStates(country ? country.states : []);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = states.find(s => s.name === selectedState);
      setCities(state ? state.cities : []);
    }
  }, [selectedState]);

  const handleFormDataUpdate = () => {
    // Validation
    if (!employerFullName) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorFullName'));
      return false; // Return false if validation fails
    }
    if (!companyName) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorCompanyName'));
      return false; // Return false if validation fails
    }
    if (!mobileNumber) { // Assuming mobile number should be 10 digits
      Alert.alert(t('alert.attention'), t('employerDetails.errorMobileNumber'));
      return false; // Return false if validation fails
    }
    if (!idNumber) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorIDNumber'));
      return false; // Return false if validation fails
    }
    if (!employerAddress) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorAddress'));
      return false; // Return false if validation fails
    }
    if (!selectedState) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorState'));
      return false; // Return false if validation fails
    }
    if (!selectedCity) {
      Alert.alert(t('alert.attention'), t('employerDetails.errorCity'));
      return false; // Return false if validation fails
    }
    if (!pinCode) { // Assuming pin code should be 5 digits
      Alert.alert(t('alert.attention'), t('employerDetails.errorPinCode'));
      return false; // Return false if validation fails
    }

    // If all validations pass, update form data
    setFormData(prevData => ({
      ...prevData,
      employerDetails: {
        EmployerFullName: employerFullName,
        CompanyName: companyName,
        MobileNumber: mobileNumber,
        IDNumber: idNumber,
        EmployerAddress: employerAddress,
        State: selectedState,
        City: selectedCity,
        PinCode: pinCode,
        EmployerCountry: "Malaysia"
      }
    }));

    return true; // Return true if all validations pass
  };

  // Function to handle navigation
  const handleNext = () => {
    const isValid = handleFormDataUpdate(); // Call validation function
    if (isValid) {
      router.push('/pages/completeuser/passportdetails'); // Navigate only if valid
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
          <PageHeader title={t('employerDetails.completeYourProfile')} />

          <View style={[tailwind.mT6]}>
            <Text style={[tailwind.textBlue800, tailwind.fontBold, tailwind.text2xl, tailwind.mB2]}>
              {t('employerDetails.employerDetails')}
            </Text>
            <Text style={[tailwind.textBlue600, tailwind.textLg, tailwind.mB4]}>
              {t('employerDetails.employerDetails')}
            </Text>

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('employerDetails.employerFullName')}
              placeholderTextColor="#718096"
              value={employerFullName}
              onChangeText={setEmployerFullName}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('employerDetails.companyName')}
              placeholderTextColor="#718096"
              value={companyName}
              onChangeText={setCompanyName}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('employerDetails.mobileNumber')}
              placeholderTextColor="#718096"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('employerDetails.employerIDNumber')}
              placeholderTextColor="#718096"
              value={idNumber}
              onChangeText={setIdNumber}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('employerDetails.employerAddress')}
              placeholderTextColor="#718096"
              value={employerAddress}
              onChangeText={setEmployerAddress}
            />

            <View style={[styles.pickerContainer, tailwind.mB4]}>
              <Picker
                selectedValue={selectedState}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedState(itemValue)}
              >
                <Picker.Item label={t('employerDetails.selectState')} value="" />
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
                  <Picker.Item label={t('employerDetails.selectCity')} value="" />
                  {cities.map((city) => (
                    <Picker.Item key={city.id} label={city.name} value={city.name} />
                  ))}
                </Picker>
              </View>
            )}

            <TextInput
              style={[styles.input, tailwind.mB8]}
              placeholder={t('employerDetails.pinCode')}
              keyboardType="numeric"
              value={pinCode}
              onChangeText={setPinCode}
            />

            <TouchableOpacity
              style={[styles.button, tailwind.mT8]}
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

export default EmployerDetails;

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
  }
});
