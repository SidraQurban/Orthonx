import React, { useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { COLORS, SHADOWS, SIZES } from "../constants/Theme";

const InfoModal = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  buttonText = "OK", 
  onButtonPress,
  icon = "alert-circle",
  iconColor = COLORS.danger
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1);
      opacity.value = withDelay(100, withSpring(1));
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}10` }]}>
            <Feather name={icon} size={40} color={iconColor} />
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={onButtonPress || onClose}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>

          {onButtonPress && (
             <TouchableOpacity 
             style={styles.secondaryButton} 
             onPress={onClose}
           >
             <Text style={styles.secondaryButtonText}>Close</Text>
           </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    ...SHADOWS.dark,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.danger}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 25,
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 15,
    padding: 10,
  },
  secondaryButtonText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default InfoModal;
