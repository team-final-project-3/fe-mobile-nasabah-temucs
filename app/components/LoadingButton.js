import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function LoadingButton({ onPress, isLoading, text, style, textStyle, disabled, icon }) {
  return (
    <TouchableOpacity
      style={[styles.button, style, (isLoading || disabled) && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
        </View>
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
    justifyContent: 'center',
    marginTop: RFValue(14),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: RFValue(8),
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    fontSize: RFValue(12),
  },
});