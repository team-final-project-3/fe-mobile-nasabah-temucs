import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ServiceSelectionHeader({ selectedCount, maxSelection }) {
  return (
    <Text style={styles.sectionTitle}>
      Jenis Layanan: ({selectedCount} dari {maxSelection} dipilih)
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});
