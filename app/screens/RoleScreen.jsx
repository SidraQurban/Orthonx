import { View, Text, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RoleScreen = ({ navigation }) => {
  const RoleCard = ({ title, subtitle, icon, onPress, primary = false }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: '100%',
        backgroundColor: primary ? COLORS.primary : COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.medium,
        borderWidth: primary ? 0 : 1,
        borderColor: COLORS.border,
      }}
    >
      <View style={{ 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: primary ? 'rgba(255,255,255,0.2)' : COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Feather name={icon} size={30} color={primary ? COLORS.white : COLORS.primary} />
      </View>
      <View style={{ marginLeft: 20, flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: primary ? COLORS.white : COLORS.text }}>{title}</Text>
        <Text style={{ fontSize: 12, color: primary ? 'rgba(255,255,255,0.8)' : COLORS.gray }}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={24} color={primary ? COLORS.white : COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={{ width, height, flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: SIZES.padding }}>
          <View style={{ marginTop: 60 }}>
            <Text style={{ fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text }}>Select Your Role</Text>
            <Text style={{ fontSize: SIZES.body, color: COLORS.gray, marginTop: 5 }}>Help us personalize your Orthonx experience</Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <RoleCard 
              title="Patient" 
              subtitle="Access AI diagnosis, history, and talk to our assistant."
              icon="user"
              primary={true}
              onPress={() => navigation.navigate("SignUp", { role: "user" })}
            />
            <RoleCard 
              title="Doctor" 
              subtitle="Review scans, manage appointments, and access advanced tools."
              icon="activity"
              onPress={() => navigation.navigate("SignUp", { role: "doctor" })}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RoleScreen;
