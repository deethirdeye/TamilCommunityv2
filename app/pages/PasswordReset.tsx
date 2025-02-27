import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { LinearGradient } from 'expo-linear-gradient';
import useTranslation from "@/app/i8n/useTranslationHook";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "expo-router";
import { AppConfig } from "@/app/config/AppConfig";

const PasswordReset: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert(
        t("passwordReset.error"),
        t("passwordReset.verificationCodeMessage")
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${AppConfig.APIURL}/api/Account/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          t("passwordReset.success.title"),
          t("passwordReset.success.message")
        );
        router.push(`/pages/newPassword?email=${encodeURIComponent(email)}`);
      } else {
        Alert.alert(
          t("passwordReset.error"),
          result.message || t("passwordReset.errors.emailSend")
        );
      }
    } catch (error) {
      Alert.alert(
        t("passwordReset.error"),
        t("passwordReset.errors.generic")
      );
    } finally {
      setIsLoading(false);
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
        <PageHeader title={t("passwordReset.passwordReset")} />
        <ScrollView
          style={[tailwind.flex1]}
          contentContainerStyle={[tailwind.pY20, tailwind.pX2]}
        >
          <View style={[tailwind.justifyCenter, tailwind.itemsCenter, tailwind.mT10]}>
            <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4, tailwind.textCenter]}>
              {t("passwordReset.title")}
            </Text>
            <View style={[{ width: "70%" }, tailwind.mB4, tailwind.textCenter]}>
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
                  tailwind.textCenter,
                  styles.inputShadow
                ]}
                placeholder={t("passwordReset.emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#64748B"
                textAlign="center"
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
              onPress={handleSend}
              disabled={isLoading}
            >
              <Text style={[tailwind.textWhite, tailwind.textCenter, tailwind.fontBold, tailwind.textLg]}>
                {isLoading ? t("passwordReset.sendButton.sending") : t("passwordReset.sendButton.send")}
              </Text>
            </TouchableOpacity>

            <Text style={[tailwind.textBase, tailwind.textGray700, tailwind.textCenter, tailwind.pX4]}>
              {t("passwordReset.verificationMessage")}
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

export default PasswordReset;
