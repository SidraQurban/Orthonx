import { View, Text, ImageBackground, Dimensions, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectRole from "../components/SelectRole";

const { width, height } = Dimensions.get("window");
const RoleScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <View>
          <ImageBackground
            source={require("../../assets/bgimg.png")}
            style={{
              resizeMode: "cover",
              width: width,
              height: height,
            }}
          >
            <SelectRole />
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RoleScreen;
