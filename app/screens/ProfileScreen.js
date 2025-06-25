import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { User, ChevronRight, Lock, Info } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import Header from '../components/Header';
import LogoutPopup from '../components/PopupLogout';
import LogoutButton from '../components/LogoutButton';
import { getProfile } from '../api/api';

const { width, height } = Dimensions.get('window');
const scale = (s) => (width / 375) * s;
const vertical = (s) => (height / 812) * s;
const moderate = (s, f = 0.5) => s + (scale(s) - s) * f;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data.user);
    } catch (err) {
      Alert.alert('Gagal memuat profil', err?.response?.data?.message || err.message);
    } finally {
      await sleep(200);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const formatDate = useCallback(
    (d) =>
      new Date(d).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const userInfo = useMemo(() => {
    if (!profile) return [];
    return [
      ['Nama Lengkap', profile.fullname || '-'],
      ['No.Telp', profile.phoneNumber || '-'],
      ['Email', profile.email || '-'],
      ['Bergabung sejak', profile.createdAt ? formatDate(profile.createdAt) : '-'],
    ];
  }, [profile, formatDate]);

  const menuOptions = useMemo(
    () => [
      {
        icon: <Lock color="#fb923c" size={moderate(20)} />,
        label: 'Ubah Kata Sandi',
        onPress: () => navigation.navigate('ChangePasswordScreen'),
      },
      {
        icon: <Info color="#38bdf8" size={moderate(20)} />,
        label: 'Tentang Aplikasi',
        onPress: () => navigation.navigate('AboutUsScreen'),
      },
    ],
    [navigation]
  );

  const handleLogout = useCallback(async () => {
    await AsyncStorage.multiRemove(['authToken', 'userId']);
    navigation.replace('LoginScreen');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header isProfil />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#053F5C', '#0B85C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileCard}
        >
          <User color="#fff" size={moderate(40)} />
          <Text style={styles.usernameText} numberOfLines={1}>
            {profile?.username ?? 'Memuat...'}
          </Text>
        </LinearGradient>

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <View style={styles.infoBox}>
            {userInfo.map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </View>
        )}

        <View style={styles.menuBox}>
          {menuOptions.map(({ icon, label, onPress }, i) => (
            <TouchableOpacity
              key={label}
              style={[styles.menuItem, i < menuOptions.length - 1 && styles.menuItemBorder]}
              onPress={onPress}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={styles.menuItemLeft}>
                {icon}
                <Text style={styles.menuLabel} numberOfLines={1}>{label}</Text>
              </View>
              <ChevronRight color="#9ca3af" size={moderate(16)} />
            </TouchableOpacity>
          ))}
        </View>

        <LogoutButton onPress={() => setLogoutModalVisible(true)} />
        <LogoutPopup
          visible={logoutModalVisible}
          onCancel={() => setLogoutModalVisible(false)}
          onConfirm={handleLogout}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = React.memo(({ label, value }) => (
  <View style={styles.inputBox}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.disabledInput}>
      <Text style={styles.inputValue} numberOfLines={1}>{value}</Text>
    </View>
  </View>
));

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  scrollContent: {
    padding: moderate(16),
    paddingBottom: vertical(40),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderate(16),
    borderRadius: moderate(16),
    marginBottom: moderate(16),
    height: moderate(80),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  usernameText: {
    color: '#fff',
    fontSize: moderate(16),
    marginLeft: moderate(12),
    fontWeight: '600',
    flexShrink: 1,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: moderate(16),
    padding: moderate(16),
    marginBottom: moderate(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputBox: {
    marginBottom: moderate(12),
  },
  inputLabel: {
    fontSize: moderate(14),
    color: '#374151',
    marginBottom: moderate(4),
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: moderate(8),
    paddingVertical: moderate(10),
    paddingHorizontal: moderate(12),
  },
  inputValue: {
    color: '#111827',
    fontSize: moderate(14),
  },
  menuBox: {
    backgroundColor: '#fff',
    borderRadius: moderate(16),
    overflow: 'hidden',
    marginBottom: moderate(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderate(14),
    paddingHorizontal: moderate(16),
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  menuLabel: {
    marginLeft: moderate(12),
    color: '#374151',
    fontSize: moderate(14),
    flexShrink: 1,
  },
});
