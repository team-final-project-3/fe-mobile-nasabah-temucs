import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import Header from '../components/Header';
import RefreshableScreen from '../components/RefreshableScreen';
import TicketSummaryCard from '../components/TicketSummaryCard';
import DeleteButton from '../components/DeleteButton';
import CustomAlert from '../components/CustomAlert';

import { getQueueTicketById, cancelQueueById, getDocumentsByServiceIds } from '../api/api'; 

export const DetailHistory = () => {
  const { queueId: ticketId, userLocationData = null } = useRoute().params || {};
  const navigation = useNavigation();

  const [ticketData, setTicketData] = useState(null);
  const [documents, setDocuments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userLocation, setUserLocation] = useState(userLocationData);
  const [countdown, setCountdown] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [formattedTime, setFormattedTime] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const intervalRef = useRef();

  useEffect(() => {
    if (userLocationData) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          setUserLocation(location);
        }
      } catch (err) {
        setUserLocation(null);
      }
    })();
  }, []);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const data = await getQueueTicketById(ticketId);
      const ticket = data.ticket || data;
      setTicketData(ticket);

      const isoTime = ticket.estimatedTime;
      setEstimatedTime(isoTime);

      if (isoTime) {
        const formatted = new Date(isoTime).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        });
        setFormattedTime(formatted + ' WIB');
      }

     
      if (ticket?.services?.length > 0) {
        const serviceIds = ticket.services.map(s => s.id);
        try {
          const response = await getDocumentsByServiceIds(serviceIds);
          const docs = response?.data || [];
          setDocuments(docs); 
        } catch (error) {
          console.warn('Gagal fetch dokumen:', error.message);
        }
      }

      setErrorMsg(null);
    } catch (err) {
      console.error('Gagal ambil data tiket:', err.message);
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

      if (distance <= 3) {
        setCountdown('Segera datang ke cabang');
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

  const currentDate = new Date().toLocaleDateString('id-ID');

  const showSuccessCancelModal = () => {
    setModalConfig({
      title: 'Antrian Berhasil Dibatalkan',
      isConfirmation: false,
      onClose: () => {
        setModalVisible(false);
        navigation.navigate('Main');
      },
      singleButtonText: 'Kembali ke Beranda',
      iconName: 'alert-circle',
      iconBackgroundColor: '#E57373',
      iconColor: '#fff',
      iconSize: 60,
      showCloseButton: true,
    });
    setModalVisible(true);
  };

  const handleCancel = async () => {
    setModalVisible(false);
    try {
      setIsCancelling(true);
      await cancelQueueById(ticketId);
      showSuccessCancelModal();
    } catch (err) {
      setErrorMsg('Gagal membatalkan antrean. Silakan coba lagi.');
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmCancel = () => {
    setModalConfig({
      title: 'Apakah Anda Yakin?',
      message: 'Anda akan menyetujui pembatalan antrian.',
      isConfirmation: true,
      onClose: () => setModalVisible(false),
      onConfirm: handleCancel,
      singleButtonText: 'Batal',
      confirmButtonText: 'Lanjutkan',
      iconName: 'emoticon-happy',
      iconBackgroundColor: '#D1AF8A',
      iconColor: '#fff',
      iconSize: 40,
      showCloseButton: true,
    });
    setModalVisible(true);
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <RefreshableScreen onRefresh={fetchTicket}>
          <Header isHistory />
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#1E4064" />
            <Text style={styles.loadingText}>Memuat detail antrean...</Text>
          </View>
        </RefreshableScreen>
      </>
    );
  }

  if (errorMsg || !ticketData?.branch) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Header isHistory />
        <View style={styles.errorFullContent}>
          <Text style={styles.errorText}>{errorMsg || 'Data antrean tidak tersedia.'}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header isDetailRiwayat />
      <RefreshableScreen onRefresh={fetchTicket}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TicketSummaryCard
            ticketData={ticketData}
            countdown={countdown}
            estimatedTimeFormatted={formattedTime}
            currentDate={currentDate}
            userLocationData={userLocation}
            documents={documents} 
          />
        </ScrollView>
      </RefreshableScreen>

      {ticketData?.status === 'waiting' && (
        <View style={styles.buttonContainer}>
          <DeleteButton onPress={confirmCancel} disabled={isCancelling} />
        </View>
      )}

      <CustomAlert visible={modalVisible} {...modalConfig} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  centeredContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorFullContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
