import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, showBackButton = true, onBackButtonPress }) => {
  const router = useRouter();
  
  return (
    <View style={[tailwind.flexRow, tailwind.itemsCenter, tailwind.p4, tailwind.mT8]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBackButtonPress || (() => router.back())}  style={[tailwind.mR4]}>
          <View style={[tailwind.bgWhite, tailwind.roundedFull, tailwind.p2, tailwind.shadowMd]}>
            <Ionicons name="arrow-back" size={24} color="#0369A1" />
          </View>
        </TouchableOpacity>
      )}
      <Text style={[tailwind.textXl, tailwind.fontBold, tailwind.textBlue900]}>
        {title}
      </Text>
    </View>
  );
};

export default PageHeader;
