import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { AppConfig } from "@/app/config/AppConfig";
import i18next from 'i18next';
import useTranslation from "@/app/i8n/useTranslationHook";

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("Notification", message);
  }
};

const EmailVerification: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${AppConfig.APIURL}/api/Account/resend-verification-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showToast(t('mailSent.toasts.resendSuccess'));
      } else {
        showToast(t('mailSent.toasts.resendFailed'));
      }
    } catch (error) {
      showToast(t('mailSent.toasts.resendFailed'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[tailwind.flex1]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
        style={[tailwind.flex1, tailwind.pX4]}
      >
        <ScrollView
          style={[tailwind.flex1]}
          contentContainerStyle={[tailwind.pY20, tailwind.pX2]}
        >
          <TouchableOpacity onPress={() => router.back()} style={[tailwind.mB4]}>
            <View style={[tailwind.bgWhite, tailwind.roundedFull, tailwind.p2, tailwind.shadowMd, { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="arrow-back" size={24} color="#0369A1" />
            </View>
          </TouchableOpacity>

          <View style={[tailwind.mT8, tailwind.mB8]}>
            <Text style={[tailwind.text4xl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB2]}>
              {t('mailSent.title')}
            </Text>
            <Text style={[tailwind.textXl, tailwind.textBlue700, tailwind.mB2]}>
              {t('mailSent.subtitle')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.textBlue600]}>
              {t('mailSent.emailSentTo')} {email}
            </Text>
          </View>

          <View style={[
            tailwind.bgWhite,
            tailwind.roundedLg,
            tailwind.p6,
            tailwind.shadowLg,
            tailwind.mB8,
            styles.glassEffect
          ]}>
            <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800, tailwind.mB4]}>
              {t('mailSent.nextSteps.title')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.textBlue600, tailwind.mB2]}>
              {t('mailSent.nextSteps.step1')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.textBlue600, tailwind.mB2]}>
              {t('mailSent.nextSteps.step2')}
            </Text>
            <Text style={[tailwind.textBase, tailwind.textBlue600, tailwind.mB4]}>
              {t('mailSent.nextSteps.step3')}
            </Text>

            <TouchableOpacity
              style={[
                tailwind.bgBlue600,
                tailwind.pY4,
                tailwind.roundedLg,
                tailwind.shadowMd,
                styles.buttonShadow
              ]}
              onPress={() => router.push('/pages/login')}
            >
              <Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontBold, tailwind.textLg]}>
                {t('mailSent.proceedToLogin')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[tailwind.itemsCenter, tailwind.mB8]}>
            <Text style={[tailwind.textBlue800]}>
              {t('mailSent.resendEmail.question')}{' '}
              <TouchableOpacity onPress={handleResendEmail} disabled={isResending}>
                <Text style={[tailwind.textBlue600, tailwind.fontBold]}>
                  {isResending ? t('mailSent.resendEmail.resending') : t('mailSent.resendEmail.resend')}
                </Text>

              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default EmailVerification;
