import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Linking,
  Alert,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import apiClient from "../api/apiClient";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import InfoModal from "../components/InfoModal";

const { width } = Dimensions.get("window");

const ClockPulse = () => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
       <Feather name="clock" size={24} color="#92400E" />
    </Animated.View>
  );
};

const DiagnosisDetail = ({ route, navigation }) => {
  const { id } = route.params || {};
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("result");
  const [isRequesting, setIsRequesting] = useState(false);
  const [config, setConfig] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "", icon: "alert-circle", iconColor: COLORS.danger });
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [recRes, confRes] = await Promise.all([
        apiClient.get(`/api/v1/prediction/${id}`),
        apiClient.get("/api/v1/dashboard/config")
      ]);
      setRecord(recRes.data);
      setConfig(confRes.data);
    } catch (error) {
      console.error("Failed to fetch diagnosis detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReview = async () => {
    if (!record || isRequesting) return;
    
    try {
      setIsRequesting(true);
      await apiClient.post(`/api/v1/prediction/${id}/request-review`);
      // Refresh record to get new status
      const response = await apiClient.get(`/api/v1/prediction/${id}`);
      setRecord(response.data);
      Alert.alert("Success", "Review requested successfully. A specialist will review your scan shortly.");
    } catch (error) {
      if (error.response?.status === 402) {
        setModalConfig({
          title: "Insufficient Credits",
          message: `Your balance: ${user?.credits || 0} credits\nRequired: ${config?.request_review_cost || 20} credits\n\nPlease top up your account to continue.`,
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
             handleRequestReview();
          }
        });
        setShowModal(true);
      } else {
        console.error("Request review error:", error);
        Alert.alert(
          "Request Failed",
          error.response?.data?.detail || "Could not request review. Please check your balance."
        );
      }
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.loadingContainer, { padding: 20 }]}>
        <Feather name="alert-circle" size={50} color={COLORS.danger} />
        <Text style={styles.errorText}>Diagnosis Not Found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasFracture = record.diagnosis_data?.detections?.length > 0;
  const detection = hasFracture ? record.diagnosis_data.detections[0] : null;

  const images = [
    { key: "uploaded", url: record.uploaded_image_url, label: "Original" },
    { key: "result", url: record.result_image_url, label: "Detection" },
    { key: "explanation", url: record.explanation_image_url, label: "Explanation" },
    { key: "gradcam", url: record.gradcam_image_url, label: "Heatmap" },
  ].filter((img) => img.url);

  const activeImage = images.find((img) => img.key === selectedImage)?.url || images[0]?.url;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnosis Detail</Text>
        <TouchableOpacity>
          <Feather name="share-2" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageViewer}>
          <Image source={{ uri: activeImage }} style={styles.mainImage} resizeMode="contain" />
          <View style={styles.imageTabs}>
            {images.map((img) => (
              <TouchableOpacity
                key={img.key}
                onPress={() => setSelectedImage(img.key)}
                style={[styles.imageTab, selectedImage === img.key && styles.activeTab]}
              >
                <Text style={[styles.tabText, selectedImage === img.key && styles.activeTabText]}>
                  {img.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <LinearGradient
          colors={hasFracture ? ["#FFF5F5", "#FFE3E3"] : ["#F0FFF4", "#C6F6D5"]}
          style={[styles.statusCard, { borderColor: hasFracture ? "#FEB2B2" : "#9AE6B4" }]}
        >
          <View style={[styles.statusIcon, { backgroundColor: hasFracture ? COLORS.danger : "#38A169" }]}>
            <MaterialCommunityIcons name={hasFracture ? "alert-circle" : "check-circle"} size={32} color={COLORS.white} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: hasFracture ? "#9B2C2C" : "#22543D" }]}>
              {hasFracture ? "Fracture Detected" : "Clear / Normal"}
            </Text>
            <Text style={[styles.statusSub, { color: hasFracture ? "#C53030" : "#2F855A" }]}>
              Clinical AI Analysis Complete
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Analysis Result</Text>
          {hasFracture && detection ? (
            <View style={styles.diagnosisBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Classification</Text>
                <Text style={styles.detailValue}>{detection.class.toUpperCase()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence</Text>
                <View style={styles.confidenceRow}>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressBar, { width: `${detection.confidence * 100}%` }]} />
                  </View>
                  <Text style={styles.confidenceText}>{Math.round(detection.confidence * 100)}%</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.normalBox}>
              <Text style={styles.normalText}>The AI model did not identify any fractures in the uploaded scan. No clinical action required.</Text>
            </View>
          )}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Metadata</Text>
          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Scan ID</Text>
              <Text style={styles.metaValue}>#{id ? id.toString().slice(0, 8) : "N/A"}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Timestamp</Text>
              <Text style={styles.metaValue}>{record.timestamp ? new Date(record.timestamp).toLocaleDateString() : "N/A"}</Text>
            </View>
          </View>

          {/* Review Section */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Professional Opinion</Text>
          {(!record.review_status || record.review_status === 'none') ? (
            <View style={styles.reviewPromptBox}>
              <View style={styles.reviewInfoRow}>
                <View style={styles.stethoscopeIcon}>
                   <MaterialCommunityIcons name="stethoscope" size={24} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                   <Text style={styles.reviewPromptTitle}>Expert Verification</Text>
                   <Text style={styles.reviewPromptSub}>Get a certified orthopedic surgeon to review this scan.</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.requestReviewBtn}
                onPress={handleRequestReview}
                disabled={isRequesting}
              >
                {isRequesting ? (
                   <ActivityIndicator color={COLORS.white} />
                ) : (
                   <Text style={styles.requestBtnText}>Request Review ({config?.request_review_cost || 20} Credits)</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : record.review_status === 'pending' ? (
            <View style={[styles.statusBox, styles.pendingBox]}>
              <ClockPulse />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.statusBoxTitle}>Review Pending</Text>
                <Text style={styles.statusBoxSub}>A specialist has been notified and will provide notes shortly.</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.statusBox, styles.reviewedBox]}>
              <View style={styles.reviewedHeader}>
                <Feather name="check-circle" size={18} color="#065F46" />
                <Text style={styles.reviewedTitle}>Doctor's Clinical Notes</Text>
              </View>
              <Text style={styles.reviewNotes}>{record.review_notes}</Text>
            </View>
          )}

          {record.report_url && (
            <TouchableOpacity 
              style={styles.downloadBtn}
              onPress={() => Linking.openURL(record.report_url)}
            >
              <LinearGradient
                colors={GRADIENTS.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Feather name="file-text" size={20} color={COLORS.white} />
                <Text style={styles.btnText}>Download Medical Report</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    paddingTop: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text },
  scrollContent: { padding: SIZES.padding, paddingBottom: 50 },
  imageViewer: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 15,
    ...SHADOWS.medium,
    marginBottom: 20,
  },
  mainImage: { width: "100%", height: width - 60, borderRadius: 15 },
  imageTabs: { flexDirection: "row", marginTop: 15, justifyContent: "space-between" },
  imageTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.lightGray,
  },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, color: COLORS.gray, fontWeight: "600" },
  activeTabText: { color: COLORS.white },
  statusCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 25,
  },
  statusIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center" },
  statusInfo: { marginLeft: 15, flex: 1 },
  statusTitle: { fontSize: 18, fontWeight: "bold" },
  statusSub: { fontSize: 12, marginTop: 2, opacity: 0.8 },
  detailsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.text, marginBottom: 15 },
  diagnosisBox: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.light },
  detailRow: { marginBottom: 15 },
  detailLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 5 },
  detailValue: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  confidenceRow: { flexDirection: "row", alignItems: "center" },
  progressBg: { flex: 1, height: 8, backgroundColor: COLORS.lightGray, borderRadius: 4, marginRight: 10 },
  progressBar: { height: "100%", backgroundColor: COLORS.primary, borderRadius: 4 },
  confidenceText: { fontSize: 14, fontWeight: "bold", color: COLORS.primary },
  normalBox: { padding: 20, backgroundColor: "#F0FFF4", borderRadius: 15, borderWidth: 1, borderColor: "#9AE6B4" },
  normalText: { fontSize: 14, color: "#22543D", lineHeight: 20 },
  metaBox: { flexDirection: "row", justifyContent: "space-between" },
  metaItem: { width: "48%", backgroundColor: COLORS.white, padding: 15, borderRadius: 15, ...SHADOWS.light },
  metaLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 5 },
  metaValue: { fontSize: 14, fontWeight: "bold", color: COLORS.text },
  downloadBtn: { marginTop: 30, ...SHADOWS.medium },
  btnGradient: { flexDirection: "row", paddingVertical: 18, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  btnText: { color: COLORS.white, fontWeight: "bold", fontSize: 16, marginLeft: 10 },
  reviewPromptBox: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: "#EBF8FF",
  },
  reviewInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stethoscopeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6FFFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  reviewPromptTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  reviewPromptSub: { fontSize: 12, color: COLORS.gray, marginTop: 2, lineHeight: 16 },
  requestReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    ...SHADOWS.small,
  },
  requestBtnText: { color: COLORS.white, fontWeight: "bold", fontSize: 14 },
  statusBox: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  pendingBox: { backgroundColor: "#FFFBEB", borderColor: "#FEF3C7" },
  statusBoxTitle: { fontSize: 15, fontWeight: "bold", color: "#92400E" },
  statusBoxSub: { fontSize: 12, color: "#B45309", marginTop: 2 },
  reviewedBox: { 
    backgroundColor: "#F0FDF4", 
    borderColor: "#DCFCE7", 
    flexDirection: "column", 
    alignItems: "flex-start" 
  },
  reviewedHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  reviewedTitle: { fontSize: 14, fontWeight: "bold", color: "#065F46", marginLeft: 8 },
  reviewNotes: { fontSize: 14, color: "#166534", lineHeight: 22, fontStyle: "italic" },
  errorText: { fontSize: 18, color: COLORS.text, fontWeight: "bold", marginTop: 15 },
  backBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: 10 },
  backBtnText: { color: COLORS.white, fontWeight: "bold" },
});

export default DiagnosisDetail;
