import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TicketServiceDetail = ({ selectedServiceNames }) => {
  return (
    <View>
      {selectedServiceNames.length > 0 ? (
        <View style={styles.servicesList}>
          {selectedServiceNames.map((serviceName, index) => (
            <Text key={index} style={styles.serviceItem}>• {serviceName}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>Tidak ada layanan yang dipilih.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  servicesList: {
    paddingLeft: 10,
  },
  serviceItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    lineHeight: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default TicketServiceDetail;