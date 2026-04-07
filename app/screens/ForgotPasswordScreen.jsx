import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import ModernInput from "../components/ModernInput";
import InfoModal from "../components/InfoModal";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      setLoading(false);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={{ width, height, flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: SIZES.padding }}>
          <View style={{ marginTop: 40, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, marginRight: 15 }}>
              <Feather name="arrow-left" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text }}>Forgot Password?</Text>
              <Text style={{ fontSize: SIZES.body, color: COLORS.gray, marginTop: 5 }}>Enter your email to receive a reset link</Text>
            </View>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ marginTop: 50 }}>
            {error ? (
              <View style={{ backgroundColor: '#FFF0F0', padding: 12, borderRadius: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={{ color: COLORS.danger, marginLeft: 10, fontSize: 13 }}>{String(error)}</Text>
              </View>
            ) : null}

            <ModernInput 
              label="Email Address" 
              placeholder="name@example.com" 
              icon="mail" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
            />

            <TouchableOpacity 
              onPress={handleResetRequest} 
              disabled={loading} 
              activeOpacity={0.8}
              style={{ marginTop: 25 }}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 55,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: loading ? 0.7 : 1,
                  ...SHADOWS.medium
                }}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}>Send Reset Link</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>

      <InfoModal 
        visible={showSuccessModal}
        title="Email Sent"
        message="A password reset link has been sent to your email. Please check your inbox and spam folder."
        icon="check-circle"
        iconColor={COLORS.success}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.navigate("Login");
        }}
      />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
