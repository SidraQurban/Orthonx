import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import ProfileDetails from "../components/ProfileDetails";

const Profile = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: responsiveHeight(2),
          paddingTop: responsiveHeight(2),
        }}
      >
        <Text style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}>
          My Profile
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(1.5),
            color: "#6C757D",
            marginTop: responsiveHeight(0.5),
          }}
        >
          Manage your account settings and preferences
        </Text>
      </View>

      {/* Profile Card */}
      <View
        style={{
          backgroundColor: "white",
          margin: responsiveHeight(2),
          borderRadius: responsiveHeight(2),
          padding: responsiveHeight(2),
          alignSelf: "center",
          flex: 1, // Important: allows inner ScrollView to expand
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/profile-pic.png")}
              style={{
                width: responsiveHeight(8),
                height: responsiveHeight(8),
                borderRadius: responsiveHeight(4),
                backgroundColor: "gray",
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: responsiveFontSize(1.7),
              marginLeft: responsiveWidth(4),
              fontWeight: "bold",
            }}
          >
            sidraqurban34280
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{
            marginTop: responsiveHeight(1.2),
            height: 1,
            backgroundColor: "lightgray",
          }}
        />

        {/* Scrollable ProfileDetails */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: responsiveHeight(2) }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileDetails />
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Profile;
