import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import NoRequirementsMessage from '../components/NoRequirementsMessage';
import RequirementCategory from '../components/RequirementCategory';
import NextButton from '../components/NextButton';
import CustomAlert from '../components/CustomAlert';
import * as Notifications from 'expo-notifications';

import {
  getDocumentsByServiceIds,
  bookOnlineQueue,
  getStoredUser,
} from '../api/api';

const MIN_SELECTION = 1;

export default function Dokumen() {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    selectedServiceIds = [],
    serviceNames: initialServiceNames = [],
    headerTitle,
    branchId,
    userLocationData,
  } = route.params || {};

  const [persyaratan, setPersyaratan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customModalConfig, setCustomModalConfig] = useState({});

  const successModalTimerRef = useRef(null);

  const finalServiceNames =
    initialServiceNames.length > 0
      ? initialServiceNames
      : selectedServiceIds.map(id => `Layanan ID ${id}`);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await getStoredUser();
        setUser(storedUser);
      } catch (err) {
        console.warn('Gagal memuat user:', err?.message || err);
      }
    };

    fetchUser();
  }, []);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDocumentsByServiceIds(selectedServiceIds);
      const data = response?.data || [];

      const grouped = [
        {
          id: 1,
          requirements: data,
        },
      ];

      setPersyaratan(grouped);
    } catch (err) {
      console.error('Gagal memuat dokumen:', err);
      setError('Gagal memuat data persyaratan.');
    } finally {
      setLoading(false);
    }
  }, [selectedServiceIds]);

  useEffect(() => {
    if (!selectedServiceIds || selectedServiceIds.length === 0) {
      setLoading(false);
      return;
    }

    fetchDocuments();

    return () => {
      if (successModalTimerRef.current) clearTimeout(successModalTimerRef.current);
    };
  }, [selectedServiceIds, fetchDocuments]);

  const handleRefresh = () => {
    setIsCustomModalVisible(false);
    fetchDocuments();
  };

  const showSuccessQueueModal = useCallback(async () => {
    if (!branchId || !selectedServiceIds || selectedServiceIds.length === 0) {
      setCustomModalConfig({
        title: 'Data Tidak Lengkap',
        message: 'Data antrian tidak lengkap. Silakan coba lagi.',
        isConfirmation: false,
        onClose: () => setIsCustomModalVisible(false),
        singleButtonText: 'Tutup',
      });
      setIsCustomModalVisible(true);
      return;
    }

    try {
      const payload = {
        branchId,
        serviceIds: selectedServiceIds,
      };

      const response = await bookOnlineQueue(payload);
      const queue = response?.queue;

      if (!queue?.id) {
        setCustomModalConfig({
          title: 'Kesalahan',
          message: 'Nomor tiket tidak ditemukan. Silakan coba lagi.',
          isConfirmation: false,
          onClose: () => setIsCustomModalVisible(false),
          singleButtonText: 'Tutup',
        });
        setIsCustomModalVisible(true);
        return;
      }

      setCustomModalConfig({
        title: 'Antrian Berhasil Dibuat',
        message: `Nomor antrian Anda: ${queue.ticketNumber}`,
        isConfirmation: false,
        onClose: () => {
          setIsCustomModalVisible(false);
        
          const flatRequirements = persyaratan.flatMap(item => item.requirements || []);
          console.log('Dokumen dikirim ke Tiket:', flatRequirements);

          console.log('Dokumen hasil flatten:', flatRequirements);
console.log('Persyaratan state:', persyaratan);
          navigation.navigate('Tiket', {
            ticketId: queue.id,
            queueNumber: queue.ticketNumber,
            estimatedWaitTime: queue.estimatedTime,
            userLocationData,
            documents: flatRequirements, 
          });
        },
        
        singleButtonText: 'Lihat Tiket',
        iconName: 'emoticon-happy',
        iconBackgroundColor: '#D1AF8A',
        iconColor: '#fff',
        iconSize: 60,
        showCloseButton: true,
      });

      setIsCustomModalVisible(true);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Terjadi kesalahan saat memesan antrian.';

      setCustomModalConfig({
        title: 'Gagal Membuat Antrean',
        message: errorMessage,
        isConfirmation: false,
        onClose: () => {
          setIsCustomModalVisible(false);
          navigation.navigate('Main');
        },
        singleButtonText: 'Tutup',
        iconName: 'alert-circle',
        iconBackgroundColor: '#dc3545',
        iconColor: '#fff',
        iconSize: 50,
        showCloseButton: true,
      });

      setIsCustomModalVisible(true);
    }
  }, [branchId, selectedServiceIds, userLocationData, persyaratan, navigation]);

  const handleNextPress = useCallback(() => {
    if (selectedServiceIds.length < MIN_SELECTION) {
      setCustomModalConfig({
        title: 'Peringatan',
        message: `Harap pilih setidaknya ${MIN_SELECTION} jenis layanan.`,
        isConfirmation: false,
        onClose: () => setIsCustomModalVisible(false),
        singleButtonText: 'OK',
      });
      setIsCustomModalVisible(true);
      return;
    }

    setCustomModalConfig({
      title: 'Apakah Anda Yakin?',
      message: 'Anda akan menyetujui pembuatan antrian.',
      isConfirmation: true,
      onClose: () => setIsCustomModalVisible(false),
      onConfirm: () => {
        setIsCustomModalVisible(false);
        showSuccessQueueModal();
      },
      showCloseButton: true,
      singleButtonText: 'Batal',
      confirmButtonText: 'Lanjutkan',
      iconName: 'emoticon-happy',
      iconBackgroundColor: '#D1AF8A',
      iconColor: '#fff',
      iconSize: 40,
    });
    setIsCustomModalVisible(true);
  }, [selectedServiceIds.length, showSuccessQueueModal]);

  const renderContent = () => {
    if (persyaratan.length === 0) {
      return (
        <NoRequirementsMessage message="Belum ada dokumen persyaratan untuk layanan ini." />
      );
    }

    return (
      <FlatList
        data={persyaratan}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <RequirementCategory category={item} />}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={
          <Text style={styles.mainTitle}>{headerTitle || 'Dokumen Persyaratan'}</Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      />
    );
  };

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
      <Header isDokumen />
      {renderContent()}
      <View style={styles.buttonContainer}>
        <NextButton
          onPress={handleNextPress}
          disabled={selectedServiceIds.length < MIN_SELECTION}
        />
      </View>
      <CustomAlert visible={isCustomModalVisible} {...customModalConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E4064',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  listContentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
