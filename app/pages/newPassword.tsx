import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { useRouter, useGlobalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import useTranslation from "@/app/i8n/useTranslationHook";
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from "@/components/PageHeader"; 
import { AppConfig } from "@/app/config/AppConfig";

const NewPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { email } = useGlobalSearchParams(); 
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert(t('login.alerts.attention'), t('newPassword.passwordsDoNotMatch'));
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert(t('login.alerts.attention'), t('newPassword.passwordCannotBeEmpty'));
      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert(t('login.alerts.attention'), t('newPassword.verificationCodeCannotBeEmpty'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${AppConfig.APIURL}/api/Account/ResetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          VerificationCode: verificationCode, 
          NewPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(t('login.alerts.success'), t('newPassword.successResetPassword'));
        router.push("/pages/login"); 
      } else {
        Alert.alert(t('login.alerts.attention'), result.message || t('newPassword.errorResetPassword'));
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  { t("newPassword.setNewPassword") }
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
        <PageHeader title="" />
        <ScrollView
          style={[tailwind.flex1]}
          contentContainerStyle={[tailwind.pY20, tailwind.pX2]}
        >
          <View style={[tailwind.justifyCenter, tailwind.itemsCenter, tailwind.mT10]}>
            <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4]}>
              {t("newPassword.setNewPassword")}
            </Text>
            <Text style={[tailwind.textBase, tailwind.textBlue600, tailwind.mB4, tailwind.textCenter]}>
              {t('newPassword.enterNewPassword')}
            </Text>

            <View style={[{ width: "70%" }, tailwind.mB4]}>
              <TextInput
                style={[
                  tailwind.wFull,
                  tailwind.border,
                  tailwind.borderBlue200,
                  tailwind.bgWhite,
                  tailwind.roundedLg,
                  tailwind.pY3,
                  tailwind.pX4,
                  tailwind.textBase,
                  styles.inputShadow
                ]}
                placeholder={t('newPassword.verificationCode')}
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={[{ width: "70%" }, tailwind.mB4]}>
              <TextInput
                style={[
                  tailwind.wFull,
                  tailwind.border,
                  tailwind.borderBlue200,
                  tailwind.bgWhite,
                  tailwind.roundedLg,
                  tailwind.pY3,
                  tailwind.pX4,
                  tailwind.textBase,
                  styles.inputShadow
                ]}
                placeholder={t('newPassword.newPassword')}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#64748B"
              />
            </View>

            <View style={[{ width: "70%" }, tailwind.mB4]}>
              <TextInput
                style={[
                  tailwind.wFull,
                  tailwind.border,
                  tailwind.borderBlue200,
                  tailwind.bgWhite,
                  tailwind.roundedLg,
                  tailwind.pY3,
                  tailwind.pX4,
                  tailwind.textBase,
                  styles.inputShadow
                ]}
                placeholder={t('newPassword.confirmPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#64748B"
              />
            </View>

            <TouchableOpacity
              style={[
                tailwind.bgBlue600,
                tailwind.pY4,
                tailwind.roundedLg,
                tailwind.shadowMd,
                { width: "90%" },
                tailwind.mB4,
                styles.buttonShadow
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontBold, tailwind.textLg]}>
                {isLoading ? t('newPassword.resetting') : t('newPassword.resetPassword')}
              </Text>
            </TouchableOpacity>
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
  inputShadow: {
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

export default NewPasswordScreen;
