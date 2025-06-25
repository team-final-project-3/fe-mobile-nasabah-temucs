import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoRequirementsMessage = ({ message }) => (
  <View style={styles.noRequirementsContainer}>
    <Text style={styles.noRequirementsText}>
      {message}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  noRequirementsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noRequirementsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default NoRequirementsMessage;