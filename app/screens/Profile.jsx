import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ProfileDetails from "../components/ProfileDetails";
import { COLORS, SIZES, SHADOWS } from "../constants/Theme";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const Profile = ({ navigation }) => {
  const { user, refreshUser } = useAuth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshUser) {
      await refreshUser();
    }
    setRefreshing(false);
  }, [refreshUser]);

  useFocusEffect(
    useCallback(() => {
      if (refreshUser) {
        refreshUser();
      }
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Feather name="user" size={50} color={COLORS.gray} />
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Feather name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || "User"}</Text>
          <Text style={styles.role}>{user?.user_type === 'doctor' ? 'Specialized Doctor' : 'Patient'}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user?.credits || "0"}</Text>
              <Text style={styles.statLabel}>Credits</Text>
            </View>
          </View>
        </View>

        <ProfileDetails />
      </ScrollView>
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
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    marginTop: 10,
    ...SHADOWS.medium,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  role: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
});

export default Profile;
