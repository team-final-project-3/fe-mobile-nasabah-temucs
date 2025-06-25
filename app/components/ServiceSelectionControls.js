import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from './SearchBar'; 

const ServiceSelectionControls = React.memo(({ selectedCount, maxSelection, searchText, onSearchTextChange }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Jenis Layanan: ({selectedCount} dari {maxSelection} dipilih)</Text>
      <SearchBar
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
        placeholder="Cari jenis layanan..."
      />
    </View>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});

export default ServiceSelectionControls;