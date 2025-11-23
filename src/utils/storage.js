// src/utils/storage.js
// 🔐 Storage Utility - AsyncStorage Wrapper
// แทนที่ sessionStorage ด้วย AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  /**
   * บันทึกข้อมูล
   */
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      console.log(`💾 Saved to storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${key}:`, error);
      return false;
    }
  }

  /**
   * อ่านข้อมูล
   */
  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      
      // พยายาม parse JSON ถ้าเป็น object
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`❌ Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * ลบข้อมูล
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ Removed from storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing ${key}:`, error);
      return false;
    }
  }

  /**
   * ลบข้อมูลทั้งหมด
   */
  async clear() {
    try {
      await AsyncStorage.clear();
      console.log('🧹 Storage cleared');
      return true;
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      return false;
    }
  }

  /**
   * ดึงข้อมูลหลายตัวพร้อมกัน
   */
  async multiGet(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result = {};
      values.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      return result;
    } catch (error) {
      console.error('❌ Error multi get:', error);
      return {};
    }
  }

  /**
   * บันทึกหลายตัวพร้อมกัน
   */
  async multiSet(keyValuePairs) {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      ]);
      await AsyncStorage.multiSet(pairs);
      console.log('💾 Multi set successful');
      return true;
    } catch (error) {
      console.error('❌ Error multi set:', error);
      return false;
    }
  }

  /**
   * ดึง keys ทั้งหมด
   */
  async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('❌ Error getting keys:', error);
      return [];
    }
  }
}

export default new Storage();
