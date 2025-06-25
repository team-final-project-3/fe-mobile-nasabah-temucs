// LogoutPopup.jsx
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
import { MaterialCommunityIcons } from '@expo/vector-icons';


const STORAGE_KEYS = ['accessToken', 'refreshToken', 'userProfile'];
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const LogoutPopup = ({ visible, onCancel, onConfirm }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  /** Hapus token + verifikasi sukses */
  const clearAuthStorage = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(STORAGE_KEYS);

      // multiGet untuk cek sekaligus
      const [[, accessToken], [, refreshToken]] = await AsyncStorage.multiGet([
        'accessToken',
        'refreshToken',
      ]);

      const success = !accessToken && !refreshToken;
      ToastAndroid.show(
        success ? 'Logout berhasil!' : 'Logout gagal, coba lagi',
        ToastAndroid.SHORT,
      );

      if (!success) {
        console.log('❌ Token masih ada:', { accessToken, refreshToken });
      } else {
        console.log('✅ Token berhasil dihapus');
      }

      return success;
    } catch (err) {
      console.log('❌ Gagal menghapus token:', err);
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

    if (ok) onConfirm();              
  }, [clearAuthStorage, onConfirm]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
           <MaterialCommunityIcons name="emoticon-confused" size={36} color="white" />
          </View>
          <Text style={styles.title}>Apakah Anda Yakin?</Text>
          <Text style={styles.caption}>Anda akan keluar dari aplikasi ini</Text>

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
                <Text style={styles.logoutTxt}>Logout</Text>
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
    width: '80%',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  icon: { fontSize: 30, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  caption: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  iconCircle: {
  backgroundColor: '#E78C26',
  borderRadius: 50,
  padding: 16,
  marginBottom: 10,
  alignItems: 'center',
  justifyContent: 'center',
},
  cancelTxt: { color: '#374151', fontWeight: 'bold' },
  logoutTxt: { color: '#fff', fontWeight: 'bold' },
});

export default LogoutPopup;
