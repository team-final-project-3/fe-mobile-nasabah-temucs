import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatusBadge from './StatusBadge';
import { utcToZonedTime, format } from 'date-fns-tz';

export default function QueueCard({ queue }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetailHistory', {
      queueId: queue.id,
      branchId: queue.branchId,
      queueNumber: queue.ticketNumber,
      selectedServiceIds: queue.services.map(service => service.id),
      userLocationData: queue.userLocation,
    });
  };

  const getTimeZoneByBranch = (branchName) => {
    if (!branchName) return 'Asia/Jakarta';
    const name = branchName.toLowerCase();
    if (name.includes('papua') || name.includes('maluku')) return 'Asia/Jayapura';
    if (name.includes('bali') || name.includes('makassar') || name.includes('sulawesi') || name.includes('ntt')) return 'Asia/Makassar';
    return 'Asia/Jakarta';
  };

  const getTimeZoneLabel = (tz) => {
    switch (tz) {
      case 'Asia/Jayapura':
        return 'WIT';
      case 'Asia/Makassar':
        return 'WITA';
      case 'Asia/Jakarta':
      default:
        return 'WIB';
    }
  };

  let formattedDate = '-';
  if (queue?.bookingDate) {
    const timeZone = getTimeZoneByBranch(queue.branch?.name);
    const bookingDate = new Date(queue.bookingDate);
    const zonedDate = utcToZonedTime(bookingDate, timeZone);
    const formattedTime = format(zonedDate, 'dd/MM/yyyy HH:mm', { timeZone });
    const timeZoneLabel = getTimeZoneLabel(timeZone);
    formattedDate = `${formattedTime} ${timeZoneLabel}`;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.row}>
        <Text style={styles.ticketNumber}>{queue.ticketNumber}</Text>
        <StatusBadge status={queue.status} />
      </View>

      <Text style={styles.label}>Cabang: {queue.branch?.name || '-'}</Text>
      <Text style={styles.time}>Booking: {formattedDate}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    marginTop: 4,
    color: '#555',
    fontSize: 14,
  },
  time: {
    marginTop: 2,
    color: '#777',
    fontSize: 12,
  },
});
