// import { Alert } from "react-native";
// import { Audio } from 'expo-av';
// import * as DocumentPicker from 'expo-document-picker';
// import { AppConfig } from "@/src/config/AppConfig";
// import { TamilCommunityApi } from "@/src/context/GlobalContext";
// import { router } from "expo-router";

// interface TrackAidDetailsState {
//   RequestID: string;
//   userCode: string;
//   fullName: string;
//   recordingStatus: 'idle' | 'recording' | 'recorded';
//   recordedUri: string | null;
//   recording: Audio.Recording | null;
//   sound: Audio.Sound | null;
//   attachments: Attachment[];
//   description: string;
//   setRecordingStatus: (status: 'idle' | 'recording' | 'recorded') => void;
//   setRecordedUri: (uri: string | null) => void;
//   setRecording: (recording: Audio.Recording | null) => void;
//   setSound: (sound: Audio.Sound | null) => void;
//   setAttachments: (attachments: Attachment[]) => void;
//   setIsRecording: (isRecording: boolean) => void;
//   setRefreshKey: (key: number) => void;
//   setComments: (comments: Comment[]) => void;
// }

// export const useTrackAidDetailsHandlers = (state: TrackAidDetailsState) => {
//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       state.setRecording(recording);
//       state.setRecordingStatus('recording');
//       state.setIsRecording(true);
//       state.setRecordedUri(null);
//     } catch (err) {
//       console.error('Failed to start recording', err);
//       Alert.alert('Error', 'Failed to start recording');
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       if (!state.recording) return;
//       state.setIsRecording(false);
//       await state.recording.stopAndUnloadAsync();
//       const uri = state.recording.getURI();
//       if (uri) {
//         state.setRecordedUri(uri);
//         const { sound } = await Audio.Sound.createAsync({ uri });
//         state.setSound(sound);
//       }
//       state.setRecordingStatus('recorded');
//     } catch (err) {
//       console.error('Failed to stop recording', err);
//       Alert.alert('Error', 'Failed to stop recording');
//     }
//   };

//   const toggleRecording = async () => {
//     if (state.recordingStatus === 'recording') {
//       await stopRecording();
//     } else {
//       await startRecording();
//     }
//   };

//   const playRecording = async () => {
//     try {
//       await state.sound?.playAsync();
//     } catch (err) {
//       Alert.alert('Error', 'Failed to play recording');
//     }
//   };

//   const deleteRecording = () => {
//     state.sound?.unloadAsync();
//     state.setSound(null);
//     state.setRecordingStatus('idle');
//     state.setRecordedUri(null);
//   };

//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*',
//         copyToCacheDirectory: false,
//       });

//       if (result.type === 'success') {
//         if (result.size && result.size > 50 * 1024 * 1024) {
//           Alert.alert("File Too Large", "Please select a file smaller than 50MB.");
//           return;
//         }

//         const newAttachment: Attachment = {
//           id: Date.now().toString(),
//           name: result.name,
//           size: result.size,
//           uri: result.uri,
//         };
//         state.setAttachments(prev => [...prev, newAttachment]);
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to attach file");
//     }
//   };

//   const removeAttachment = (id: string) => {
//     state.setAttachments(prev => prev.filter(attachment => attachment.id !== id));
//   };

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(
//         `${AppConfig.APIURL}/api/Grievance/GetCommentsByRequestID/${state.RequestID}`
//       );
//       const result = await response.json();

//       if (response.ok && result.ResponseData) {
//         state.setComments(result.ResponseData[0]);
//       } else {
//         console.error('Failed to fetch comments:', result);
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };

//   const handleCancelRequest = async () => {
//     try {
//       const response = await fetch(
//         `${AppConfig.APIURL}${TamilCommunityApi.CANCEL_AID_REQUEST}/${state.RequestID}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const result = await response.json();
      
//       if (response.ok && result.ResponseMessage) {
//         Alert.alert("Success", "Request cancelled successfully");
//         router.push("/RequestAid");
//       } else {
//         Alert.alert("Error", "Failed to cancel request");
//       }
//       state.setRefreshKey(prevKey => prevKey + 1);
//     } catch (error) {
//       Alert.alert("Error", "Network error. Please try again later.");
//     }
//   };

//   const sendComment = async () => {
//     if (!state.description.trim()) {
//       Alert.alert("Error", "Please enter a comment");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("RequestID", state.RequestID);
//       formData.append("CommenterCode", state.userCode);
//       formData.append("Comment", state.description);
//       formData.append("AdminUserFlg", "0");
//       formData.append("Status", "0");
//       formData.append("CommentID", "0");
//       formData.append("Name", state.fullName);

//       // Add attachments if any
//       state.attachments.forEach((attachment, index) => {
//         formData.append(`attachments`, {
//           uri: attachment.uri,
//           type: 'application/octet-stream',
//           name: attachment.name,
//         });
//       });

//       // Add recording if exists
//       if (state.recordedUri) {
//         formData.append('recording', {
//           uri: state.recordedUri,
//           type: 'audio/wav',
//           name: 'recording.wav',
//         });
//       }

//       const response = await fetch(`${AppConfig.APIURL}/api/Grievance/AddComment`, {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const result = await response.json();

//       if (response.ok) {
//         state.setRefreshKey(prev => prev + 1);
//         fetchComments();
//       } else {
//         Alert.alert("Error", "Failed to send comment");
//       }
//     } catch (error) {
//       console.error('Error sending comment:', error);
//       Alert.alert("Error", "Failed to send comment");
//     }
//   };

//   return {
//     startRecording,
//     stopRecording,
//     toggleRecording,
//     playRecording,
//     deleteRecording,
//     pickDocument,
//     removeAttachment,
//     fetchComments,
//     handleCancelRequest,
//     sendComment,
//   };
// }; 