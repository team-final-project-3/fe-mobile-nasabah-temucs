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
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { resetPassword } from '../api/api';

const { width, height } = Dimensions.get('window');

const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const { email = '' } = useRoute().params || {};

 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState({ password: true, confirm: true });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  
const validatePasswords = () => {
  const newErrors = {};

  if (!email) {
    newErrors.password = 'Email tidak ditemukan. Silakan ulangi proses verifikasi.';
    return newErrors;
  }

  if (!password.trim()) {
    newErrors.password = 'Password tidak boleh kosong';
    return newErrors;
  }

  if (!confirmPassword.trim()) {
    newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    return newErrors;
  }

  if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Konfirmasi tidak sama dengan password';
  }

  const rules = [];
  if (password.length < 8) rules.push('minimal 8 karakter');
  if (!/[A-Z]/.test(password)) rules.push('huruf besar');
  if (!/[a-z]/.test(password)) rules.push('huruf kecil');
  if (!/\d/.test(password)) rules.push('angka');
  if (!/[@$!%*#?&^_\-]/.test(password)) rules.push('simbol');

  if (rules.length > 0) {
    newErrors.password = `Password harus mengandung ${rules.join(', ')}`;
  }

  return newErrors;
};


  const handleSubmit = async () => {
    setIsLoading(true);
    const validationErrors = validatePasswords();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }
  
    try {
      await resetPassword({ email, newPassword: password });
      setErrors({});
      setIsSuccess(true);
    } catch (error) {
      setErrors({ password: error.message });
    } finally {
      setIsLoading(false);
    }
  };


  const renderInput = (
    label,
    value,
    onChangeText,
    secureTextEntry,
    toggleSecure,
    error,
    placeholder,
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          allowFontScaling={false}
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            setErrors({});
          }}
        />
        <TouchableOpacity
          onPress={toggleSecure}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={RFValue(20)}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

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
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backIcon}
            >
              <Icon name="arrow-left" size={RFValue(24)} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Buat Password Baru</Text>
            <Text style={styles.subtitle}>
              Buat kata sandi baru yang berbeda dari sebelumnya demi keamanan
            </Text>

            {renderInput(
              'Password',
              password,
              setPassword,
              secure.password,
              () =>
                setSecure((prev) => ({ ...prev, password: !prev.password })),
              errors.password,
              'Masukkan Kata Sandi baru',
            )}

            {renderInput(
              'Konfirmasi Password',
              confirmPassword,
              setConfirmPassword,
              secure.confirm,
              () =>
                setSecure((prev) => ({ ...prev, confirm: !prev.confirm })),
              errors.confirmPassword,
              'Ulang Kata Sandi',
            )}

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Ubah Kata Sandi</Text>
              )}
            </TouchableOpacity>


            {isSuccess && (
              <View style={styles.successPopup}>
                <Text style={styles.successText}>
                  Password berhasil diubah!
                </Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setIsSuccess(false);
                    navigation.navigate('LoginScreen');
                  }}
                >
                  <Text style={styles.successButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewPasswordScreen;


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.05,
  },


  backIcon: { marginBottom: RFValue(10) },


  title: {
    fontSize: RFValue(20),
    fontWeight: '700',
    marginTop: RFValue(10),
    color: '#000',
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#777',
    marginVertical: RFValue(10),
    lineHeight: RFValue(20),
  },


  label: {
    fontWeight: '600',
    marginTop: RFValue(20),
    fontSize: RFValue(14),
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: RFValue(10),
    marginTop: RFValue(5),
  },
  input: {
    flex: 1,
    paddingVertical: RFValue(10),
    fontSize: RFValue(14),
    color: '#000',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: {
    color: '#ef4444',
    fontSize: RFValue(12),
    marginTop: RFValue(4),
  },


  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: RFValue(15),
    borderRadius: 8,
    marginTop: RFValue(30),
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: RFValue(14),
  },


  successPopup: {
    position: 'absolute',
    top: '40%',
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: RFValue(20),
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  successText: {
    fontSize: RFValue(16),
    fontWeight: '700',
    marginBottom: RFValue(15),
    textAlign: 'center',
    color: '#000',
  },
  successButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: 8,
  },
  successButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: RFValue(14),
  },
});
