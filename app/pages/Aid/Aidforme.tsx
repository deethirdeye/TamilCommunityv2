import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  FlatList,
  Animated,
  Platform,
  BackHandler,
} from "react-native";
import { router } from "expo-router";
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '@/components/PageHeader';
import * as DocumentPicker from 'expo-document-picker';
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import { AppConfig } from "@/app/config/AppConfig";
import DescriptionInput from '@/components/DescriptionInput';
import { useDescriptionAndRecordingHandlers } from '@/components/handlers/DescriptionAndRecordingHandlers';
import useTranslation from "@/app/i8n/useTranslationHook";

const { height } = Dimensions.get('window');

interface Attachment {
  id: string;
  name: string;
  size: number;
  uri: string;
}

const Aidforme = () => {
  const { t } = useTranslation();
  const [aidType, setAidType] = useState("");
  const [customAidType, setCustomAidType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

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

 

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
      <PageHeader
  title={t('aidForm.title')}
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
              {t('aidForm.quickGuide.title')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForm.quickGuide.steps.step1')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForm.quickGuide.steps.step2')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForm.quickGuide.steps.step3')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue700]}>
              {t('aidForm.quickGuide.steps.step4')}
            </Text>
          </View>

          <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue800, tailwind.mY4]}>
            {t('aidForm.aidType.title')}
          </Text>

          {/* Picker Container */}
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={aidType}
              onValueChange={(itemValue) => setAidType(itemValue)}
              style={[tailwind.p4]}
            >
              <Picker.Item label={t('aidForm.aidType.placeholder')} value="" />
              <Picker.Item label={t('aidForm.aidType.types.financial')} value="financial" />
              <Picker.Item label={t('aidForm.aidType.types.medical')} value="medical" />
              <Picker.Item label={t('aidForm.aidType.types.legal')} value="legal" />
              <Picker.Item label={t('aidForm.aidType.types.education')} value="education" />
              <Picker.Item label={t('aidForm.aidType.types.housing')} value="housing" />
              <Picker.Item label={t('aidForm.aidType.types.food')} value="food" />
              <Picker.Item label={t('aidForm.aidType.types.other')} value="custom" />
            </Picker>
          </View>

          {aidType === 'custom' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[tailwind.p4, tailwind.textBase]}
                placeholder={t('aidForm.aidType.customPlaceholder')}
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
              placeholder={t('aidForm.subject.placeholder')}
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

          {/* Attachments List */}
          {attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              <Text style={[tailwind.textBase, tailwind.fontBold, tailwind.textBlue800, tailwind.mB2]}>
                {t('aidForm.attachments.title')}
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

      {/* Success Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      // onRequestClose={handlers.handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue900, tailwind.textCenter, tailwind.mB6]}>
              {t('aidForm.modal.success')}
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlers.handleDone}
            
            >
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
                {t('aidForm.buttons.done')}
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

export default Aidforme;
