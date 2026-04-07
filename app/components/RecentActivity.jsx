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
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SHADOWS, SIZES } from "../constants/Theme";
import apiClient, { API_URL } from "../api/apiClient";

const RecentActivty = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await apiClient.get("/api/v1/yolo/detection/history?page=1&page_size=5");
        setHistory(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);
  
  const renderItem = ({ item }) => {
    const isDetected = item.detections?.length > 0;

    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.card}
        onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
      >
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image 
              source={item.result_image_url ? { uri: item.result_image_url.startsWith('http') ? item.result_image_url : `${API_URL}${item.result_image_url.startsWith('/') ? '' : '/'}${item.result_image_url}` } : require("../../assets/orthlogo.png")} 
              style={styles.image} 
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{isDetected ? "Fracture Detected" : "No Fracture Found"}</Text>
            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>

          <View style={styles.rightSection}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isDetected ? "#FDECEA" : "#E6F4EA" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isDetected ? "#D93025" : "#1E8E3E" },
                ]}
              >
                {isDetected ? "Urgent" : "Clear"}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.gray} style={{ marginLeft: 8 }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false} // Since it's inside a ScrollView/FlatList parent
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: COLORS.gray, padding: 20 }}>No recent activity.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding,
    marginTop: 25,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  viewAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default RecentActivty;
