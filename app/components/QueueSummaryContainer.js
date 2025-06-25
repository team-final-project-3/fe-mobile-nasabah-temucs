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
  const isCompact = width < 360; // Threshold lebar layar

  if (isCompact) {
    // Layar kecil: 1 atas, 2 bawah
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
          {showWaiting && (
            <View style={styles.flexBox}>
              <QueueDisplayBox
                title="Antrean Saat Ini"
                value={waiting.toString()}
                valueColor="#E67E22"
                borderColor="#E67E22"
              />
            </View>
          )}
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

  // Layout default: 3 bersampingan
  return (
    <View style={styles.cardContainer}>
      <View style={styles.rowWrapper}>
        <View style={styles.flexBox}>
          <QueueDisplayBox
            title="Sedang Dilayani"
            value={lastServed}
            valueColor="#3498DB"
            borderColor="#3498DB"
          />
        </View>
        {showWaiting && (
          <View style={styles.flexBox}>
            <QueueDisplayBox
              title="Antrean Saat Ini"
              value={waiting.toString()}
              valueColor="#E67E22"
              borderColor="#E67E22"
            />
          </View>
        )}
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
    marginVertical: 16,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
