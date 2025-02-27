import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, FlatList, Animated, BackHandler } from "react-native";
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import useTranslation from "@/app/i8n/useTranslationHook";
import { Audio } from "expo-av";
// import Slider from "@react-native-community/slider";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from "@/components/PageHeader";
import * as DocumentPicker from 'expo-document-picker';
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import { AppConfig } from "@/app/config/AppConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDescriptionAndRecordingHandlers } from '@/components/handlers/DescriptionAndRecordingHandlers';
import DescriptionInput from "@/components/DescriptionInput";


// Add this interface for the comment request
interface CommentRequest {
  RequestID: string;
  CommenterCode: string;
  Comment: string;
  AdminUserFlg: 0;
  Status: 0;
  CommentID: 0;
  Name: string;
  CreatedOn: string;
  AttachementPath: string;
  RecordingPath: string;
  LastModifiedBy: string;
}



// Add interface for comments
interface Comment {
  RequestID: string;
  CommenterCode: string;
  Comment: string;
  AdminUserFlg: number;
  Status: number;
  Name: string;
  CreatedOn: string;
  AttachmentPath: string | null;
  RecordingPath: string | null;
  LastModifiedBy: string | null;
  CommentID: number;
}

// Define the interface for request details
interface RequestDetails {
  RecordingPath?: string; // Optional property
  // Add other properties as needed
  CreatedOn?: string; // Example of another property
  AidType?: string; // Example of another property
  FullName?: string;
  ProcessStatus?: string

  Description?: string;
}

