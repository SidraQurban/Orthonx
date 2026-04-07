import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import apiClient, { API_URL } from "../api/apiClient";
import { COLORS, SHADOWS } from "../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import InfoModal from "./InfoModal";
import { useAuth } from "../context/AuthContext";

const UploadImage = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [statusText, setStatusText] = useState("AI is analyzing your scan...");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const pickImage = async () => {
    // Request permissions explicitly
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Permission Denied",
        "We need access to your gallery to upload X-ray scans for analysis. Please enable it in your device settings.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setResult(null); 
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Could not open image gallery. Please try again.");
    }
  };

  const pollTaskStatus = async (taskId) => {
    try {
      const statusResponse = await apiClient.get(`/api/v1/yolo/detection/status/${taskId}`);
      const { status, result: taskResult } = statusResponse.data;

      if (status === 'SUCCESS') {
        setResult(taskResult);
        setLoading(false);
        setStatusText("Analysis Complete!");
      } else if (status === 'FAILURE' || status === 'REVOKED') {
        setLoading(false);
        Alert.alert("Analysis Failed", "Something went wrong during detection.");
      } else {
        setStatusText('Processing X-ray image...');
        setTimeout(() => pollTaskStatus(taskId), 1500);
      }
    } catch (err) {
      setLoading(false);
      console.error("Polling error", err);
      Alert.alert("Error", "Failed to check status. Please check connectivity.");
    }
  };

  const uploadAndDetect = async () => {
    if (!image) return;

    setLoading(true);
    setStatusText("Uploading task...");

    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "xray.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await apiClient.post("/api/v1/yolo/detection/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const { task_id } = response.data;
      if (task_id) {
          setStatusText("Task queued...");
          pollTaskStatus(task_id);
      } else {
          setLoading(false);
          Alert.alert("Error", "No task ID received");
      }
    } catch (error) {
      setLoading(false);
      
      if (error.response?.status === 402) {
        setShowErrorModal(true);
      } else if (error.message === "Network Error") {
        Alert.alert(
          "Connection Lost", 
          "Could not reach the Orthonx server. Please check your internet connection or the server IP in .env"
        );
      } else {
        console.error("Detection error:", error);
        Alert.alert("Detection failed", "Please check your connection and try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <TouchableOpacity onPress={pickImage} style={styles.uploadArea}>
          <View style={styles.uploadCircle}>
            <Feather name="upload-cloud" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.uploadTitle}>Tap to Upload X-ray</Text>
          <Text style={styles.uploadSub}>Supports JPG, PNG up to 10MB</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          
          {!result && !loading && (
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setImage(null)} style={styles.secondaryBtn}>
                <Text style={{ color: COLORS.gray }}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={uploadAndDetect} style={styles.primaryBtn}>
                <Text style={{ color: COLORS.white, fontWeight: "bold" }}>Analyze Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>{statusText}</Text>
            </View>
          )}

          {result && (
            <View style={styles.reportContainer}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>Clinical Report</Text>
                <View style={[styles.badge, { backgroundColor: result.detections?.length > 0 ? "#FDECEA" : "#E6F4EA" }]}>
                  <Text style={{ color: result.detections?.length > 0 ? "#D93025" : "#1E8E3E", fontWeight: "bold", fontSize: 10 }}>
                    {result.detections?.length > 0 ? "FRACTURE DETECTED" : "CLEAR SCAN"}
                  </Text>
                </View>
              </View>

              <Text style={styles.reportSubtitle}>Grad-CAM Heatmap Visualization</Text>
              <Image 
                source={result.result_image ? { uri: result.result_image.startsWith('http') ? result.result_image : `${API_URL}${result.result_image.startsWith('/') ? '' : '/'}${result.result_image}` } : require("../../assets/orthlogo.png")} 
                style={styles.resultImage} 
              />

              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>AI Summary</Text>
                <Text style={styles.summaryText}>
                  {result.detections?.length > 0 
                    ? `Fracture detected with ${Math.round(result.detections[0].confidence * 100)}% confidence. The heatmap highlights the affected region.`
                    : "No fractures detected. Please consult a specialist for confirmation."
                  }
                </Text>
              </View>

              <TouchableOpacity onPress={() => setImage(null)} style={styles.restartBtn}>
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>Upload New Scan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <InfoModal 
        visible={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Insufficient Credits"
        message={`Your balance: ${user?.credits || 0} credits\nRequired: 10 credits\n\nPlease top up your account to continue.`}
        buttonText="View Profile"
        onButtonPress={() => {
          setShowErrorModal(false);
          navigation.navigate("Profile");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  uploadArea: {
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  uploadSub: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  previewContainer: {
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  previewImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  buttonRow: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  secondaryBtn: {
    width: 80,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  reportContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reportSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
  },
  restartBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UploadImage;
