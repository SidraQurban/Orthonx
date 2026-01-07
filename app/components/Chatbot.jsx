import { TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { responsiveHeight } from "react-native-responsive-dimensions";

const Chatbot = () => {
  return (
    <TouchableOpacity
      style={{
        width: responsiveHeight(8),
        height: responsiveHeight(8),
        borderRadius: responsiveHeight(4),
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: responsiveHeight(2),
        right: responsiveHeight(2),
        elevation: 5,
        zIndex: 999,
      }}
    >
      <LinearGradient
        colors={["#468FAF", "#00B4D8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: responsiveHeight(7),
          height: responsiveHeight(7),
          borderRadius: responsiveHeight(3.5),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="chatbubble-ellipses" size={30} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Chatbot;
