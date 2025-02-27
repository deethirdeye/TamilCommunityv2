import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import useTranslation from "@/app/i8n/useTranslationHook";

const { height } = Dimensions.get('window');

const ChatSupport = () => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView
        style={[tailwind.flex1]}
        contentContainerStyle={[tailwind.pB16]}
      >
        {/* Header Section */}
        <View style={[tailwind.pX6, tailwind.mT8]}>
          <Text style={[
            tailwind.text3xl,
            tailwind.fontBold,
            tailwind.textBlue900,
            tailwind.textCenter,
            tailwind.mB6
          ]}>
            {t('chatSupport.title')}
          </Text>
        </View>
        {/* Chat Support Icon */}
        <View style={[tailwind.pX4, tailwind.mT4, tailwind.itemsCenter]}>
          <View style={styles.iconBackground}>
            <Ionicons name="chatbubbles-outline" size={64} color="#0369A1" />
          </View>
          <Text style={[
            tailwind.textLg,
            tailwind.fontMedium,
            tailwind.textBlue800,
            tailwind.mT4,
            tailwind.textCenter
          ]}>
            {t('chatSupport.subtitle')}
          </Text>
        </View>
        {/* Go To Chat Button */}
        <View style={[tailwind.p4, tailwind.mT8]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[tailwind.textWhite, tailwind.textLg, tailwind.fontBold]}>
              {t('chatSupport.startChat')}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Additional Information Section */}
        <View style={[tailwind.p4, tailwind.mB2, styles.infoSection]}>
          <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4]}>
            {t('chatSupport.supportInfo.title')}
          </Text>
          <View style={[tailwind.p4, tailwind.mB4, styles.infoCard]}>
            <Text style={[tailwind.textLg, tailwind.fontSemibold, tailwind.textBlue800]}>
              {t('chatSupport.supportInfo.availability.title')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.mT1]}>
              {t('chatSupport.supportInfo.availability.description')}
            </Text>
          </View>
          <View style={[tailwind.p4, tailwind.mB4, styles.infoCard]}>
            <Text style={[tailwind.textLg, tailwind.fontSemibold, tailwind.textBlue800]}>
              {t('chatSupport.supportInfo.responseTime.title')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.mT1]}>
              {t('chatSupport.supportInfo.responseTime.description')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[
              tailwind.textXl,
              tailwind.fontBold,
              tailwind.mB5,
              tailwind.textCenter
            ]}>
              {t('chatSupport.modal.redirecting')}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[
                tailwind.textLg,
                tailwind.fontBold,
                tailwind.textWhite
              ]}>
                {t('chatSupport.modal.done')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 30,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: height * 0.4,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalContainer: {
    ...tailwind.flex1,
    ...tailwind.justifyEnd,
    ...tailwind.pX5,
    ...tailwind.pB5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
    // background with some transparency
  },
  modalContent: {
    ...tailwind.bgWhite,
    ...tailwind.p5,
    ...tailwind.roundedLg,
    ...tailwind.itemsCenter,
  },
});

export default ChatSupport;
