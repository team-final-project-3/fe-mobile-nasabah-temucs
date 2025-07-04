import React, { useRef, useState, useEffect } from 'react';
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
import ResendOtpLink from '../components/ResendOtpLink'; 
import Header from '../components/Header';         

const { width, height } = Dimensions.get('window');
const scale           = s => (width  / 375) * s;
const verticalScale   = s => (height / 812) * s;
const moderateScale   = (s, f = 0.5) => s + (scale(s) - s) * f;

const OTP_LENGTH = 6;
const OTP_GAP    = moderateScale(10);
const OTP_BOX_SIZE =
  (width - moderateScale(40) - (OTP_LENGTH - 1) * OTP_GAP) / OTP_LENGTH;

export default function OtpResetPasswordScreen({ navigation, route }) {
  const [otp, setOtp]               = useState(Array(OTP_LENGTH).fill(''));
  const [email]                     = useState(route?.params?.email ?? null);
  const [token]                     = useState(route?.params?.token ?? null);
  const [loading, setLoading]       = useState({ verify: false, resend: false });
  const [popup, setPopup]           = useState({ success: false, error: false, errorMessage: '' });
  const [cooldown, setCooldown]     = useState(0);

  const intervalRef = useRef(null);
  const inputsRef   = useRef([]);


  useEffect(() => () => clearInterval(intervalRef.current), []);


  const handleChange = (text, idx) => {
    if (/^\d$/.test(text) || text === '') {
      const newOtp = [...otp];
      newOtp[idx]  = text;
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
  console.log('[OTP Verify] Kode OTP yang dimasukkan:', fullOtp);
  if (fullOtp.length !== OTP_LENGTH) {
    console.log('[OTP Verify] OTP tidak lengkap');
    return;
  }

  setLoading((p) => ({ ...p, verify: true }));

  try {
    await verifyOtpForgot(email, fullOtp);
    console.log('[OTP Verify] Verifikasi berhasil, pindah ke NewPasswordScreen');
    navigation.navigate('NewPasswordScreen', { email });
  } catch (err) {
    console.error('Verifikasi OTP gagal:', err);


    const message = err?.response?.data?.message?.toLowerCase() || '';

    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    if (message.includes('otp salah') || message.includes('invalid otp')) {
      errorMessage = 'Kode OTP yang kamu masukkan salah. Silakan coba lagi.';
    }

    setPopup({ success: false, error: true, errorMessage });
  } finally {
    setLoading((p) => ({ ...p, verify: false }));
  }
};


  const handleResendOtp = async () => {
    if (!email || cooldown > 0) {
    console.log('[Resend OTP] Tidak dapat mengirim ulang saat cooldown:', cooldown); 
    return;
  }

    setLoading(p => ({ ...p, resend: true }));
     console.log('[Resend OTP] Mengirim ulang OTP ke:', email);
    try {
      await resendOtp(email, token);
      console.log('[Resend OTP] OTP berhasil dikirim ulang');
      setPopup({ success: true, error: false, errorMessage: '' });


      setCooldown(60);
      intervalRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
            <View style={styles.container}>

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

              <View style={{ marginTop: verticalScale(20) }}>
                <ResendOtpLink
                  cooldown={cooldown}
                  loading={loading.resend}
                  onPress={handleResendOtp}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>


      <PopupSuccess
        visible={popup.success}
        onClose={() => setPopup(p => ({ ...p, success: false }))}
        message="Kode OTP berhasil dikirim ulang ke email."
      />
      <PopupError
        visible={popup.error}
        onClose={() => setPopup(p => ({ ...p, error: false }))}
        message={popup.errorMessage}
      />
    </>
  );
}


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
});