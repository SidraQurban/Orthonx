/**
 * BottomNavBar — Reusable bottom navigation bar for standalone screens
 * (screens outside the BottomTabsNavigator, e.g. Appointments, ConsultDoctor)
 */
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { COLORS, SHADOWS } from "../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";

const TAB_BAR_HEIGHT = responsiveHeight(10);

const NAV_ITEMS = [
  { name: "Home", icon: "home-variant-outline", iconActive: "home-variant", label: "Home", route: "Tabs", params: { screen: "Home" } },
  { name: "Reports", icon: "file-chart-outline", iconActive: "file-chart", label: "Reports", route: "Tabs", params: { screen: "Reports" } },
  { name: "MyDiagnosis", icon: null, label: "", route: "Tabs", params: { screen: "MyDiagnosis" }, isCenter: true },
  { name: "Appointments", icon: "calendar-check-outline", iconActive: "calendar-check", label: "Appts", route: "Appointments", params: undefined },
  { name: "Profile", icon: "account-circle-outline", iconActive: "account-circle", label: "Profile", route: "Tabs", params: { screen: "Profile" } },
];

const BottomNavBar = ({ activeTab = "" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {NAV_ITEMS.map((item) => {
          const isFocused = activeTab === item.name;

          const onPress = () => {
            if (item.route === "Appointments") {
              navigation.navigate("Appointments");
            } else {
              navigation.navigate("HomeTabs", {
                screen: item.route,
                params: item.params,
              });
            }
          };

          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={item.name}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.fabContainer}
              >
                <LinearGradient
                  colors={["#468FAF", "#00B4D8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.fabGradient}
                >
                  <Icon name="camera" size={responsiveFontSize(3.2)} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.name}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
                <Icon
                  name={isFocused ? item.iconActive : item.icon}
                  size={responsiveFontSize(2.8)}
                  color={isFocused ? COLORS.primary : "#ADB5BD"}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "#fff",
    ...SHADOWS.dark,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabBar: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: Platform.OS === "ios" ? responsiveHeight(2) : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsiveHeight(0.5),
  },
  iconPill: {
    width: responsiveWidth(12),
    height: responsiveHeight(4.5),
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPillActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  tabLabel: {
    fontSize: responsiveFontSize(1.3),
    color: "#ADB5BD",
    fontWeight: "500",
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  fabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -responsiveHeight(3.5),
  },
  fabGradient: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(4),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    ...SHADOWS.dark,
  },
});
