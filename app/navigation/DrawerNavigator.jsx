// DrawerNavigator.js
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import BottomTabsNavigator from "./BottomTabsNavigator";
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitle: () => (
          <Text
            style={{ fontSize: responsiveFontSize(2.5), fontWeight: "bold" }}
          >
            Orthonx
          </Text>
        ),
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: responsiveWidth(3) }}
          >
            <Icon name="menu" size={30} color="#ADB5BD" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: responsiveWidth(3) }}>
            <View
              style={{
                width: responsiveHeight(5),
                height: responsiveHeight(5),
                borderRadius: responsiveHeight(2.5),
                backgroundColor: "#CED4DA",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../assets/profile-pic.jpg")}
                style={{
                  width: responsiveHeight(4.5),
                  height: responsiveHeight(4.5),
                  borderRadius: responsiveHeight(2.25),
                }}
              />
            </View>
          </TouchableOpacity>
        ),
      })}
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ flex: 1, padding: 20 }}
        >
          <Text
            style={{ fontSize: responsiveFontSize(2.5), fontWeight: "bold" }}
          >
            Menu
          </Text>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen name="HomeTabs" component={BottomTabsNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
