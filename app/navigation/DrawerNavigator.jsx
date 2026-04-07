// DrawerNavigator.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import MainStack from "./MainStack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useAuth } from "../context/AuthContext";
import { COLORS, SHADOWS } from "../constants/Theme";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { user, logout } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerTitle: () => (
          <Image
            source={require("../../assets/logoapp.png")}
            style={{
              width: responsiveHeight(25),
              height: responsiveHeight(25),
              resizeMode: "contain",
            }}
          />
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: responsiveWidth(3) }}
          >
            <Icon name="menu" size={30} color="#ADB5BD" />
          </TouchableOpacity>
        ),
      })}
      drawerContent={(props) => {
        /* -------- ACTIVE TAB DETECTION (NATIVE NESTED STATE) -------- */
        const getActiveRouteName = (state) => {
          const route = state.routes[state.index];
          if (route.state) {
            return getActiveRouteName(route.state);
          }
          return route.name;
        };

        const activeTab = getActiveRouteName(props.state);
        const isActive = (name) => activeTab === name;
        const isDoctor = user?.user_type === "doctor";

        return (
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
              flex: 1,
              padding: responsiveWidth(5),
              justifyContent: "space-between",
            }}
          >
            {/* TOP */}
            <View>
              {/* User Profile Info */}
              <View style={{ alignItems: 'center', marginBottom: responsiveHeight(2) }}>
                  <View style={{
                    width: responsiveHeight(10),
                    height: responsiveHeight(10),
                    borderRadius: responsiveHeight(5),
                    backgroundColor: '#F1F3F4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderWidth: 2,
                    borderColor: '#fff',
                    ...SHADOWS.light
                  }}>
                    <Icon name="account" size={responsiveHeight(6)} color="#ADB5BD" />
                  </View>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#343A40' }}>{user?.name || user?.email?.split('@')[0] || 'User'}</Text>
                  <Text style={{ fontSize: 12, color: '#6C757D' }}>{user?.user_type === 'doctor' ? 'Medical Professional' : 'Patient'}</Text>
              </View>

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F1F3F4",
                  marginVertical: responsiveHeight(2),
                }}
              />

              {/* Navigation Links */}
              <DrawerItem
                label="Dashboard"
                icon="view-dashboard-outline"
                active={isActive("Home")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Tabs", params: { screen: "Home" } })}
              />
              <DrawerItem
                label="New Diagnosis"
                icon="camera-plus-outline"
                active={isActive("MyDiagnosis")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Tabs", params: { screen: "MyDiagnosis" } })}
              />
              <DrawerItem
                label="Diagnostic History"
                icon="history"
                active={isActive("History")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Tabs", params: { screen: "History" } })}
              />
              <DrawerItem
                label={isDoctor ? "Patient Worklist" : "Medical Reports"}
                icon={isDoctor ? "clipboard-list-outline" : "file-document-outline"}
                active={isActive("Reports")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Tabs", params: { screen: "Reports" } })}
              />
              <DrawerItem
                label="Appointments"
                icon="calendar-check-outline"
                active={isActive("Appointments")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Appointments" })}
              />
              <DrawerItem
                label="My Profile"
                icon="account-outline"
                active={isActive("Profile")}
                onPress={() => props.navigation.navigate("HomeTabs", { screen: "Tabs", params: { screen: "Profile" } })}
              />
            </View>

            {/* BOTTOM */}
            <TouchableOpacity
              onPress={logout}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: responsiveWidth(4),
                marginBottom: responsiveHeight(5),
              }}
            >
              <Icon name="logout" size={22} color="#e03131" />
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: responsiveFontSize(2),
                  color: "#e03131",
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen 
        name="HomeTabs" 
        component={MainStack} 
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Tabs";
          const noHeaderScreens = ["Chat", "ConsultDoctor", "BookAppointment", "Appointments", "DiagnosisDetail"];
          return {
            headerShown: !noHeaderScreens.includes(routeName),
          };
        }}
      />
    </Drawer.Navigator>
  );
};

const DrawerItem = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: active ? `${COLORS.primary}15` : "transparent",
      paddingVertical: responsiveHeight(1.8),
      paddingHorizontal: responsiveWidth(4),
      borderRadius: 12,
      marginBottom: responsiveHeight(0.8),
      borderLeftWidth: 4,
      borderLeftColor: active ? COLORS.primary : "transparent",
    }}
  >
    <Icon name={icon} size={24} color={active ? COLORS.primary : COLORS.gray} />
    <Text
      style={{
        marginLeft: 15,
        fontSize: responsiveFontSize(1.9),
        fontWeight: active ? "700" : "500",
        color: active ? COLORS.primary : COLORS.gray,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default DrawerNavigator;
