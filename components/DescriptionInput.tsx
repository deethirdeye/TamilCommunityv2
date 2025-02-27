import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from 'expo-av';
import useTranslation from "@/app/i8n/useTranslationHook";

interface DescriptionInputProps {
  description: string;
  onDescriptionChange: (text: string) => void;
  recordingStatus: 'idle' | 'recording' | 'recorded';
  toggleRecording: () => void;
  playRecording: () => void;
  deleteRecording: () => void;
  pickDocument: () => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  onDescriptionChange,
  recordingStatus,
  toggleRecording,
  playRecording,
  deleteRecording,
  pickDocument,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.descriptionContainer}>
      <TextInput
        style={[
          tailwind.p10,
          tailwind.textBase,
          tailwind.textBlue800,
          styles.descriptionInput
        ]}
        placeholder={t('descriptionInput.placeholder')}
        multiline={true}
        value={description}
        onChangeText={onDescriptionChange}
        placeholderTextColor="#94A3B8"
      />
      <View style={styles.mediaControlsContainer}>
        <View style={styles.recordingControls}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleRecording}
            accessibilityLabel={t('descriptionInput.accessibility.recordButton')}
          >
            <Ionicons
              name={recordingStatus === 'recording' ? "stop-circle" : "mic"}
              size={24}
              color="#0369A1"
            />
          </TouchableOpacity>
          {recordingStatus === 'recorded' && (
            <>
              <TouchableOpacity
                style={[styles.iconButton, tailwind.mL4]}
                onPress={playRecording}
                accessibilityLabel={t('descriptionInput.accessibility.playButton')}
              >
                <Ionicons name="play" size={24} color="#0369A1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, tailwind.mL4]}
                onPress={deleteRecording}
                accessibilityLabel={t('descriptionInput.accessibility.deleteButton')}
              >
                <Ionicons name="trash" size={24} color="#0369A1" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* <TouchableOpacity
          style={[styles.iconButton, tailwind.mL2]}
          onPress={pickDocument}
          accessibilityLabel={t('descriptionInput.accessibility.attachButton')}
        >
          <Ionicons name="attach" size={24} color="#0369A1" />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    descriptionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height:200,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 10,
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DescriptionInput; 