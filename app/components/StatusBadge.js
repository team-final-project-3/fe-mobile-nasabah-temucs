import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const statusMap = {
  done: {
    label: 'Selesai',
    backgroundColor: '#d4edda',
    textColor: '#155724',
  },
  inprogress: {
    label: 'Sedang Berjalan',
    backgroundColor: '#fff3cd',
    textColor: '#856404',
  },
  canceled: {
    label: 'Dibatalkan',
    backgroundColor: '#f8d7da',
    textColor: '#721c24',
  },
  waiting: {
    label: 'Menunggu',
    backgroundColor: '#cce5ff',
    textColor: '#004085',
  },
  skipped: {
    label: 'Dilewati',
    backgroundColor: '#e2e3e5',
    textColor: '#383d41',
  },
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();
  const {
    label,
    backgroundColor,
    textColor,
  } = statusMap[normalizedStatus] || {
    label:
      normalizedStatus?.charAt(0).toUpperCase() +
        normalizedStatus?.slice(1) ||
      'Tidak Dikenal',
    backgroundColor: '#f1f1f1',
    textColor: '#6c757d',
  };

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
