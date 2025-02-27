import {Pressable, StyleSheet, Text, View, Image, Platform} from 'react-native';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Border, Opacity, opacity, Stylings} from '../constants/GlobalStyle';

const SocialLogin = ({text, bgColor, img, textClr, onPress}) => {
  const windowWidth = useWindowDimensions().width;

  const containerWidth = windowWidth < 600 ? '80%' : '60%';

  return (
    <View
      style={[
        styles.socialLogCon,
        {backgroundColor: bgColor, width: containerWidth},
      ]}>
      <Pressable style={({pressed}) => pressed && styles.pressed} onPress={onPress}>
        <View style={styles.imgTxtCon}>
          <Image source={img} style={styles.img} />
          <Text style={[styles.txtStyle, {color: textClr}]}>{text}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  socialLogCon: {
    marginHorizontal: 50,
    padding: 6,
    borderRadius: Stylings.Border.mediumBorder,
    marginVertical: 10,
  },
  pressed: {
    opacity: Stylings.Opacity.opacityValue,
  },
  imgTxtCon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  txtStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
  pressed: {
    opacity: Stylings.Opacity.opacityValue,
  },
});
