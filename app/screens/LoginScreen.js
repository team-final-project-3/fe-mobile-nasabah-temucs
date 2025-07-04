import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { jwtDecode } from 'jwt-decode';
import { login , sendExpoPushToken} from '../api/api';
import LoadingButton from '../components/LoadingButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      ()=>true
    );
    return ()=>backHandler.remove()
  }, [])
const handleLogin = async () => {
  console.log('[LoginScreen] Tombol "Masuk" ditekan');

  const newErrors = {};
  if (!username.trim()) newErrors.username = 'Username tidak boleh kosong';
  if (!password.trim()) newErrors.password = 'Kata sandi tidak boleh kosong';
  else if (password.length < 8) newErrors.password = 'Kata sandi minimal 8 karakter';

  if (Object.keys(newErrors).length) {
    console.log('[LoginScreen] Validasi gagal:', newErrors);
    setErrors(newErrors);
    return;
  }

  setIsLoading(true);
  try {
    console.log('[LoginScreen] Mengirim data ke API login:', { username, password: '[TOKEN]' });
    const result = await login(username, password);
    console.log('[LoginScreen] Respons dari API login:', result);

    if (result.success) {
      const token = await AsyncStorage.getItem('authToken');
      console.log('[LoginScreen] Token diterima dari AsyncStorage:', token);
      let decoded;

      try {
        decoded = jwtDecode(token);
        console.log('[LoginScreen] Token berhasil didecode:', decoded);
      } catch (decodeErr) {
        console.log('[LoginScreen] Gagal mendekode token:', decodeErr);
        setErrors({ login: 'Token tidak valid. Silakan login ulang.' });
        return;
      }

      const role = (decoded?.role || '').trim().toLowerCase();
      if (role !== 'nasabah') {
        console.log('[LoginScreen] Akses ditolak. Role tidak valid:', role);
        setErrors({
          username: 'Akun tidak memiliki akses. Gunakan akun yang sesuai.',
          password: 'Akun tidak memiliki akses. Gunakan akun yang sesuai.',
        });
        return;
      }

      console.log('[LoginScreen] Login berhasil. Role:', role);
      const user = result.user || {};
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('userName', user.fullname || user.username || 'Pengguna');
      const userId = user.id || user.userId;
      if (userId) await AsyncStorage.setItem('userId', String(userId));
        const expoPushToken = await AsyncStorage.getItem('expoPushToken');
      if (expoPushToken) {
        console.log('[LoginScreen] Mengirim push token ke backend:', expoPushToken);
        await sendExpoPushToken(expoPushToken);
      }
      setErrors({});
      navigation.replace('Main');
    } else {
      const errorMessage = result.message?.toLowerCase() || '';
      const statusCode = result.code;
      console.log('[LoginScreen] Login gagal. Pesan:', result.message, 'Kode:', statusCode);

      if (errorMessage.includes('user') && errorMessage.includes('tidak ditemukan')) {
        setErrors({
          username: 'Akun belum ditemukan. Silakan daftar terlebih dahulu.',
          password: 'Akun belum ditemukan. Silakan daftar terlebih dahulu.',
        });
      } else if (errorMessage.includes('invalid') || errorMessage.includes('salah')) {
        setErrors({
          username: 'Username atau kata sandi salah',
          password: 'Username atau kata sandi salah',
        });
      } else if (statusCode === 500 || errorMessage.includes('server')) {
        setErrors({ login: 'Terjadi kesalahan di server. Silakan coba lagi nanti.' });
      } else if (statusCode === 429 || errorMessage.includes('too many')) {
        setErrors({ login: 'Terlalu banyak percobaan login. Coba lagi beberapa saat.' });
      } else {
        setErrors({ login: result.message || 'Login gagal' });
      }
    }
  } catch (err) {
    console.log('[LoginScreen] Kesalahan jaringan atau server:', err);
    setErrors({ login: 'Gagal menghubungi server. Periksa koneksi internet Anda.' });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#f97316" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            extraScrollHeight={Platform.OS === 'ios' ? 100 : 80}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.brandContainer}>
              <Image source={require('../../assets/logologin.png')} style={styles.brandLogoFull} />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>Masuk</Text>

              <Text style={styles.label}>Username</Text>
              <View style={[styles.input, errors.username && styles.inputError, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: RFValue(10) }]}>
                <Icon name="account-outline" size={RFValue(18)} color="#555" style={{ marginRight: RFValue(8) }} />
                <TextInput
                  value={username}
                  onChangeText={t => {
                    setUsername(t.replace(/\s/g, '').toLowerCase());
                    setErrors({});
                  }}
                  placeholder="Masukkan username"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  style={{ flex: 1, fontSize: RFValue(12), color: '#000' }}
                />
              </View>

              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

              <Text style={styles.label}>Kata Sandi</Text>
              <View style={styles.passwordContainer}>
              <View style={[styles.input, errors.password && styles.inputError, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: RFValue(10) }]}>
                <Icon name="lock-outline" size={RFValue(18)} color="#555" style={{ marginRight: RFValue(8) }} />
                <TextInput
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    setErrors({});
                  }}
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={{ flex: 1, fontSize: RFValue(12), color: '#000' }}
                />
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={RFValue(20)} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Lupa Kata Sandi</Text>
              </TouchableOpacity>
              <LoadingButton
                onPress={handleLogin}
                isLoading={isLoading}
                icon={<Icon name="login" size={RFValue(18)} color="#fff" />}
                text="Masuk"
              />

              <View style={styles.separatorContainer}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Atau</Text>
                <View style={styles.separatorLine} />
              </View>

              <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerButtonText}>Daftar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
              Dengan masuk atau mendaftar, kamu menyetujui{' '}
