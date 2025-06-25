import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Branch from './Branch';

const TicketBranchDetail = ({ branchData, userLocationData }) => {
  return (
    <View>
      {branchData ? (
        <Branch data={branchData} userLocation={userLocationData} />
      ) : (
        <Text style={styles.noDataText}>Detail cabang tidak ditemukan.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default TicketBranchDetail;