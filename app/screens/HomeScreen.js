import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import MapPreview from '../components/MapPreview';
import BranchList from '../components/BranchList';

import { getAllBranches } from '../api/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userName, setUserName] = useState('');
  const [branchData, setBranchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [componentKey, setComponentKey] = useState(Date.now());

  useEffect(() => {
    initialLoad();
  }, []);

  const initialLoad = async () => {
    await Promise.all([
      loadUserName(),
      fetchBranches(),
    ]);
  };

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) setUserName(name);
    } catch (error) {
      console.error('Gagal ambil nama user:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await getAllBranches();
      setBranchData(res.branches || []);
    } catch (error) {
      console.error('Gagal ambil data cabang:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing semua komponen...');
    setRefreshing(true);
    await initialLoad();
    setComponentKey(Date.now()); 
    setRefreshing(false);
  };

  const handleBranchPress = (branch) => {
    navigation.navigate('Ambilantre', { branchId: branch.id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>

       
       <Header key={`header-${componentKey}`} userName={userName} style={styles.fixedHeader} />

      
        <View style={styles.innerContainer}>
        <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
          <SearchBar
            key={`search-${componentKey}`}
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />

          {searchText.length > 0 ? (
            <BranchList
            key={`branchListFiltered-${componentKey}`}
            branches={branchData.filter(branch => branch.isOpen)}
            onBranchPress={handleBranchPress}
            filterText={searchText}
            sortByDistance={true}
          />
          ) : (
            <>
              <MapPreview key={`map-${componentKey}`} />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Cabang Terdekat</Text>
                  <TouchableOpacity onPress={handleSearchPress}>
                    <Text style={styles.linkText}>Lihat Semua</Text>
                  </TouchableOpacity>
                </View>
                <BranchList
                  key={`branchListNearest-${componentKey}`}
                  branches={branchData.filter(branch => branch.isOpen)}
                  onBranchPress={handleBranchPress}
                  sortByDistance={true}
                  limit={5}
                />
              </View>
            </>
          )}

          <View style={styles.sectionpromo}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Promo & Informasi</Text>
            </View>
            <PromoBanner key={`promo-${componentKey}`} />
          </View>
          </ScrollView>
        </View>
      
   </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scrollContainer: {
    paddingBottom: 20,
    
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#F6F6F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    marginTop: -25, 
    minHeight: 800,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionpromo: {
    marginTop: 12,
    marginBottom:145,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#429EBD',
    fontWeight: '500',
    fontSize: 13,
  },
});
