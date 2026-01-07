import { View, Text } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
// import {  } from "@expo/vector-icons";

const Cards = () => {
  return (
    <View
      style={{
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveHeight(2),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="camera" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}> Scan Now</Text>
        </View>
        <View
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="file-document-outline" color="#ADB5BD" size={30} />
          <Text style={{ marginTop: responsiveHeight(1) }}> My Reports</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: responsiveHeight(2),
        }}
      >
        <View
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="stethoscope" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}>Consult Doctor</Text>
        </View>
        <View
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="bar-chart" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}>AI Insight</Text>
        </View>
      </View>
    </View>
  );
};

export default Cards;
