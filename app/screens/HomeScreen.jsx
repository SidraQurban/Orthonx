import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";
import { responsiveHeight } from "react-native-responsive-dimensions";

import Cards from "../components/Cards";
import RecentActivty from "../components/RecentActivity";
import Chatbot from "../components/Chatbot";
import DoctorDashboard from "../components/doctor/DoctorDashboard";

const HomeScreen = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshUser) {
      await refreshUser();
    }
    setTimeout(() => setRefreshing(false), 800);
  }, [refreshUser]);

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Good Morning,</Text>
        <Text style={styles.userName}>{user?.name?.split(' ')[0] || user?.email?.split('@')[0] || "User"}</Text>
      </View>
      <TouchableOpacity style={styles.notificationBtn}>
        <Feather name="bell" size={22} color={COLORS.text} />
        <View style={styles.dot} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {user?.user_type === 'doctor' ? (
        <DoctorDashboard user={user} />
      ) : (
        <FlatList
          data={[1]}
          keyExtractor={(item) => item.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={() => (
            <View style={{ paddingBottom: responsiveHeight(12) }}>
              <RecentActivty />
            </View>
          )}
          ListHeaderComponent={
            <>
              <Header />
              <Cards />
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
      <Chatbot />
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
    paddingHorizontal: SIZES.padding,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.gray,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  notificationBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  dot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default HomeScreen;
