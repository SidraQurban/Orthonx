import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
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
  }
});

export default AppointmentsScreen;
