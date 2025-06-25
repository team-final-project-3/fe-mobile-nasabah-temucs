import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';


import Header from '../components/Header';
import TicketCard from '../components/TicketCard';
import TicketDetailSection from '../components/TicketDetailSection';
import TicketBranchDetail from '../components/TicketBranchDetail';
import TicketServiceDetail from '../components/TicketServiceDetail';
import QueueSummaryFetcher from '../components/QueueSummaryFetcher.js';
import RefreshableScreen from '../components/RefreshableScreen';
import { getQueueTicketById } from '../api/api';
import NextButton from '../components/NextButton';

export const Tiket = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticketId } = route.params || {};

  const [ticket, setTicket] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState({}); 
  const [userLocationData, setUserLocation] = useState(null);

  const [countdown, setCountdown] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [formattedEstimatedDateTime, setFormattedEstimatedDateTime] = useState('');
  const HomeScreen = () => navigation.navigate('Main'); 

  const intervalRef = useRef();

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
      userLocation,
      status
    } = ticketData;


  const fetchTicket = async () => {
    if (!ticketId) {
      setError('ID tiket tidak ditemukan.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getQueueTicketById(ticketId);
      console.log('RESPON API:', data);
      setTicketData(data.ticket || data);

      

      const isoTime = data.ticket?.estimatedTime || data?.estimatedTime;
      setEstimatedTime(isoTime);

      if (isoTime) {
        const formatted = new Date(isoTime).toLocaleString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        setFormattedEstimatedDateTime(formatted);
      }
    } catch (err) {
      console.error('Error saat ambil tiket:', err.response?.data || err.message);
      setError('Gagal memuat data tiket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleRefresh = () => {
    setError(null);
    setCountdown('');
    setEstimatedTime(null);
    setFormattedEstimatedDateTime('');
    fetchTicket();
  };

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
        `${hours.toString().padStart(2, '0')} : ${minutes
          .toString()
          .padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [estimatedTime]);

  const handleGoHome = () => navigation.navigate('Main');

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const getServiceNames = (serviceList) => {
    if (!Array.isArray(serviceList)) return [];
    return serviceList.map(service => {
      if (typeof service === 'string') return service;
      return service?.serviceName || service?.name || 'Layanan Tidak Diketahui';
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <RefreshableScreen onRefresh={handleRefresh}>
          <Header isTiket />
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#1E4064" />
            <Text style={styles.loadingText}>Memuat detail antrean...</Text>
          </View>
        </RefreshableScreen>
      </SafeAreaView>
    );
  }

  if (error || !ticketData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header isTiket/>
        <View style={styles.errorFullContent}>
          <Text style={styles.errorText}>{error || 'Data antrean tidak tersedia.'}</Text>
        </View>
      </SafeAreaView>
    );
  }



  const selectedServiceNames = getServiceNames(services);

  return (
    <SafeAreaView style={styles.container}>
       <Header isTiket />
      <RefreshableScreen onRefresh={fetchTicket}>
       

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TicketDetailSection title="Cabang Terpilih">
          <TicketBranchDetail branchData={branchData} userLocationData={userLocation} />
          </TicketDetailSection>

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
            <QueueSummaryFetcher branchId={branchData.id} showWaiting={true} />
          )}

          {(status === 'waiting' || status === 'in_progress') && (
            <TicketDetailSection title="Antrean Anda Saat Ini">
              <View style={{ backgroundColor: '#E5F3FF', padding: 12, borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                  Nomor Tiket: {ticketNumber}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>Status: {status}</Text>
                <Text style={{ fontSize: 14, marginBottom: 2 }}>
                  Estimasi Dilayani: {formattedEstimatedDateTime || '-'}
                </Text>
                <Text style={{ fontSize: 14 }}>Hitung Mundur: {countdown}</Text>
              </View>
            </TicketDetailSection>
          )}

         
        </ScrollView>

      </RefreshableScreen>

        
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },
});
