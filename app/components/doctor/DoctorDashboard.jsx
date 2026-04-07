import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SHADOWS, SIZES } from "../../constants/Theme";
import apiClient from "../../api/apiClient";
import { LinearGradient } from "expo-linear-gradient";

const DoctorDashboard = ({ user }) => {
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, reviewsRes] = await Promise.all([
        apiClient.get("/api/v1/dashboard/doctor-stats"),
        apiClient.get("/api/v1/prediction/reviews/pending"),
      ]);
      setStats(statsRes.data);
      setPendingReviews(reviewsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch doctor dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value ?? "0"}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtext}>{subtext}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.scrollContent}
    >
      {/* Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("Worklist")}
      >
        <LinearGradient
          colors={["#468FAF", "#01BAEF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.actionContent}>
            <MaterialCommunityIcons name="stethoscope" size={24} color={COLORS.white} />
            <Text style={styles.actionText}>Start Reviewing Cases</Text>
            <Feather name="arrow-right" size={20} color={COLORS.white} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="AI Scans"
          value={stats?.total_detections}
          icon="pulse"
          color="#845ADF"
          subtext="Processed"
        />
        <StatCard
          title="Completed"
          value={stats?.reviews_completed}
          icon="check-circle-outline"
          color="#26BF94"
          subtext="Consultations"
        />
        <StatCard
          title="Pending"
          value={pendingReviews.length}
          icon="clock-outline"
          color="#F5B843"
          subtext="Awaiting you"
        />
        <StatCard
          title="Credits"
          value={stats?.credits}
          icon="wallet-outline"
          color="#23BF08"
          subtext="Available"
        />
      </View>

      {/* Credit Summary Card */}
      <LinearGradient
        colors={["#212529", "#343A40"]}
        style={styles.creditCard}
      >
        <View style={styles.creditHeader}>
          <Text style={styles.creditLabel}>EARNING BALANCE</Text>
          <MaterialCommunityIcons name="chip" size={32} color="#F5B843" />
        </View>
        <View style={styles.creditAmountContainer}>
          <Text style={styles.creditAmount}>{stats?.credits ?? "0"}</Text>
          <Text style={styles.creditUnit}>CR</Text>
        </View>
        <View style={styles.creditFooter}>
          <View>
            <Text style={styles.footerLabel}>LAST RESET</Text>
            <Text style={styles.footerValue}>
              {stats?.credits_last_reset 
                ? new Date(stats.credits_last_reset).toLocaleDateString() 
                : "N/A"}
            </Text>
          </View>
          <MaterialCommunityIcons name="credit-card-chip-outline" size={40} color="rgba(255,255,255,0.2)" />
        </View>
      </LinearGradient>

      {/* Pending Reviews Preview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Review Requests</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Worklist")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {pendingReviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="check-circle" size={40} color={COLORS.success} />
          <Text style={styles.emptyText}>All caught up!</Text>
        </View>
      ) : (
        pendingReviews.slice(0, 3).map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.requestCard}
            onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
          >
            <View style={styles.requestInfo}>
              <View style={styles.idBadge}>
                <Text style={styles.idText}>#{item.id?.toString().slice(-6)}</Text>
              </View>
              <Text style={styles.requestDate}>
                {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.reviewBtn}
              onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
            >
              <Text style={styles.reviewBtnText}>Review</Text>
              <Feather name="chevron-right" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}

      {/* Spacer */}
      <View style={{ height: responsiveHeight(15) }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 10,
  },
  actionButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    ...SHADOWS.medium,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2),
    fontWeight: "800",
    flex: 1,
    marginLeft: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "900",
    color: COLORS.text,
  },
  statTitle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: "700",
    color: COLORS.subtext,
    marginTop: 2,
  },
  statSubtext: {
    fontSize: responsiveFontSize(1.2),
    color: COLORS.gray,
    marginTop: 2,
  },
  creditCard: {
    borderRadius: 24,
    padding: 25,
    marginBottom: 30,
    ...SHADOWS.dark,
  },
  creditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  creditLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: responsiveFontSize(1.4),
    fontWeight: "900",
    letterSpacing: 2,
  },
  creditAmountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  creditAmount: {
    color: COLORS.white,
    fontSize: responsiveFontSize(5.5),
    fontWeight: "900",
  },
  creditUnit: {
    color: "rgba(255,255,255,0.4)",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
    marginLeft: 10,
  },
  creditFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 15,
  },
  footerLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: responsiveFontSize(1.2),
    fontWeight: "700",
    marginBottom: 2,
  },
  footerValue: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.6),
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "800",
    color: COLORS.text,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: responsiveFontSize(1.6),
    fontWeight: "700",
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.gray,
    fontWeight: "700",
  },
  requestCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  idBadge: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  idText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: responsiveFontSize(1.4),
    fontWeight: "700",
    color: COLORS.subtext,
  },
  requestDate: {
    fontSize: responsiveFontSize(1.6),
    color: COLORS.gray,
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  reviewBtnText: {
    color: COLORS.primary,
    fontWeight: "800",
    marginRight: 4,
    fontSize: responsiveFontSize(1.6),
  },
});

export default DoctorDashboard;
