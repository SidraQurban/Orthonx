import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SignUpModal = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("User");
  const [showOptions, setShowOptions] = useState(false);
  return (
    <View>
      <View
        style={{
          marginTop: responsiveHeight(5),
          backgroundColor: "white",
          height: responsiveHeight(70),
          borderRadius: responsiveHeight(4),
          marginHorizontal: responsiveHeight(2),
        }}
      >
        <View style={{ marginTop: responsiveHeight(2), alignItems: "center" }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Create Account
          </Text>
        </View>
        <View style={{ marginTop: responsiveHeight(1), alignItems: "center" }}>
          <Text style={{ color: "#6c757d", fontSize: responsiveFontSize(1.8) }}>
            Join Orthonx for AI-powered diagnostics
          </Text>
        </View>

        <View style={{ marginHorizontal: responsiveHeight(2) }}>
          {/* Email */}
          <View style={{ marginTop: responsiveHeight(4) }}>
            <TextInput
              placeholder="Email / Username"
              style={{
                marginTop: responsiveHeight(1),
                borderWidth: 1,
                borderColor: "#ced4da",
                borderRadius: responsiveHeight(2),
                paddingLeft: responsiveHeight(4),
                backgroundColor: "#e9ecef",
                height: responsiveHeight(5.5),
              }}
            />
            <MaterialDesignIcons
              name="email-outline"
              color="#6c757d"
              size={19}
              style={{
                marginTop: responsiveHeight(-3.8),
                marginLeft: responsiveWidth(2),
              }}
            />
          </View>
          {/* Password */}
          <View style={{ marginTop: responsiveHeight(4) }}>
            <TextInput
              secureTextEntry={!showPassword}
              placeholder="Password"
              style={{
                marginTop: responsiveHeight(1),
                borderWidth: 1,
                borderColor: "#ced4da",
                borderRadius: responsiveHeight(2),
                paddingLeft: responsiveHeight(4),
                backgroundColor: "#e9ecef",
                height: responsiveHeight(5.5),
              }}
            />
            <SimpleLineIcons
              name="lock"
              color="#6c757d"
              size={18}
              style={{
                marginTop: responsiveHeight(-4),
                marginLeft: responsiveWidth(2),
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                marginLeft: responsiveWidth(73),
                marginTop: responsiveHeight(2.8),
              }}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>
          {/* Confirm Password */}
          <View style={{ marginTop: responsiveHeight(4) }}>
            <TextInput
              secureTextEntry={!showPassword}
              placeholder="Confirm Password"
              style={{
                marginTop: responsiveHeight(1),
                borderWidth: 1,
                borderColor: "#ced4da",
                borderRadius: responsiveHeight(2),
                paddingLeft: responsiveHeight(4),
                backgroundColor: "#e9ecef",
                height: responsiveHeight(5.5),
              }}
            />
            <SimpleLineIcons
              name="lock"
              color="#6c757d"
              size={18}
              style={{
                marginTop: responsiveHeight(-4),
                marginLeft: responsiveWidth(2),
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                marginLeft: responsiveWidth(73),
                marginTop: responsiveHeight(2.8),
              }}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#6c757d"
              />
            </TouchableOpacity>
          </View>
          {/* role */}
          <View>
            {/* signup btn */}
            <View
              style={{ alignItems: "center", marginTop: responsiveHeight(1) }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                activeOpacity={0.8}
                style={{
                  marginTop: responsiveHeight(4),
                  width: responsiveWidth(65),
                  alignSelf: "center",
                  // Shadow for Android
                  elevation: 8,
                  borderRadius: responsiveHeight(10),
                }}
              >
                <LinearGradient
                  colors={["#468FAF", "#00B4D8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: responsiveHeight(1.5),
                    borderRadius: responsiveHeight(10),
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: "bold",
                    }}
                  >
                    Sign Up
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {/* cont with */}
            <View>
              {/* already have an acc? */}
              <View
                style={{
                  marginTop: responsiveHeight(2),
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.75),
                  }}
                >
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text
                    style={{
                      color: "#468faf",
                      fontSize: responsiveFontSize(1.75),
                      marginLeft: responsiveWidth(1),
                    }}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{ alignItems: "center", marginTop: responsiveHeight(2) }}
              >
                <Text style={{ fontSize: responsiveFontSize(1.8) }}>
                  Or Continue with
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: responsiveHeight(2),
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: responsiveHeight(2),
                    padding: responsiveWidth(0.8),
                    marginHorizontal: responsiveWidth(2),
                    width: responsiveHeight(6),
                    height: responsiveHeight(6),
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 3,
                    shadowColor: "#000", //ios shadow
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                >
                  <Image
                    source={require("../../assets/google.png")}
                    style={{
                      resizeMode: "center",
                      height: responsiveHeight(6),
                      width: responsiveWidth(6),
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => navigation.navigate("PhoneSignup")}
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: responsiveHeight(2),
                    padding: responsiveWidth(0.8),
                    marginHorizontal: responsiveWidth(2),
                    width: responsiveHeight(6),
                    height: responsiveHeight(6),
                    alignItems: "center",
                    justifyContent: "center",
                    elevation: 3,
                    shadowColor: "#000", //ios shadow
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                  }}
                >
                  <Image
                    source={require("../../assets/phone.png")}
                    style={{
                      height: responsiveHeight(4),
                      width: responsiveHeight(4),
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUpModal;
