import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { COLORS, SHADOWS } from "../constants/Theme";
import { Feather } from "@expo/vector-icons";

const DoctorCards = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/v1/appointments/doctors");
      setDoctors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: responsiveWidth(2),
        paddingTop: responsiveHeight(1),
      }}
    >
      {doctors.map((doctor, index) => (
        <TouchableOpacity
          key={doctor.id || index}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("BookAppointment", { doctor })}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.white,
            padding: responsiveWidth(4),
            borderRadius: responsiveWidth(4),
            marginBottom: responsiveHeight(2),
            borderWidth: 1,
            borderColor: COLORS.border,
            ...SHADOWS.light,
          }}
        >
          {/* Doctor Info */}
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <View style={{ 
                width: responsiveWidth(14), 
                height: responsiveWidth(14), 
                borderRadius: responsiveWidth(7), 
                backgroundColor: COLORS.lightGray,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: responsiveWidth(3)
            }}>
              {doctor.image_url ? (
                <Image
                  source={{ uri: doctor.image_url }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: responsiveWidth(7),
                  }}
                />
              ) : (
                <Feather name="user" size={24} color={COLORS.gray} />
              )}
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: responsiveFontSize(1.8),
                  color: COLORS.text
                }}
              >
                Dr. {doctor.name}
              </Text>
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: responsiveFontSize(1.5),
                  fontWeight: '600',
                  marginTop: 2,
                }}
              >
                {doctor.specialty || "Orthopedic Surgeon"}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Feather name="star" size={12} color="#F59E0B" />
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.3),
                    color: COLORS.gray,
                    marginLeft: 4
                  }}
                >
                  4.8 (120+ Reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Consult Button */}
          <View
            style={{
              backgroundColor: `${COLORS.primary}10`,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 12,
              marginLeft: 10,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 13 }}>
              Book
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Empty State */}
      {!loading && doctors.length === 0 && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
           <Feather name="search" size={40} color={COLORS.gray} />
           <Text style={{ color: COLORS.gray, marginTop: 10 }}>No doctors found.</Text>
        </View>
      )}

      {/* Spacer to clear BottomNavBar */}
      <View style={{ height: responsiveHeight(12) }} />
    </ScrollView>
  );
};

export default DoctorCards;
