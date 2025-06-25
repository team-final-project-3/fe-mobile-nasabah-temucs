import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* Judul */}
          <Text style={styles.title}>TENTANG APLIKASI TEMUCS</Text>

          {/* 1. Deskripsi Singkat */}
          <Text style={styles.sectionTitle}>1. Deskripsi Singkat</Text>
          <Text style={styles.text}>
TemuCS merupakan aplikasi digital yang dirancang untuk mempermudah masyarakat dalam melakukan pemesanan dan pengambilan nomor antrean secara online. Dengan menggunakan TemuCS, pengguna tidak perlu lagi datang langsung ke lokasi hanya untuk mengambil nomor antrean. Proses reservasi layanan menjadi lebih praktis, efisien, dan fleksibel, mendukung era digitalisasi layanan publik dan instansi.
          </Text>

          {/* 2. Tujuan Pengembangan */}
          <Text style={styles.sectionTitle}>2. Tujuan Pengembangan</Text>
          <Text style={styles.text}>
            Pengembangan aplikasi TemuCS bertujuan untuk:{'\n'}
            • Mengurangi waktu tunggu pengguna saat mengakses layanan tatap muka.{'\n'}
            • Mengelola alur layanan secara lebih teratur dan efisien.{'\n'}
            • Meningkatkan kepuasan dan kenyamanan pengguna dalam memperoleh layanan.{'\n'}
            • Memberikan solusi digital untuk pelayanan publik maupun privat yang membutuhkan sistem antrean. </Text>

          {/* 3. Fitur Utama */}
          <Text style={styles.sectionTitle}>3. Fitur Utama</Text>
          <Text style={styles.text}>
            • Pemesanan nomor antrean secara online{'\n'}
            • Pemilihan lokasi kantor/cabang tujuan{'\n'}
            • Notifikasi status antrean secara real-time{'\n'}
            • Riwayat antrean sebelumnya{'\n'}
            • Profil pengguna
          </Text>

          {/* 4. Manfaat untuk Pengguna */}
          <Text style={styles.sectionTitle}>4. Manfaat untuk Pengguna</Text>
          <Text style={styles.text}>
            • Menghemat waktu karena tidak perlu antre manual{'\n'}
            • Mendapatkan estimasi waktu panggilan{'\n'}
            • Meningkatkan kenyamanan dan efisiensi dalam mengakses layanan
          </Text>

          {/* 5. Kontak & Bantuan */}
          <Text style={styles.sectionTitle}>5. Kontak & Bantuan</Text>
          <Text style={styles.text}>
            Jika Anda memiliki pertanyaan, masukan, atau kendala penggunaan, silakan hubungi kami
            melalui email:{'\n'}
            <Text style={styles.link}>support@temuCS.com</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F6F6F6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#000000',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
    textAlign: 'justify'
  },
});
