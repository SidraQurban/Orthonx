import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { Image } from "react-native";
import SignUpModal from "../components/SignUpModal";

const { width, height } = Dimensions.get("window");
const SignUpScreen = () => {
  return (
    <SafeAreaView>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={{
          resizeMode: "cover",
          width: width,
          height: height,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/logoapp.png")}
            style={{
              height: responsiveHeight(15),
              width: responsiveHeight(30),
              resizeMode: "cover",
            }}
          />
        </View>
        <SignUpModal />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUpScreen;
