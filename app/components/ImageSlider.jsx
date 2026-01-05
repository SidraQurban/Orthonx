import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React, { useState } from "react";
import Carousel from "react-native-reanimated-carousel";
import { images } from "../../Constant";
import { responsiveHeight } from "react-native-responsive-dimensions";

const { width } = Dimensions.get("window");

const ImageSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.wrapper}>
      {/* White Box */}
      <View style={{ marginTop: responsiveHeight(1.5) }}>
        <Carousel
          width={width - 40}
          height={200}
          data={images}
          loop
          autoPlay
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setActiveIndex(index)}
          renderItem={({ item }) => (
            <Image source={item.img} style={styles.image} resizeMode="cover" />
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ImageSlider;
const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  //   card: {
  //     backgroundColor: "#fff",
  //     height: responsiveHeight(25),
  //     borderRadius: responsiveHeight(2),
  //     paddingVertical: responsiveHeight(2),
  //     paddingHorizontal: 10,
  //   },
  image: {
    width: responsiveHeight(32),
    height: responsiveHeight(22),
    borderRadius: responsiveHeight(2),
    alignSelf: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: responsiveHeight(1),
  },
  dot: {
    height: responsiveHeight(0.5),
    width: responsiveHeight(0.5),
    backgroundColor: "#6c757d",
    borderRadius: responsiveHeight(0.25),
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#adb5bd",
  },
});
