import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
  Modal,

  ScrollView,
  Alert,
  FlatList,
  Animated,
  BackHandler,
} from "react-native";
import { Checkbox } from 'react-native-paper';
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from "@/components/PageHeader"; 
import DescriptionInput from "@/components/DescriptionInput";
import { useDescriptionAndRecordingHandlers } from '@/components/handlers/DescriptionAndRecordingHandlers';
import { AppConfig } from "@/app/config/AppConfig";
import { TamilCommunityApi } from "@/app/context/GlobalContext";

const RequestAid = () => {
  const [aidType, setAidType] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [aidFor, setAidFor] = useState<string[]>([]);
  const [aidForPickerVisible, setAidForPickerVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [SomeoneUserCode, setSomeoneUserCode] = useState<{ SomeoneUserCode: string; FullName: string }[]>([]);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [subject, setSubject] = useState("");
  const [customAidType, setCustomAidType] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const { t } = useTranslation();
  // Recording states
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [isRecording, setIsRecording] = useState(false);

  const handlers = useDescriptionAndRecordingHandlers({
    userId,
    aidType,
    customAidType,
    description,
    recordingStatus,
    recordedUri,
    attachments,
    recording,
    sound,
    blinkAnim,
    setRecordingStatus,
    setRecordedUri,
    setAttachments,
    setIsRecording,
    setModalVisible,
    setRecording,
    setSound,
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(Number(storedUserId));
      } catch (error) {
        console.error("Failed to fetch userId:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(Number(storedUserId));
      } catch (error) {
        console.error("Failed to fetch userId:", error);
      }
    };
    fetchUserId();
    
    // Handle the back button press when recording
    const backAction = () => {
      if (recordingStatus === 'recording') {
        Alert.alert(
          t('login.alerts.attention'),
          t('trackAidDetailsSelf.actionDisabled'),
          [{ text: t('trackAidDetailsSelf.yes') }]
        );
        return true;  // Prevent the back action
      } else {
        return false;  // Allow the back action
      }
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      // Clean up the listener on component unmount
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [recordingStatus]);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log("AsyncUserId from AsyncStorage:", storedUserId);
        setUserId(Number(storedUserId));
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, [userId]);

  
  useEffect(() => {
    const fetchUserCodes = async () => {
      if (!userId) {
        console.warn("User ID is not available.");
        return;
      }

      try {
        const response = await fetch(`${AppConfig.APIURL}/api/NonMember/GetUserCodesByUserId/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

       
        if (Array.isArray(data.ResponseData)) {
          const userCodesData = data.ResponseData;

         
          if (userCodesData.length > 0) {
            setSomeoneUserCode(userCodesData[0]); 
          } else {
            setSomeoneUserCode(userCodesData); 
          }
        } else {
          console.error("ResponseData is not defined or not an array.");
          setSomeoneUserCode([]); 
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    };

    fetchUserCodes();
  }, [userId]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error(t('alerts.recordingPermissionError'));
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.m4a',
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC
        },
        ios: {
          extension: '.m4a',
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          audioQuality: Audio.IOSAudioQuality.HIGH
        },
        web: {
          mimeType: "audio/m4a",
          bitsPerSecond: 128000
        }
      };
  
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setRecordingStatus('recording');
     
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('alerts.unknownError');
      Alert.alert(t('alerts.failedToStartRecording'), errorMessage);
    }
  };
  const stopRecording = async () => {
    try {
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      setRecording(null);
      setRecordingStatus('recorded');
      if (uri) {
        setRecordedUri(uri);
        blinkAnim.setValue(1);
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSound(sound);
      } else {
        setRecordedUri(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('alerts.unknownError');
      Alert.alert(t('alerts.failedToStartRecording'), errorMessage);
    }
  };

  const toggleRecording = async () => {
    try {
      if (recordingStatus === 'recording') {
        await stopRecording();
        setIsRecording(false);
      } else {
        await startRecording();
        setIsRecording(true);
       
        setRecordingStatus('recording');
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      Alert.alert(t('alerts.error'), t('alerts.failedToStartRecording'));
    }
  };


  const removeAttachment = (id: string) => {
    setAttachments(prevAttachments => prevAttachments.filter(attachment => attachment.id !== id));
  };

  const handlePlayRecording = async (recordingPath: string | null) => {
    if (!recordingPath) {
      Alert.alert("Error", "No recording file available to play.");
      return;
    }
  
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingPath },
        { shouldPlay: true }
      );
  
      // Play the sound
      await newSound.playAsync();
  
      // Handle playback completion
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status && status.isLoaded && 'didJustFinish' in status && status.didJustFinish) {
          console.log("Playback finished");
        }
      });
    } catch (error) {
      console.error("Error playing recording:", error);
      Alert.alert("Error", "Failed to play recording");
    }
  };


  const uploadRecording = async () => {
    if (!recordedUri) {
      console.error('No recording URI found.');
      return null;
    }
  
    try {
      const fileUri = recordedUri; // Ensure this is a `file://` URI
  
     const formData = new FormData();
     formData.append('audioFile', {
        uri: fileUri,
        name: `recording_${Date.now()}.m4a`,
        type: 'audio/m4a',
      } as any);
      
  
      const uploadResponse = await fetch(`${AppConfig.APIURL}${TamilCommunityApi.UPLOAD_RECORDING}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.title || 'Failed to upload recording');
      }
  
      const responseData = await uploadResponse.json();
      return responseData.blobUrl;
    } catch (error) {
      console.error('Error in uploadRecording:', error);
      Alert.alert('Upload Error', 'Failed to upload recording');
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!aidType || !description) {
        Alert.alert(t('login.alerts.attention'), t('alerts.fillAllFields'));
        return;
      }
      if (recordingStatus === 'recording') {
        Alert.alert(t('login.alerts.attention'),t('trackAidDetailsSelf.stopRecording'));
        return;
      }
      let recordingPath = null;
      if (recordingStatus === 'recorded') {
        recordingPath = await uploadRecording();
      }

      const response = await fetch(`${AppConfig.APIURL}/api/Aid/AddBasicAidSomeone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          aidType:aidType === 'custom' ?customAidType : aidType,
          description: description,
          ProcessStatus: "Sent",
          RecordingPath: recordingPath,
         // RecordingPath: blobUrl,
         AidforUserCode: aidFor[0],
      
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalVisible(true);
      } else {
        Alert.alert("Error", data.message || "Failed to submit the request");
      }
    } catch (error) {
      Alert.alert(t('alerts.error'), t('alerts.networkError'));
      console.error(error);
    }
  };

  const filteredUserCodes = SomeoneUserCode.filter((item) =>
    item.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.SomeoneUserCode.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleRequestDone = () => {
    setModalVisible(false);
    router.push('/Aid');
  };

  const handleDone = () => {
    setAidForPickerVisible(false);
  };

  const handlegoback = () => {
    setAidForPickerVisible(false);
    router.push('/pages/Aid/AidForSomeone');
  }
  // const handleSubmit = async () => {
  //   if (!subject || !description) {
  //     Alert.alert(t('aidForSomeoneNonMember.alerts.fillAllFields'));
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${AppConfig.APIURL}/api/Aid/AddBasicAidSomeone`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: userId, 
  //         aidType: subject,
  //         description: description,
  //         ProcessStatus: "Sent",
  //         AidforUserCode: aidFor[0]
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
 
  //       setModalVisible(true);
  //     } else {
  //       Alert.alert("Error", data.message || "Failed to submit the request.");
  //     }
  //   } catch (error) {
  //     Alert.alert(t('aidForSomeoneNonMember.alerts.networkError'));
  //   }
  // };

  const handleAidForSelection = (value: string) => {
    if (aidFor.includes(value)) {
      setAidFor(aidFor.filter((item) => item !== value));
    } else {
      setAidFor([...aidFor, value]);
    }
  };
  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
      <PageHeader
  title={t('aidForSomeoneNonMember.pageTitle')}
  showBackButton
  onBackButtonPress={() => {
    if (recordingStatus === 'recording') {
      Alert.alert(
        t('login.alerts.attention'),
        t('trackAidDetailsSelf.actionDisabled'),
        [{ text: t('trackAidDetailsSelf.yes') }]
      );
    } else {
      // Navigate back or perform the default back button action
      router.back();
    }
  }}
/>

        <View style={[tailwind.p6]}>
          <Text style={[tailwind.textXl,
          tailwind.fontBold,
          tailwind.textBlue800,
          tailwind.mY4,]}>
            {t('aidForSomeoneNonMember.grievanceFor')}
          </Text>

 
          <TouchableOpacity
            style={[
              styles.inputContainer
            ]}
            onPress={() => setAidForPickerVisible(true)}
          >
            <Text style={[tailwind.p4, tailwind.textBase]}>
              {aidFor.length > 0 ? aidFor.join(", ") : t('aidForSomeoneNonMember.selectAidFor')}
            </Text>
          </TouchableOpacity>

         
          <Modal
  visible={aidForPickerVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setAidForPickerVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TextInput
        style={[
          tailwind.p2,
          tailwind.border,
          tailwind.rounded,
          tailwind.mB4,
          tailwind.textBase,
        ]}
        placeholder={t('aidForSomeoneNonMember.searchPlaceholder')}
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={[]}>
        {filteredUserCodes.map((item) => (
          <View
            key={item.SomeoneUserCode}
            style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.mB3]}
          >
            <Checkbox
              status={aidFor.includes(item.SomeoneUserCode) ? 'checked' : 'unchecked'}
              onPress={() => {
                if (aidFor.includes(item.SomeoneUserCode)) {
                  // Uncheck if already selected
                  setAidFor(aidFor.filter((code) => code !== item.SomeoneUserCode));
                } else if (aidFor.length > 0) {
                  // Show alert if another checkbox is already selected
                  alert('Only one option can be selected at a time.');
                } else {
                  // Select the new checkbox
                  setAidFor([item.SomeoneUserCode]);
                }
              }}
            />
            <Text style={[tailwind.textBase, tailwind.mL2]}>{item.FullName}</Text>
            <Text style={[tailwind.textBase, tailwind.mL2]}>
              ({item.SomeoneUserCode})
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={tailwind.justifyCenter}>
        <Text style={[tailwind.textBase, tailwind.textGray700]}>
          {t('aidForSomeoneNonMember.memberQuestion')}{" "}
          <Text
            style={[
              tailwind.itemsCenter,
              tailwind.fontBold,
              tailwind.textBlue500,
              tailwind.underline,
            ]}
            onPress={handlegoback}
          >
            {t('aidForSomeoneNonMember.goBack')}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[
          tailwind.bgBlue500,
          tailwind.p4,
          tailwind.roundedLg,
          tailwind.itemsCenter,
          tailwind.mT5,
        ]}
        onPress={handleDone}
      >
        <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
          {t('aidForSomeoneNonMember.done')}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


          <Text style={[
            tailwind.textXl,
            tailwind.fontBold,
            tailwind.textBlue800,
            tailwind.mY4,
          ]}>
            {t('aidForSomeoneNonMember.selectAidType')}
          </Text>

 
          <View >
            <Picker
              selectedValue={aidType}
              onValueChange={(itemValue) => setAidType(itemValue)}
              style={[styles.inputContainer, tailwind.p4]}
            >
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.select')} value="" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.financial')} value="financial" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.medical')} value="medical" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.legal')} value="legal" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.education')} value="education" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.housing')} value="housing" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.food')} value="food" />
              <Picker.Item label={t('aidForSomeoneNonMember.aidTypes.other')} value="custom" />
            </Picker>
          </View>

          {aidType === 'custom' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[tailwind.p4, tailwind.textBase]}
                placeholder={t('aidForSomeoneNonMember.customAidType')}
                value={customAidType}
                onChangeText={setCustomAidType}
                placeholderTextColor="#94A3B8"
              />
            </View>
          )}

     
          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase]}
              placeholder={t('aidForSomeoneNonMember.subject')}
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#94A3B8"
            />
          </View>

     
          <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
            recordingStatus={recordingStatus}
            toggleRecording={toggleRecording}
            playRecording={handlers.playRecording}
            deleteRecording={handlers.deleteRecording}
            pickDocument={handlers.pickDocument}
          />


          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <Text style={[tailwind.textBase, tailwind.fontBold, tailwind.textBlue800, tailwind.mB2]}>
                {t('aidForSomeoneNonMember.attachments')}
              </Text>
              <FlatList
                data={attachments}
                renderItem={({ item }) => (
                  <View style={styles.attachmentItem}>
                    <Text style={[tailwind.textSm, tailwind.textBlue700, tailwind.flex1]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => handlers.removeAttachment(item.id)}>
                      <Ionicons name="close-circle" size={24} color="#0369A1" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          )}


          <TouchableOpacity
            style={[styles.submitButton, tailwind.mT6]}
            onPress={handleSubmit}
          >
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
              {t('aidForSomeoneNonMember.submitRequest')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[
              tailwind.text2xl,
              tailwind.fontBold,
              tailwind.textBlue900,
              tailwind.textCenter,
              tailwind.mB6
            ]}>
              {t('aidForSomeoneNonMember.requestSubmitted')}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlers.handleDone}
            >
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
                {t('aidForSomeoneNonMember.done')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 200,
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
  descriptionInput: {
    flex: 1,

    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
  },
  mediaControlsContainer: {
    ...tailwind.flexRow,
    ...tailwind.justifyBetween,
    ...tailwind.itemsCenter,
    ...tailwind.p4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(3, 105, 161, 0.1)',
  },
  recordingControls: {
    ...tailwind.flexRow,
    ...tailwind.itemsCenter,
  },
  iconButton: {
    ...tailwind.p2,
    ...tailwind.roundedFull,
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
  submitButton: {
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
  modalContainer: {
    ...tailwind.flex1,
    ...tailwind.justifyEnd,
    ...tailwind.pX5,
    ...tailwind.pB5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  modalContent: {
    ...tailwind.bgWhite,
    ...tailwind.p5,
    ...tailwind.roundedLg,
    ...tailwind.itemsCenter,
  },
  attachmentsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(3, 105, 161, 0.1)',
  },
});


export default RequestAid;
