import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, SHADOWS } from "../constants/Theme";

const ModernInput = ({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  togglePassword, 
  keyboardType = "default",
  autoCapitalize = "none" 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper, 
        isFocused && styles.inputWrapperFocused,
        SHADOWS.light
      ]}>
        <Feather 
          name={icon} 
          size={18} 
          color={isFocused ? COLORS.primary : COLORS.gray} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {togglePassword && (
          <TouchableOpacity onPress={togglePassword} style={styles.iconRight}>
            <Feather 
              name={secureTextEntry ? "eye-off" : "eye"} 
              size={18} 
              color={COLORS.gray} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    height: "100%",
  },
  iconRight: {
    padding: 5,
  }
});

export default ModernInput;
