import React from "react";
import "react-native-gesture-handler";
import { StatusBar, View } from "react-native";
import AppNavigation from "./app/navigation/AppNavigation";
import { AuthProvider } from "./app/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <AppNavigation />
      </View>
    </AuthProvider>
  );
};
export default App;
