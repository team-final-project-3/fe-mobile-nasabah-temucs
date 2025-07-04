import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import Header from '../components/Header';
import RefreshableScreen from '../components/RefreshableScreen';
import TicketSummaryCard from '../components/TicketSummaryCard';
import { getQueueTicketById } from '../api/api';

export const Tiket = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { ticketId, documents = [] } = route.params || {};

  const [ticketData, setTicketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocationData, setUserLocation] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [formattedEstimatedDateTime, setFormattedEstimatedDateTime] = useState('');

  const intervalRef = useRef();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setUserLocation(location);
      } catch (err) {
        console.warn('Gagal ambil lokasi:', err.message);
        setUserLocation(null);
      }
    };

    fetchUserLocation();
  }, []);

  const fetchTicket = async () => {
    if (!ticketId) {
      setError('ID tiket tidak ditemukan.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getQueueTicketById(ticketId);
      const ticket = data.ticket || data;
      setTicketData(ticket);

      const isoTime = ticket.estimatedTime;

      if (!isoTime) {
        setEstimatedTime(null);
        setFormattedEstimatedDateTime('');
        return;
      }

      setEstimatedTime(isoTime);

      const formatted = new Date(isoTime).toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      setFormattedEstimatedDateTime(formatted);
    } catch (err) {
      console.error('Gagal memuat tiket:', err.response?.data || err.message);
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
        setCountdown('Segera datang ke cabang');
        clearInterval(intervalRef.current);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [estimatedTime]);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <RefreshableScreen onRefresh={handleRefresh}>
          <Header isTiket />
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#1E4064" />
            <Text style={styles.loadingText}>Memuat detail antrean...</Text>
          </View>
        </RefreshableScreen>
      </>
    );
  }

  if (error || !ticketData) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Header isTiket />
        <View style={styles.errorFullContent}>
          <Text style={styles.errorText}>{error || 'Data antrean tidak tersedia.'}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Header isTiket />
      <RefreshableScreen onRefresh={handleRefresh}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TicketSummaryCard
            ticketData={ticketData}
            countdown={countdown}
            estimatedTimeFormatted={formattedEstimatedDateTime}
            currentDate={currentDate}
            userLocationData={userLocationData}
            documents={documents}
          />


        </ScrollView>
      </RefreshableScreen>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.text}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 0,
  },
  button: {
    backgroundColor: '#F27F0C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  documentsContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  documentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1E4064',
  },
  documentItem: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  noDocuments: {
    fontStyle: 'italic',
    color: 'gray',
  },
});
