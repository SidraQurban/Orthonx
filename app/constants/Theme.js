import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

export const COLORS = {
  primary: "#468FAF",
  secondary: "#01BAEF",
  accent: "#89C2D9",
  background: "#F8F9FA",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#6C757D",
  lightGray: "#E9ECEF",
  success: "#2D6A4F",
  danger: "#E03131",
  warning: "#FFD166",
  text: "#212529",
  subtext: "#495057",
  border: "#DEE2E6",
};

export const SHADOWS = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const SIZES = {
  h1: responsiveFontSize(4),
  h2: responsiveFontSize(3),
  h3: responsiveFontSize(2.5),
  body: responsiveFontSize(1.8),
  small: responsiveFontSize(1.5),
  radius: 16,
  padding: responsiveWidth(5),
  margin: responsiveHeight(2),
};

export const GRADIENTS = {
  primary: ["#468FAF", "#01BAEF"],
  glass: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.4)"],
};

const theme = { COLORS, SHADOWS, SIZES, GRADIENTS };

export default theme;
