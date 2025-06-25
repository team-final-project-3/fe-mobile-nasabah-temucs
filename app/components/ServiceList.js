import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ServiceList({
  services,
  selectedServiceIds,
  onServiceSelect,
  onRefresh,         
  refreshing = false 
}) {
  const renderServiceItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => onServiceSelect(item.id)}
    >
      <MaterialCommunityIcons
        name={selectedServiceIds.includes(item.id) ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={selectedServiceIds.includes(item.id) ? "#F47B00" : "gray"}
        style={styles.checkboxIcon}
      />
      <Text style={styles.serviceName}>{item.serviceName}</Text>
    </TouchableOpacity>
  ), [selectedServiceIds, onServiceSelect]);

  return (
    <FlatList
      data={services}
      renderItem={renderServiceItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.serviceList}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  serviceList: {
    paddingBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxIcon: {
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
