import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ServiceItem = React.memo(({ item, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => onSelect(item.id)}
    >
      <MaterialCommunityIcons
        name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={isSelected ? "#F47B00" : "gray"}
        style={styles.checkboxIcon}
      />
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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

export default ServiceItem;