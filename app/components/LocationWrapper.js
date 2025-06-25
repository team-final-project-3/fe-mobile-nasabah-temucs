import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import BranchCard from '../components/BranchCard';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import MapPreview from '../components/MapPreview';

import { getAllBranches } from '../api/api';
import { calculateDistance } from '../utils/distanceCalculator';

export default function LocationWrapper({ locationData }) {
  const { userLocation, loadingLocation, locationError } = locationData;
  const [branches, setBranches] = useState([]);
  const [displayedBranches, setDisplayedBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  const filteredBranches = displayedBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchText.toLowerCase())
  );

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

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await getAllBranches();
        setBranches(data.branches);
        setDisplayedBranches(data.branches);
      } catch (error) {
        setApiError('Gagal memuat data cabang.');
        console.error('Fetch branches error:', error);
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!userLocation || !userLocation.coords || branches.length === 0) return;
    const { latitude: userLat, longitude: userLon } = userLocation.coords;

    const sorted = branches
      .map(branch => {
        if (branch.latitude && branch.longitude) {
          const distance = calculateDistance(userLat, userLon, branch.latitude, branch.longitude);
          return { ...branch, distance };
        }
        return { ...branch, distance: Infinity };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    setDisplayedBranches(sorted);
  }, [userLocation, branches]);

  const handleBranchPress = (branch) => {
    navigation.navigate('Ambilantre', { branchId: branch.id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const renderBranches = () => {
    if (loadingBranches || loadingLocation) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1E4064" />
          <Text style={styles.loadingText}>
            {loadingLocation ? 'Mencari lokasi Anda...' : 'Mengambil data cabang...'}
          </Text>
        </View>
      );
    }

    if (locationError) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{locationError}</Text>
          <Text style={styles.subText}>Menampilkan cabang tanpa urutan jarak.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={displayedBranches}
        renderItem={({ item }) => (
          <BranchCard
            data={item}
            userLocation={userLocation}
            onPress={() => handleBranchPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header />
      <View style={styles.innerContainer}>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
        {searchText.length > 0 ? (
          <FlatList
            data={filteredBranches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BranchCard
                data={item}
                userLocation={userLocation}
                onPress={() => handleBranchPress(item)}
              />
            )}
            scrollEnabled={false}
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
              {renderBranches()}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1E4064',
    fontWeight: '500',
  },
});
