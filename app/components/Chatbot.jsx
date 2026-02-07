import React, { useRef, useEffect } from "react";
import { TouchableOpacity, Image, View, Animated } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const Chatbot = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current; // start semi-transparent

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, // fully visible
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3, // faded out
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const outerSize = responsiveHeight(8);
  const innerSize = responsiveHeight(7);

  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        bottom: responsiveHeight(2),
        right: responsiveHeight(2),
        width: outerSize,
        height: outerSize,
        justifyContent: "center",
        alignItems: "center",
      }}
      activeOpacity={0.8}
    >
      {/* Fading Outer Border with Shadow */}
      <Animated.View
        style={{
          position: "absolute",
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          borderWidth: 3,
          borderColor: "#90e0ef", // light blue border
          opacity: fadeAnim,
          shadowColor: "#90e0ef", // shadow color matches border
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 10,
          elevation: 10, // Android shadow
        }}
      />

      {/* Inner Button */}
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
      >
        <Image
          source={require("../../assets/orthlogo.png")}
          style={{
            width: responsiveWidth(10),
            height: responsiveHeight(5),
            resizeMode: "cover",
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Chatbot;
