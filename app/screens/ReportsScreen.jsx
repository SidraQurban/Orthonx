import { View, Text, ImageBackground } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import ReportActivity from "../components/ReportActivity";
import Chatbot from "../components/Chatbot";

const ReportsScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          paddingHorizontal: responsiveHeight(2),
          paddingTop: responsiveHeight(2),
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
          Reports
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.5),
            color: "#6C757D",
            marginBottom: responsiveHeight(2),
          }}
        >
          View your past X-ray analysis records
        </Text>
      </View>
      <ReportActivity />
      <Chatbot />
    </ImageBackground>
  );
};

export default ReportsScreen;
