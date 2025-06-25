import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TicketInfoDetail = ({ queueNumber, estimatedWaitTime }) => {
  return (
    <View style={styles.detailTicketInfoBox}>
      <Text style={styles.ticketInfoTitle}>Informasi Antrean</Text>
      <Text style={styles.ticketDetailText}>Nomor Antrean: {queueNumber || 'Loading'}</Text>
      <Text style={styles.ticketDetailText}>Estimasi Waktu Tunggu: {estimatedWaitTime || 'Loading'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailTicketInfoBox: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#EBF8EE',
    borderRadius: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38A169',
    marginBottom: 10,
  },
  ticketDetailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
});

export default TicketInfoDetail;