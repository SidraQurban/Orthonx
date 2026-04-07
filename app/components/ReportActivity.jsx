import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import apiClient, { API_URL } from "../api/apiClient";

const ReportActivity = () => {
  const navigation = useNavigation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiClient.get("/api/v1/yolo/detection/history?page=1&page_size=10");
        setReports(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const renderItem = ({ item }) => {
    const isDetected = item.detections?.length > 0;

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
      >
        <View style={styles.row}>
          {/* Left Image */}
          <Image 
            source={item.result_image_url ? { uri: item.result_image_url.startsWith('http') ? item.result_image_url : `${API_URL}${item.result_image_url.startsWith('/') ? '' : '/'}${item.result_image_url}` } : require("../../assets/orthlogo.png")} 
            style={styles.image} 
          />

          {/* Middle Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{isDetected ? "Fracture Detected" : "No Fracture"}</Text>
            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>

          {/* Right: Status + Arrow */}
          <View style={styles.rightSection}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isDetected ? "#FDECEA" : "#E6F4EA",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isDetected ? "#D93025" : "#1E8E3E" },
                ]}
              >
                {isDetected ? "Detected" : "Clear"}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#C4C4C4"
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#468FAF" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
      </View>

      {/* List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>No recent activity.</Text>}
      />
    </View>
  );
};

export default ReportActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: responsiveWidth(4),
    borderRadius: 16,
    padding: responsiveHeight(2),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },

  headerTitle: {
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: 8,
    marginRight: responsiveWidth(3),
    backgroundColor: '#000'
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: "500",
  },

  date: {
    fontSize: responsiveFontSize(1.3),
    color: "#6C757D",
    marginTop: 2,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: 20,
  },

  statusText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: "500",
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F3F4",
    marginVertical: responsiveHeight(1.5),
  },
});
