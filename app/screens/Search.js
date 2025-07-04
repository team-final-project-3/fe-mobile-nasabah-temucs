import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BranchList from '../components/BranchList';


export default function Search() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleBranchPress = (branch) => {
    navigation.navigate('Ambilantre', { branchId: branch.id });
  };

  

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
    
      <Header isSearch />

      <View style={styles.searchBarWrapper}>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          placeholder="Cari cabang"
          containerStyle={styles.searchBarContainerOverride}
          inputStyle={styles.searchBarInputOverride}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={styles.filterText}>Semua</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'open' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('open')}
        >
          <Text style={styles.filterText}>Buka</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'closed' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('closed')}
        >
          <Text style={styles.filterText}>Tutup</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <BranchList
          onBranchPress={handleBranchPress}
          filterText={searchText}
          sortByDistance={true}
          scrollEnabled={true}
          statusFilter={statusFilter} 
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBarContainerOverride: {
    flex: 1,
    borderWidth: 0,
    marginVertical: 0,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 0,
  },
  searchBarInputOverride: {
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#1E4064',
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
