import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import ConsultDoctor from "../screens/ConsultDoctor";
import ChatScreen from "../screens/ChatScreen";
import DiagnosisDetail from "../screens/DiagnosisDetail";
import BookAppointment from "../screens/BookAppointment";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import WorklistScreen from "../screens/WorklistScreen";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabsNavigator} />
      <Stack.Screen name="ConsultDoctor" component={ConsultDoctor} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetail} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="BookAppointment" component={BookAppointment} />
      <Stack.Screen name="Worklist" component={WorklistScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
