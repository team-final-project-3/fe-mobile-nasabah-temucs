import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useEffect } from 'react';
import Header from '../components/Header';

export default function TermsAndConditionsScreen({ navigation }) {
  const handleAgree = () => {
    console.log('[Terms] Pengguna menekan tombol "Saya Mengerti dan Setuju"');
    navigation.goBack();
  };

  useEffect(() => {
    console.log('[Terms] Halaman Ketentuan Penggunaan dimuat');
  }, []);


  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
    
        <Header isKetentuan/>
        
        <Animatable.View style={styles.contentBody} animation="fadeInUp" duration={800} delay={200}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
         
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Pengantar</Text>
            <Text style={styles.paragraph}>
              Selamat datang di TemuCS. Dengan menggunakan aplikasi ini, Anda setuju untuk terikat oleh syarat dan
              ketentuan yang ditetapkan. Aplikasi ini bertujuan untuk memudahkan Anda dalam memesan layanan secara online
              untuk menghindari antrean panjang.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Kewajiban Pengguna</Text>
            <Text style={styles.paragraph}>
              Anda bertanggung jawab untuk memberikan informasi yang akurat dan benar saat melakukan pendaftaran dan
              pemesanan. Dilarang keras menyalahgunakan aplikasi untuk tujuan yang melanggar hukum atau merugikan pihak
              lain.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Privasi dan Data</Text>
            <Text style={styles.paragraph}>
              Kami berkomitmen untuk melindungi privasi Anda. Data pribadi seperti nama, email, dan nomor telepon yang kami
              kumpulkan hanya akan digunakan untuk keperluan verifikasi, komunikasi terkait layanan, dan peningkatan kualitas
              aplikasi. Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan
              oleh hukum.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Pembatasan Tanggung Jawab</Text>
            <Text style={styles.paragraph}>
              TemuCS tidak bertanggung jawab atas kerugian tidak langsung yang mungkin timbul dari penggunaan atau
              ketidakmampuan untuk menggunakan aplikasi. Layanan disediakan "sebagaimana adanya" tanpa jaminan apa pun.
            </Text>
          </View>
        </ScrollView>
      </Animatable.View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
          <Text style={styles.agreeButtonText}>Saya Mengerti dan Setuju</Text>
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
  contentBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  scrollViewContent: {
    padding: 25,
    paddingBottom: 40,
    marginBottom:20
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#1F2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    color: '#4B5563',
    textAlign: 'justify',
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