import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { Doctors } from "../../Constant";

const DoctorCards = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: responsiveWidth(4),
        paddingTop: responsiveHeight(2),
      }}
    >
      {Doctors.map((doctor, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#F5F8FF",
            padding: responsiveWidth(4),
            borderRadius: responsiveWidth(3),
            marginBottom: responsiveHeight(2),
          }}
        >
          {/* Doctor Info */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={doctor.image}
              style={{
                width: responsiveWidth(15),
                height: responsiveWidth(15),
                borderRadius: responsiveWidth(7.5),
                marginRight: responsiveWidth(3),
              }}
            />
            <View style={{ flexShrink: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: responsiveFontSize(1.8),
                }}
              >
                {doctor.name}
              </Text>
              <Text
                style={{
                  color: "#468FAF",
                  fontSize: responsiveFontSize(1.5),
                  marginTop: responsiveHeight(0.5),
                }}
              >
                {doctor.specialty}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  color: "#555",
                  marginTop: responsiveHeight(0.5),
                }}
              >
                {doctor.experience}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.3),
                  color: "#555",
                  marginTop: responsiveHeight(0.5),
                }}
              >
                {doctor.rating}
              </Text>
            </View>
          </View>

          {/* Consult Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#00B4D8",
              paddingVertical: responsiveHeight(0.8),
              paddingHorizontal: responsiveWidth(4),
              borderRadius: responsiveWidth(5),
              marginLeft: responsiveWidth(3),
            }}
          >
            <Text style={{ color: "#fff", fontSize: responsiveFontSize(1.5) }}>
              Consult Now
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* !!! Spacer at the end */}
      <View style={{ height: responsiveHeight(10) }} />
    </ScrollView>
  );
};

export default DoctorCards;
