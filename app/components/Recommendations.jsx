import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";

const DATA = [
  {
    id: "1",
    title: "Wear a wrist brace",
    subtitle: "for better healing",
    image: require("../../assets/doc-1.png"),
  },
  {
    id: "2",
    title: "Follow-up X-ray",
    subtitle: "for next week",
    image: require("../../assets/doc-2.png"),
  },
  {
    id: "3",
    title: "Limit heavy lifting",
    subtitle: "to prevent further injury",
    image: require("../../assets/doc-3.png"),
  },
  {
    id: "4",
    title: "Apply cold compress",
    subtitle: "to reduce swelling",
    image: require("../../assets/doc-4.png"),
  },
  {
    id: "5",
    title: "Take prescribed painkillers",
    subtitle: "as directed by doctor",
    image: require("../../assets/doc-5.png"),
  },
  {
    id: "6",
    title: "Start light physiotherapy",
    subtitle: "after pain subsides",
    image: require("../../assets/doc-8.png"),
  },
  {
    id: "7",
    title: "Keep the arm elevated",
    subtitle: "to improve blood flow",
    image: require("../../assets/doc-7.png"),
  },

  {
    id: "8",
    title: "Avoid sudden movements",
    subtitle: "to protect the fracture",
    image: require("../../assets/doc-6.png"),
  },
  {
    id: "9",
    title: "Attend orthopedic consultation",
    subtitle: "for expert evaluation",
    image: require("../../assets/doc-9.png"),
  },
  {
    id: "10",
    title: "Monitor pain levels",
    subtitle: "and report any changes",
    image: require("../../assets/doc-10.png"),
  },
];

const Recommendations = () => {
  return (
    <View
      style={{
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveHeight(2),
      }}
    >
      <Text style={{ color: "#ADB5BD", marginBottom: 10 }}>
        Recommendations
      </Text>

      {DATA.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: responsiveWidth(4),
            marginVertical: responsiveHeight(1),
            borderRadius: 12,
            elevation: 3,
          }}
        >
          <Image
            source={item.image}
            style={{
              width: responsiveHeight(5),
              height: responsiveHeight(5),
              borderRadius: responsiveHeight(2.5),
              marginRight: responsiveWidth(4),
              backgroundColor: "#CED4DA",
            }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "600", fontSize: 14 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#6c757d", fontSize: 12 }}>
              {item.subtitle}
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Recommendations;
