import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MyDiagnosis from "../screens/MyDiagnosis";
import ReportsScreen from "../screens/ReportsScreen";
import Profile from "../screens/Profile";
import History from "../screens/History";
import WorklistScreen from "../screens/WorklistScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { COLORS, SHADOWS } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = responsiveHeight(10);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom > 0 ? insets.bottom : Platform.OS === "android" ? 16 : 0;

  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBar, { paddingBottom: bottomPad }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isCenter = index === 2; // MyDiagnosis is center

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center FAB button
          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
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

          const isDoctor = user?.user_type === "doctor";
          
          // Icon maps
          const iconMap = {
            Home: "home-variant",
            Reports: isDoctor ? "clipboard-list-outline" : "file-chart-outline",
            History: "clock-outline",
            Profile: "account-circle-outline",
          };
          const iconActive = {
            Home: "home-variant",
            Reports: isDoctor ? "clipboard-list" : "file-chart",
            History: "clock",
            Profile: "account-circle",
          };
          const labelMap = {
            Home: "Home",
            Reports: isDoctor ? "Worklist" : "Reports",
            History: "History",
            Profile: "Profile",
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
                <Icon
                  name={isFocused ? iconActive[route.name] : iconMap[route.name]}
                  size={responsiveFontSize(2.8)}
                  color={isFocused ? COLORS.primary : "#ADB5BD"}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {labelMap[route.name]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const BottomTabsNavigator = () => {
  const { user } = useAuth();
  const isDoctor = user?.user_type === "doctor";

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Reports" 
        component={isDoctor ? WorklistScreen : ReportsScreen} 
        options={{
          tabBarLabel: isDoctor ? "Worklist" : "Reports"
        }}
      />
      <Tab.Screen name="MyDiagnosis" component={MyDiagnosis} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    ...SHADOWS.dark,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabBar: {
    flexDirection: "row",
    minHeight: TAB_BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: responsiveWidth(2),
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
