import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import TicketCard from '../components/TicketCard';
import TicketDetailSection from '../components/TicketDetailSection';
import TicketBranchDetail from '../components/TicketBranchDetail';
import TicketServiceDetail from '../components/TicketServiceDetail';
import DeleteButton from '../components/DeleteButton';
import CustomAlert from '../components/CustomAlert';
import RefreshableScreen from '../components/RefreshableScreen';
import QueueSummaryFetcher from '../components/QueueSummaryFetcher.js';
import * as Location from 'expo-location';

import { getQueueTicketById, cancelQueueById } from '../api/api';

export const DetailHistory = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { queueId: ticketId, userLocationData = null } = route.params || {};

  const [ticket, setTicket] = useState({});
  const [countdown, setCountdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customModalConfig, setCustomModalConfig] = useState({});
  const [userLocation, setUserLocation] = useState(userLocationData);

  const successModalTimerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (userLocationData) return; 
  
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
  
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);
      } catch (err) {
        console.warn('Gagal mengambil lokasi:', err.message);
        setUserLocation(null);
      }
    };
  
    fetchUserLocation();
  }, []);

  const {
    ticketNumber,
    branch: branchData,
    services = [],
    requiredDocuments = [],
    estimatedTime,
    status,
  } = ticket;

  const formattedEstimatedDateTime = estimatedTime
    ? new Date(estimatedTime).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
      }) + ' WIB'
    : '-';

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const fetchTicket = async () => {
    if (!ticketId) {
      setErrorMsg('ID tiket tidak tersedia.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getQueueTicketById(ticketId);
      const ticketData = data.ticket || data;
      setTicket(ticketData);
    } catch (err) {
      console.error('Gagal ambil data tiket:', err.response?.data || err.message);
      setErrorMsg('Gagal memuat data tiket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (!estimatedTime) return;

    intervalRef.current = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(estimatedTime).getTime();
      const distance = target - now;

      if (distance <= 0) {
        setCountdown('Sekarang giliran anda');
        clearInterval(intervalRef.current);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [estimatedTime]);

  const handleGoHome = () => navigation.navigate('Main');

  const showSuccessCancelModal = () => {
    setCustomModalConfig({
      title: 'Antrian Berhasil Dibatalkan',
      isConfirmation: false,
      onClose: () => {
        setIsCustomModalVisible(false);
        handleGoHome();
      },
      singleButtonText: 'Kembali ke Beranda',
      iconName: 'alert-circle',
      iconBackgroundColor: '#E57373',
      iconColor: '#fff',
      iconSize: 60,
      showCloseButton: true,
    });
  
    setIsCustomModalVisible(true);
  };
  

  const handleNextPress = () => {
    setCustomModalConfig({
      title: 'Apakah Anda Yakin?',
      message: 'Anda akan menyetujui pembatalan antrian.',
      isConfirmation: true,
      onClose: () => setIsCustomModalVisible(false),
      onConfirm: async () => {
        try {
          setIsCancelling(true);
          setIsCustomModalVisible(false);
          await cancelQueueById(ticketId);
          showSuccessCancelModal();
        } catch (error) {
          console.error('Gagal membatalkan antrean:', error.response?.data || error.message);
          setErrorMsg('Gagal membatalkan antrean. Silakan coba lagi.');
        } finally {
          setIsCancelling(false);
        }
      },
      showCloseButton: true,
    });
    setIsCustomModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <RefreshableScreen onRefresh={fetchTicket}>
          <Header isHistory />
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#1E4064" />
            <Text style={styles.loadingText}>Memuat detail antrean...</Text>
          </View>
        </RefreshableScreen>
      </SafeAreaView>
    );
  }

  if (errorMsg || !branchData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detail Antrean" showBackButton />
        <View style={styles.errorFullContent}>
          <Text style={styles.errorText}>{errorMsg || "Data antrean tidak dapat dimuat."}</Text>
          <Text style={styles.errorDetail}>Pastikan ID antrian benar atau hubungi petugas.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
       <Header isHistory />
      <RefreshableScreen onRefresh={fetchTicket}>
       

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TicketDetailSection title="Cabang Terpilih">
          <TicketBranchDetail branchData={branchData} userLocationData={userLocation} />
          </TicketDetailSection>

          {(status === 'In progress' || status === 'done' || status === 'canceled' || status === 'skipped') && (
            <TicketDetailSection title="Status Antrean Anda">
              <View style={{ backgroundColor: '#fff3cd', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                  Nomor Tiket: {ticketNumber}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>Status: {status}</Text>
      
              </View>
            </TicketDetailSection>
          )}

          

          <TicketCard
            status={status}
            bankName="Bank Negara Indonesia"
            branchName={`Kantor Cabang ${branchData?.name || 'Tidak Dikenal'}`}
            queueNumber={ticketNumber || 'Loading'}
            ticketDate={currentDate}
            estimatedTime={formattedEstimatedDateTime}
            countdown={countdown}
          />
          

          <TicketDetailSection title="Jenis Layanan">
            <TicketServiceDetail selectedServiceNames={services.map(service => service.serviceName)} />
          </TicketDetailSection>

          {(status === 'waiting' || status === 'in_progress') && branchData?.id && (
            <QueueSummaryFetcher
  branchId={branchData.id}
  showWaiting={true}
  layoutMode="vertical"
/>
          )}

          {(status === 'waiting' || status === 'in progress') && (
            <TicketDetailSection title="Antrean Anda Saat Ini">
              <View style={{ backgroundColor: '#E5F3FF', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                  Nomor Tiket: {ticketNumber}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>Status: {status}</Text>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>
                  Estimasi Dilayani: {formattedEstimatedDateTime || '-'}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Hitung Mundur: {countdown}</Text>
              </View>
            </TicketDetailSection>
          )}

         
        </ScrollView>

      </RefreshableScreen>
      {status === 'waiting' && (
          <View style={styles.buttonContainer}>
            <DeleteButton onPress={handleNextPress} disabled={isCancelling} />
          </View>
        )}

        <CustomAlert visible={isCustomModalVisible} {...customModalConfig} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorFullContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorDetail: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },
});
