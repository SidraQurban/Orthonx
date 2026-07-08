import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../api/apiClient";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import BottomNavBar from "../components/BottomNavBar";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  
  // Doctor notes modal states
  const [selectedApp, setSelectedApp] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const isDoctor = user?.user_type === "doctor";

  const fetchAppointments = useCallback(async () => {
    try {
      const endpoint = isDoctor 
        ? "/api/v1/appointments/me/doctor" 
        : "/api/v1/appointments/me/patient";
        
      const response = await apiClient.get(endpoint);
      setAppointments(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isDoctor]);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await apiClient.patch(`/api/v1/appointments/${appointmentId}`, {
        status: newStatus,
      });
      Alert.alert("Success", `Appointment status updated to ${newStatus}.`);
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update appointment:", error);
      Alert.alert("Error", error.response?.data?.detail || "Could not update status.");
    }
  };

  const saveDoctorNote = async () => {
    if (!selectedApp) return;
    try {
      setIsUpdating(true);
      await apiClient.patch(`/api/v1/appointments/${selectedApp.id}`, {
        doctor_notes: noteText,
      });
      setShowNoteModal(false);
      setSelectedApp(null);
      setNoteText("");
      Alert.alert("Success", "Clinical notes saved successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to save note:", error);
      Alert.alert("Error", error.response?.data?.detail || "Could not save notes.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter((app) => 
    filter === "all" ? true : app.status === filter
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return { bg: '#FFF3CD', text: '#856404' };
      case 'confirmed': return { bg: '#D1ECF1', text: '#0C5460' };
      case 'completed': return { bg: '#D4EDDA', text: '#155724' };
      case 'cancelled': return { bg: '#F8D7DA', text: '#721C24' };
      default: return { bg: '#E2E3E5', text: '#383D41' };
    }
  };

  const renderItem = ({ item }) => {
    const statusColors = getStatusColor(item.status);
    const displayPerson = isDoctor ? item.patient : item.doctor;
    const nameLabel = isDoctor 
        ? `${displayPerson?.name || 'Patient'}` 
        : `Dr. ${displayPerson?.name || 'Specialist'}`;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Feather name="user" size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.nameText}>{nameLabel}</Text>
              <Text style={styles.specialtyText}>
                {isDoctor ? "Patient" : (displayPerson?.specialty || "Orthopedic Surgeon")}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <Feather name="calendar" size={16} color={COLORS.primary} />
            <Text style={styles.timeText}>
                {new Date(item.appointment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.timeRow}>
            <Feather name="clock" size={16} color={COLORS.primary} />
            <Text style={styles.timeText}>{item.time_slot.split(' - ')[0]}</Text>
          </View>
        </View>

        {item.patient_notes && (
          <View style={styles.notesContainer}>
             <Text style={styles.notesLabel}>Notes:</Text>
             <Text style={styles.notesText} numberOfLines={2}>{item.patient_notes}</Text>
          </View>
        )}

        {item.doctor_notes && (
          <View style={styles.docNotesContainer}>
             <Text style={styles.docNotesLabel}>Doctor's Notes:</Text>
             <Text style={styles.docNotesText}>{item.doctor_notes}</Text>
          </View>
        )}

        {isDoctor && (
          <View style={styles.actionRow}>
            {item.status === "pending" && (
              <TouchableOpacity
                onPress={() => updateAppointmentStatus(item.id, "confirmed")}
                style={[styles.actionBtn, styles.confirmBtn]}
              >
                <Feather name="check" size={14} color={COLORS.white} />
                <Text style={styles.actionBtnText}>Confirm</Text>
              </TouchableOpacity>
            )}
            {item.status === "confirmed" && (
              <TouchableOpacity
                onPress={() => updateAppointmentStatus(item.id, "completed")}
                style={[styles.actionBtn, styles.completeBtn]}
              >
                <Feather name="check-circle" size={14} color={COLORS.white} />
                <Text style={styles.actionBtnText}>Complete</Text>
              </TouchableOpacity>
            )}
            {(item.status === "pending" || item.status === "confirmed") && (
              <TouchableOpacity
                onPress={() => updateAppointmentStatus(item.id, "cancelled")}
                style={[styles.actionBtn, styles.cancelBtn]}
              >
                <Feather name="x" size={14} color={COLORS.white} />
                <Text style={styles.actionBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setSelectedApp(item);
                setNoteText(item.doctor_notes || "");
                setShowNoteModal(true);
              }}
              style={[styles.actionBtn, styles.notesBtn]}
            >
              <Feather name="edit-2" size={14} color={COLORS.primary} />
              <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Notes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const FilterTabs = () => (
    <View style={styles.filterContainer}>
      {['all', 'pending', 'confirmed', 'completed'].map((f) => (
        <TouchableOpacity 
          key={f} 
          onPress={() => setFilter(f)}
          style={[styles.filterTab, filter === f && styles.activeFilterTab]}
        >
          <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={responsiveFontSize(3)} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <FilterTabs />

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding, paddingBottom: responsiveHeight(14) }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="calendar-blank" size={60} color={COLORS.lightGray} />
              <Text style={{ color: COLORS.gray, marginTop: 15, fontSize: 16 }}>No appointments found.</Text>
            </View>
          }
        />
      )}

      {/* Book New FAB for Patients */}
      {!isDoctor && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ConsultDoctor")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fabGradient}
          >
            <Feather name="plus" size={20} color={COLORS.white} />
            <Text style={styles.fabText}>Book New</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Footer Navigation */}
      <BottomNavBar activeTab="Appointments" />

      <Modal
        visible={showNoteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowNoteModal(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>Add Clinical Notes</Text>
            <Text style={styles.modalSubtitle}>
              Notes will be saved and visible to the patient for this appointment.
            </Text>
            <TextInput
              multiline
              numberOfLines={6}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Enter patient diagnosis, prescription info, or next step recommendations..."
              placeholderTextColor={COLORS.gray}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowNoteModal(false)}
                style={[styles.modalBtn, styles.modalCancelBtn]}
              >
                <Text style={[styles.modalBtnText, { color: COLORS.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveDoctorNote}
                disabled={isUpdating}
                style={[styles.modalBtn, styles.modalSaveBtn]}
              >
                {isUpdating ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Save Notes</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
  backButton: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    color: COLORS.text,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(2),
  },
  filterTab: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: 25,
    backgroundColor: COLORS.white,
    marginRight: responsiveWidth(2.5),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.gray,
    fontWeight: "600",
  },
  activeFilterText: {
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
  },
  nameText: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    color: COLORS.text,
  },
  specialtyText: {
    fontSize: responsiveFontSize(1.5),
    color: COLORS.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: 10,
  },
  statusText: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: responsiveHeight(2),
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 8,
    fontSize: responsiveFontSize(1.7),
    color: COLORS.text,
    fontWeight: "600"
  },
  notesContainer: {
    marginTop: responsiveHeight(2),
    backgroundColor: "#F8F9FA",
    padding: responsiveWidth(3.5),
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notesLabel: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: "bold",
    color: COLORS.gray,
    marginBottom: 4
  },
  notesText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.text,
    fontStyle: "italic",
    lineHeight: 22,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    marginTop: responsiveHeight(15),
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: responsiveHeight(12),
    right: responsiveWidth(5),
    zIndex: 10,
    ...SHADOWS.dark,
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.8),
    borderRadius: 30,
  },
  fabText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: responsiveFontSize(2),
    marginLeft: 8,
  },
  docNotesContainer: {
    marginTop: responsiveHeight(2),
    backgroundColor: "#F0F7FA",
    padding: responsiveWidth(3.5),
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  docNotesLabel: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: "bold",
    color: "#0288D1",
    marginBottom: 4
  },
  docNotesText: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.text,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: responsiveHeight(2),
    paddingTop: responsiveHeight(1.5),
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 4,
  },
  confirmBtn: {
    backgroundColor: "#0288D1",
  },
  completeBtn: {
    backgroundColor: COLORS.success,
  },
  cancelBtn: {
    backgroundColor: COLORS.danger,
  },
  notesBtn: {
    backgroundColor: `${COLORS.primary}15`,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(5),
  },
  modalContent: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.dark,
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: responsiveFontSize(1.5),
    color: COLORS.gray,
    marginBottom: 15,
  },
  modalInput: {
    minHeight: 120,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    fontSize: responsiveFontSize(1.7),
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelBtn: {
    backgroundColor: COLORS.lightGray,
  },
  modalSaveBtn: {
    backgroundColor: COLORS.primary,
  },
  modalBtnText: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.6),
  },
});

export default AppointmentsScreen;
