import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { tailwind } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";

const { height } = Dimensions.get('window');

const ConfirmationScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <View style={[tailwind.flex1, tailwind.justifyBetween]}>
        <ScrollView
          style={[tailwind.flex1]}
          contentContainerStyle={[tailwind.pT16, tailwind.pX4]}
        >
          {/* Header Section */}
          <View style={[tailwind.pX6, tailwind.mT12]}>
            <Text style={[
              tailwind.text3xl,
              tailwind.fontBold,
              tailwind.textBlue900,
              tailwind.textCenter,
              tailwind.mB6
            ]}>
              {t('registration.successTitle')}
            </Text>
          </View>

          {/* Confirmation Message */}
          <View style={[tailwind.pX4, tailwind.mT8, tailwind.itemsCenter]}>
            <View style={[styles.iconBackground, tailwind.mB6]}>
              <Ionicons name="checkmark-circle" size={64} color="#0369A1" />
            </View>
            <Text style={[
              tailwind.textXl,
              tailwind.fontBold,
              tailwind.textBlue800,
              tailwind.textCenter,
              tailwind.mB4
            ]}>
              {t('registration.successMessage')}
            </Text>
          </View>
        </ScrollView>

        {/* Next Steps Section */}
        <View style={[tailwind.p4, styles.nextStepsSection]}>
          <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4]}>
            {t('registration.nextStepsTitle')}
          </Text>

          <View style={[tailwind.mB4, styles.stepCard]}>
            <Text style={[tailwind.textLg, tailwind.fontSemibold, tailwind.textBlue800]}>
              {t('registration.nextStepsExplore')}
            </Text>
            <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.mT1]}>
              {t('registration.nextStepsExploreDescription')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, tailwind.mT6]}
            onPress={() => router.push('/Aid')}
          >
            <Text style={[tailwind.textWhite, tailwind.textLg, tailwind.fontBold]}>
              {t('registration.getStarted')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 50,
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
  nextStepsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  stepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
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

export default ConfirmationScreen;
