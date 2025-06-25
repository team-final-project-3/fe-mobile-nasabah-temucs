import React from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import QueueCard from './QueueCard';

export default function QueueList({ queues, onRefresh, refreshing }) {
  const renderItem = ({ item }) => {
    return <QueueCard queue={item} />;
  };

  return (
    <FlatList
      data={queues}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
