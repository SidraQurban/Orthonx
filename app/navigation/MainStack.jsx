import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import ConsultDoctor from "../screens/ConsultDoctor";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabsNavigator} />
      <Stack.Screen name="ConsultDoctor" component={ConsultDoctor} />
    </Stack.Navigator>
  );
};

export default MainStack;
