import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QueueDisplayBox({ title, value, valueColor, borderColor }) {
  return (
    <View style={[styles.box, { borderColor }]}>
      <Text style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    maxWidth: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    maxWidth: '100%',
  },
});
