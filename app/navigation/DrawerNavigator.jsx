// DrawerNavigator.js
import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import BottomTabsNavigator from "./BottomTabsNavigator";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { EvilIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
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
                source={require("../../assets/profile-pic.png")}
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
      drawerContent={(props) => {
        /* -------- ACTIVE TAB DETECTION -------- */
        const currentRoute = props.state.routeNames[props.state.index];

        let activeTab = "Home";

        if (currentRoute === "HomeTabs") {
          const tabState = props.state.routes[props.state.index]?.state;
          if (tabState) {
            activeTab = tabState.routeNames[tabState.index];
          }
        }

        const isActive = (name) => activeTab === name;

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
              {/* Logo */}
              <Image
                source={require("../../assets/logoapp.png")}
                style={{
                  height: responsiveHeight(5),
                  width: responsiveWidth(60),
                  resizeMode: "cover",
                  alignSelf: "center",
                }}
              />

              {/* Divider */}
              <View
                style={{
                  height: 1,
                  backgroundColor: "#F1F3F4",
                  marginVertical: responsiveHeight(2),
                  marginTop: responsiveHeight(3),
                }}
              />

              {/* Search */}
              <View
                style={{
                  position: "relative",
                  marginBottom: responsiveHeight(3),
                }}
              >
                <EvilIcons
                  name="search"
                  size={24}
                  color="#6c757d"
                  style={{
                    position: "absolute",
                    left: responsiveWidth(4),
                    top: "50%",
                    transform: [{ translateY: -12 }],
                    zIndex: 1,
                  }}
                />

                <TextInput
                  placeholder="Search"
                  placeholderTextColor="#adb5bd"
                  style={{
                    borderWidth: 1,
                    borderColor: "#ced4da",
                    borderRadius: responsiveHeight(3),
                    paddingLeft: responsiveWidth(12),
                    backgroundColor: "#e9ecef",
                    height: responsiveHeight(5.5),
                  }}
                />
              </View>

              {/* Overview */}
              <DrawerItem
                label="Overview"
                icon="home"
                active={isActive("Home")}
                onPress={() =>
                  props.navigation.navigate("HomeTabs", {
                    screen: "Home",
                  })
                }
              />
              {/* History */}
              <DrawerItem
                label="Reports"
                icon="file-document-outline"
                active={isActive("Reports")}
                onPress={() =>
                  props.navigation.navigate("HomeTabs", {
                    screen: "Reports",
                  })
                }
              />
              {/* Profile */}
              <DrawerItem
                label="My Profile"
                icon="account-outline"
                active={isActive("Profile")}
                onPress={() =>
                  props.navigation.navigate("HomeTabs", {
                    screen: "Profile",
                  })
                }
              />
              {/* History */}
              <DrawerItem
                label="History"
                icon="history"
                active={isActive("History")}
                onPress={() =>
                  props.navigation.navigate("HomeTabs", {
                    screen: "History",
                  })
                }
              />
            </View>
            {/* Divider */}
            <View
              style={{
                height: 1,
                backgroundColor: "#F1F3F4",
                marginVertical: responsiveHeight(2),
                marginTop: responsiveHeight(30),
              }}
            />

            {/* BOTTOM */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: responsiveWidth(4),
                marginBottom: responsiveHeight(2),
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
      <Drawer.Screen name="HomeTabs" component={BottomTabsNavigator} />
    </Drawer.Navigator>
  );
};

const DrawerItem = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: active ? "#00B4D8" : "transparent",
      paddingVertical: responsiveHeight(1.6),
      paddingHorizontal: responsiveWidth(4),
      borderRadius: 14,
      marginBottom: responsiveHeight(1),
    }}
  >
    <Icon name={icon} size={22} color={active ? "#fff" : "#6c757d"} />
    <Text
      style={{
        marginLeft: 15,
        fontSize: responsiveFontSize(2),
        fontWeight: active ? "600" : "400",
        color: active ? "#fff" : "#6c757d",
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default DrawerNavigator;
