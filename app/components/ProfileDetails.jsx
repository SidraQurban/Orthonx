import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOWS, GRADIENTS } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";
import ModernInput from "./ModernInput";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const ProfileDetails = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone_number: user?.phone_number || "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      Alert.alert("✅ Success", "Your profile has been updated!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } else {
      Alert.alert("Error", result.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Personal Info Section */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Feather name="user" size={16} color={COLORS.primary} />
        </View>
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>

      <ModernInput
        label="Full Name"
        icon="user"
        placeholder="Enter your full name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        autoCapitalize="words"
      />

      {/* Email — read-only styled differently */}
      <View style={styles.readOnlyContainer}>
        <Text style={styles.ioLabel}>Email Address</Text>
        <View style={styles.readOnlyRow}>
          <Feather name="mail" size={18} color={COLORS.gray} />
          <Text style={styles.readOnlyValue}>{user?.email || "—"}</Text>
          <View style={styles.lockedBadge}>
            <Feather name="lock" size={11} color="#fff" />
          </View>
        </View>
      </View>

      <ModernInput
        label="Phone Number"
        icon="phone"
        placeholder="+1 234 567 890"
        value={formData.phone_number}
        onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
        keyboardType="phone-pad"
      />

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Security</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Security Section */}
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: "#FFF3CD" }]}>
          <Feather name="shield" size={16} color="#e67700" />
        </View>
        <Text style={styles.sectionTitle}>Change Password</Text>
      </View>

      <ModernInput
        label="New Password"
        icon="lock"
        placeholder="Leave empty to keep current"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry={!showPassword}
        togglePassword={() => setShowPassword(!showPassword)}
      />

      {/* Save Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleUpdate}
        disabled={loading}
        style={{ marginTop: responsiveHeight(1), opacity: loading ? 0.7 : 1 }}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtn}
        >
          {loading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator color="#fff" />
              <Text style={[styles.saveBtnText, { marginLeft: 10 }]}>Saving...</Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="check-circle" size={18} color="#fff" />
              <Text style={[styles.saveBtnText, { marginLeft: 8 }]}>Save Changes</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(3),
    paddingBottom: responsiveHeight(3),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
    color: COLORS.text,
  },
  readOnlyContainer: {
    marginBottom: 20,
    width: "100%",
  },
  ioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E9ECEF",
  },
  readOnlyValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray,
    marginLeft: 12,
  },
  lockedBadge: {
    backgroundColor: COLORS.gray,
    borderRadius: 6,
    padding: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: responsiveHeight(3),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: responsiveFontSize(1.5),
    color: COLORS.gray,
    fontWeight: "600",
    paddingHorizontal: 12,
  },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
  },
});

export default ProfileDetails;
