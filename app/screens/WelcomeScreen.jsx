import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={{ width, height, flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: SIZES.padding, justifyContent: 'space-between', paddingBottom: 50 }}>
          
          <View style={{ marginTop: 80, alignItems: 'center' }}>
            <Image 
              source={require("../../assets/logoapp.png")} 
              style={{ width: width * 0.7, height: 120, resizeMode: 'contain' }} 
            />
            <Text style={{ 
              fontSize: SIZES.h1, 
              fontWeight: '800', 
              color: COLORS.primary, 
              marginTop: 20,
              textAlign: 'center' 
            }}>
              Orthonx AI
            </Text>
            <Text style={{ 
              fontSize: SIZES.body, 
              color: COLORS.gray, 
              textAlign: 'center', 
              marginTop: 10,
              paddingHorizontal: 20
            }}>
              Advancing Orthopedic Care through Intelligent Fracture Detection
            </Text>
          </View>

          <View style={{ width: '100%' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Role")}
              activeOpacity={0.8}
              style={{ ...SHADOWS.medium }}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 18,
                  borderRadius: 30,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}>
                  Get Started
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 20, alignItems: 'center' }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
                Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
