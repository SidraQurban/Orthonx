import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MyDiagnosis from "../screens/MyDiagnosis";
import ReportsScreen from "../screens/ReportsScreen";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { responsiveHeight } from "react-native-responsive-dimensions";

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00B4D8",
        tabBarInactiveTintColor: "#ADB5BD",
        tabBarStyle: {
          height: responsiveHeight(12),
          paddingTop: responsiveHeight(1),
          borderRadius: responsiveHeight(2),
        },
        tabBarLabelStyle: {
          fontSize: responsiveHeight(1.3),
        },
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={30} />
          ),
        }}
      />

      {/* Reports */}
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="file-document-outline" color={color} size={30} />
          ),
        }}
      />

      {/* MyDiagnosis */}
      <Tab.Screen
        name="MyDiagnosis"
        component={MyDiagnosis}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.outerCircle}>
              <LinearGradient
                colors={["#468FAF", "#00B4D8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.innerCircle}
              >
                <Icon name="camera" size={30} color="#fff" />
              </LinearGradient>
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.scanButtonContainer}
              activeOpacity={0.8}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={30} />
          ),
        }}
      />

      {/* Settings */}
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="cog-outline" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;

const styles = StyleSheet.create({
  scanButtonContainer: {
    top: -responsiveHeight(1),
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(4),
    backgroundColor: "#fff", // white outer circle
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: responsiveHeight(7),
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
    justifyContent: "center",
    alignItems: "center",
  },
});
