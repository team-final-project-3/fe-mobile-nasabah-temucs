import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TicketCard = ({ status, bankName, countdown, branchName, queueNumber, estimatedTime, ticketDate }) => {
  const isWaiting = status === 'waiting';

  return (
    <View style={styles.ticketCard}>
      <Text style={styles.bankName}>{bankName}</Text>
      <Text style={styles.ticketBranchName}>{branchName}</Text>

      <View style={styles.queueInfoContainer}>
        <Text style={styles.queueLabel}>Nomor Antrian Anda</Text>
        <Text style={styles.ticketQueueNumber}>{queueNumber}</Text>
      </View>

      {isWaiting && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimasi Dilayani</Text>
            <Text style={styles.estimatedTime}>{estimatedTime}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bersiaplah</Text>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
        </>
      )}

      <Text style={styles.ticketDate}>Tanggal Ambil Antrian: {ticketDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketCard: {
    width: '100%',
    backgroundColor: '#013A63',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 30,
  },
  bankName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
    opacity: 0.8,
  },
  ticketBranchName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  queueInfoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  queueLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.9,
  },
  ticketQueueNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 5,
  },
  estimatedTime: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countdown: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFEB3B',
  },
  ticketDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 20,
  },
});

export default TicketCard;