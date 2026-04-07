import React, { useEffect, useRef } from "react";
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Animated, 
  Easing 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SHADOWS } from "../constants/Theme";
import { responsiveHeight } from "react-native-responsive-dimensions";

const Chatbot = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim, {
        toValue: 2,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => pulse());
    };

    pulse();
  }, [pulseAnim]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat")}
      activeOpacity={0.9}
      style={styles.container}
    >
      {/* Pulsing Background Aura (Same as Web Ping) */}
      <Animated.View 
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulseAnim }],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 2],
              outputRange: [0.3, 0]
            })
          }
        ]} 
      />

      {/* Main White Bubble */}
      <View style={styles.bubble}>
        <Image 
          source={require("../../assets/orthlogo.png")} 
          style={styles.logo} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: responsiveHeight(12),
    right: 25,
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white, // Thick white border same as web ring
    padding: 2,
    ...SHADOWS.medium,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  pulseRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary, // Blue pulsing aura
  },
});

export default Chatbot;
