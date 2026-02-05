import { ImageBackground, View } from "react-native";
import React from "react";
import ImageSlider from "../components/ImageSlider";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";
import { FlatList } from "react-native";
import Chatbot from "../components/Chatbot";
import { responsiveHeight } from "react-native-responsive-dimensions";
import RecentActivty from "../components/RecentActivity";

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/bgimg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FlatList
        data={[1]} // dummy
        renderItem={() => (
          <View style={{ paddingTop: responsiveHeight(2) }}>
            <RecentActivty />
          </View>
        )}
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
      <Chatbot />
    </ImageBackground>
  );
};

export default HomeScreen;
