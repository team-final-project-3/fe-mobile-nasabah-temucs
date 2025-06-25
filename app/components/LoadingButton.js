import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function LoadingButton({ onPress, isLoading, text, style, textStyle, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, isLoading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#053F5C',
    paddingVertical: RFValue(12),
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: RFValue(14),
    marginBottom: RFValue(16),
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: RFValue(14),
  },
});
