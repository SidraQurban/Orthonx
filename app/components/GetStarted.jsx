import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const GetStarted = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/wldoc.png")}
          style={{
            resizeMode: "contain",
            width: responsiveWidth(75),
            height: responsiveHeight(75),
            marginTop: responsiveHeight(-14),
          }}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: responsiveHeight(-19) }}>
        <Text
          style={{
            color: "#468FAF",
            fontWeight: "bold",
            fontSize: responsiveFontSize(3.5),
          }}
        >
          Welcome to
        </Text>
        <Image
          source={require("../../assets/logoapp.png")}
          style={{
            height: responsiveHeight(5),
            width: responsiveHeight(30),
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={{ alignItems: "center", marginTop: responsiveHeight(1.5) }}>
        <Text style={{ fontSize: responsiveFontSize(2) }}>
          AI-powered X-ray fracture detection
        </Text>
        <Text style={{ fontSize: responsiveFontSize(2) }}>
          at your fingertips.
        </Text>
      </View>
      {/* btn */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Role")}
        activeOpacity={0.8}
        style={{
          marginTop: responsiveHeight(15),
          width: responsiveWidth(70),
          alignSelf: "center",
          // Shadow for Android
          elevation: 8,
          borderRadius: responsiveHeight(10),
        }}
      >
        <LinearGradient
          colors={["#468FAF", "#00B4D8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: responsiveHeight(2),
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
            Get Started
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: responsiveHeight(4) }}>
        <Text style={{ color: "#00B4D8", fontSize: responsiveFontSize(2) }}>
          Fast. Accurate, Reliable
        </Text>
      </View>
    </View>
  );
};

export default GetStarted;
