import { View, Text, ImageBackground, Dimensions, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GetStarted from "../components/GetStarted";

const { width, height } = Dimensions.get("window");
const WelcomeScreen = () => {
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
            <GetStarted />
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
