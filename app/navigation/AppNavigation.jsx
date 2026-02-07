import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../screens/WelcomeScreen";
import RoleScreen from "../screens/RoleScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Welcome"
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Role" component={RoleScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {/* Drawer contains BottomTabsStack + ConsultDoctor */}
        <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
