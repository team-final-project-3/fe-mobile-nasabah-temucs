import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import QueueDisplayBox from './QueueDisplayBox';

export default function QueueSummaryContainer({
  lastServed,
  waiting,
  totalQueue,
  showWaiting = true,
}) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  if (isCompact) {
   
    return (
      <View style={styles.cardContainer}>
        <View style={styles.singleRow}>
          <QueueDisplayBox
            title="Sedang Dilayani"
            value={lastServed}
            valueColor="#3498DB"
            borderColor="#3498DB"
          />
        </View>
        <View style={styles.rowWrapper}>
         
          <View style={styles.flexBox}>
            <QueueDisplayBox
              title="Total Antrean"
              value={totalQueue.toString()}
              valueColor="#757575"
              borderColor="#9E9E9E"
            />
          </View>
        </View>
      </View>
    );
  }

 
  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.flexBox}>
          <QueueDisplayBox
            title="Sedang Dilayani"
            value={lastServed}
            valueColor="#757575"
            borderColor="#757575"
          />
        </View>
        <View style={styles.flexBox}>
          <QueueDisplayBox
            title="Total Antrean"
            value={totalQueue.toString()}
            valueColor="#757575"
            borderColor="#9E9E9E"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 20,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  singleRow: {
    marginBottom: 8,
  },
  flexBox: {
    flex: 1,
  },
});