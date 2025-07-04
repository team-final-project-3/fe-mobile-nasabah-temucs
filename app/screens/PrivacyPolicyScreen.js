import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Header from '../components/Header';

const privacyData = [
  {
    icon: 'document-text-outline',
    title: '1. Data yang Kami Kumpulkan',
    content: [
      'Nama lengkap untuk identifikasi.',
      'Nomor telepon dan/atau email untuk verifikasi dan komunikasi.',
      'Informasi layanan dan kantor cabang yang Anda pilih.',
    ],
  },
  {
    icon: 'server-outline',
    title: '2. Bagaimana Kami Menggunakan Data Anda',
    content: [
      'Memproses pendaftaran dan pemesanan nomor antrean Anda.',
      'Mengirimkan notifikasi dan informasi terkait status antrean.',
      'Menghubungi Anda untuk konfirmasi atau jika terjadi kendala layanan.',
      'Menganalisis data secara anonim untuk peningkatan kualitas aplikasi.',
    ],
  },
  {
    icon: 'shield-checkmark-outline',
    title: '3. Keamanan dan Penyimpanan DataKeamanan dan Penyimpanan Data',
    content: [
      'Semua data pribadi Anda disimpan dalam server yang aman dan dienkripsi.',
      'Kami tidak akan pernah menjual atau membagikan data Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit Anda.',
      'Akses ke data pribadi dibatasi hanya untuk personel yang berwenang.',
    ],
  },
  {
    icon: 'person-circle-outline',
    title: '4. Hak Anda Sebagai Pengguna',
    content: [
      'Anda berhak untuk mengakses dan meninjau data pribadi yang kami simpan.',
      'Anda dapat meminta koreksi atau penghapusan data Anda sesuai dengan ketentuan yang berlaku.',
    ],
  },
];

export default function PrivacyPolicyScreen({ navigation }) {
  const handleUnderstand = () => {
    console.log('[PrivacyPolicy] Pengguna menekan tombol "Saya Mengerti", kembali ke halaman sebelumnya.');
    navigation.goBack();
  };


  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
    
      <Header isPrivacy/>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animatable.View style={styles.contentBody} animation="fadeInUp" duration={800} delay={200}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {privacyData.map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name={section.icon} size={22} color="#053F5C" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              {section.content.map((point, pointIndex) => (
                <View key={pointIndex} style={styles.bulletPointContainer}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletPointText}>{point}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </Animatable.View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.agreeButton} onPress={handleUnderstand}>
          <Text style={styles.agreeButtonText}>Saya Mengerti</Text>
        </TouchableOpacity>
      </View>

    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#053F5C',
  },
  header: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 45 : 60,
    left: 20,
    padding: 5,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  scrollViewContent: {
    padding: 25,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#2C3E50',
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    backgroundColor: '#053F5C',
    borderRadius: 3,
    marginTop: 6,
    marginRight: 10,
  },
  bulletPointText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  agreeButton: {
    backgroundColor: '#053F5C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  agreeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
