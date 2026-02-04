import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const ProfileDetails = () => {
  return (
    <View
      style={{
        marginHorizontal: responsiveHeight(1),
      }}
    >
      {/* Name */}
      <View style={{ marginTop: responsiveHeight(2) }}>
        <Text>Full Name</Text>
        <TextInput
          placeholder="Sidra Qurban"
          style={{
            marginTop: responsiveHeight(1),
            borderWidth: 1,
            borderColor: "#ced4da",
            borderRadius: responsiveHeight(2),
            paddingLeft: responsiveHeight(4),
            backgroundColor: "#e9ecef",
            height: responsiveHeight(5.5),
            width: responsiveWidth(80),
          }}
        />
        <MaterialIcons
          name="person"
          color="#6c757d"
          size={20}
          style={{
            marginTop: responsiveHeight(-3.8),
            marginLeft: responsiveWidth(2),
          }}
        />
      </View>
      {/* Email */}
      <View style={{ marginTop: responsiveHeight(4) }}>
        <Text>Email Address</Text>
        <TextInput
          placeholder="sidraqurban34280@gmail.com"
          style={{
            marginTop: responsiveHeight(1),
            borderWidth: 1,
            borderColor: "#ced4da",
            borderRadius: responsiveHeight(2),
            paddingLeft: responsiveHeight(4),
            backgroundColor: "#e9ecef",
            height: responsiveHeight(5.5),
            width: responsiveWidth(80),
          }}
        />
        <MaterialDesignIcons
          name="email-outline"
          color="#6c757d"
          size={19}
          style={{
            marginTop: responsiveHeight(-3.8),
            marginLeft: responsiveWidth(2),
          }}
        />
        <Text
          style={{
            marginTop: responsiveHeight(1.5),
            fontSize: responsiveFontSize(1.5),
            color: "gray",
          }}
        >
          Contact support to change email
        </Text>
      </View>
      {/* Contact */}
      <View style={{ marginTop: responsiveHeight(2) }}>
        <Text>Phone Number</Text>
        <TextInput
          placeholder="+92 300 1234567"
          style={{
            marginTop: responsiveHeight(1),
            borderWidth: 1,
            borderColor: "#ced4da",
            borderRadius: responsiveHeight(2),
            paddingLeft: responsiveHeight(4),
            backgroundColor: "#e9ecef",
            height: responsiveHeight(5.5),
            width: responsiveWidth(80),
          }}
        />
        <Feather
          name="phone"
          color="#6c757d"
          size={18}
          style={{
            marginTop: responsiveHeight(-4),
            marginLeft: responsiveWidth(2),
          }}
        />
        <View
          style={{
            marginTop: responsiveHeight(4),
            marginHorizontal: responsiveHeight(1),
            height: responsiveHeight(0.1),
            backgroundColor: "lightgray",
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: responsiveHeight(2),
        }}
      >
        <SimpleLineIcons name="lock" color="#00B4D8" size={18} />
        <Text
          style={{
            fontSize: responsiveFontSize(2),
            fontWeight: "bold",
            marginLeft: responsiveHeight(1),
          }}
        >
          Security
        </Text>
      </View>
      <View style={{ marginTop: responsiveHeight(1) }}>
        <Text>New Password</Text>
        <TextInput
          placeholder="Leave empty to keep current "
          style={{
            marginTop: responsiveHeight(1),
            borderWidth: 1,
            borderColor: "#ced4da",
            borderRadius: responsiveHeight(2),
            paddingLeft: responsiveHeight(4),
            backgroundColor: "#e9ecef",
            height: responsiveHeight(5.5),
            width: responsiveWidth(80),
          }}
        />
        <SimpleLineIcons
          name="lock"
          color="#6c757d"
          size={18}
          style={{
            marginTop: responsiveHeight(-4),
            marginLeft: responsiveWidth(2),
          }}
        />
      </View>
    </View>
  );
};

export default ProfileDetails;
