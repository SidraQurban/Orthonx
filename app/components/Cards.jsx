import { View, Text } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

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
          <Text> Scan Now</Text>
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
          <Text> My Reports</Text>
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
          <Text> Consult Doctor</Text>
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
          <Text> AI Insight</Text>
        </View>
      </View>
    </View>
  );
};

export default Cards;
