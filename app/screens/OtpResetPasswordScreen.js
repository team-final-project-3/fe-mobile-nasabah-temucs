import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
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
import Icon from 'react-native-vector-icons/Feather';
import PopupSuccess from '../components/PopupSuccess';
import PopupError from '../components/PopupError';
import { verifyOtpForgot, resendOtp } from '../api/api';

const { width, height } = Dimensions.get('window');
const scale = s => (width / 375) * s;
const verticalScale = s => (height / 812) * s;
const moderateScale = (s, f = 0.5) => s + (scale(s) - s) * f;

const OTP_LENGTH = 6;
const OTP_GAP = moderateScale(10);
const OTP_BOX_SIZE =
  (width - moderateScale(40) - (OTP_LENGTH - 1) * OTP_GAP) / OTP_LENGTH;

const OtpResetPasswordScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [email] = useState(route?.params?.email ?? null);
  const [token] = useState(route?.params?.token ?? null);
  const [loading, setLoading] = useState({ verify: false, resend: false });
  const [popup, setPopup] = useState({ success: false, error: false, errorMessage: '' });
  const inputsRef = useRef([]);

  const handleChange = (text, idx) => {
    if (/^\d$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < OTP_LENGTH - 1) inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && otp[idx] === '' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== OTP_LENGTH) return;
  
    setLoading(p => ({ ...p, verify: true }));
    try {
      await verifyOtpForgot(email, fullOtp);
      navigation.navigate('NewPasswordScreen', { email });
    } catch (err) {
      console.error('Verifikasi OTP gagal:', err);
      let errorMessage = err.response?.data?.message || 'OTP salah atau expired';
      if (errorMessage.toLowerCase().includes('invalid otp')) {
        errorMessage = 'OTP tidak sesuai';
      }
      setPopup({ success: false, error: true, errorMessage });
    } finally {
      setLoading(p => ({ ...p, verify: false }));
    }
  };
  
  const handleResendOtp = async () => {
    if (!email) return;
    setLoading(p => ({ ...p, resend: true }));
    try {
      await resendOtp(email, token);
      setPopup({ success: true, error: false, errorMessage: '' });
    } catch (err) {
      console.error('Resend OTP error:', err);
      const errorMessage =
        err.response?.data?.message || 'Terjadi kesalahan saat mengirim ulang OTP.';
      setPopup({ success: false, error: true, errorMessage });
    } finally {
      setLoading(p => ({ ...p, resend: false }));
    }
  };
  
  const renderOtpInputs = () =>
    otp.map((digit, idx) => (
      <TextInput
        key={idx}
        ref={r => (inputsRef.current[idx] = r)}
        style={styles.otpInput}
        maxLength={1}
        keyboardType="numeric"
        value={digit}
        onChangeText={t => handleChange(t, idx)}
        onKeyPress={e => handleKeyPress(e, idx)}
        allowFontScaling={false}
      />
    ));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                <Icon name="arrow-left" size={moderateScale(24)} color="#000" />
              </TouchableOpacity>

              <Text style={styles.title}>Cek Email Anda</Text>
              <Text style={styles.subtitle}>
                Masukkan kode OTP yang dikirimkan ke email Anda
              </Text>

              <View style={styles.otpContainer}>{renderOtpInputs()}</View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { opacity: otp.every(Boolean) && !loading.verify ? 1 : 0.5 },
                ]}
                onPress={handleVerify}
                disabled={!otp.every(Boolean) || loading.verify}
              >
                {loading.verify ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verifikasi Kode</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.resendText}>
                Tidak menerima kode?{' '}
                <Text style={styles.link} onPress={handleResendOtp}>
                  {loading.resend ? 'Mengirim ulang...' : 'Kirim ulang'}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <PopupSuccess
        visible={popup.success}
        onClose={() => setPopup(p => ({ ...p, success: false }))}
        message="OTP berhasil dikirim ulang ke email Anda."
      />
      <PopupError
        visible={popup.error}
        onClose={() => setPopup(p => ({ ...p, error: false }))}
        message={popup.errorMessage}
      />
    </SafeAreaView>
  );
};

export default OtpResetPasswordScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
  },
  container: { flex: 1 },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#777',
    marginBottom: verticalScale(20),
    textAlign: 'center',
    lineHeight: moderateScale(18),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    gap: OTP_GAP,
  },
  otpInput: {
    width: OTP_BOX_SIZE,
    height: OTP_BOX_SIZE * 1.2,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: '#000',
  },
  button: {
    backgroundColor: '#f57c00',
    paddingVertical: verticalScale(14),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  resendText: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    color: '#777',
    fontSize: moderateScale(13),
  },
  link: { color: '#007BFF', fontWeight: '700' },
});
