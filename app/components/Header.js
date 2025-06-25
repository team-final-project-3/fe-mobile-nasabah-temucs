import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Welcome from './Welcome';
import { getStoredUser } from '../api/api';

const Header = ({
  isAmbilAntrean,
  isLayanan,
  isDokumen,
  isTiket,
  isSearch,
  isHistory,
  isProfil,
}) => {
  const navigation = useNavigation();
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const user = await getStoredUser();
        if (user?.user?.fullname) {
          setName(user.user.fullname);
        }
      } catch (err) {
        console.error('Gagal ambil nama user:', err);
      }
    };
    fetchName();
  }, []);

  const renderBackHeader = (title) => (
    <ImageBackground
      source={require('../../assets/headers.png')}
      style={styles.backContainer}
      resizeMode="cover"
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 28 }} /> 
    </ImageBackground>
  );

 
  if (isAmbilAntrean) return renderBackHeader('Ambil Antrean');
  if (isLayanan) return renderBackHeader('Layanan');
  if (isDokumen) return renderBackHeader('Dokumen Syarat');
  if (isSearch) return renderBackHeader('Cari Layanan');
  if (isHistory) return renderBackHeader('Riwayat');
  if (isProfil) return renderBackHeader('Profil');
  if (isTiket) return renderBackHeader('Tiket');

  
  return (
    <ImageBackground
      source={require('../../assets/headers.png')}
      style={styles.headerBackground}
      resizeMode="cover"
    >
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/Logofix.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.greetingContainer}>
          <Welcome name={name} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;

const styles = StyleSheet.create({
  backContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    overflow: 'hidden', 
    minHeight: 80,
  },
  headerBackground: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 100,
    alignSelf: 'center',
  },
  greetingContainer: {
    marginTop: 4,
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
