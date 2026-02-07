import { View, Text, ImageBackground } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import UploadImage from "../components/UploadImage";
import Chatbot from "../components/Chatbot";

const MyDiagnosis = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{ marginTop: responsiveHeight(2) }}>
          <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
            New Diagnosis
          </Text>
          <Text style={{ fontSize: responsiveFontSize(1.5), color: "#6C757D" }}>
            Upload an X-ray Image for instant AI analysis
          </Text>
        </View>
        <UploadImage />
      </View>
      <Chatbot />
    </ImageBackground>
  );
};

export default MyDiagnosis;
