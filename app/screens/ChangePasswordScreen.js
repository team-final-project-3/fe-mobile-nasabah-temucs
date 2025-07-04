import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../components/Header';
import { changePassword } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const scale = s => (width / 375) * s;
const vScale = s => (height / 812) * s;
const mScale = (s, f = 0.5) => s + (scale(s) - s) * f;

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({ old: '', new: '', confirm: '' });
  const [secure, setSecure] = useState({ old: true, new: true, confirm: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
    symbol: false,
  });

  const removeEmojis = text => text.replace(/[^\x20-\x7E]/g, '');

  const checkNewPasswordCriteria = (text) => {
    const cleaned = removeEmojis(text.replace(/\s/g, ''));
    setForm(p => ({ ...p, new: cleaned }));
    setErrors(p => ({ ...p, new: '' }));
    setPasswordCriteria({
      length: cleaned.length >= 8,
      upper: /[A-Z]/.test(cleaned),
      lower: /[a-z]/.test(cleaned),
      digit: /\d/.test(cleaned),
      symbol: /[@$!%*#?&^_\-]/.test(cleaned),
    });
  };

  const validate = () => {
    const err = {};
    if (!form.old) err.old = 'Password lama wajib diisi';
    if (!form.new) err.new = 'Password baru wajib diisi';
    if (!form.confirm) err.confirm = 'Konfirmasi password wajib diisi';
    if (form.new && form.confirm && form.new !== form.confirm)
      err.confirm = 'Konfirmasi tidak cocok';
    if (form.old && form.new && form.old === form.new)
      err.new = 'Password baru harus berbeda dari lama';

    const rules = [];
    if (form.new.length < 8) rules.push('minimal 8 karakter');
    if (!/[A-Z]/.test(form.new)) rules.push('huruf besar');
    if (!/[a-z]/.test(form.new)) rules.push('huruf kecil');
    if (!/\d/.test(form.new)) rules.push('angka');
    if (!/[@$!%*#?&^_\-]/.test(form.new)) rules.push('simbol');

    if (rules.length && !err.new) {
      err.new = `Password harus mengandung ${rules.join(', ')}`;
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await changePassword(token, form.old, form.new);
      setSuccess(true);
    } catch (err) {
      const msg = err?.message || '';
      if (msg === 'Password lama tidak sesuai')
        setErrors({ old: 'Password lama tidak sesuai' });
      else if (msg === 'Password baru tidak boleh sama dengan lama')
        setErrors({ new: 'Password baru tidak boleh sama' });
      else
        setErrors({ old: msg });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, field, placeholder, secureTextEntry, onChangeText }) => (
    <View style={styles.fieldBox}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passBox}>
        <TextInput
          style={styles.passInput}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          value={form[field]}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecure(p => ({ ...p, [field]: !p[field] }))}>
          <Icon name={secureTextEntry ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
      {!!errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header isnewPass />
      <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={Platform.OS === 'ios' ? 40 : 60}
          contentContainerStyle={styles.scroll}
        >
          <Text style={styles.subtitle}>Ubah kata sandi akun kamu</Text>
          <Field
            label="Kata Sandi Lama"
            field="old"
            placeholder="Masukkan Kata Sandi Lama"
            secureTextEntry={secure.old}
            onChangeText={t => setForm(p => ({ ...p, old: t.replace(/\s/g, '') }))}
          />
          <Field
            label="Kata Sandi Baru"
            field="new"
            placeholder="Masukkan Kata Sandi Baru"
            secureTextEntry={secure.new}
            onChangeText={checkNewPasswordCriteria}
          />
          <Field
            label="Konfirmasi Kata Sandi"
            field="confirm"
            placeholder="Ulangi Kata Sandi"
            secureTextEntry={secure.confirm}
            onChangeText={t => setForm(p => ({ ...p, confirm: t.replace(/\s/g, '') }))}
          />

          <View style={styles.rulesBox}>
            <Text style={styles.rulesText}>Password harus mengandung:</Text>
            <RuleItem met={passwordCriteria.length} label="Minimal 8 karakter" />
            <RuleItem met={passwordCriteria.upper && passwordCriteria.lower} label="Huruf besar dan kecil" />
            <RuleItem met={passwordCriteria.digit} label="Angka" />
            <RuleItem met={passwordCriteria.symbol} label="Simbol (@$!%*#?&^_-)" />
          </View>

          {success && <Text style={[styles.success, { marginBottom: 10 }]}>Password berhasil diubah!</Text>}
        </KeyboardAwareScrollView>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Simpan</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const RuleItem = ({ met, label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <Icon name={met ? 'check-circle' : 'close-circle'} size={16} color={met ? '#10b981' : '#ef4444'} />
    <Text style={{ marginLeft: 8, color: met ? '#10b981' : '#ef4444', fontSize: RFValue(11) }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  subtitle: { fontSize: mScale(16), color: '#111827', fontWeight: '600', marginBottom: vScale(12) },
  fieldBox: { marginBottom: vScale(16) },
  label: { fontSize: mScale(14), color: '#374151', marginBottom: vScale(6), fontWeight: '500' },
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
  success: { color: '#10b981', fontSize: mScale(14), fontWeight: '600', textAlign: 'center' },
  rulesBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#f87171',
    paddingLeft: RFValue(12),
    marginBottom: vScale(16),
  },
  rulesText: { color: '#6b7280', fontSize: RFValue(12), marginBottom: RFValue(4) },
  btn: {
    backgroundColor: '#FF7A00',
    paddingVertical: vScale(14),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  btnText: { color: '#fff', fontSize: mScale(14), fontWeight: '600' },
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
