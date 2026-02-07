import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const Specialities = () => {
  const [selected, setSelected] = useState("General Physician");

  const specialties = [
    "Orthopedic",
    "Radiologist",
    "Trauma",
    "Pediatric Orthopedic",
    "General Physician",
  ];

  return (
    <View>
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 12,
          fontSize: responsiveFontSize(2),
        }}
      >
        Specialities
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          gap: 10,
          paddingRight: 16,
        }}
      >
        {specialties.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelected(item)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: selected === item ? "#00B4D8" : "#e9ecef",
            }}
          >
            <Text
              style={{
                color: selected === item ? "#fff" : "#555",
                fontSize: responsiveFontSize(1.6),
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Specialities;
