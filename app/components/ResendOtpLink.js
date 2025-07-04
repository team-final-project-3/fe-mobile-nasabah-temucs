import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ResendOtpLink({ cooldown = 0, loading = false, onPress }) {
  const disabled = cooldown > 0 || loading;

  const label = loading
    ? 'Mengirim ulang...'
    : cooldown > 0
    ? `Kirim ulang dalam ${cooldown}s`
    : 'Kirim ulang';

  return (
    <Text style={styles.resendText}>
      Tidak mendapatkan kode?{' '}
      <Text
        style={[styles.link, { opacity: disabled ? 0.5 : 1 }]}
        onPress={!disabled ? onPress : undefined}
      >
        {label}
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  resendText: {
    marginTop: RFValue(20),
    textAlign: 'center',
    color: '#6b7280',
    fontSize: RFValue(12),
  },
  link: {
    color: '#007BFF',
    fontWeight: '700',
  },
});