import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../api/api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';

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
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
    symbol: false,
  });

  const handleChange = (field, val) => {
    let cleaned = val;
    if (field === 'username') cleaned = val.toLowerCase().replace(/\s/g, '');
    if (field === 'phone') cleaned = val.replace(/\s/g, '');
    if (field === 'email') cleaned = val.trim();

    setForm(p => ({ ...p, [field]: cleaned }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const removeEmojis = text => text.replace(/[^\x20-\x7E]/g, '');

  const checkPasswordCriteria = (text) => {
    const cleaned = removeEmojis(text.replace(/\s/g, ''));
    setForm(p => ({ ...p, password: cleaned }));
    setErrors(p => ({ ...p, password: '' }));

    setPasswordCriteria({
      length: cleaned.length >= 8,
      upper: /[A-Z]/.test(cleaned),
      lower: /[a-z]/.test(cleaned),
      digit: /\d/.test(cleaned),
      symbol: /[@$!%*#?&^_\-]/.test(cleaned),
    });
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

    if (!form.confirmPassword) {
      nErr.confirmPassword = 'Konfirmasi kata sandi wajib diisi';
    } else if (form.confirmPassword !== form.password) {
      nErr.confirmPassword = 'Konfirmasi kata sandi tidak cocok';
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
    { l: 'Nama Lengkap', k: 'fullName', p: 'Masukkan Nama Lengkap' },
    { l: 'Username', k: 'username', p: 'Masukkan Username', type: 'default' },
    { l: 'Email', k: 'email', p: 'Masukkan Email', type: 'email-address' },
    { l: 'No Telepon', k: 'phone', p: 'Masukkan No Telepon', type: 'phone-pad' },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header isDaftar />
      <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
        <KeyboardAwareScrollView
          ref={scrollRef}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'ios' ? 40 : 60}
          contentContainerStyle={styles.scroll}
        >
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
                autoCapitalize="none"
              />
              {!!errors[k] && <Text style={styles.error}>{errors[k]}</Text>}
            </View>
          ))}

          {/* Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.passBox}>
              <TextInput
                style={styles.passInput}
                placeholder="Buat Kata Sandi"
                placeholderTextColor="#9ca3af"
                secureTextEntry={securePassword}
                keyboardType="visible-password"
                value={form.password}
                onChangeText={checkPasswordCriteria}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecurePassword(p => !p)}>
                <Icon name={securePassword ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <View style={styles.passBox}>
              <TextInput
                style={styles.passInput}
                placeholder="Ulangi Kata Sandi"
                placeholderTextColor="#9ca3af"
                secureTextEntry={securePassword}
                value={form.confirmPassword}
                onChangeText={t => {
                  const cleaned = removeEmojis(t.replace(/\s/g, ''));
                  handleChange('confirmPassword', cleaned);
                }}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecurePassword(p => !p)}>
                <Icon name={securePassword ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {!!errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
          </View>

          <View style={styles.rulesBox}>
            <Text style={styles.rulesText}>Password harus mengandung:</Text>
            <RuleItem met={passwordCriteria.length} label="Minimal 8 karakter" />
            <RuleItem met={passwordCriteria.upper && passwordCriteria.lower} label="Huruf besar dan kecil" />
            <RuleItem met={passwordCriteria.digit} label="Angka" />
            <RuleItem met={passwordCriteria.symbol} label="Simbol (@$!%*#?&^_-)" />
          </View>

          {!!errors.general && <Text style={styles.error}>{errors.general}</Text>}
        </KeyboardAwareScrollView>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Daftar</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const RuleItem = ({ met, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <Icon name={met ? 'check-circle' : 'close-circle'} size={16} color={met ? '#10b981' : '#ef4444'} />
    <Text style={{ marginLeft: 8, color: met ? '#10b981' : '#ef4444', fontSize: RFValue(13) }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  subtitle: { 
    fontSize: mScale(16), 
    color: '#111827', 
    fontWeight: '600', 
    marginBottom: vScale(16) 
  },
  
  fieldBox: { 
    marginBottom: vScale(16) 
  },
  label: {
     fontSize: mScale(14), 
     color: '#374151', 
     marginBottom: 
     vScale(6), 
     fontWeight: '600'
     },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: mScale(14),
    paddingVertical: Platform.OS === 'android' ? vScale(10) : vScale(12),
    fontSize: mScale(14),
    backgroundColor: '#fff',
    color: '#111827',
  },
  passBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: mScale(14),
    backgroundColor: '#fff',
  },
  passInput: { flex: 1, fontSize: mScale(14), color: '#111827' },
  error: { color: '#ef4444', fontSize: mScale(12), marginTop: vScale(4) },
  rulesBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#f87171',
    paddingLeft: RFValue(12),
    marginBottom: vScale(16),
  },
  rulesText: { color: '#6b7280', fontSize: RFValue(13), marginBottom: RFValue(4) },
  btn: {
    backgroundColor: '#FF7A00',
    paddingVertical: vScale(14),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  btnText: { 
    color: '#fff', 
    fontSize: mScale(14), 
    fontWeight: '600' 
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  scroll: {
    paddingHorizontal: mScale(20),
    paddingTop: vScale(30),
    paddingBottom: vScale(100),
  },
});
