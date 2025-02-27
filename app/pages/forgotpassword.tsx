import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  return (
    <View style={[t.flex1, t.bgBlue200]}>
      <View style={[t.flex1, t.justifyCenter, t.itemsCenter, t.mT12]}>
        <Text style={[t.text4xl, t.fontBold, t.textBlack]}>
          Welcome to
        </Text>
        <Text style={[t.text2xl, t.fontBold, t.textBlue800]}>
          Tamil Community Portal
        </Text>
        <Text style={[t.textLg, t.textGray700]}>
          A place for the Tamils outside India
        </Text>
      </View>

      <View style={[t.flex1, t.justifyCenter, t.pX8]}>
        <TextInput
          placeholder="Mobile Number"
          style={[t.bgWhite, t.pY3, t.pX4, t.roundedLg, t.border, t.borderGray300, t.textBase, t.mB4]}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[t.bgWhite, t.pY3, t.pX4, t.roundedLg, t.border, t.borderGray300, t.textBase, t.mB4]}
        />
        <TouchableOpacity style={[t.selfEnd, t.mB6]} onPress={() => router.push('./forgotpassword')}>
          <Text style={[t.textBase, t.textBlue800]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[t.bgBlue500, t.pY3, t.roundedLg, t.itemsCenter]} onPress={() => {/* Handle sign in */ }}>
          <Text style={[t.textBase, t.textWhite, t.fontBold]}>
            Sign In
          </Text>
        </TouchableOpacity>
        <View style={[t.mT4, t.itemsCenter]}>
          <Text style={[t.textBase, t.textGray700]}>
            Don't have an account?{' '}
            <Text style={[t.textBlue500, t.underline]} onPress={() => router.push('./Signup')}>
              Create an account
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
