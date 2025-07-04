import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FooterText() {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        Dengan masuk atau mendaftar, kamu menyetujui{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('TermsAndConditionsScreen')}>
          Ketentuan Layanan
        </Text>{' '}
        dan{' '}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
          Kebijakan Privasi
        </Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ffff',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
