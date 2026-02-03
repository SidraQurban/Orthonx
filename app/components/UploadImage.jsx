import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const UploadImage = () => {
  return (
    <View>
      <View
        style={{
          height: responsiveHeight(60),
          width: responsiveHeight(41),
          borderRadius: responsiveHeight(2),
          backgroundColor: "#fff",
          alignItems: "center",
          marginTop: responsiveHeight(5),
        }}
      >
        <View>
          <TouchableOpacity
            style={{
              marginTop: responsiveHeight(10),
              height: responsiveHeight(8),
              width: responsiveHeight(8),
              borderRadius: responsiveHeight(4),
              backgroundColor: "#caf0f8",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="upload" size={30} color="#00B4D8" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: responsiveHeight(1.75),
            fontWeight: "bold",
            marginTop: responsiveHeight(3),
          }}
        >
          Drag and Drop X-Ray
        </Text>
        <Text
          style={{
            fontSize: responsiveHeight(1.5),
            color: "#6C757D",
            marginTop: responsiveHeight(1),
          }}
        >
          Supported formats: JPG, PNG
        </Text>
        <TouchableOpacity
          style={{
            marginTop: responsiveHeight(4),
            width: responsiveWidth(50),
            alignSelf: "center",
            elevation: 8,
            borderRadius: responsiveHeight(10),
          }}
        >
          <LinearGradient
            colors={["#468FAF", "#00B4D8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: responsiveHeight(1.5),
              borderRadius: responsiveHeight(10),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: responsiveFontSize(2.5),
                fontWeight: "bold",
              }}
            >
              Browse Files
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadImage;
