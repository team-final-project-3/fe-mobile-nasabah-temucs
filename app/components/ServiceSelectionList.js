import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ServiceItem from './ServiceItem'; 

const ServiceSelectionList = React.memo(({ services, selectedServiceIds, onServiceSelect }) => {
  const renderItem = useCallback(({ item }) => (
    <ServiceItem
      item={item}
      isSelected={selectedServiceIds.includes(item.id)}
      onSelect={onServiceSelect}
    />
  ), [selectedServiceIds, onServiceSelect]);

  return (
    <FlatList
      data={services}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.serviceList}
    />
  );
});

const styles = StyleSheet.create({
  serviceList: {
    paddingBottom: 20,
  },
});

export default ServiceSelectionList;