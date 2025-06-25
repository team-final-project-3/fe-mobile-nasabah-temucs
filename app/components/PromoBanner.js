import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';

export default function PromoBanner() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Image
          source={require('../../assets/promo-banner.jpeg')}
          style={styles.banner}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/promo-banner3.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/promo-banner2.jpeg')}
          style={styles.banner}
          resizeMode="cover"
        />
        <Image
          source={require('../../assets/promo-banner3.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  banner: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginRight: 12,
  },
});
