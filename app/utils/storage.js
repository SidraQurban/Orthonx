import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Super-defensive storage utility that silences native-missing warnings.
 * Attempts SecureStore -> AsyncStorage -> In-Memory
 */

// In-memory fallback
const memoryStorage = {};

const storage = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS !== 'web') {
        try {
          await SecureStore.setItemAsync(key, value);
          return;
        } catch (e) {
          // Fail silently and move to AsyncStorage
        }
      }
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },

  getItem: async (key) => {
    try {
      if (Platform.OS !== 'web') {
        try {
          const val = await SecureStore.getItemAsync(key);
          if (val !== null) return val;
        } catch (e) {
          // Fail silently and move to AsyncStorage
        }
      }
      try {
        const asyncVal = await AsyncStorage.getItem(key);
        if (asyncVal !== null) return asyncVal;
      } catch (e) {
        // Fail silently and move to memory
      }
      return memoryStorage[key] || null;
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },

  deleteItem: async (key) => {
    try {
      if (Platform.OS !== 'web') {
        try {
          await SecureStore.deleteItemAsync(key);
          return;
        } catch (e) {
          // Fail silently
        }
      }
      try {
        await AsyncStorage.removeItem(key);
      } catch (e) {
        // Fail silently
      }
    } catch (e) {
      // Fail silently
    } finally {
      delete memoryStorage[key];
    }
  }
};

export default storage;
