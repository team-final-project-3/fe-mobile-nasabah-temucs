import React, { useEffect, useRef, useState } from 'react';
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
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';

import { verifyOtp, resendOtp } from '../api/api';
import PopupError from '../components/PopupError';
import PopupSuccess from '../components/PopupSuccess';
import ResendOtpLink from '../components/ResendOtpLink';

const OTP_LENGTH = 6;
const RESEND_INTERVAL = 60;
const { width, height } = Dimensions.get('window');

export default function OtpRegistrasiScreen({ navigation, route }) {
  const [otpArray, setOtpArray] = useState(Array(OTP_LENGTH).fill(''));
  const [email, setEmail] = useState(route?.params?.email || '');
  const [cooldown, setCooldown] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (route?.params?.email) setEmail(route.params.email);
  }, [route?.params?.email]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (text, index) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otpArray];
      newOtp[index] = text;
      setOtpArray(newOtp);
      if (text && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otpArray.join('');
    if (!email || fullOtp.length !== OTP_LENGTH) {
      setErrorMessage(!email ? 'Email tidak ditemukan.' : 'Semua kolom harus diisi!');
      setShowError(true);
      return;
    }

    setLoadingVerify(true);
    try {
      await verifyOtp({ email, otp: fullOtp });
      setSuccessMessage('OTP berhasil diverifikasi!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigation.navigate('LoginScreen');
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || '';
      console.log("DEBUG Backend message:", msg);
      
      if (msg.toLowerCase().includes('otp salah')) {
        setErrorMessage('Kode OTP yang kamu masukkan salah. Silakan coba lagi.');
      } else {
        setErrorMessage('Terjadi kesalahan saat memverifikasi OTP. Silakan coba lagi.');
      }
      setShowError(true);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrorMessage('Email tidak ditemukan.');
      setShowError(true);
      return;
    }
    if (cooldown > 0) return;

    setLoadingResend(true);
    try {
      await resendOtp(email);
      setSuccessMessage('Kode OTP berhasil dikirim ulang ke email.');
      setShowSuccess(true);
      setCooldown(RESEND_INTERVAL);
    } catch (err) {
      setErrorMessage('Gagal mengirim ulang OTP. Silakan coba beberapa saat lagi.');
      setShowError(true);
    } finally {
      setLoadingResend(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="arrow-left" size={RFValue(24)} color="#000" />
              </TouchableOpacity>

              <Text style={styles.title}>Cek Email Anda</Text>
              <Text style={styles.subtitle}>
                Masukkan kode OTP dari email yang Anda berikan
              </Text>

              <View style={styles.otpContainer}>
                {otpArray.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={ref => (inputsRef.current[i] = ref)}
                    value={digit}
                    onChangeText={t => handleChange(t, i)}
                    onKeyPress={e => handleKeyPress(e, i)}
                    keyboardType="numeric"
                    maxLength={1}
                    allowFontScaling={false}
                    style={styles.otpInput}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, { opacity: otpArray.every(Boolean) ? 1 : 0.5 }]}
                onPress={handleVerify}
                disabled={!otpArray.every(Boolean) || loadingVerify}
              >
                {loadingVerify ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verifikasi Kode</Text>
                )}
              </TouchableOpacity>

              <ResendOtpLink
                cooldown={cooldown}
                loading={loadingResend}
                onPress={handleResendOtp}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <PopupError
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
      <PopupSuccess
        visible={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

const OTP_BOX_SIZE = (width - RFValue(40) - (OTP_LENGTH - 1) * RFValue(10)) / OTP_LENGTH;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: RFValue(20),
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
  },
  container: { flex: 1 },
  title: {
    fontSize: RFValue(20),
    fontWeight: '700',
    marginTop: RFValue(20),
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#6b7280',
    marginVertical: RFValue(10),
    textAlign: 'center',
    lineHeight: RFValue(20),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(20),
    marginBottom: RFValue(30),
  },
  otpInput: {
    width: OTP_BOX_SIZE,
    height: OTP_BOX_SIZE,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: RFValue(20),
    color: '#000',
  },
  button: {
    backgroundColor: '#f57c00',
    paddingVertical: RFValue(15),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: RFValue(14),
  },
});
