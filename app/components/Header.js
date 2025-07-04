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
  isKetentuan,
  isPrivacy,
  isAboutUS,
  isDaftar,
  isCekEmail,
  isResetPass, 
  isDetailRiwayat,
  isnewPass,

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
      <TouchableOpacity style={{marginTop: "48"}} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 28 }} /> 
    </ImageBackground>
  );

  const renderBackHeaderTiket = (title) => (
    <ImageBackground
      source={require('../../assets/headers.png')}
      style={styles.backContainerTiket}
      resizeMode="cover"
    >
      <Text style={styles.title}>{title}</Text>
    </ImageBackground>
  );

  if (isTiket) return renderBackHeaderTiket('Tiket');
  if (isHistory) return renderBackHeaderTiket('Riwayat');
  if (isProfil) return renderBackHeaderTiket('Profil');
 

 
  if (isAmbilAntrean) return renderBackHeader('Ambil Antrean');
  if (isLayanan) return renderBackHeader('Layanan');
  if (isDokumen) return renderBackHeader('Dokumen Syarat');
  if (isSearch) return renderBackHeader('Cari Layanan');

   if (isKetentuan) return renderBackHeader('Ketentuan Layanan TemuCS');
  if (isPrivacy) return renderBackHeader ('Kebijakan Privasi')
  if (isAboutUS) return renderBackHeader ('Detail Aplikasi')
  if (isDaftar) return renderBackHeader ('Daftar')
    if (isDetailRiwayat) return renderBackHeader ('Detail Tiket')
    if (isCekEmail) return renderBackHeader ('Verifikasi OTP')
      if (isResetPass) return renderBackHeader ('Ubah Kata Sandi')
        if (isnewPass) return renderBackHeader ('Buat Password Baru')

  
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

  backContainerTiket: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 32
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
    marginTop: 48,
    textAlign: 'center'
  },
});
