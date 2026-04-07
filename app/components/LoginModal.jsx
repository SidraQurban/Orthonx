import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS, SHADOWS, GRADIENTS } from "../constants/Theme";
import ModernInput from "./ModernInput";
import InfoModal from "./InfoModal";

const LoginModal = ({ visible, onClose, onSignUpPress, onForgotPasswordPress, onResendVerificationPress }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", icon: "wifi-off", iconColor: COLORS.gray });

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        onClose();
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
          message: "Could not connect to the Orthonx server. Please check your network or server IP.",
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: "flex-end" }}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: '100%' }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 25,
              paddingBottom: 40,
              ...SHADOWS.dark,
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text }}>Welcome Back</Text>
                <Text style={{ color: COLORS.gray, marginTop: 5 }}>Sign in to continue</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                <Feather name="x" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={{ 
                backgroundColor: '#FFF0F0', 
                padding: 12, 
                borderRadius: 10, 
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Feather name="alert-circle" size={18} color={COLORS.danger} />
                <Text style={{ color: COLORS.danger, marginLeft: 10, fontSize: 13 }}>{String(error)}</Text>
              </View>
            ) : null}

            {/* Inputs */}
            <ModernInput
              label="Email Address"
              icon="mail"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <ModernInput
              label="Password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity 
              onPress={onForgotPasswordPress}
              style={{ alignSelf: 'flex-end', marginBottom: 25, marginTop: -5 }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 13, fontWeight: "600" }}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
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
                    <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 25,
              }}
            >
              <Text style={{ color: COLORS.gray }}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUpPress}>
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Resend Verification Footer */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              <Text style={{ color: COLORS.gray, fontSize: 13 }}>Didn't receive email? </Text>
              <TouchableOpacity onPress={onResendVerificationPress}>
                <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 13 }}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      <InfoModal 
        visible={showNetworkModal}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        onClose={() => setShowNetworkModal(false)}
      />
    </Modal>
  );
};

export default LoginModal;
