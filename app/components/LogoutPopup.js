import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const STORAGE_KEYS = ['accessToken', 'refreshToken', 'userProfile'];
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const LogoutPopup = ({ visible, onCancel, onConfirm }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const clearAuthStorage = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(STORAGE_KEYS);
      const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
      ]);
      const success = !accessToken && !refreshToken;
      ToastAndroid.show(
        success ? 'Logout berhasil!' : 'Logout gagal, coba lagi',
        ToastAndroid.SHORT
      );
      return success;
    } catch (err) {
      ToastAndroid.show('Terjadi kesalahan saat logout', ToastAndroid.SHORT);
      return false;
    }
  }, []);

  const handleLogoutPress = useCallback(async () => {
    setLogoutLoading(true);
    await sleep(500);
    const ok = await clearAuthStorage();
    await sleep(300);
    setLogoutLoading(false);
    if (ok) {
      onConfirm();
    }
  }, [clearAuthStorage, onConfirm]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.contentRow}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="smile" size={74} color="#E78C26" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Apakah Anda Yakin?</Text>
              <Text style={styles.caption}>Anda akan keluar dari aplikasi ini</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={logoutLoading}
            >
              <Text style={styles.cancelTxt}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogoutPress}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.logoutTxt}>Keluar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    borderRadius: 999,
    padding: 14,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: '#6b7280',
  },
 actions: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 8,
},
cancelBtn: {
  flex: 1,
  borderColor: '#9CA3AF',
  borderWidth: 1,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: 'transparent',
  alignItems: 'center',
},
logoutBtn: {
  flex: 1,
  backgroundColor: '#EF4444',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
logoutTxt: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,          
  textAlign: 'center',  
  
},

})
export default LogoutPopup;