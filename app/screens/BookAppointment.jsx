import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";
import apiClient from "../api/apiClient";
import { LinearGradient } from "expo-linear-gradient";
import InfoModal from "../components/InfoModal";
import { useAuth } from "../context/AuthContext";

const BookAppointment = ({ route, navigation }) => {
  const { doctor } = route.params || {};
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ appointment_booking_cost: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", icon: "alert-circle", iconColor: COLORS.danger });

  const [formData, setFormData] = useState({
    appointment_date: new Date().toISOString().split("T")[0],
    time_slot: "",
    patient_notes: "",
  });

  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
  ];

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await apiClient.get("/api/v1/dashboard/config");
      setConfig(response.data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    }
  };

  const handleBooking = async () => {
    if (!formData.time_slot) {
      Alert.alert("Required", "Please select a time slot.");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/api/v1/appointments/", {
        doctor_id: doctor.id,
        appointment_date: formData.appointment_date,
        time_slot: formData.time_slot,
        patient_notes: formData.patient_notes,
      });

      Alert.alert("Success", "Appointment booked successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      if (error.response?.status === 402) {
        setModalConfig({
          title: "Insufficient Credits",
          message: `Your balance: ${user?.credits || 0} credits\nRequired: ${config?.appointment_booking_cost || 0} credits\n\nPlease top up your account to continue.`,
          icon: "alert-circle",
          iconColor: COLORS.danger,
          buttonText: "View Profile",
          onButtonPress: () => {
            setShowModal(false);
            navigation.navigate("Profile");
          }
        });
        setShowModal(true);
      } else if (error.message === "Network Error") {
        setModalConfig({
          title: "Connection Lost",
          message: "Could not reach the server. Please check your network connection.",
          icon: "wifi-off",
          iconColor: COLORS.gray,
          buttonText: "Retry",
          onButtonPress: () => {
             setShowModal(false);
             handleBooking();
          }
        });
        setShowModal(true);
      } else {
        console.error("Booking error:", error);
        Alert.alert(
          "Booking Failed",
          error.response?.data?.detail || "Could not complete booking. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDateStrip = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
          {dates.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0];
            const isSelected = formData.appointment_date === dateStr;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setFormData({ ...formData, appointment_date: dateStr })}
                style={[styles.dateCard, isSelected && styles.activeDateCard]}
              >
                <Text style={[styles.dateDay, isSelected && styles.activeText]}>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.activeText]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Visit</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Doctor Summary */}
        <View style={styles.doctorSummary}>
          <Image source={{ uri: doctor.image_url }} style={styles.doctorImage} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty || "Orthopedic Surgeon"}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified Specialist</Text>
            </View>
          </View>
        </View>

        {step === 1 ? (
          <>
            {renderDateStrip()}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Slots</Text>
              <View style={styles.slotGrid}>
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setFormData({ ...formData, time_slot: slot })}
                    style={[
                      styles.slotCard,
                      formData.time_slot === slot && styles.activeSlotCard,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        formData.time_slot === slot && styles.activeText,
                      ]}
                    >
                      {slot.split(" - ")[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medical Notes (Optional)</Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Describe your symptoms..."
                placeholderTextColor={COLORS.gray}
                value={formData.patient_notes}
                onChangeText={(text) => setFormData({ ...formData, patient_notes: text })}
                style={styles.notesInput}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStep(2)}
              disabled={!formData.time_slot}
            >
              <Text style={styles.btnText}>Review Appointment</Text>
              <Feather name="arrow-right" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewHeading}>Review Booking</Text>

            <View style={styles.reviewRow}>
              <Feather name="calendar" size={18} color={COLORS.primary} />
              <View style={styles.reviewTextContainer}>
                <Text style={styles.reviewLabel}>Date</Text>
                <Text style={styles.reviewValue}>
                  {new Date(formData.appointment_date).toLocaleDateString("en-US", {
                    dateStyle: "long",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.reviewRow}>
              <Feather name="clock" size={18} color={COLORS.primary} />
              <View style={styles.reviewTextContainer}>
                <Text style={styles.reviewLabel}>Time Slot</Text>
                <Text style={styles.reviewValue}>{formData.time_slot}</Text>
              </View>
            </View>

            {formData.patient_notes ? (
              <View style={styles.reviewRow}>
                <Feather name="edit-3" size={18} color={COLORS.primary} />
                <View style={styles.reviewTextContainer}>
                  <Text style={styles.reviewLabel}>Your Notes</Text>
                  <Text style={styles.reviewValue}>{formData.patient_notes}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.costBox}>
              <Text style={styles.costLabel}>Total Cost</Text>
              <Text style={styles.costValue}>{config.appointment_booking_cost} Credits</Text>
            </View>

            <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleBooking}
                disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.btnText}>Complete Booking</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={() => setStep(1)}>
              <Text style={styles.backLinkText}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <InfoModal 
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        iconColor={modalConfig.iconColor}
        buttonText={modalConfig.buttonText}
        onButtonPress={modalConfig.onButtonPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    paddingTop: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text },
  content: { padding: SIZES.padding, paddingBottom: 50 },
  doctorSummary: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    ...SHADOWS.light,
    marginBottom: 25,
    alignItems: "center",
  },
  doctorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  doctorName: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  doctorSpecialty: { fontSize: 14, color: COLORS.primary, marginTop: 2, fontWeight: "600" },
  badge: {
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 10, color: "#22543D", fontWeight: "bold" },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.text, marginBottom: 15 },
  dateList: { flexDirection: "row" },
  dateCard: {
    width: 65,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeDateCard: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateDay: { fontSize: 12, color: COLORS.gray, fontWeight: "600" },
  dateNumber: { fontSize: 18, fontWeight: "bold", color: COLORS.text, marginTop: 4 },
  activeText: { color: COLORS.white },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  slotCard: {
    width: "48%",
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeSlotCard: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotText: { fontSize: 13, fontWeight: "bold", color: COLORS.text },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
    color: COLORS.text
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...SHADOWS.medium,
  },
  confirmBtn: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    ...SHADOWS.medium,
  },
  btnText: { color: COLORS.white, fontWeight: "bold", fontSize: 16, marginRight: 10 },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 25,
    ...SHADOWS.medium,
  },
  reviewHeading: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: 20 },
  reviewRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  reviewTextContainer: { marginLeft: 15, flex: 1 },
  reviewLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  reviewValue: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  costBox: {
    backgroundColor: "#FFFBEB",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  costLabel: { fontSize: 14, fontWeight: "bold", color: "#92400E" },
  costValue: { fontSize: 18, fontWeight: "900", color: "#92400E" },
  backLink: { marginTop: 15, alignSelf: "center" },
  backLinkText: { color: COLORS.primary, fontWeight: "bold" },
});

export default BookAppointment;
