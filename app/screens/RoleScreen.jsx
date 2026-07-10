import {
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";

const { width, height } = Dimensions.get("window");

const RoleScreen = ({ navigation }) => {
  const RoleCard = ({
    title,
    subtitle,
    iconSource,
    onPress,
    variant = "doctor",
  }) => {
    const isDoctor = variant === "doctor";

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.card, isDoctor ? styles.cardDoctor : styles.cardPatient]}
      >
        {/* Image */}
        <View style={styles.iconContainer}>
          <Image
            source={iconSource}
            style={styles.cardIcon}
            resizeMode="contain"
          />
        </View>

        {/* Text */}
        <View style={styles.cardTextWrapper}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDoctor ? COLORS.primary : "#4CAF50" },
            ]}
          >
            {title}
          </Text>

          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../../assets/bgimg.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Continue as...</Text>

            <Text style={styles.headerSubtitle}>
              Choose your role to get the{"\n"}best experience.
            </Text>
          </View>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            <RoleCard
              title="Doctor"
              subtitle="Access patient scans and detailed reports."
              iconSource={require("../../assets/stethoscope.png")}
              variant="doctor"
              onPress={() => navigation.navigate("SignUp", { role: "doctor" })}
            />

            <RoleCard
              title="User"
              subtitle="Check your X-rays and get quick results."
              iconSource={require("../../assets/patient.png")}
              variant="patient"
              onPress={() => navigation.navigate("SignUp", { role: "user" })}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.infoCircle}>
              <Text style={styles.infoLetter}>i</Text>
            </View>

            <Text style={styles.whyText}>Why we ask?</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D6EAF8",
  },

  bgImage: {
    width,
    height,
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    justifyContent: "space-between",
    paddingBottom: 40,
  },

  header: {
    marginTop: height * 0.13,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },

  cardsContainer: {
    marginTop: -height * 0.05,
    gap: 24,
    alignItems: "center",
  },
  card: {
    width: "88%",
    height: 130,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 26,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.medium,
  },

  cardDoctor: {
    backgroundColor: "#E3F4FB",
    borderWidth: 1.8,
    borderColor: COLORS.primary,
  },

  cardPatient: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1.8,
    borderColor: "#4CAF50",
  },

  iconContainer: {
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  cardIcon: {
    width: 120,
    height: 120,
  },

  cardTextWrapper: {
    marginLeft: 8,
    flex: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  footer: {
    alignItems: "center",
    marginTop: 20,
  },

  infoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  infoLetter: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },

  whyText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
});

export default RoleScreen;
