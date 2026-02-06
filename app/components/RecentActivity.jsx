import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { ReportData } from "../../Constant";
import { useNavigation } from "@react-navigation/native";

const RecentActivty = () => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    const isDetected = item.status === "Detected";

    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.row}>
          {/* Left Image */}
          <Image source={item.image} style={styles.image} />

          {/* Middle Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
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
                {item.status}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Reports")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={ReportData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RecentActivty;

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

  viewAll: {
    fontSize: responsiveFontSize(1.4),
    color: "#1A73E8",
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
