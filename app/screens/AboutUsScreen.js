import React from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Header from '../components/Header';

const AboutUsScreen = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
      <Header isAboutUS/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          
          <Text style={styles.title}>Tentang Aplikasi TemuCS</Text>

          
          <Text style={styles.sectionTitle}>1. Deskripsi Singkat</Text>
          <Text style={styles.text}>
            TemuCS adalah aplikasi digital yang dirancang untuk mempermudah masyarakat dalam melakukan pemesanan dan pengambilan nomor antrean secara daring. Dengan TemuCS, pengguna tidak perlu lagi datang langsung hanya untuk mengambil nomor antrean, sehingga proses reservasi layanan menjadi lebih praktis, efisien, dan sesuai dengan era digitalisasi layanan publik.
          </Text>

          
          <Text style={styles.sectionTitle}>2. Tujuan Pengembangan</Text>
          <Text style={styles.bullet}>• Mengurangi waktu tunggu pengguna saat mengakses layanan tatap muka.</Text>
          <Text style={styles.bullet}>• Mengelola alur layanan secara lebih terstruktur dan efisien.</Text>
          <Text style={styles.bullet}>• Meningkatkan kenyamanan dan kepuasan pengguna dalam memperoleh layanan.</Text>
          <Text style={styles.bullet}>• Menyediakan solusi digital untuk institusi publik maupun privat yang memerlukan sistem antrean.</Text>

          
          <Text style={styles.sectionTitle}>3. Fitur Utama</Text>
          <Text style={styles.bullet}>• Pemesanan nomor antrean secara online</Text>
          <Text style={styles.bullet}>• Pemilihan lokasi kantor atau cabang tujuan</Text>
          <Text style={styles.bullet}>• Notifikasi status antrean secara real-time</Text>
          <Text style={styles.bullet}>• Riwayat antrean sebelumnya</Text>
          <Text style={styles.bullet}>• Pengelolaan profil pengguna</Text>

         
          <Text style={styles.sectionTitle}>4. Manfaat untuk Pengguna</Text>
          <Text style={styles.bullet}>• Menghemat waktu karena tidak perlu antre secara manual</Text>
          <Text style={styles.bullet}>• Meningkatkan efisiensi dan kenyamanan dalam mengakses layanan</Text>

          
          <Text style={styles.sectionTitle}>5. Kontak & Bantuan</Text>
          <Text style={styles.text}>
            Jika Anda memiliki pertanyaan, masukan, atau kendala terkait penggunaan aplikasi, silakan hubungi kami melalui email:
            <Text style={styles.link}> temucs326@gmail.com</Text>
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 6,
    color: '#111827',
  },
  text: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'justify',
  },
  bullet: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 6,
  },
  link: {
    color: '#1D4ED8',
    textDecorationLine: 'underline',
  },
});
