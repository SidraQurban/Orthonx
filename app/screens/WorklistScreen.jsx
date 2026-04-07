import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SHADOWS, SIZES } from "../constants/Theme";
import apiClient from "../api/apiClient";

const WorklistScreen = () => {
  const navigation = useNavigation();
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorklist = async () => {
    try {
      const response = await apiClient.get("/api/v1/prediction/reviews/pending");
      setPendingReviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch worklist:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorklist();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorklist();
  };

  const filteredData = pendingReviews.filter((item) => {
    const query = searchQuery.toLowerCase();
    const id = item.id?.toString() || "";
    const date = new Date(item.timestamp).toLocaleDateString().toLowerCase();
    const result = item.diagnosis_data?.detections?.[0]?.class?.toLowerCase() || "normal";
    return id.includes(query) || date.includes(query) || result.includes(query);
  });

  const renderItem = ({ item }) => {
    const hasFracture = item.diagnosis_data?.detections?.length > 0;
    const confidence = hasFracture ? Math.round(item.diagnosis_data.detections[0].confidence * 100) : 0;
    
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
      >
        <View style={styles.cardTop}>
          <View style={styles.recordIdContainer}>
            <Text style={styles.recordId}>#{item.id?.toString().slice(-8)}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={14} color={COLORS.gray} />
            <Text style={styles.dateText}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.cardMain}>
          <View style={styles.predictionBadge}>
            <View style={[styles.dot, { backgroundColor: hasFracture ? COLORS.danger : COLORS.success }]} />
            <Text style={[styles.predictionText, { color: hasFracture ? COLORS.danger : COLORS.success }]}>
              {hasFracture ? item.diagnosis_data.detections[0].class : "Clear Scan"}
            </Text>
          </View>
          
          {hasFracture && (
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${confidence}%` }]} />
              </View>
              <Text style={styles.confidenceValue}>{confidence}%</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
           <Text style={styles.clickHint}>Tap to review case</Text>
           <View style={styles.actionBtn}>
             <Text style={styles.actionBtnText}>Review</Text>
             <Feather name="arrow-right" size={14} color={COLORS.white} />
           </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Worklist</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by ID, date, or prediction..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={80} color={COLORS.lightGray} />
              <Text style={styles.emptyTitle}>Queue Cleared</Text>
              <Text style={styles.emptySub}>No pending reviews found in the system right now.</Text>
            </View>
          )
        }
        ListHeaderComponent={
          filteredData.length > 0 ? (
            <Text style={styles.resultsCount}>{filteredData.length} Cases Pending</Text>
          ) : null
        }
      />

      {loading && (
        <View style={styles.absLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "800",
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    margin: SIZES.padding,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  resultsCount: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: "700",
    color: COLORS.gray,
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  recordIdContainer: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordId: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: responsiveFontSize(1.4),
    fontWeight: "700",
    color: COLORS.subtext,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 6,
    fontSize: responsiveFontSize(1.4),
    color: COLORS.gray,
    fontWeight: "600",
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  predictionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  predictionText: {
    fontSize: responsiveFontSize(1.9),
    fontWeight: "800",
  },
  confidenceContainer: {
    alignItems: "flex-end",
  },
  confidenceLabel: {
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.gray,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  progressBarBg: {
    width: 60,
    height: 5,
    backgroundColor: COLORS.lightGray,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  confidenceValue: {
    fontSize: responsiveFontSize(1.3),
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clickHint: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.gray,
    fontStyle: "italic",
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: responsiveFontSize(1.6),
    marginRight: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 20,
  },
  emptySub: {
    fontSize: responsiveFontSize(1.8),
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 50,
  },
  absLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});

export default WorklistScreen;
