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
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { changePassword } from '../api/api';
import LoadingButton from '../components/LoadingButton'; 

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState({ old: true, new: true, confirm: true });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const err = {};

    if (!oldPassword.trim()) err.oldPassword = 'Password lama tidak boleh kosong';
    if (!newPassword.trim()) err.newPassword = 'Password baru tidak boleh kosong';
    if (!confirmPassword.trim()) err.confirmPassword = 'Konfirmasi password tidak boleh kosong';
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      err.confirmPassword = 'Konfirmasi password tidak sama dengan password baru';

    if (oldPassword && newPassword && oldPassword === newPassword)
      err.newPassword = 'Password baru harus berbeda dari password lama';

    const rules = [];
    if (newPassword.length < 8) rules.push('minimal 8 karakter');
    if (!/[A-Z]/.test(newPassword)) rules.push('huruf besar');
    if (!/[a-z]/.test(newPassword)) rules.push('huruf kecil');
    if (!/\d/.test(newPassword)) rules.push('angka');
    if (!/[@$!%*#?&^_\-]/.test(newPassword)) rules.push('simbol');
    if (rules.length && !err.newPassword)
      err.newPassword = `Password harus mengandung ${rules.join(', ')}`;

    return err;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

try {
  const token = await AsyncStorage.getItem('accessToken');
  await changePassword(token, oldPassword, newPassword);
  setErrors({});
  setIsSuccess(true);
} catch (err) {
  const errorMessage = err?.message || '';

  if (errorMessage === 'Password lama tidak sesuai') {
    setErrors({ oldPassword: 'Password lama yang kamu masukkan tidak sesuai.' });
  } else if (errorMessage === 'Password baru tidak boleh sama dengan lama') {
    setErrors({ newPassword: 'Password baru tidak boleh sama dengan password lama.' });
  } else {
    setErrors({ oldPassword: errorMessage });
  }
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
    placeholder
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
          <Icon name={secureTextEntry ? 'eye-off' : 'eye'} size={RFValue(20)} color="#999" />
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
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
              <Icon name="arrow-left" size={RFValue(24)} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>Ubah Password</Text>
            <Text style={styles.subtitle}>
              Untuk keamanan akun Anda, gunakan kombinasi huruf besar, kecil, angka, dan simbol
            </Text>

            {renderInput(
              'Password Lama',
              oldPassword,
              setOldPassword,
              secure.old,
              () => setSecure((prev) => ({ ...prev, old: !prev.old })),
              errors.oldPassword,
              'Masukkan Password Lama'
            )}

            {renderInput(
              'Password Baru',
              newPassword,
              setNewPassword,
              secure.new,
              () => setSecure((prev) => ({ ...prev, new: !prev.new })),
              errors.newPassword,
              'Masukkan Password Baru'
            )}

            {renderInput(
              'Konfirmasi Password Baru',
              confirmPassword,
              setConfirmPassword,
              secure.confirm,
              () => setSecure((prev) => ({ ...prev, confirm: !prev.confirm })),
              errors.confirmPassword,
              'Ulangi Password Baru'
            )}

            {/* 🔄 Reusable LoadingButton */}
            <LoadingButton
              onPress={handleSubmit}
              isLoading={isLoading}
              text="Ubah"
              style={styles.button}        // override warna & margin
              textStyle={styles.buttonText} // konsisten dengan desain
              disabled={isLoading}
            />

            {isSuccess && (
              <View style={styles.successPopup}>
                <Text style={styles.successText}>Password berhasil diubah!</Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={() => {
                    setIsSuccess(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.successButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

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
    backgroundColor: '#FF7A00', // override warna default LoadingButton
    paddingVertical: RFValue(15),
    borderRadius: 8,
    marginTop: RFValue(30),
    alignItems: 'center',
  },
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
