import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function SearchTrigger({ placeholder = "Cari lokasi, antrean, atau layanan" }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Search');
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.touchable}>
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="gray" style={styles.icon} />
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 48, 
  },
  icon: {
    marginRight: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: 'gray', 
  },
});