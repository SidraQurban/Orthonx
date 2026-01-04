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
import LoginModal from "../components/LoginModal";
import { Image } from "react-native";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
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
        <LoginModal />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;
