import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Cards = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        marginHorizontal: responsiveWidth(4),
        marginTop: responsiveHeight(2),
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MyDiagnosis")}
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="camera" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}> New Diagnosis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Reports")}
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialDesignIcons
            name="image-multiple-outline"
            color="#ADB5BD"
            size={27}
          />
          <Text style={{ marginTop: responsiveHeight(1) }}>
            Batch Diagnosis
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: responsiveHeight(2),
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("History")}
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name="stethoscope" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}>Consult Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: responsiveHeight(13),
            width: responsiveWidth(45),
            backgroundColor: "#fff",
            borderRadius: responsiveHeight(3),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="event-note" size={30} color="#ADB5BD" />
          <Text style={{ marginTop: responsiveHeight(1) }}>Appointments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cards;
