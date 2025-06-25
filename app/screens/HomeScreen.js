import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import RefreshableScreen from '../components/RefreshableScreen';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import MapPreview from '../components/MapPreview';
import BranchList from '../components/BranchList';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) setUserName(name);
      } catch (error) {
        console.error('Gagal ambil nama user:', error);
      }
    };
    loadUserName();
  }, []);

  const handleBranchPress = (branch) => {
    navigation.navigate('Ambilantre', { branchId: branch.id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  return (
    <SafeAreaView style={styles.container}>
      <RefreshableScreen>
        <Header />
        <View style={styles.innerContainer}>
          <SearchBar
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />

          {searchText.length > 0 ? (
            <BranchList
              onBranchPress={handleBranchPress}
              filterText={searchText}
              sortByDistance={true}
            />
          ) : (
            <>
              <MapPreview />
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Cabang Terdekat</Text>
                  <TouchableOpacity onPress={handleSearchPress}>
                    <Text style={styles.linkText}>Lihat Semua</Text>
                  </TouchableOpacity>
                </View>
                <BranchList
                  onBranchPress={handleBranchPress}
                  sortByDistance={true}
                  limit={5}
                />
              </View>
            </>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Promo & Informasi</Text>
            </View>
            <PromoBanner />
          </View>
        </View>
      </RefreshableScreen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#F6F6F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    marginTop: -30,
    minHeight: 800,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#429EBD',
    fontWeight: '500',
    fontStyle: 'bold',
    fontSize: 13,
  },
});