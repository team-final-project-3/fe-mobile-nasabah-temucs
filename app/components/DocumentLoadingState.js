import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const DocumentLoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
    <Text>Memuat persyaratan...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentLoadingState;