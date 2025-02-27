import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { color, tailwind } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFormContext } from '@/app/context/FormContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTranslation from "@/app/i8n/useTranslationHook";
import PageHeader from "@/components/PageHeader";
import { Audio } from 'expo-av';
import { AppConfig } from '@/app/config/AppConfig';


interface FormData {
  nonMemberDetails?: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    EmergencyContactPersonName?: string;
    emergencyContactNumber?: string;
  };
}


interface AidRequestItem {
  RequestID: string;
  CreatedOn: string; 
  ProcessStatus: string;

}

const NonMemberDetails: React.FC = () => {
  const { formData, setFormData } = useFormContext(); 
  const router = useRouter();
  const [fullName, setFullName] = useState(formData.nonMemberDetails?.fullName || '');
  const [email, setEmail] = useState(formData.nonMemberDetails?.email || '');
  const [mobileNumber, setMobileNumber] = useState(formData.nonMemberDetails?.mobileNumber || '');
  const [EmergencyContactPersonName, setEmergencyContactPersonName] = useState(formData.nonMemberDetails?.EmergencyContactPersonName || '');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(formData.nonMemberDetails?.emergencyContactNumber || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | number | null>(null); 
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null); 
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log("AsyncUserId from AsyncStorage:", storedUserId);
        if (storedUserId !== null) {
          setUserId(Number(storedUserId));
        }
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, []);

  

  const handleNext = async () => {
    if (!fullName || !email || !mobileNumber || !EmergencyContactPersonName || !emergencyContactNumber) {
      Alert.alert(t('alerts.error'), t('alerts.fillAllFields'));
      return;
    }

    try {
      const response = await fetch(`${AppConfig.APIURL}/api/NonMember/AddNonMemberDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, 
          fullName,
          mobileNumber,
          email,
          EmergencyContactPersonName,
          emergencyContactNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
  
        setModalVisible(true);
        router.push("/pages/Aid/AidForSomeoneNonMember");
      } else {
        Alert.alert("Error", data.message || "Failed to submit the request.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again later.");
    }
  };



  const handleEnterNonMember = () => {
    setModalVisible(false);
    router.push("/pages/Aid/AidForSomeoneNonMember");

  };
  // const startRecording = async () => {
  //   try {
  //     console.log('Requesting permissions..');
  //     await Audio.requestPermissionsAsync();

  //     console.log('Starting recording..');
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  //     );
  //     setRecording(recording);
  //     console.log('Recording started');
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // };


  const stopRecording = async () => {
    console.log('Stopping recording..');
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);
      setRecordedUri(uri);
    }
  };

  
  const playRecording = async () => {
    if (recordedUri) {
      console.log('Loading sound for playback..');
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(sound);
      console.log('Playing sound..');
      await sound.playAsync();
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      console.log('Stopping playback..');
      await sound.stopAsync();
      setSound(null);
    }
  };

  // Function to delete the recording
  const deleteRecording = () => {
    setRecordedUri(null); 
    setSound(null);
    console.log('Recording deleted.');
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <PageHeader title={t('aidForNonMember.title')} />

      <ScrollView style={[tailwind.flex1]}>
        <View style={[tailwind.p6]}>
          {/* Instruction Section */}
          <View style={styles.instructionContainer}>
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800, tailwind.mB2]}>
              {t('aidForNonMembersteps.quickGuide.title')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForNonMembersteps.quickGuide.steps.step1')}
            </Text>
          
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForNonMembersteps.quickGuide.steps.step2')}
            </Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}
              placeholder={t('aidForNonMember.fullNamePlaceholder')}
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}
              placeholder={t('aidForNonMember.emailPlaceholder')}
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}
              placeholder={t('aidForNonMember.mobileNumberPlaceholder')}
              placeholderTextColor="#94A3B8"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}
              placeholder={t('aidForNonMember.emergencyContactPersonNamePlaceholder')}
              placeholderTextColor="#94A3B8"
              value={EmergencyContactPersonName}
              onChangeText={setEmergencyContactPersonName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}
              placeholder={t('aidForNonMember.emergencyContactNumberPlaceholder')}
              placeholderTextColor="#94A3B8"
              value={emergencyContactNumber}
              onChangeText={setEmergencyContactNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleNext}
          >
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
              {t('aidForNonMember.nextButton')}
            </Text>
          </TouchableOpacity>

          <View style={[tailwind.justifyCenter, tailwind.mT5]}>
            <Text style={[tailwind.textBase, tailwind.textGray700]}>
              {t('aidForNonMember.alreadyAddedDetails')}{" "}
              <Text
                style={[tailwind.fontBold, tailwind.textBlue500, tailwind.underline]}
                onPress={handleEnterNonMember}>
                {t('aidForNonMember.nextPage')}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  instructionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(3, 105, 161, 0.2)',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  submitButton: {
    backgroundColor: '#0369A1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default NonMemberDetails;
