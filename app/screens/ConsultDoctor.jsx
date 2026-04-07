import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Specialities from "../components/Specialities";
import DoctorCards from "../components/DoctorCards";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";
import BottomNavBar from "../components/BottomNavBar";

const ConsultDoctor = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consult Doctor</Text>
        <TouchableOpacity>
          <Feather name="filter" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.heading}>Find Your Doctor</Text>
          <Text style={styles.subheading}>Get expert advice from certified orthopedic specialists</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Search doctors by name or specialty"
            placeholderTextColor={COLORS.gray}
            style={styles.searchInput}
          />
        </View>



        {/* Doctor List Wrapper */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Available Doctors</Text>
          <DoctorCards />
        </View>
      </ScrollView>

      <BottomNavBar activeTab="Appointments" />
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
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 140,
  },
  titleSection: {
    marginTop: 10,
    marginBottom: 25,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
});

export default ConsultDoctor;
