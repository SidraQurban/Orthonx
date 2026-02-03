import { View, Text, ImageBackground } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import HistoryList from "../components/HistoryList";

const History = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View
        style={{
          paddingHorizontal: responsiveHeight(2),
          paddingTop: responsiveHeight(2),
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
          Diagnosis History
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

        {/* Give HistoryList a responsive height */}
        <HistoryList containerHeight={responsiveHeight(70)} />
      </View>
    </ImageBackground>
  );
};

export default History;
