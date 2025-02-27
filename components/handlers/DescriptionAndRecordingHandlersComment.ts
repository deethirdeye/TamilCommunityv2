import { Alert } from "react-native";
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { AppConfig } from "@/app/config/AppConfig";
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import { router } from "expo-router";
import { Animated } from "react-native";
import { useTranslation } from "react-i18next";
import { State } from "@/app/context/types";

interface Attachment {
  id: string;
  name: string;
  size: number;
  uri: string;
}

interface StateComment {
  userId: string | number | null;
  aidType: string;
  customAidType: string;
  description: string;
  recordingStatus: 'idle' | 'recording' | 'recorded';
  recordedUri: string | null;
  attachments: Attachment[];
  recording: Audio.Recording | null;
  sound: Audio.Sound | null;
  blinkAnim: Animated.Value;
  setRecordingStatus: (status: 'idle' | 'recording' | 'recorded') => void;
  setRecordedUri: (uri: string | null) => void;
  setAttachments: (attachments: Attachment[]) => void;
  setIsRecording: (isRecording: boolean) => void;
  setModalVisible: (visible: boolean) => void;
  setRecording: (recording: Audio.Recording | null) => void;
  setSound: (sound: Audio.Sound | null) => void;
  RequestID: string | string[];
  userCode: string | null;
}

export const useDescriptionAndRecordingHandlersComment = (state: StateComment) => {
  const { t } = useTranslation();

  const pickDocument = async () => {
    try {
      if (state.attachments.length >= 5) {
        Alert.alert("Limit Reached", "You can only upload up to 5 files.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      // if (result.type === 'success') {
      //   if (result.size && result.size > 5 * 1024 * 1024) {
      //     Alert.alert("File Too Large", "Please select a file smaller than 5MB.");
      //     return;
      //   }

      //   const formData = new FormData();
      //   formData.append('file', {
      //     uri: result.uri,
      //     type: result.mimeType || 'application/octet-stream',
      //     name: result.name,
      //   });

      //   const uploadResponse = await fetch(`${AppConfig.APIURL}/upload`, {
      //     method: 'POST',
      //     body: formData,
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });

      //   if (!uploadResponse.ok) {
      //     throw new Error('Failed to upload file');
      //   }

      //   const uploadResult = await uploadResponse.json();

      //   const newAttachment: Attachment = {
      //     id: Date.now().toString(),
      //     name: result.name,
      //     size: result.size,
      //     uri: uploadResult.blobUrl,
      //   };
      //   state.setAttachments([...state.attachments, newAttachment]);
      // }
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.failedToAttachFile'));
      console.error(err);
    }
  };

  const removeAttachment = (id: string) => {
    state.setAttachments(state.attachments.filter(attachment => attachment.id !== id));
  };

  const uploadRecording = async () => {
    if (!state.recordedUri) {
      console.error('No recording URI found.');
      return null;
    }
  
    try {
      const fileUri = state.recordedUri; // Ensure this is a `file://` URI
  
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
    console.log(state.recordingStatus);
    try {
      if (state.recordingStatus === 'recording') {
        Alert.alert("Stop Recording", "Please stop recording before sending a reply.");
        return;
      }
      if (!state.description.trim() && !state.recordedUri && state.attachments.length === 0) {
        Alert.alert("Empty Comment", "Please enter a comment or record audio.");
        return;
      }

      let recordingPath = null;
      if (state.recordingStatus === 'recorded') {
        recordingPath = await uploadRecording();
      }
      if(state.recordingStatus === 'idle'){
        recordingPath = "null";
      }
      let attachmentsPath = null;

      const commentData = {
        RequestID: state.RequestID,
        CommenterCode: state.userCode, // Ensure userCode is set
        Comment: state.description,
        AdminUserFlg: 0,
        AttachmentPath: " ",
        RecordingPath: recordingPath,
      };

      const response = await fetch(`${AppConfig.APIURL}/api/Grievance/AddComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

      if (response.ok) {
        state.setModalVisible(true);
      } else {
        Alert.alert("Error", data.message || "Failed to submit the request");
      }
    } catch (error) {
      Alert.alert(t('alerts.error'), t('alerts.networkError'));
      console.error(error);
    }
  };

  const handleDone = () => {
    state.setModalVisible(false);
    router.push('/Aid');
  };

  const handleInfoPress = () => {
    Alert.alert(t('alerts.information'), t('alerts.recordingSubjectInfo'));
  };

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(state.blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(state.blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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
      state.setRecording(recording);
      state.setRecordingStatus('recording');
      startBlinking();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('alerts.unknownError');
      Alert.alert(t('alerts.failedToStartRecording'), errorMessage);
    }
  };
  const stopRecording = async () => {
    try {
      await state.recording?.stopAndUnloadAsync();
      const uri = state.recording?.getURI();
      state.setRecording(null);
      state.setRecordingStatus('recorded');
      if (uri) {
        state.setRecordedUri(uri);
        state.blinkAnim.setValue(1);
        const { sound } = await Audio.Sound.createAsync({ uri });
        state.setSound(sound);
      } else {
        state.setRecordedUri(null);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('alerts.unknownError');
      Alert.alert(t('alerts.failedToStartRecording'), errorMessage);
    }
  };

  const playRecording = async () => {
    try {
      await state.sound?.playAsync();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('alerts.unknownError');
      Alert.alert(t('alerts.error'), errorMessage);
    }
  };

  const deleteRecording = () => {
    state.sound?.unloadAsync();
    state.setSound(null);
    state.setRecordingStatus('idle');
  };

  const toggleRecording = async () => {
    try {
      if (state.recordingStatus === 'recording') {
        await stopRecording();
        state.setIsRecording(false);
      } else {
        await startRecording();
        state.setIsRecording(true);
        startBlinking();
        state.setRecordingStatus('recording');
      }
    } catch (error) {
      console.error('Error toggling recording:', error);
      Alert.alert(t('alerts.error'), t('alerts.failedToStartRecording'));
    }
  };

  return {
    pickDocument,
    removeAttachment,
    uploadRecording,
    handleSubmit,
    handleDone,
    handleInfoPress,
    startBlinking,
    startRecording,
    stopRecording,
    playRecording,
    deleteRecording,
    toggleRecording,
  };
}; 