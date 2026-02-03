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
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{ marginTop: responsiveHeight(1) }}>
          <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
            Diagnosis History
          </Text>
          <Text style={{ fontSize: responsiveFontSize(1.5), color: "#6C757D" }}>
            View your past X-ray analysis records
          </Text>
        </View>
        <HistoryList />
      </View>
    </ImageBackground>
  );
};

export default History;
