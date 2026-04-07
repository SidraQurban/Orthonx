import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import UploadImage from "../components/UploadImage";
import { COLORS, SIZES } from "../constants/Theme";
import { Feather } from "@expo/vector-icons";

const MyDiagnosis = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Bone Diagnosis</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Feather name="info" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Please upload a clear X-ray image for the most accurate AI fracture detection.
          </Text>
        </View>

        <UploadImage />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    paddingTop: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 12,
    lineHeight: 18,
    flex: 1,
  },
});

export default MyDiagnosis;
