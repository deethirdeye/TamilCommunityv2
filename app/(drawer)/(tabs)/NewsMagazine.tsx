import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { tailwind } from "react-native-tailwindcss";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";


const { height } = Dimensions.get('window');

// Define a type for valid Ionicons names
type IoniconName =
  | "calendar-outline"
  | "other-icon-name"; // Add other valid icon names as needed

const NewsMagazine = () => {
  const { t } = useTranslation();

  const handleSelect = (cost: number) => {
    router.push({
      pathname: "/pages/PaymentPage",
      params: { cost },
    });
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1, tailwind.pX6]}>
        {/* Header Section */}
        <View style={[tailwind.mT12, tailwind.mB8]}>
          <Text style={[
            tailwind.text3xl,
            tailwind.fontBold,
            tailwind.textBlue900,
            tailwind.textCenter,
          ]}>
            {t('newsMagazine.title')}
          </Text>
          <Text style={[
            tailwind.textLg,
            tailwind.textBlue700,
            tailwind.textCenter,
            tailwind.mT4
          ]}>
            {t('newsMagazine.subtitle')}
          </Text>
        </View>
        {/* Subscription Options */}
        <View style={[tailwind.mT4]}>
          {[
            { title: 'newsMagazine.monthly', cost: 10, icon: 'calendar-outline', description: 'newsMagazine.monthlyDesc' },
            { title: 'newsMagazine.quarterly', cost: 27, icon: 'calendar-outline', description: 'newsMagazine.quarterlyDesc' },
            { title: 'newsMagazine.halfYearly', cost:51, icon: 'calendar-outline', description: 'newsMagazine.halfYearlyDesc' },
            { title: 'newsMagazine.annually', cost: 96, icon: 'calendar-outline', description: 'newsMagazine.annuallyDesc' },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.subscriptionOption, tailwind.mB6]}
              onPress={() => handleSelect(option.cost)}
            >
              <View style={styles.iconBackground}>
                <Ionicons name={(option.icon as React.ComponentProps<typeof Ionicons>['name']) || 'alert-circle-outline'} size={24} color="#0369A1" />
              </View>
              <View style={[tailwind.mL4, tailwind.flex1]}>
                <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800]}>
                  {t(option.title)}
                </Text>
                <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.mT1]}>
                  {t(option.description)}
                </Text>
              </View>
              <Text style={[tailwind.textLg, tailwind.fontBold, tailwind.textBlue800]}>
                RM {option.cost}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Additional Information */}
        <Text style={[tailwind.textSm, tailwind.textBlue600, tailwind.textCenter, tailwind.mT8, tailwind.mB12]}>
          {t('newsMagazine.additionalInfo')}
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  subscriptionOption: {
    ...tailwind.flexRow,
    ...tailwind.itemsCenter,
    ...tailwind.p4,
    ...tailwind.roundedLg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default NewsMagazine;
