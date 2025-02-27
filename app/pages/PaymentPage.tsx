import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { tailwind } from "react-native-tailwindcss";
import { useGlobalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import PageHeader from "@/components/PageHeader";
import useTranslation from "@/app/i8n/useTranslationHook";

// Define the Receipt interface
interface Receipt {
  name: string;
  // Add other properties if needed
}

const PaymentPage = () => {
  const { t } = useTranslation();
  const { cost } = useGlobalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleSubmit = async () => {
    if (paymentMethod === "upload") {
      const result = await DocumentPicker.getDocumentAsync({});
      // if (result.type === "success") {
      //   setReceipt(result);
      // }
    } else {
      console.log("Processing payment via", paymentMethod);
    }
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
        <PageHeader title={t('payment.title')} />

        <View style={[tailwind.pX4, tailwind.mT4]}>
          <Text style={[tailwind.text2xl, tailwind.fontBold, tailwind.textBlue900, tailwind.textCenter, tailwind.mB4]}>
            {t('payment.subscriptionPlans')}
          </Text>
          <Text style={[tailwind.text4xl, tailwind.fontBold, tailwind.textCenter, tailwind.textBlue800, tailwind.mY6]}>
           RM {cost}.00 
          </Text>

          <View style={[tailwind.mT4, styles.paymentSection]}>
            <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue900, tailwind.mB4]}>
              {t('payment.selectPaymentMethod')}
            </Text>

            {[
              {
                value: 'paypal',
                label: t('payment.paymentMethods.paypal'),
                icon: 'logo-paypal',
                description: t('payment.paymentMethods.paypalDescription')
              },
              {
                value: 'ipay88',
                label: t('payment.paymentMethods.ipay88'),
                icon: 'card',
                description: t('payment.paymentMethods.ipay88Description')
              },
              {
                value: 'upload',
                label: t('payment.paymentMethods.bankTransfer'),
                icon: 'cloud-upload-outline',
                description: t('payment.paymentMethods.bankTransferDescription')
              },
            ].map((method) => (
              <TouchableOpacity
                key={method.value}
                style={[styles.paymentOption, tailwind.mB4]}
                onPress={() => setPaymentMethod(method.value)}
              >
                <RadioButton
                  value={method.value}
                  status={paymentMethod === method.value ? 'checked' : 'unchecked'}
                  onPress={() => setPaymentMethod(method.value)}
                  color="#0369A1"
                />
                <View style={[tailwind.flexCol, tailwind.mL2, tailwind.flex1]}>
                  <View style={[tailwind.flexRow, tailwind.itemsCenter]}>
                    {/* <Ionicons name={method.icon} size={24} color="#0369A1" style={tailwind.mR2} /> */}
                    <Text style={[tailwind.textLg, tailwind.fontMedium, tailwind.textBlue800]}>
                      {method.label}
                    </Text>
                  </View>
                  <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.mT1]}>
                    {method.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {receipt && (
              <View style={[tailwind.mT4, tailwind.p4, styles.receiptInfo]}>
                <Text style={[tailwind.textLg, tailwind.fontMedium, tailwind.textBlue800]}>
                  {t('payment.receiptUploaded')}: {receipt.name}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, tailwind.mT6]}
              onPress={handleSubmit}
            >
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textWhite]}>
                {paymentMethod === "upload" ? t('payment.uploadReceipt') : t('payment.proceedToPayment')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  paymentSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 20,

    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentOption: {
    ...tailwind.flexRow,
    ...tailwind.itemsCenter,
    ...tailwind.p4,
    ...tailwind.roundedLg,

    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  receiptInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#0369A1',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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

export default PaymentPage;
