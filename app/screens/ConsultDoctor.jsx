import { View, Text, ImageBackground, TextInput } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { EvilIcons } from "@expo/vector-icons";
import Specialities from "../components/Specialities";
import DoctorCards from "../components/DoctorCards";

const ConsultDoctor = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(4),
          paddingTop: responsiveHeight(2),
        }}
      >
        {/* Title */}
        <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
          Doctor Consultation
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.5),
            color: "#6C757D",
            marginBottom: responsiveHeight(2),
          }}
        >
          Get expert advice from certified doctors
        </Text>

        {/* Search Bar */}
        <View
          style={{ position: "relative", marginBottom: responsiveHeight(3) }}
        >
          <EvilIcons
            name="search"
            size={24}
            color="#6c757d"
            style={{
              position: "absolute",
              left: responsiveWidth(4),
              top: "50%",
              transform: [{ translateY: -12 }],
              zIndex: 1,
            }}
          />
          <TextInput
            placeholder="Search Doctors"
            placeholderTextColor="#adb5bd"
            style={{
              borderWidth: 1,
              borderColor: "#ced4da",
              borderRadius: responsiveHeight(3),
              paddingLeft: responsiveWidth(12),
              backgroundColor: "#e9ecef",
              height: responsiveHeight(5.5),
            }}
          />
        </View>

        {/* Specialities */}
        <Specialities />

        {/* Doctor Cards ScrollView */}
        <View style={{ flex: 1 }}>
          <DoctorCards />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ConsultDoctor;
