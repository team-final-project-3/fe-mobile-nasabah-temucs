import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../api/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');
const scale = s => (width / 375) * s;
const vScale = s => (height / 812) * s;
const mScale = (s, f = 0.5) => s + (scale(s) - s) * f;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const inputRefs = useRef({});
  const scrollRef = useRef(null);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => {
    let cleaned = val;
    if (field === 'username') cleaned = val.toLowerCase().replace(/\s/g, '');
    if (field === 'phone') cleaned = val.replace(/\s/g, '');
    if (field === 'email') cleaned = val.trim();

    setForm(p => ({ ...p, [field]: cleaned }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const { fullName, username, email, phone, password } = form;
    const nErr = {};

    if (!fullName) nErr.fullName = 'Nama lengkap wajib diisi';
    if (!username) nErr.username = 'Username wajib diisi';
    else if (!/^[a-z0-9_]+$/.test(username))
      nErr.username = 'Username hanya boleh huruf kecil, angka, dan underscore (_) tanpa spasi';
    if (!email) nErr.email = 'Email wajib diisi';
    else if (email.includes(' ')) nErr.email = 'Email tidak boleh mengandung spasi';
    else if (!email.includes('@')) nErr.email = 'Email harus mengandung karakter "@"';
    if (!phone) nErr.phone = 'No telepon wajib diisi';
    else if (!/^\d+$/.test(phone)) nErr.phone = 'No telepon harus berupa angka tanpa spasi';
    else if (phone.length < 10) nErr.phone = 'No telepon minimal 10 digit';
    if (!password) nErr.password = 'Kata sandi wajib diisi';
    else {
      const checks = [
        { r: /.{8,}/, m: 'minimal 8 karakter' },
        { r: /[A-Z]/, m: 'huruf besar' },
        { r: /[a-z]/, m: 'huruf kecil' },
        { r: /\d/, m: 'angka' },
        { r: /[@$!%*#?&^_\-]/, m: 'simbol' },
      ];
      const fail = checks.filter(c => !c.r.test(password)).map(c => c.m);
      if (fail.length) nErr.password = `Kata sandi harus mengandung ${fail.join(', ')}`;
    }

    setErrors(nErr);
    return Object.keys(nErr).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      fullname: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
      phoneNumber: form.phone,
    };

    try {
      const d = await registerUser(payload);
      navigation.navigate('OtpRegistrasiScreen', {
        userId: d.userId,
        email: form.email,
      });
    } catch (error) {
      const data = error.response?.data || {};
      const msg = (data.message || error.message || '').toLowerCase();
      const details = data.errors || [];
      const newErr = {};

      if (msg.includes('sudah terdaftar')) {
        newErr.general = 'Data yang kamu gunakan sudah terdaftar. Silakan coba dengan data lain.';
      } else if (msg.includes('belum menjadi nasabah')) {
        newErr.general = 'Maaf, kamu belum menjadi nasabah. Silakan kunjungi cabang terdekat.';
      } else if (msg.includes('validation') && Array.isArray(details)) {
        details.forEach(errMsg => {
          const m = errMsg.toLowerCase();
          if (m.includes('invalid email')) newErr.email = 'Format email tidak valid.';
          if (m.includes('password must be at least'))
            newErr.password = 'Kata sandi minimal 6 karakter.';
          if (m.includes('phone number')) newErr.phone = 'No telepon harus 10–15 digit.';
        });
        if (!Object.keys(newErr).length) {
          newErr.general = 'Validasi gagal. Silakan periksa kembali data kamu.';
        }
      } else {
        newErr.general = data.message || error.message || 'Terjadi kesalahan. Silakan coba lagi.';
      }

      setErrors(newErr);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { l: 'Nama lengkap', k: 'fullName', p: 'Masukkan Nama Lengkap' },
    { l: 'Username', k: 'username', p: 'Masukkan Username', type: 'default' },
    { l: 'Email', k: 'email', p: 'Masukkan Email', type: 'email-address' },
    { l: 'No Telepon', k: 'phone', p: 'Masukkan No Telepon', type: 'phone-pad' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
              ref={scrollRef}
              enableOnAndroid
              extraScrollHeight={0}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scroll}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
              >
                <Icon name="arrow-left" size={mScale(24)} color="#000" />
              </TouchableOpacity>

              <Text style={styles.title}>Daftar</Text>
              <Text style={styles.subtitle}>Buat akun temuCS kamu</Text>

              {fields.map(({ l, k, p, type }) => (
                <View key={k} style={styles.fieldBox}>
                  <Text style={styles.label}>{l}</Text>
                  <TextInput
                    ref={r => (inputRefs.current[k] = r)}
                    style={styles.input}
                    placeholder={p}
                    placeholderTextColor="#9ca3af"
                    value={form[k]}
                    onChangeText={t => handleChange(k, t)}
                    keyboardType={type}
                    allowFontScaling={false}
                    autoCapitalize="none"
                    onFocus={() =>
                      scrollRef.current?.scrollToFocusedInput(inputRefs.current[k], 100)
                    }
                  />
                  {!!errors[k] && <Text style={styles.error}>{errors[k]}</Text>}
                </View>
              ))}

              <View style={styles.fieldBox}>
                <Text style={styles.label}>Kata Sandi</Text>
                <View style={styles.passBox}>
                  <TextInput
                    ref={r => (inputRefs.current.password = r)}
                    style={styles.passInput}
                    placeholder="Buat Kata Sandi"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={securePassword}
                    value={form.password}
                    onChangeText={t => handleChange('password', t)}
                    allowFontScaling={false}
                    autoCapitalize="none"
                    onFocus={() =>
                      scrollRef.current?.scrollToFocusedInput(inputRefs.current.password, 100)
                    }
                  />
                  <TouchableOpacity onPress={() => setSecurePassword(p => !p)}>
                    <Icon name={securePassword ? 'eye-off' : 'eye'} size={20} color="#999" />
                  </TouchableOpacity>
                </View>
                {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>

              {!!errors.general && <Text style={styles.error}>{errors.general}</Text>}

              {/* Spacer biar ga mentok */}
              <View style={{ height: 10 }} />
            </KeyboardAwareScrollView>

            {/* Tombol tetap di bawah layar */}
            <View style={styles.bottomArea}>
              <TouchableOpacity
                style={[styles.btn, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Daftar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scroll: {
    paddingHorizontal: mScale(20),
    paddingTop: vScale(30),
  },
  backBtn: { marginBottom: vScale(10) },
  title: {
    fontSize: mScale(24),
    fontWeight: '700',
    marginTop: vScale(10),
    color: '#000',
  },
  subtitle: {
    fontSize: mScale(14),
    color: '#777',
    marginVertical: vScale(10),
  },
  fieldBox: { marginTop: vScale(10) },
  label: {
    fontSize: mScale(14),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: mScale(15),
    paddingVertical: Platform.OS === 'android' ? vScale(8) : vScale(10),
    marginTop: vScale(6),
    fontSize: mScale(14),
    color: '#000',
  },
  passBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: mScale(15),
    paddingVertical: Platform.OS === 'android' ? vScale(8) : vScale(10),
    marginTop: vScale(6),
  },
  passInput: {
    flex: 1,
    fontSize: mScale(14),
    color: '#000',
  },
  error: {
    color: '#ef4444',
    marginTop: vScale(6),
    fontSize: mScale(13),
    flexWrap: 'wrap',
  },
  btn: {
    backgroundColor: '#FF7A00',
    paddingVertical: vScale(14),
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: mScale(16),
  },
  bottomArea: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
});
