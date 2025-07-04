import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { forgotPassword } from '../api/api';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
  React.useCallback(() => {
    setLoading(false);   
    setError('');        
    return () => {};
  }, [])
);

  const validateEmail = (value) => {
    if (!value.trim()) return 'Email tidak boleh kosong';
    if (!value.includes('@')) return 'Email harus mengandung karakter "@"';
    return;
  };

const handleSubmit = async () => {
  const errorMsg = validateEmail(email);
  if (errorMsg) {
    console.log('[ForgotPassword] Validasi gagal:', errorMsg);
    setError(errorMsg);
    return;
  }

  setError('');
  setLoading(true);
  console.log('[ForgotPassword] Mengirim permintaan lupa password untuk:', email);

  try {
    const result = await forgotPassword(email);
    console.log('[ForgotPassword] Respons berhasil:', result);
    navigation.navigate('OtpResetPasswordScreen', {
      email,
      userId: result?.userId,
    });
  } catch (err) {
    console.log('[ForgotPassword] Gagal mengirim OTP:', err.message);
    setError(err.message); 
    setLoading(false);
  }
};
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
            <Header isResetPass/>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.subtitle}>
              Masukkan email Anda untuk membuat kata sandi baru
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              placeholder="Masukkan Email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, error && styles.inputError]}
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Kirim OTP</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
  },
  backButton: {
    marginBottom: height * 0.025,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: '600',
    marginBottom: RFValue(8),
    color: '#000',
  },
  subtitle: {
    fontSize: RFValue(12),
    color: '#6b7280',
    marginBottom: RFValue(28),
    lineHeight: RFValue(20),
  },
  label: {
    fontSize: RFValue(12),
    marginBottom: RFValue(6),
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(14),
    fontSize: RFValue(12),
    color: '#000',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: RFValue(12),
    marginTop: RFValue(6),
    marginBottom: RFValue(12),
  },
  button: {
    backgroundColor: '#f97316',
    paddingVertical: RFValue(14),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: RFValue(38),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: RFValue(14),
  },
});