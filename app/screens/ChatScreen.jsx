import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, SHADOWS, GRADIENTS } from "../constants/Theme";
import { useAuth } from "../context/AuthContext";
import { WS_URL } from "../api/apiClient";
import InfoModal from "../components/InfoModal";

const ChatScreen = ({ navigation }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! I'm your Orthonx AI assistant. How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const flatListRef = useRef();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!token) return;

    const connectSocket = () => {
      // Don't reconnect if already connected
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) return;

      const wsUrl = `${WS_URL}/api/v1/chat/ws?token=${token}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Chat connected");
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message" || data.type === "chunk") {
        // Simple logic: if chunk, update last bot message or add new one
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          // If the last message is already a streaming message from the bot, append text
          if (lastMsg && !lastMsg.isUser && lastMsg.id === "streaming") {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = { 
              ...lastMsg, 
              text: lastMsg.text + (data.text || "") 
            };
            return updatedMessages;
          }
          // Otherwise, start a new streaming message
          return [...prev, { id: "streaming", text: data.text || "", isUser: false }];
        });
        // We do NOT set isTyping(false) here, only on 'done'
      } else if (data.type === "done") {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.id === "streaming") {
            const finalMessages = [...prev];
            finalMessages[finalMessages.length - 1] = { 
              ...lastMsg, 
              id: `bot-${Date.now()}` 
            };
            return finalMessages;
          }
          return prev;
        });
        setIsTyping(false);
      } else if (data.type === "error") {
        setIsTyping(false);
        console.error("Chat error:", data.message);
        if (data.message?.toLowerCase()?.includes("credit")) {
          setShowErrorModal(true);
        }
      }
    };

      socket.onclose = () => {
        console.log("Chat disconnected");
        setIsConnected(false);
        // Only reconnect if the user is still on the chat page
        if (isMountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
             console.log("Attempting to reconnect chat...");
             connectSocket();
          }, 3000);
        }
      };

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [token]);

  const handleSend = () => {
    if (input.trim() === "") return;
    if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("Cannot send message: WebSocket is disconnected.");
      return;
    }

    const userMessage = { id: Date.now().toString(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    socketRef.current.send(JSON.stringify({ message: input }));
    setInput("");
    setIsTyping(true);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageRow, 
      { 
        justifyContent: item.isUser ? "flex-end" : "flex-start",
        alignSelf: item.isUser ? "flex-end" : "flex-start" 
      }
    ]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <Image 
            source={require("../../assets/fav_icon.png")} 
            style={{ width: 22, height: 22, resizeMode: 'contain' }} 
          />
        </View>
      )}
      {item.isUser ? (
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.messageBubble, 
            { 
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 20,
              ...SHADOWS.light
            }
          ]}
        >
          <Text style={[styles.messageText, { color: COLORS.white }]}>
            {item.text}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[
          styles.messageBubble, 
          { 
            backgroundColor: COLORS.white,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 4,
            borderWidth: 1,
            borderColor: COLORS.lightGray,
            ...SHADOWS.light
          }
        ]}>
          <Text style={[styles.messageText, { color: COLORS.text }]}>
            {item.text}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button & Branding */}
      <View style={styles.floatingControls}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Image 
            source={require("../../assets/fav_icon.png")} 
            style={{ width: 26, height: 26, resizeMode: 'contain', marginRight: 6 }} 
          />
          <Text style={styles.headerTitle}>Orthonx AI</Text>
          <View style={[styles.onlineDot, { backgroundColor: isConnected ? "#40C057" : "#FF6B6B" }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={COLORS.gray}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity 
              onPress={handleSend} 
              disabled={!input.trim() || !isConnected || isTyping}
              style={{ paddingBottom: 5 }}
            >
              <LinearGradient
                colors={(input.trim() && isConnected && !isTyping) ? GRADIENTS.primary : [COLORS.lightGray, COLORS.lightGray]}
                style={styles.sendButton}
              >
                <Feather name="send" size={18} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <InfoModal 
        visible={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title={!isConnected ? "Connection Lost" : "Insufficient Credits"}
        message={!isConnected ? "Could not connect to the Orthonx AI. Please check your network or server settings." : "You don't have enough credits to chat with the AI. Please check your profile."}
        icon={!isConnected ? "wifi-off" : "alert-circle"}
        iconColor={!isConnected ? COLORS.gray : COLORS.danger}
        buttonText="View Profile"
        onButtonPress={() => {
          setShowErrorModal(false);
          navigation.navigate("Profile");
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  floatingControls: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1000,
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginRight: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chatList: {
    padding: 15,
    paddingTop: 80, // Leave space for floating header
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 20,
    maxWidth: "85%",
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: "auto",
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  messageBubble: {
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  inputContainer: {
    padding: 15,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: '#F1F3F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    minHeight: 52,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 10,
    maxHeight: 120,
    marginLeft: 5,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 2,
    ...SHADOWS.light,
  },
});

export default ChatScreen;