<Text style={styles.footerText}>
  Dengan masuk, Anda menyetujui{' '}
  <Text
    style={styles.linkText}
    onPress={() => navigation.navigate('TermsAndConditionsScreen')}
  >
    Ketentuan Layanan
  </Text>{' '}
  &{' '}
  <Text
    style={styles.linkText}
    onPress={() => navigation.navigate('PrivacyPolicyScreen')}
  >
    Kebijakan Privasi
  </Text>
  .
</Text>

            </Text>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f97316' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.02,
    backgroundColor: '#f97316',

  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: RFValue(24),
    
  },
  brandLogoFull: {
    width: RFValue(200),
    height: RFValue(70),
    resizeMode: 'contain',
  },
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: RFValue(22),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: RFValue(21),
    fontWeight: '600',
    color: '#000',
    marginBottom: RFValue(4),
    textAlign: 'center',
  },
  label: {
    fontSize: RFValue(13),
    fontWeight: '500',
    color: '#000',
    marginTop: RFValue(6),
    marginBottom: RFValue(6),
  },
  input: {
    backgroundColor: '#f3f4f6',
    paddingVertical: RFValue(5),
    paddingHorizontal: RFValue(0),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: RFValue(12),
    color: '#000',
    marginBottom: 10
  },
  passwordContainer: { position: 'relative', width: '100%' },
  passwordInput: { paddingRight: RFValue(40) },
  eyeIcon: { position: 'absolute', right: RFValue(12), top: RFValue(14) },
  inputError: { borderColor: '#ef4444' },
  errorText: {
    fontSize: RFValue(12),
    color: '#ef4444',
    marginTop: RFValue(4),
    
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotPasswordText: { fontSize: RFValue(10), color: '#4D81E7' },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: RFValue(12),
    
    
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#d1d5db' },
  separatorText: {
    marginHorizontal: RFValue(10),
    fontSize: RFValue(12),
    color: '#6b7280',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#f97316',
    paddingVertical: RFValue(12),
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: RFValue(12),
    fontWeight: '700',
    color: '#f97316',
  },
footerText: {
  fontSize: RFValue(10),
  color: '#ffffff',
  textAlign: 'center',
  lineHeight: RFValue(16),
  marginTop: '58'
},

  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: RFValue(10),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: RFValue(4),
  },
  iconLeft: {
    marginRight: RFValue(8),
  },
});
