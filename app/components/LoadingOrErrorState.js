import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingOrErrorState({ loading, errorMessage, loadingMessage }) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F47B00" />
        <Text style={styles.text}>{loadingMessage}</Text>
      </View>
    );
  }

  if (errorMessage) {
    return <Text style={styles.error}>{errorMessage}</Text>;
  }

  return null;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  text: {
    marginTop: 10,
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 16,
  },
});
