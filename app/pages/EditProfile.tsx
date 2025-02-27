import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { tailwind } from "react-native-tailwindcss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import PageHeader from "@/components/PageHeader";
import { TamilCommunityApi } from "@/app/context/GlobalContext";
import { AppConfig } from "@/app/config/AppConfig";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get('window');

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.expandableSection}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#0369A1" 
        />
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const ProfileForm = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [UserCode, setUserCode] = useState(''); 

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      const storedUserCode = await AsyncStorage.getItem('UserCode');
      const response = await fetch(`${AppConfig.APIURL}${TamilCommunityApi.GET_BASIC_DETAILS_BY_USER_ID}/${userId}`);
      const data = await response.json();
      setUserData(data.ResponseData[0]);
      setUserCode(storedUserCode || 'TC0000000');
      setLoading(false);
      console.log("USERCODE:",storedUserCode);
      console.log("USERCODE:",setUserCode);
      console.log("USERID:",userId);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  

  
//   const handleImagePick = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setProfileImageUri(result.assets[0].uri);
//     }
//   };

  const handleUpdate = async () => {
    Alert.alert(
      "Attention",
      "Please contact the Admin from Chat support to update your details",
      [
        {
          text: "OK",
        //   onPress: () => router.back()
        }
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return (
    <View style={[tailwind.flex1, tailwind.justifyCenter, tailwind.itemsCenter]}>
      <Text>Loading...</Text>
    </View>
  );

  const capitalizeWords = (str:string) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <LinearGradient
      colors={['#E1F2FF', '#BFE6FF', '#99D6FF']}
      style={[tailwind.flex1]}
    >
      <ScrollView style={[tailwind.flex1]}>
        <PageHeader title= "Profile" />

        <View style={styles.profileHeader}>
          <TouchableOpacity>
            {/* <Image
              source={{ uri: profileImageUri || 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            /> */}
          </TouchableOpacity>
          <Text style={styles.profileName}>{capitalizeWords(userData?.basicDetails?.FullName || 'John Doe')}</Text>
          <Text style={tailwind.fontBold}>{userData?.basicDetails?.Email || 'john.doe@example.com'}</Text>
          <Text style={tailwind.fontBold}>User Code : {UserCode || 'TC0000000'}</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Personal Details */}
          <ExpandableSection title={t('profile.PersonalDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={userData?.basicDetails?.FullName || ''}
              onChangeText={(text) => setUserData({ ...userData, basicDetails: { ...userData.basicDetails, FullName: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={userData?.basicDetails?.Email || ''}
              onChangeText={(text) => setUserData({ ...userData, basicDetails: { ...userData.basicDetails, Email: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={userData?.basicDetails?.MobileNumber || ''}
              onChangeText={(text) => setUserData({ ...userData, basicDetails: { ...userData.basicDetails, MobileNumber: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              value={userData?.basicDetails?.DOB || ''}
              onChangeText={(text) => setUserData((prevState: { basicDetails: any; }) => ({
                ...prevState,
                basicDetails: {
                  ...prevState.basicDetails,
                  DOB: text,
                },
              }))}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Location"
              value={userData?.basicDetails?.CurrentLocation || ''}
              onChangeText={(text) => setUserData({ ...userData, basicDetails: { ...userData.basicDetails, CurrentLocation: text } })}
              editable={false}
            />
          </ExpandableSection>

          {/* Native Details */}
          <ExpandableSection title={t('profile.NativeDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Native Address"
              value={userData?.nativeDetails?.NativeAddress || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativeAddress: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={userData?.nativeDetails?.NativeCity || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativeCity: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={userData?.nativeDetails?.NativeState || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativeState: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Pin Code"
              keyboardType="numeric"
              value={userData?.nativeDetails?.NativePinCode || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativePinCode: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Person Name"
              value={userData?.nativeDetails?.NativeContactPersonName || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativeContactPersonName: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Person Phone"
              keyboardType="phone-pad"
              value={userData?.nativeDetails?.NativeContactPersonPhone || ''}
              onChangeText={(text) => setUserData({ ...userData, nativeDetails: { ...userData.nativeDetails, NativeContactPersonPhone: text } })}
              editable={false}
            />
          </ExpandableSection>

          {/* Malaysia Residence Details */}
          <ExpandableSection title={t('profile.MalaysiaResidenceDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Residence Address"
              value={userData?.malaysiaResidenceDetails?.MalaysiaAddress || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaAddress: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={userData?.malaysiaResidenceDetails?.MalaysiaResidenceCity || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaResidenceCity: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={userData?.malaysiaResidenceDetails?.MalaysiaResidenceState || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaResidenceState: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Pin Code"
              keyboardType="numeric"
              value={userData?.malaysiaResidenceDetails?.MalaysiaResidencePinCode || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaResidencePinCode: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Person Name"
              value={userData?.malaysiaResidenceDetails?.MalaysiaContactPersonName || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaContactPersonName: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Person Phone"
              keyboardType="phone-pad"
              value={userData?.malaysiaResidenceDetails?.MalaysiaContactPersonPhone || ''}
              onChangeText={(text) => setUserData({ ...userData, malaysiaResidenceDetails: { ...userData.malaysiaResidenceDetails, MalaysiaContactPersonPhone: text } })}
              editable={false}
            />
          </ExpandableSection>

          {/* Emergency Contact Details */}
          <ExpandableSection title={t('profile.EmergencyContactDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact Person"
              value={userData?.emergencyDetails?.MalaysiaEmergencyContactPerson || ''}
              onChangeText={(text) => setUserData({ ...userData, emergencyDetails: { ...userData.emergencyDetails, MalaysiaEmergencyContactPerson: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Phone"
              keyboardType="phone-pad"
              value={userData?.emergencyDetails?.MalaysiaEmergencyPhone || ''}
              onChangeText={(text) => setUserData({ ...userData, emergencyDetails: { ...userData.emergencyDetails, MalaysiaEmergencyPhone: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Other Contact Person"
              value={userData?.emergencyDetails?.OtherEmergencyContactPerson || ''}
              onChangeText={(text) => setUserData({ ...userData, emergencyDetails: { ...userData.emergencyDetails, OtherEmergencyContactPerson: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Other Phone"
              keyboardType="phone-pad"
              value={userData?.emergencyDetails?.OtherEmergencyPhone || ''}
              onChangeText={(text) => setUserData({ ...userData, emergencyDetails: { ...userData.emergencyDetails, OtherEmergencyPhone: text } })}
              editable={false}
            />
          </ExpandableSection>

          {/* Employer Details */}
          <ExpandableSection title={t('profile.EmployerDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Employer Full Name"
              value={userData?.employerDetails?.EmployerFullName || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, EmployerFullName: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={userData?.employerDetails?.CompanyName || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, CompanyName: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Employer Address"
              value={userData?.employerDetails?.EmployerAddress || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, EmployerAddress: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={userData?.employerDetails?.City || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, City: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={userData?.employerDetails?.State || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, State: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Pin Code"
              keyboardType="numeric"
              value={userData?.employerDetails?.PinCode || ''}
              onChangeText={(text) => setUserData({ ...userData, employerDetails: { ...userData.employerDetails, PinCode: text } })}
              editable={false}
            />
          </ExpandableSection>

          {/* Passport Details */}
          <ExpandableSection title={t('profile.PassportDetails')}>
            <TextInput
              style={styles.input}
              placeholder="Passport Number"
              value={userData?.passportDetails?.PassportNumber || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, PassportNumber: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              value={userData?.passportDetails?.Surname || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, Surname: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Given Names"
              value={userData?.passportDetails?.GivenNames || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, GivenNames: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Nationality"
              value={userData?.passportDetails?.Nationality || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, Nationality: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Issue"
              value={userData?.passportDetails?.DateOfIssue || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, DateOfIssue: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Expiry"
              value={userData?.passportDetails?.DateOfExpiry || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, DateOfExpiry: text } })}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Place of Issue"
              value={userData?.passportDetails?.PlaceOfIssue || ''}
              onChangeText={(text) => setUserData({ ...userData, passportDetails: { ...userData.passportDetails, PlaceOfIssue: text } })}
              editable={false}
            />
          </ExpandableSection>
        </View>

        {/* Update and Cancel Buttons */}
        <View style={[tailwind.p6, styles.buttonContainer]}>
        
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={[tailwind.textBlue600, tailwind.textLg, tailwind.fontBold]}>
              {t('profile.OK')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    ...tailwind.itemsCenter,
    ...tailwind.mY4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  profileName: {
    ...tailwind.text2xl,
    ...tailwind.fontBold,
    ...tailwind.textBlue900,
    ...tailwind.mT2,
  },
  formContainer: {
    ...tailwind.p4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: height * 0.6,
  },
  expandableSection: {
    ...tailwind.mB4,
  },
  sectionHeader: {
    ...tailwind.flexRow,
    ...tailwind.justifyBetween,
    ...tailwind.itemsCenter,
    ...tailwind.p4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
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
  sectionTitle: {
    ...tailwind.textLg,
    ...tailwind.fontBold,
    ...tailwind.textBlue800,
  },
  input: {
    ...tailwind.p4,
    ...tailwind.mY2,
    ...tailwind.roundedLg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#BFE6FF',
  },
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingBottom: 20,
  },
  button: {
    ...tailwind.p4,
    ...tailwind.roundedLg,
    ...tailwind.itemsCenter,
    ...tailwind.mB2,
  },
  updateButton: {
    backgroundColor: '#3490dc',
    shadowColor: '#0369A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3490dc',
  },
});

export default ProfileForm;
  