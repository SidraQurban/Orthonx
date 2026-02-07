// HistoryList.js
import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Icon from "react-native-vector-icons/Ionicons";
import { DATA } from "../../Constant";

const HistoryList = ({ containerHeight }) => {
  const [selectedId, setSelectedId] = useState(null);

  const renderRow = ({ item }) => {
    const isNormal = item.result === "No Fracture Detected";
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedId(isSelected ? null : item.id)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: responsiveHeight(1),
            backgroundColor: "#FFF",
            borderBottomWidth: 1,
            borderBottomColor: "#EEE",
          }}
        >
          {/* Scan Image */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              source={item.image}
              style={{
                width: responsiveHeight(6),
                height: responsiveHeight(6),
                borderRadius: 8,
              }}
            />
          </View>

          {/* Result */}
          <View style={{ flex: 2, alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "500",
                color: isNormal ? "#2ECC71" : "#E63946",
                textAlign: "center",
                fontSize: responsiveFontSize(1.6),
              }}
            >
              {item.result}
            </Text>
          </View>

          {/* Confidence */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                width: "80%",
                height: 6,
                backgroundColor: "#E9ECEF",
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  width: `${item.confidence}%`,
                  height: 6,
                  backgroundColor: "#F4B400",
                  borderRadius: 10,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: responsiveFontSize(1.2),
                marginTop: 4,
                color: "#333",
              }}
            >
              {item.confidence}%
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        {isSelected && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingVertical: responsiveHeight(1),
              backgroundColor: "#F9FAFB",
            }}
          >
            {/* View Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: responsiveWidth(4),
                paddingVertical: responsiveHeight(0.5),
                paddingHorizontal: responsiveWidth(3),
                backgroundColor: "#4B9EF6",
                borderRadius: 8,
              }}
            >
              <Icon
                name="eye-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ color: "#fff", fontSize: responsiveFontSize(1.4) }}
              >
                View
              </Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: responsiveHeight(0.5),
                paddingHorizontal: responsiveWidth(3),
                backgroundColor: "#E63946",
                borderRadius: 8,
              }}
            >
              <Icon
                name="trash-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ color: "#fff", fontSize: responsiveFontSize(1.4) }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        height: containerHeight,
        backgroundColor: "#F5F7FA",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F1F3F5",
          paddingVertical: responsiveHeight(1.5),
          borderRadius: 10,
        }}
      >
        {["Scan", "Result", "Confidence"].map((item, index) => (
          <Text
            key={index}
            style={{
              flex: index === 1 ? 2 : 1,
              textAlign: "center",
              fontWeight: "600",
              color: "#6C757D",
              fontSize: responsiveFontSize(1.6),
            }}
          >
            {item}
          </Text>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(4),
        }}
      />
    </View>
  );
};

export default HistoryList;
