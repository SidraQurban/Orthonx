import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

const SelectRole = () => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ alignItems: "center", marginTop: responsiveHeight(14) }}>
        <Text
          style={{
            color: "#468FAF",
            fontSize: responsiveFontSize(3),
            fontWeight: "bold",
          }}
        >
          Continue as...
        </Text>
        <Text
          style={{
            marginTop: responsiveHeight(1),
            fontSize: responsiveFontSize(2),
            fontWeight: "500",
          }}
        >
          Choose your role to get the
        </Text>
        <Text
          style={{
            fontSize: responsiveFontSize(2),
            fontWeight: "500",
          }}
        >
          best experience.
        </Text>
      </View>
      {/* cards */}
      <View
        style={{
          alignItems: "center",
          marginTop: responsiveHeight(5),
          justifyContent: "space-between",
        }}
      >
        {/* Card 1 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login", { role: "Doctor" })}
          style={{
            borderColor: "#0070C0",
            borderWidth: 2,
            height: responsiveHeight(15),
            width: responsiveHeight(35),
            borderRadius: responsiveHeight(2.5),
            flexDirection: "row",
            backgroundColor: "#deecf8ff",
            elevation: 12,
          }}
        >
          <Image
            source={require("../../assets/stethoscope.png")}
            style={{
              height: responsiveHeight(10.5),
              width: responsiveHeight(9),
              resizeMode: "cover",
              marginTop: responsiveHeight(1.5),
            }}
          />
          <Text
            style={{
              color: "#0070C0",
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
              marginTop: responsiveHeight(2.4),
            }}
          >
            Doctor
          </Text>
          <View
            style={{
              marginTop: responsiveHeight(5.5),
              marginLeft: responsiveHeight(-7.5),
            }}
          >
            <Text style={{ fontSize: responsiveFontSize(1.8) }}>
              Access patient scans and
            </Text>
            <Text style={{ fontSize: responsiveFontSize(1.8) }}>
              detailed reports.
            </Text>
          </View>
        </TouchableOpacity>
        {/* Card 2 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login", { role: "User" })}
          style={{
            borderColor: "#2C8C2C",
            borderWidth: 2,
            height: responsiveHeight(15),
            width: responsiveHeight(35),
            borderRadius: responsiveHeight(2.5),
            flexDirection: "row",
            backgroundColor: "#d6f0d2ff",
            elevation: 12,
            marginTop: responsiveHeight(5),
          }}
        >
          <Image
            source={require("../../assets/patient.png")}
            style={{
              height: responsiveHeight(10.5),
              width: responsiveHeight(9),
              resizeMode: "cover",
              marginTop: responsiveHeight(1.5),
            }}
          />
          <Text
            style={{
              color: "#2C8C2C",
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
              marginTop: responsiveHeight(2.4),
            }}
          >
            User
          </Text>
          <View
            style={{
              marginTop: responsiveHeight(5.5),
              marginLeft: responsiveHeight(-5.5),
            }}
          >
            <Text style={{ fontSize: responsiveFontSize(1.8) }}>
              Check your X-rays and get
            </Text>
            <Text style={{ fontSize: responsiveFontSize(1.8) }}>
              quick results.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* info icon */}
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/info.png")}
          style={{
            height: responsiveHeight(5),
            width: responsiveWidth(20),
            resizeMode: "cover",
            marginTop: responsiveHeight(15),
            marginLeft: responsiveWidth(10),
          }}
        />
        <Text style={{ fontSize: responsiveFontSize(1.8) }}>Why we ask?</Text>
      </View>
    </View>
  );
};

export default SelectRole;
