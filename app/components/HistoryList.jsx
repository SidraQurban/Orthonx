// HistoryList.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DATA } from "../../Constant";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const HistoryList = ({ containerHeight }) => {
  const renderRow = ({ item }) => {
    const isNormal = item.result === "No Fracture Detected";

    return (
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
        {/* ID */}
        <Text
          style={{
            width: responsiveHeight(12),
            textAlign: "center",
            color: "#333",
          }}
        >
          {item.id}
        </Text>

        {/* Date */}
        <Text
          style={{
            width: responsiveHeight(12),
            textAlign: "center",
            color: "#333",
          }}
        >
          {item.date}
        </Text>

        {/* Scan Image */}
        <View style={{ width: responsiveHeight(12), alignItems: "center" }}>
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
        <Text
          style={{
            width: responsiveHeight(20),
            fontWeight: "500",
            color: isNormal ? "#2ECC71" : "#E63946",
          }}
        >
          {item.result}
        </Text>

        {/* Confidence */}
        <View style={{ width: responsiveHeight(12), alignItems: "center" }}>
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
          <Text style={{ fontSize: 12, marginTop: 4, color: "#333" }}>
            {item.confidence}%
          </Text>
        </View>

        {/* Actions */}
        <View
          style={{
            width: responsiveHeight(12),
            flexDirection: "row",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <TouchableOpacity>
            <Icon name="eye-outline" size={20} color="#2979FF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="trash-outline" size={20} color="#E63946" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        height: containerHeight,
        backgroundColor: "#F5F7FA",
        padding: responsiveHeight(1),
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: responsiveWidth(100) }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F1F3F5",
              paddingVertical: responsiveHeight(1.5),
              borderRadius: 10,
            }}
          >
            {["#", "Date", "Scan", "Result", "Confidence", "Actions"].map(
              (item, index) => (
                <Text
                  key={index}
                  style={{
                    width:
                      index === 3 ? responsiveHeight(20) : responsiveHeight(12),
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#6C757D",
                  }}
                >
                  {item}
                </Text>
              ),
            )}
          </View>

          {/* List */}
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRow}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HistoryList;
