import { View, Text, ImageBackground, Dimensions } from "react-native";
import React from "react";
import ImageSlider from "../components/ImageSlider";
import Cards from "../components/Cards";

const { width, height } = Dimensions.get("window");
const HomeScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{
        resizeMode: "cover",
        width: width,
        height: height,
      }}
    >
      <ImageSlider />
      <Cards />
    </ImageBackground>
  );
};

export default HomeScreen;
