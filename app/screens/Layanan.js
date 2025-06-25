import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Branch from '../components/Branch';
import CustomAlert from '../components/CustomAlert';
import NextButton from '../components/NextButton';
import ServiceSelectionHeader from '../components/ServiceSelectionHeader';
import ServiceList from '../components/ServiceList';
import { getAllServices } from '../api/api';

export default function Layanan() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedBranchData, userLocationData } = route.params || {};

  const [searchText, setSearchText] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const MIN_SELECTION = 1;
  const MAX_SELECTION = 5;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllServices();
      const activeServices = data.filter(service => service.status === true);
      setServices(activeServices);
      setFilteredServices(activeServices);
    } catch (error) {
      console.error('Gagal memuat layanan saat refresh:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const lowercasedSearchText = searchText.toLowerCase();
    const filtered = services.filter(service =>
      service.serviceName?.toLowerCase().includes(lowercasedSearchText)
    );
    setFilteredServices(filtered);
  }, [searchText, services]);

  const handleServiceSelect = useCallback((serviceId) => {
    setSelectedServiceIds(prevSelected => {
      const isSelected = prevSelected.includes(serviceId);
      if (isSelected) {
        return prevSelected.filter(id => id !== serviceId);
      } else {
        if (prevSelected.length < MAX_SELECTION) {
          return [...prevSelected, serviceId];
        } else {
          setAlertMessage(`Anda hanya dapat memilih maksimal ${MAX_SELECTION} jenis layanan.`);
          setIsAlertVisible(true);
          return prevSelected;
        }
      }
    });
  }, []);

  const handleNextPress = () => {
    if (selectedServiceIds.length < MIN_SELECTION) {
      setAlertMessage(`Harap pilih setidaknya ${MIN_SELECTION} jenis layanan.`);
      setIsAlertVisible(true);
      return;
    }

    const selectedServiceNames = selectedServiceIds
      .map(id => services.find(s => s.id === id)?.serviceName)
      .filter(Boolean);

    const headerTitle = selectedServiceNames.length > 1
      ? "Persyaratan Layanan Dipilih"
      : `Persyaratan ${selectedServiceNames[0]}`;

    navigation.navigate('Dokumen', {
      selectedBranchData,
      userLocationData,
      selectedServiceIds,
      serviceNames: selectedServiceNames,
      headerTitle,
      branchId: selectedBranchData?.id || null,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header isLayanan />

      <View style={styles.content}>
        <View style={styles.branchWrapper}>
          {selectedBranchData?.id && (
            <Branch data={selectedBranchData} userLocation={userLocationData} isPressable={false} />
          )}
        </View>

        <ServiceSelectionHeader
          selectedCount={selectedServiceIds.length}
          maxSelection={MAX_SELECTION}
        />

        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          placeholder="Cari jenis layanan..."
        />

        <ServiceList
          services={filteredServices}
          selectedServiceIds={selectedServiceIds}
          onServiceSelect={handleServiceSelect}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>

      <CustomAlert
        visible={isAlertVisible}
        message={alertMessage}
        onClose={() => setIsAlertVisible(false)}
        title="Peringatan Pilihan Layanan"
      />

      <View style={styles.buttonContainer}>
        <NextButton
          onPress={handleNextPress}
          disabled={selectedServiceIds.length < MIN_SELECTION}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  branchWrapper: {
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
