import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import ModernInput from "../components/ModernInput";
import InfoModal from "../components/InfoModal";

const { width, height } = Dimensions.get("window");

const SignUpScreen = ({ navigation, route }) => {
  const { role } = route.params || { role: 'user' };
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", icon: "wifi-off", iconColor: COLORS.gray });

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await register({
        name,
        email,
        password,
        is_active: true,
        is_superuser: false,
        is_verified: false,
        user_type: role
      });
      setLoading(false);

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setLoading(false);
      if (err.code === "ECONNABORTED" || err.message?.toLowerCase().includes("timeout")) {
        setModalConfig({
          title: "Request Timed Out",
          message: "The server is taking too long to respond. Please check your connectivity and try again.",
          icon: "clock",
          iconColor: COLORS.warning,
        });
        setShowNetworkModal(true);
      } else if (err.message === "Network Error") {
        setModalConfig({
          title: "Connection Lost",
          message: "Could not connect to the Orthonx server. Please check your network connection and server IP.",
          icon: "wifi-off",
          iconColor: COLORS.gray,
        });
        setShowNetworkModal(true);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={{ width, height, flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: SIZES.padding, paddingBottom: 40 }}>
          <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: SIZES.h1, fontWeight: '800', color: COLORS.text }}>Create Account</Text>
              <Text style={{ fontSize: SIZES.body, color: COLORS.gray, marginTop: 5 }}>Sign up as a <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{role === 'doctor' ? 'Doctor' : 'Patient'}</Text></Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
              <Feather name="x" size={28} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ marginTop: 40 }}>
            {error ? (
              <View style={{ backgroundColor: '#FFF0F0', padding: 12, borderRadius: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={{ color: COLORS.danger, marginLeft: 10, fontSize: 13 }}>{String(error)}</Text>
              </View>
            ) : null}

             <ModernInput 
              label="Full Name" 
              placeholder={role === 'doctor' ? "Dr. John Doe" : "John Doe"} 
              icon="user" 
              value={name} 
              onChangeText={setName} 
            />

            <ModernInput 
              label="Email Address" 
              placeholder="name@example.com" 
              icon="mail" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
            />
            
            <ModernInput 
              label="Password" 
              placeholder="••••••••" 
              icon="lock" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity 
              onPress={handleSignUp} 
              disabled={loading} 
              activeOpacity={0.8}
              style={{ marginTop: 20 }}
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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator color={COLORS.white} />
                    <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Creating account...</Text>
                  </View>
                ) : (
                  <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
              <Text style={{ color: COLORS.gray }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
      <InfoModal 
        visible={showNetworkModal}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        onClose={() => setShowNetworkModal(false)}
      />
      <InfoModal 
        visible={showSuccessModal}
        title="Check Your Email"
        message="A verification link has been sent to your email. Please verify your account before logging in."
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

export default SignUpScreen;
