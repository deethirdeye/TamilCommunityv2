import React, { useState } from 'react';
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
import { useFormContext } from '@/app/context/FormContext';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from '@/components/PageHeader';

const EmergencyDetails = () => {
  const router = useRouter();
  const { formData, setFormData } = useFormContext();
  const { t } = useTranslation();

  const [malaysiaEmergencyContactName, setMalaysiaEmergencyContactName] = useState(formData.emergencyDetails?.MalaysiaEmergencyContactPerson || '');
  const [malaysiaEmergencyPhone, setMalaysiaEmergencyPhone] = useState(formData.emergencyDetails?.MalaysiaEmergencyPhone || '');
  const [otherEmergencyContactName, setOtherEmergencyContactName] = useState(formData.emergencyDetails?.OtherEmergencyContactPerson || '');
  const [otherEmergencyPhone, setOtherEmergencyPhone] = useState(formData.emergencyDetails?.OtherEmergencyPhone || '');

  const handleFormDataUpdate = () => {
    // Validation
    if (!malaysiaEmergencyContactName) {
      Alert.alert(t('alert.attention'), t('emergencyDetails.errorContactName'));
      return false; // Return false if validation fails
    }
    if (!malaysiaEmergencyPhone) {
      Alert.alert(t('alert.attention'), t('emergencyDetails.errorEmergencyPhone'));
      return false; // Return false if validation fails
    }
    if (!otherEmergencyContactName) {
      Alert.alert(t('alert.attention'), t('emergencyDetails.errorOtherContactName'));
      return false; // Return false if validation fails
    }
    if (!otherEmergencyPhone) {
      Alert.alert(t('alert.attention'), t('emergencyDetails.errorOtherEmergencyPhone'));
      return false; // Return false if validation fails
    }

    // If all validations pass, update form data
    setFormData(prevData => ({
      ...prevData,
      emergencyDetails: {
        MalaysiaEmergencyContactPerson: malaysiaEmergencyContactName,
        MalaysiaEmergencyPhone: malaysiaEmergencyPhone,
        OtherEmergencyContactPerson: otherEmergencyContactName,
        OtherEmergencyPhone: otherEmergencyPhone
      }
    }));

    return true; // Return true if all validations pass
  };

  // Function to handle navigation
  const handleNext = () => {
    const isValid = handleFormDataUpdate(); // Call validation function
    if (isValid) {
      router.push('/pages/completeuser/employerdetails'); // Navigate only if valid
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
          <PageHeader title={t('emergencyDetails.completeProfile')} />

          <View style={[tailwind.mT6]}>
            <Text style={[tailwind.textBlue800, tailwind.fontBold, tailwind.text2xl, tailwind.mB2]}>
              {t('emergencyDetails.personalDetails')}
            </Text>
            <Text style={[tailwind.textBlue600, tailwind.textLg, tailwind.mB4]}>
              {t('emergencyDetails.emergencyDetails')}
            </Text>

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('emergencyDetails.malaysiaEmergencyContactName')}
              placeholderTextColor="#718096"
              value={malaysiaEmergencyContactName}
              onChangeText={setMalaysiaEmergencyContactName}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('emergencyDetails.malaysiaEmergencyPhone')}
              placeholderTextColor="#718096"
              keyboardType="phone-pad"
              value={malaysiaEmergencyPhone}
              onChangeText={setMalaysiaEmergencyPhone}
            />

            <TextInput
              style={[styles.input, tailwind.mB4]}
              placeholder={t('emergencyDetails.otherEmergencyContactName')}
              placeholderTextColor="#718096"
              value={otherEmergencyContactName}
              onChangeText={setOtherEmergencyContactName}
            />

            <TextInput
              style={[styles.input, tailwind.mB8]}
              placeholder={t('emergencyDetails.otherEmergencyPhone')}
              placeholderTextColor="#718096"
              keyboardType="phone-pad"
              value={otherEmergencyPhone}
              onChangeText={setOtherEmergencyPhone}
            />

            <TouchableOpacity
              style={[styles.button]}
              onPress={handleNext} // Call handleNext for validation and navigation
            >
              <Text style={[tailwind.textWhite, tailwind.textLg, tailwind.fontBold]}>
                {t('emergencyDetails.nextButton')}
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

export default EmergencyDetails;
