import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import InfoModal from "../components/InfoModal";
import storage from "../utils/storage";

const { width } = Dimensions.get("window");

const BuyCreditsScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();
  const [credits, setCredits] = useState(200);
  const [selectedMethod, setSelectedMethod] = useState("JazzCash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const packages = [
    { label: "Starter", amount: 100, cost: 200, icon: "cube-outline" },
    { label: "Recommended", amount: 500, cost: 1000, icon: "star-outline", tag: "Best Value" },
    { label: "Professional", amount: 1000, cost: 2000, icon: "shield-check-outline" },
    { label: "Enterprise", amount: 5000, cost: 10000, icon: "lightning-bolt-outline" },
  ];

  const handleCustomInput = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCredits(numericValue ? parseInt(numericValue, 10) : 0);
  };

  const adjustCredits = (amount) => {
    setCredits((prev) => Math.max(50, prev + amount));
  };

  const handlePurchase = async () => {
    if (credits < 50) {
      alert("Minimum purchase amount is 50 credits.");
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway loading steps
    setTimeout(async () => {
      try {
        const updatedCredits = (user?.credits || 0) + credits;
        const updatedUser = { ...user, credits: updatedCredits };
        
        // Update local Context state
        setUser(updatedUser);
        
        // Persist local user state
        await storage.setItem("userData", JSON.stringify(updatedUser));
        
        setIsProcessing(false);
        setShowModal(true);
      } catch (err) {
        console.error("Local persistence error:", err);
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up Credits</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Wallet Balance Summary Card */}
        <LinearGradient
          colors={["#2D6A4F", "#52B788"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="rgba(255,255,255,0.8)" />
          </View>
          <Text style={styles.balanceAmount}>{user?.credits || 0} Credits</Text>
          <Text style={styles.balanceSub}>1 Credit = ₨ 2 PKR</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Select Credit Package</Text>
        
        {/* Packages Grid */}
        <View style={styles.packageGrid}>
          {packages.map((pkg, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setCredits(pkg.amount)}
              style={[
                styles.packageCard,
                credits === pkg.amount && styles.activePackageCard,
              ]}
            >
              {pkg.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{pkg.tag}</Text>
                </View>
              )}
              <MaterialCommunityIcons
                name={pkg.icon}
                size={28}
                color={credits === pkg.amount ? COLORS.primary : COLORS.gray}
              />
              <Text style={[styles.packageLabel, credits === pkg.amount && styles.activePackageLabel]}>
                {pkg.label}
              </Text>
              <Text style={styles.packageCredits}>{pkg.amount} CR</Text>
              <Text style={styles.packageCost}>₨ {pkg.cost}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Custom Amount</Text>
        
        {/* Custom Calculator Box */}
        <View style={styles.customCalculator}>
          <TouchableOpacity onPress={() => adjustCredits(-50)} style={styles.calcBtn}>
            <Feather name="minus" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.amountInputWrapper}>
            <TextInput
              value={credits.toString()}
              onChangeText={handleCustomInput}
              keyboardType="numeric"
              style={styles.amountInput}
            />
            <Text style={styles.calcCrText}>Credits</Text>
          </View>

          <TouchableOpacity onPress={() => adjustCredits(50)} style={styles.calcBtn}>
            <Feather name="plus" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Pricing Summary Widget */}
        <View style={styles.costSummary}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Credits Selected</Text>
            <Text style={styles.costVal}>{credits} CR</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Rate</Text>
            <Text style={styles.costVal}>₨ 2.00 / CR</Text>
          </View>
          <View style={[styles.costRow, styles.costRowTotal]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₨ {credits * 2}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Payment Methods */}
        <View style={styles.methodList}>
          {["JazzCash", "Easypaisa"].map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setSelectedMethod(method)}
              style={[
                styles.methodCard,
                selectedMethod === method && styles.activeMethodCard,
              ]}
            >
              <View style={styles.methodLeft}>
                <View style={[
                  styles.radioOuter,
                  selectedMethod === method && styles.radioOuterActive,
                ]}>
                  {selectedMethod === method && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.methodName}>{method}</Text>
              </View>
              <View style={styles.mockLogoPlaceholder}>
                <Text style={styles.mockLogoText}>
                  {method === "JazzCash" ? "JC" : "EP"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Checkout CTA */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={isProcessing}
          style={styles.checkoutBtn}
        >
          {isProcessing ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color={COLORS.white} />
              <Text style={styles.checkoutBtnText}>Processing Secure payment...</Text>
            </View>
          ) : (
            <Text style={styles.checkoutBtnText}>Proceed to Pay ₨ {credits * 2}</Text>
          )}
        </TouchableOpacity>

        {/* Safety Note */}
        <View style={styles.safetyInfo}>
          <Feather name="shield" size={16} color={COLORS.gray} />
          <Text style={styles.safetyText}>
            Simulated Sandbox Mode. No actual Pakistani Rupees (PKR) will be charged.
          </Text>
        </View>
      </ScrollView>

      {/* Success Info Modal */}
      <InfoModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          navigation.goBack();
        }}
        title="Purchase Successful!"
        message={`Successfully purchased ${credits} credits.\nYour new balance is ${
          (user?.credits || 0)
        } credits.\nUse them for fracture detection and appointments!`}
        icon="check-circle"
        iconColor={COLORS.success}
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
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  backBtn: {
    padding: 4,
  },
  scroll: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  balanceCard: {
    padding: 22,
    borderRadius: 20,
    marginBottom: 25,
    ...SHADOWS.medium,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },
  balanceSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginVertical: 15,
  },
  packageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  packageCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    alignItems: "center",
    position: "relative",
  },
  activePackageCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#F4F9FC",
  },
  tagBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagBadgeText: {
    fontSize: 8,
    color: COLORS.white,
    fontWeight: "bold",
  },
  packageLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "600",
    marginTop: 6,
  },
  activePackageLabel: {
    color: COLORS.primary,
  },
  packageCredits: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginVertical: 4,
  },
  packageCost: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.subtext,
  },
  customCalculator: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  calcBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EBF5FB",
    alignItems: "center",
    justifyContent: "center",
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    minWidth: 70,
    padding: 0,
  },
  calcCrText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "600",
  },
  costSummary: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 25,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  costLabel: {
    color: COLORS.gray,
    fontSize: 13,
  },
  costVal: {
    fontWeight: "700",
    color: COLORS.text,
  },
  costRowTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: {
    fontWeight: "800",
    fontSize: 15,
    color: COLORS.text,
  },
  totalVal: {
    fontWeight: "900",
    fontSize: 20,
    color: COLORS.primary,
  },
  methodList: {
    marginBottom: 30,
  },
  methodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
  },
  activeMethodCard: {
    borderColor: COLORS.primary,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
  },
  mockLogoPlaceholder: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.lightGray,
  },
  mockLogoText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.gray,
  },
  checkoutBtn: {
    backgroundColor: COLORS.black,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  loaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  safetyInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  safetyText: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: "center",
    marginLeft: 6,
    lineHeight: 16,
  },
});

export default BuyCreditsScreen;
