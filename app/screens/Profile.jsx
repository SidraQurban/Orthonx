import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { Image } from "react-native";
import ProfileDetails from "../components/ProfileDetails";

const Profile = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ paddingHorizontal: responsiveHeight(2) }}>
        <View style={{ marginTop: responsiveHeight(1) }}>
          <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
            My Profile
          </Text>
          <Text style={{ fontSize: responsiveFontSize(1.5), color: "#6C757D" }}>
            Manage your account settings and preferences
          </Text>
        </View>
      </View>
      <View
        style={{
          height: responsiveHeight(70),
          width: responsiveHeight(40),
          backgroundColor: "white",
          margin: 20,
          borderRadius: responsiveHeight(2),
        }}
      >
        <View
          style={{
            marginHorizontal: responsiveHeight(1),
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ marginTop: responsiveHeight(1) }}>
            <Image
              source={require("../../assets/profile-pic.png")}
              style={{
                width: 100,
                height: 100,
                height: responsiveHeight(10),
                width: responsiveHeight(10),
                borderRadius: responsiveHeight(5),
                backgroundColor: "gray",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: responsiveFontSize(1.7),
              marginTop: responsiveHeight(4),
              marginLeft: responsiveHeight(2),
              fontWeight: "bold",
            }}
          >
            sohailahmad34280
          </Text>
        </View>
        <View
          style={{
            marginTop: responsiveHeight(1),
            marginHorizontal: responsiveHeight(1),
            height: responsiveHeight(0.1),
            backgroundColor: "lightgray",
          }}
        />
        <ProfileDetails />
      </View>
    </ImageBackground>
  );
};

export default Profile;
