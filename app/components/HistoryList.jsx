import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { responsiveHeight } from "react-native-responsive-dimensions";

const data = [
  {
    id: 11,
    date: "Dec 30, 2025",
    image: require("../../assets/img2.jpg"),
    result: "forearm fracture",
    confidence: 71,
  },
  {
    id: 10,
    date: "Dec 22, 2025",
    image: require("../../assets/img1.jpg"),
    result: "No Fracture Detected",
    confidence: 92,
  },
  {
    id: 14,
    date: "Dec 22, 2025",
    image: require("../../assets/wrist.jpg"),
    result: "Wrist positive",
    confidence: 72,
  },
  {
    id: 19,
    date: "Dec 22, 2025",
    image: require("../../assets/img2.jpg"),
    result: "No Fracture Detected",
    confidence: 87,
  },
  {
    id: 21,
    date: "Dec 22, 2025",
    image: require("../../assets/arm.png"),
    result: "forearm fracture",
    confidence: 96,
  },
];

const HistoryList = () => {
  return (
    <View
      style={{
        backgroundColor: "#F5F7FA",
        padding: 10,
        marginTop: responsiveHeight(1),
      }}
    >
      <ScrollView>
        <ScrollView horizontal>
          <View
            style={{
              minWidth: 800,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 12,
                backgroundColor: "#F1F3F5",
              }}
            >
              {["#", "Date", "Scan", "Result", "Confidence", "Actions"].map(
                (item, index) => (
                  <Text
                    key={index}
                    style={{
                      width: index === 3 ? 200 : 120,
                      fontWeight: "600",
                      color: "#6C757D",
                      textAlign: "center",
                    }}
                  >
                    {item}
                  </Text>
                ),
              )}
            </View>

            {/* Rows */}
            {data.map((item, index) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  paddingVertical: 14,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#EEE",
                }}
              >
                {/* # */}
                <Text style={{ width: 120, textAlign: "center" }}>
                  {item.id}
                </Text>

                {/* Date */}
                <Text style={{ width: 120, textAlign: "center" }}>
                  {item.date}
                </Text>

                {/* Scan */}
                <View style={{ width: 120, alignItems: "center" }}>
                  <Image
                    source={item.image}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 8,
                    }}
                  />
                </View>

                {/* Result */}
                <Text
                  style={{
                    width: 200,
                    color:
                      item.result === "No Fracture Detected"
                        ? "green"
                        : "#D90429",
                  }}
                >
                  {item.result}
                </Text>

                {/* Confidence */}
                <View style={{ width: 120 }}>
                  <View
                    style={{
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
                      fontSize: 12,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    {item.confidence}%
                  </Text>
                </View>

                {/* Actions */}
                <View
                  style={{
                    width: 120,
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <TouchableOpacity>
                    <Icon name="eye-outline" size={20} color="#2979FF" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="trash-outline" size={20} color="#D90429" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default HistoryList;
