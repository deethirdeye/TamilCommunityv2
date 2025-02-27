import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,

  // CheckBox has been removed as it is not exported from 'react-native'
  FlatList,
  BackHandler,
} from "react-native";
import { router } from "expo-router";
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import PageHeader from '@/components/PageHeader';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import { AppConfig } from "@/app/config/AppConfig";
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-native-paper';

import DescriptionInput from "@/components/DescriptionInput";
import { useDescriptionAndRecordingHandlersSomeone } from "@/components/handlers/DescriptionAndRecordingHandlersSomeone";


interface Attachment {
  id: string;
  name: string;
  size: number;
  uri: string;
}

const AidForSomeone = () => {
  const { t } = useTranslation();
  const [aidType, setAidType] = useState("");
  const [customAidType, setCustomAidType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [aidFor, setAidFor] = useState<string[]>([]);
  const [aidForPickerVisible, setAidForPickerVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [userCodes, setUserCodes] = useState<{ UserCode: string; FullName: string }[]>([]);
  const [userId, setUserId] = useState<string | number | null>(null);

  const [attachments, setAttachments] = useState<Attachment[]>([]);


  // Recording states
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(Number(storedUserId));
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, []);

 

  
  const handleEnterNonMember = () => {
    setAidForPickerVisible(false);
    router.push("/pages/Aid/AidforNonMember");

 
  };

  useEffect(() => {
    const fetchUserCodes = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `${AppConfig.APIURL}/api/Account/GetUserCodes?loggedInUserCode=${userId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (Array.isArray(data.ResponseData) && data.ResponseData.length > 0) {
            setUserCodes(data.ResponseData[0]);
          } else {
            console.error("ResponseData is not in the expected format.");
          }
        } catch (error) {
          console.error("Error fetching user codes:", error);
        }
      }
    };

    fetchUserCodes();
  }, [userId]);

  // const handleSubmit = async () => {
  //   if (!aidType || !description || aidFor.length === 0) {
  //     Alert.alert(t('login.alerts.attention'), t('aidForSomeone.errors.fillFields'));
  //     return;
  //   }

  //   let recordingPath = null;
  //   if (recordingStatus === 'recorded') {
  //     recordingPath = await uploadRecording();
  //     console.log("Recording Path:", recordingPath);
  //   }

  //   try {
  //     const response = await fetch(`${AppConfig.APIURL}/api/Aid/AddBasicAidSomeone`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: userId,
  //         aidType: aidType === 'custom' ? customAidType : aidType,
  //         subject: subject,
  //         description: description,
  //         ProcessStatus: "Sent",
  //         AidforUserCode: aidFor[0],
  //         RecordingPath: recordedUri,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setModalVisible(true);
  //     } else {
  //       Alert.alert(t('login.alerts.attention'), data.Message || "Failed to submit the request");
  //     }
  //   } catch (error) {
  //     Alert.alert(t('login.alerts.attention'), t('aidForSomeone.errors.networkError'));
  //     console.error(error);
  //   }
  // };

  
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // const handleDone = () => {
  //   setModalVisible(false);
  //   router.push('/Aid');
  // };
  const handleDone = () => {
    setAidForPickerVisible(false);
  };
  const handleInfoPress = () => {
    Alert.alert("Information", "Please type a subject if you are recording.");
  };

    const handleAidForSelection = (userCode: string) => {
      if (aidFor.includes(userCode)) {
      // Uncheck the same checkbox if clicked again
      setAidFor(aidFor.filter(code => code !== userCode));
    } else if (aidFor.length > 0) {
      // Alert if another option is already selected
      alert('Only one option can be selected at a time.');
    } else {
      // Set the newly selected checkbox
      setAidFor([userCode]);
    }
  };


  const filteredUserCodes = Array.isArray(userCodes)
    ? userCodes.filter((item) =>
      item.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.UserCode.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];
    const handlers = useDescriptionAndRecordingHandlersSomeone({
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
      aidFor,
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

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
      <PageHeader
  title={t('aidForSomeone.title')}
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
          {/* Instruction Section */}
          <View style={styles.instructionContainer}>
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800, tailwind.mB2]}>
              {t('aidForSomeone.quickGuide.title')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForSomeone.quickGuide.steps.step1')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForSomeone.quickGuide.steps.step2')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForSomeone.quickGuide.steps.step3')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForSomeone.quickGuide.steps.step4')}
            </Text>
          </View>
          <Text style={[tailwind.textXl,
          tailwind.fontBold,
          tailwind.textBlue800,
          tailwind.mY4,]}>
            {t('aidForSomeoneNonMember.grievanceFor')}
          </Text>
          {/* Aid For Selection */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setAidForPickerVisible(true)}>
            <Text style={[tailwind.p4, tailwind.textBase, tailwind.textBlue800]}>
              {aidFor.length > 0 ? aidFor.join(", ") : t('aidForSomeone.selectAidFor')}
            </Text>
          </TouchableOpacity>
          <Text style={[
            tailwind.textXl,
            tailwind.fontBold,
            tailwind.textBlue800,
            tailwind.mY4,
          ]}>
            {t('aidForSomeoneNonMember.selectAidType')}
          </Text>
          {/* Aid Type Selection */}
          <View>
            <Picker
              selectedValue={aidType}
              onValueChange={(itemValue) => setAidType(itemValue)}
              style={[styles.inputContainer, tailwind.p4]}
            >
              <Picker.Item label={t('aidForSomeone.aidType.placeholder')} value="" />
              <Picker.Item label={t('aidForSomeone.aidType.types.financial')} value="financial" />
              <Picker.Item label={t('aidForSomeone.aidType.types.medical')} value="medical" />
              <Picker.Item label={t('aidForSomeone.aidType.types.legal')} value="legal" />
              <Picker.Item label={t('aidForSomeone.aidType.types.education')} value="education" />
              <Picker.Item label={t('aidForSomeone.aidType.types.housing')} value="housing" />
              <Picker.Item label={t('aidForSomeone.aidType.types.food')} value="food" />
              <Picker.Item label={t('aidForSomeone.aidType.types.other')} value="custom" />
            </Picker>
          </View>

          {aidType === 'custom' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[tailwind.p4, tailwind.textBase]}
                placeholder={t('aidForSomeone.aidType.customPlaceholder')}
                value={customAidType}
                onChangeText={setCustomAidType}
                placeholderTextColor="#94A3B8"
              />
            </View>
          )}

          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[tailwind.p4, tailwind.textBase]}
              placeholder={t('aidForSomeone.subject.placeholder')}
              value={subject}
              onChangeText={setSubject}
              placeholderTextColor="#94A3B8"
            />
          </View>

         
            {/* Description Input Component */}
            <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
            recordingStatus={recordingStatus}
            toggleRecording={handlers.toggleRecording}
            playRecording={handlers.playRecording}
            deleteRecording={handlers.deleteRecording}
            pickDocument={handlers.pickDocument}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, tailwind.mT6]}
            onPress={handlers.handleSubmit}
            //disabled={recordingStatus === 'recording'}
          >
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
              {t('aidForm.buttons.submit')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Aid For Picker Modal */}
      <Modal
  visible={aidForPickerVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setAidForPickerVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TextInput
        style={[tailwind.p2, tailwind.border, tailwind.rounded, tailwind.mB4, tailwind.textBase]}
        placeholder={t('aidForSomeone.searchAidFor')}
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.scrollView}>
        {filteredUserCodes.map((item) => (
          <View
            key={item.UserCode}
            style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.mB3]}
          >
            <Checkbox
              status={aidFor.includes(item.UserCode) ? 'checked' : 'unchecked'}
              onPress={() => handleAidForSelection(item.UserCode)}
            />
            <Text style={[tailwind.textBase, tailwind.mL2]}>{item.FullName}</Text>
            <Text style={[tailwind.textBase, tailwind.mL2]}>({item.UserCode})</Text>
          </View>
        ))}
      </ScrollView>

      {/* Add the "Not a member of Tamil Community?" text */}
      <View style={tailwind.justifyCenter}>
        <Text style={[tailwind.textBase, tailwind.textGray700]}>
          {t('aidForSomeone.notTamilMember')}{" "}
          <Text
            style={[tailwind.itemsCenter, tailwind.fontBold, tailwind.textBlue500, tailwind.underline]}
            onPress={handleEnterNonMember}
          >
            {t('aidForSomeone.enterDetails')}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={[tailwind.bgBlue500, tailwind.p4, tailwind.roundedLg, tailwind.itemsCenter, tailwind.mT5]}
        onPress={handleDone}
      >
        <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
          {t('aidForSomeone.buttons.done')}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
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
              {t('aidForSomeone.modal.success')}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/Aid');
              }}
            >
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
                {t('aidForSomeone.buttons.done')}
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
  descriptionInput: {
    flex: 1,

    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
  attachmentsContainer: {
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
  },
  modalContainer: {
    ...tailwind.flex1,
    ...tailwind.justifyEnd,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  modalContent: {
    ...tailwind.bgWhite,
    ...tailwind.p5,
    ...tailwind.roundedLg,
    ...tailwind.itemsCenter,
    ...tailwind.mX4,
    height: "70%",
    maxHeight: "80%",
  },
  scrollView: {
    ...tailwind.maxH48,
  },
  userItem: {
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedUserItem: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default AidForSomeone;
