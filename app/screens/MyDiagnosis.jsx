import { View, Text, ImageBackground } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import UploadImage from "../components/UploadImage";

const MyDiagnosis = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{ marginTop: responsiveHeight(1) }}>
          <Text style={{ fontSize: responsiveHeight(2), fontWeight: "bold" }}>
            New Diagnosis
          </Text>
          <Text style={{ fontSize: responsiveHeight(1.5), color: "#6C757D" }}>
            Upload an X-ray Image for instant AI analysis
          </Text>
        </View>
        <UploadImage />
      </View>
    </ImageBackground>
  );
};

export default MyDiagnosis;
