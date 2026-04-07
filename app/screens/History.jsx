import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiClient, { API_URL } from "../api/apiClient";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";

const History = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get("/api/v1/yolo/detection/history");
      setHistory(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }) => {
    const isDetected = item.detections?.length > 0;
    
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.card}
        onPress={() => navigation.navigate("DiagnosisDetail", { id: item.id })}
      >
        <View style={styles.row}>
          <Image 
            source={item.result_image_url ? { uri: item.result_image_url.startsWith('http') ? item.result_image_url : `${API_URL}${item.result_image_url.startsWith('/') ? '' : '/'}${item.result_image_url}` } : require("../../assets/orthlogo.png")} 
            style={styles.image} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{isDetected ? "Fracture Detected" : "No Fracture Found"}</Text>
            <Text style={styles.date}>{new Date(item.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: isDetected ? "#FDECEA" : "#E6F4EA" }]}>
            <Text style={[styles.statusText, { color: isDetected ? "#D93025" : "#1E8E3E" }]}>
              {isDetected ? "Urgent" : "Normal"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnostic History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingHorizontal: SIZES.padding, paddingBottom: 50 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="folder" size={50} color={COLORS.lightGray} />
            <Text style={{ color: COLORS.gray, marginTop: 10 }}>No history found.</Text>
          </View>
        }
      />
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
    padding: SIZES.padding,
    paddingTop: 20
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.black,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    marginTop: 100,
    alignItems: "center",
  },
});

export default History;
