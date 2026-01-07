import { ImageBackground } from "react-native";
import React from "react";
import ImageSlider from "../components/ImageSlider";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";
import { FlatList } from "react-native";

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FlatList
        data={[1]} // dummy
        renderItem={() => <Recommendations />}
        keyExtractor={(item) => item.toString()}
        ListHeaderComponent={
          <>
            <ImageSlider />
            <Cards />
          </>
        }
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
};

export default HomeScreen;
