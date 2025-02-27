import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export const Stylings = {
  FontSize: {
    fontSm: 14,
    fontBase: 16,
  },
  Border: {
    normalBorder: 15,
    mediumBorder: 33,
  },
  Opacity: {
    opacityValue: 0.25,
  },
  Padding: {
    PaddingValue: 20,
  },
  mainProperty: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    aignItems: 'center',

  },
  width,
  height,
};
