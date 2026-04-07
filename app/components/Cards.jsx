import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";

const Cards = () => {
  const navigation = useNavigation();

  const ActionCard = ({ title, icon, iconType, onPress, color = COLORS.primary }) => {
    const IconComponent = iconType === "MCI" ? MaterialCommunityIcons : iconType === "FA5" ? FontAwesome5 : Feather;
    
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.card}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <IconComponent name={icon} size={28} color={color} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ActionCard
        title="New Diagnosis"
        icon="camera"
        onPress={() => navigation.navigate("MyDiagnosis")}
      />
      <ActionCard
        title="Medical Reports"
        icon="file-text"
        onPress={() => navigation.navigate("Reports")}
        color="#2D6A4F"
      />
      <ActionCard
        title="Appointments"
        icon="calendar-month-outline"
        iconType="MCI"
        onPress={() => navigation.navigate("Appointments")}
        color="#1A73E8"
      />
      <ActionCard
        title="History"
        icon="history"
        iconType="MCI"
        onPress={() => navigation.navigate("History")}
        color="#6C757D"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding,
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
});

export default Cards;