const AidDetails = () => {
  const { RequestID } = useLocalSearchParams();
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");


  const [fullName, setFullName] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);



  const [aidType, setAidType] = useState("");
  const [customAidType, setCustomAidType] = useState("");
  const [description, setDescription] = useState("");

  // Recording states
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]); // Changed Attachment to any
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | number | null>(null);

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
  // Fetch aid request details by RequestID
  useEffect(() => {
    if (RequestID) {
      const fetchRequestDetails = async () => {
        try {
          const response = await fetch(
            `${AppConfig.APIURL}${TamilCommunityApi.GET_BASIC_AID_BY_REQUEST_ID}/${RequestID}`
          );
          const result = await response.json();

          if (response.ok && result.ResponseData) {
            setRequestDetails(result.ResponseData[0][0]); // Ensure this includes RecordingPath
          } else {
            Alert.alert(t('trackAidDetailsSelf.error'), t('trackAidDetailsSelf.cancelRequestMessage'));
          }
        } catch (error) {
          Alert.alert(t('trackAidDetailsSelf.error'), t('trackAidDetailsSelf.networkError'));
        }
      };

      fetchRequestDetails();
    }
  }, [RequestID, refreshKey]);


  useEffect(() => {
    const fetchUserCode = async () => {
      try {
        const storedUserCode = await AsyncStorage.getItem("UserCode");
        console.log("AsyncUserCode from AsyncStorage:", storedUserCode);
        setUserCode(storedUserCode);
      } catch (error) {
        console.error("Failed to fetch usercode from AsyncStorage:", error);
      }
    };

    fetchUserCode();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedFullName = await AsyncStorage.getItem("FullName");
        console.log("AsyncUserCode from AsyncStorage:", storedFullName);
        setFullName(storedFullName);
      } catch (error) {
        console.error("Failed to fetch userId from AsyncStorage:", error);
      }
    };

    fetchUser();
  }, []);
  // Handle cancel request
  const handleCancelRequest = async () => {
    Alert.alert(
      t('trackAidDetailsSelf.confirmCancelTitle'), // Title for the alert
      t('trackAidDetailsSelf.confirmCancelMessage'), // Message for the alert
      [
        {
          text: t('trackAidDetailsSelf.no'), // No button
          onPress: () => console.log("Cancel request canceled"),
          style: "cancel",
        },
        {
          text: t('trackAidDetailsSelf.yes'), // Yes button
          onPress: async () => {
            try {
              const response = await fetch(
                `${AppConfig.APIURL}/api/Aid/CancelAidRequest?requestId=${RequestID}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const result = await response.json();
              setRefreshKey(prevKey => prevKey + 1);
              if (response.ok && result.ResponseMessage) {
                Alert.alert(t('trackAidDetailsSelf.success'), t('trackAidDetailsSelf.cancelRequestSuccess'));
                router.push("/RequestAid" as unknown as Href);
              }
              //  else {
              //   Alert.alert(t('trackAidDetailsSelf.error'), t('trackAidDetailsSelf.cancelRequestMessage'));
              // }
            } catch (error) {
              Alert.alert(t('trackAidDetailsSelf.error'), t('trackAidDetailsSelf.networkError'));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Audio playback functions
  const playAudio = async () => {
    if (requestDetails && requestDetails.RecordingPath) {
      try {
        // Check if sound is already created
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        } else {
          // Create a new sound instance from the RecordingPath
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: requestDetails.RecordingPath }, // Use the RecordingPath from requestDetails
            { shouldPlay: true }
          );
          setSound(newSound);
          setIsPlaying(true);

          // Set up playback status update
          // newSound.setOnPlaybackStatusUpdate((status) => {
          //   if (status.didJustFinish) {
          //     setIsPlaying(false);
          //   }
          // });
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert("Error", "Failed to play audio");
      }
    } else {
      Alert.alert("Error", "No audio file available to play.");
    }
  };


  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    const formattedDate = istDate.toLocaleDateString('en-GB');
    const formattedTime = istDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
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
  // const onStartRecord = async () => {
  //   try {
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  //     );
  //     setIsRecording(true);
  //     setRecordedUri(null);
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // };

  // const onStopRecord = async () => {
  //   try {
  //     setIsRecording(false);
  //     await recording.stopAndUnloadAsync();
  //     const uri = recording.getURI();
  //     setRecordedUri(uri);
  //   } catch (err) {
  //     console.error('Failed to stop recording', err);
  //   }
  // };
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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      // if (result.type === 'success') {
      //   if (result.size && result.size > 50 * 1024 * 1024) {
      //     Alert.alert("File Too Large", "Please select a file smaller than 50MB.");
      //   } else {
      //     const newAttachment: Attachment = {
      //       id: Date.now().toString(),
      //       name: result.name,
      //       size: result.size,
      //       uri: result.uri,
      //     };
      //     setAttachments(prevAttachments => [...prevAttachments, newAttachment]);
      //   }
      // }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while picking the document. Please try again.");
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prevAttachments => prevAttachments.filter(attachment => attachment.id !== id));
  };

  const sendComment = async () => {
    if (recordingStatus === 'recording') {
      Alert.alert(t('login.alerts.attention'),t('trackAidDetailsSelf.stopRecording'));
      return;
    }
    if (!description.trim() && !recordedUri && attachments.length === 0) {
      Alert.alert(t('login.alerts.attention'),t('trackAidDetailsSelf.emptyComment'));
      return;
    }

    setIsLoading(true);
    try {
      // Handle file uploads if any
      let attachmentPath = '';
     
      let recordingPath = null;
      console.log(recordingStatus);
      if (recordingStatus ==='recorded') {
        recordingPath = await uploadRecording();
      }
        if (recordingStatus === 'idle') {
          recordingPath = null;
        }
      const commentData = {
        RequestID: RequestID as string,
        CommenterCode: userCode, // Ensure userCode is set
        Comment: description,
        AdminUserFlg: 0,
        AttachmentPath: attachmentPath,
        RecordingPath: recordingPath,
      };

      const response = await fetch(`${AppConfig.APIURL}/api/Grievance/AddComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear form
        setNewComment("");
        setRecordedUri(null);
        setAttachments([]);

        // Refresh the comments list
        setRefreshKey(prev => prev + 1);

        Alert.alert(t('login.alerts.success'), t('trackAidDetailsSelf.commentAdded'));
      } else {
        Alert.alert(t('login.alerts.error'), t('trackAidDetailsSelf.errorAddingComment'));
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      Alert.alert("Error", "An error occurred while sending your comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${AppConfig.APIURL}/api/Grievance/GetCommentsByRequestID/${RequestID}`
      );
      const result = await response.json();

      if (response.ok && result.ResponseData) {
        setComments(result.ResponseData[0]);


      } else {
        console.error('Failed to fetch comments:', result);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add useEffect to fetch comments
  useEffect(() => {
    if (RequestID) {
      fetchComments();
    }
  }, [RequestID, refreshKey]);

  // Helper function to format date
  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  if (!requestDetails) {
    return (
      <View style={[tailwind.flex1, tailwind.justifyCenter, tailwind.itemsCenter]}>
        <Text>{t('trackAidDetailsSomeone.loading')}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
      <PageHeader
  title={t('trackAidDetailsSomeone.title')}
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

        {/* Details Section */}
        <View style={[tailwind.mX6, tailwind.mY4]}>
          <View style={[
            tailwind.bgWhite,
            tailwind.roundedLg,
            tailwind.shadowLg,
            tailwind.p6,
            { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }
          ]}>
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800]}>{t('trackAidDetailsSomeone.requestId')} {RequestID}</Text>
            <Text style={[tailwind.textBase, tailwind.mT2, tailwind.textBlue700]}>
              {t('trackAidDetailsSomeone.aidFor')} {requestDetails.FullName || t('trackAidDetailsSomeone.notAvailable')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.mT2, tailwind.textBlue700]}>
              {t('trackAidDetailsSomeone.requestedOn')} {requestDetails.CreatedOn ? formatDateTime(requestDetails.CreatedOn) : t('trackAidDetailsSomeone.notAvailable')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.mT2, tailwind.textBlue700]}>
              {t('trackAidDetailsSomeone.requestStatus')}
              <Text style={[tailwind.fontBold]}>
                {requestDetails.ProcessStatus || t('trackAidDetailsSomeone.notAvailable')}
              </Text>
            </Text>
            <Text style={[tailwind.textBase, tailwind.mT2, tailwind.textBlue700]}>
              {t('trackAidDetailsSomeone.aidType')} {requestDetails.AidType || t('trackAidDetailsSomeone.notAvailable')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.mT2, tailwind.textBlue700]}>
              {t('trackAidDetailsSomeone.description')} {requestDetails.Description || t('trackAidDetailsSomeone.notAvailable')}
            </Text>
          </View>

          {/* Audio Recording */}
          {requestDetails.RecordingPath && (
            <View style={[tailwind.mT4]}>
              <TouchableOpacity onPress={playAudio} style={[tailwind.flexRow, tailwind.itemsCenter]}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#0369A1" />
                <Text style={[tailwind.textBase, tailwind.mL2, tailwind.textBlue700]}>
                  {isPlaying ? t('trackAidDetailsSomeone.pauseAudio') : t('trackAidDetailsSomeone.playAudio')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Comments Section */}
          <View style={[tailwind.mY4]}>
            <View style={[tailwind.bgWhite, tailwind.roundedLg, tailwind.shadowLg, tailwind.p6]}>
              <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue800, tailwind.mB4]}>
                {t('trackAidDetailsSomeone.discussions')}
              </Text>
              {isLoading ? (
                <View style={[tailwind.p4, tailwind.itemsCenter]}>
                  <Text>{t('trackAidDetailsSomeone.loadingComments')}</Text>
                </View>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <View
                    key={comment.CommentID}
                    style={[tailwind.mB4, tailwind.borderB, tailwind.borderGray200, tailwind.pB4]}
                  >
                    <Text style={[tailwind.fontBold, tailwind.textBlue700]}>
                      {comment.Name}
                      {comment.AdminUserFlg === 1 && (
                        <Text style={[tailwind.textSm, tailwind.textGray600]}> {t('trackAidDetailsSelf.tamilCommunityTeam')}</Text>
                      )}
                    </Text>
                    <Text style={[tailwind.textSm, tailwind.textGray600]}>
                      {formatDateTime(comment.CreatedOn)}
                    </Text>
                    <Text style={[tailwind.mT2, tailwind.textBlue800]}>
                      {comment.Comment}
                    </Text>
                    {comment.AttachmentPath && (
                      <TouchableOpacity
                        style={[tailwind.mT2, tailwind.flexRow, tailwind.itemsCenter]}
                      //onPress={() => handleOpenAttachment(comment.AttachmentPath)}
                      >
                        <Ionicons name="document-attach" size={20} color="#0369A1" />
                        <Text style={[tailwind.mL2, tailwind.textBlue600]}>View Attachment</Text>
                      </TouchableOpacity>
                    )}
                    {comment.RecordingPath && (
                      <TouchableOpacity
                        style={[tailwind.mT2, tailwind.flexRow, tailwind.itemsCenter]}
                        onPress={() => handlePlayRecording(comment.RecordingPath)}
                      >
                        <Ionicons name="play" size={20} color="#0369A1" />
                        <Text style={[tailwind.mL2, tailwind.textBlue600]}>Play Recording</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={[tailwind.textCenter, tailwind.textGray600]}>
                  {t('trackAidDetailsSelf.noComments')}
                </Text>
              )}
            </View>

            {/* User Reply Section */}
            <View style={[tailwind.mT4, tailwind.bgWhite, tailwind.roundedLg, tailwind.shadowLg, tailwind.p4]}>
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800, tailwind.mB2]}>{t('trackAidDetailsSelf.reply.title')}</Text>
              <View style={styles.descriptionContainer}>
                {/* Description Input Component */}
                <DescriptionInput
            description={description}
            onDescriptionChange={setDescription}
            recordingStatus={recordingStatus}
            toggleRecording={toggleRecording}
            playRecording={handlers.playRecording}
            deleteRecording={handlers.deleteRecording}
            pickDocument={handlers.pickDocument}
          />
              </View>
              {attachments.length > 0 && (
                <View style={[tailwind.mT2]}>
                  <Text style={[tailwind.fontBold, tailwind.textBlue700]}>Attachments:</Text>
                  {attachments.map((attachment) => (
                    <View key={attachment.id} style={[tailwind.flexRow, tailwind.justifyBetween, tailwind.itemsCenter]}>
                      <Text style={[tailwind.textBlue600]}>{attachment.name}</Text>
                      <TouchableOpacity onPress={() => removeAttachment(attachment.id)}>
                        <Ionicons name="close-circle" size={20} color="#0369A1" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={[styles.sendButton, tailwind.mT4]}
                onPress={sendComment}
                //disabled={recordingStatus === 'recording'}
              >
                <Text style={[tailwind.textBase, tailwind.fontBold, tailwind.textWhite]}>{t('trackAidDetailsSelf.reply.sendButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cancel Request Button */}
          {requestDetails.ProcessStatus !== 'Cancelled' && (
            <TouchableOpacity
              style={[tailwind.bgRed500, tailwind.p4, tailwind.roundedLg, tailwind.itemsCenter, tailwind.mT6, tailwind.mB10]}
              onPress={handleCancelRequest}
            >
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
                {t('trackAidDetailsSomeone.cancelRequest')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Sent':
      return tailwind.textBlue500;
    case 'Under Review':
      return tailwind.textYellow500;
    case 'Accepted':
      return tailwind.textGreen500;
    case 'Rejected':
      return tailwind.textRed500;
    default:
      return tailwind.textGray500;
  }
};

const styles = StyleSheet.create({
  // descriptionContainer: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //   borderRadius: 12,
  //   marginBottom: 16,
  //   shadowColor: '#0369A1',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  //   borderWidth: 1,
  //   borderColor: 'rgba(255, 255, 255, 0.2)',
  //   position: 'relative',
  // },
  // descriptionInput: {
  //   height: 120,
  //   paddingRight: 40, // Make space for icons
  // },
  iconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
  },
  // iconButton: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //   borderRadius: 30,
  //   padding: 10,
  //   shadowColor: '#0369A1',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  sendButton: {
    backgroundColor: '#0369A1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  }, instructionContainer: {
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

export default AidDetails;
