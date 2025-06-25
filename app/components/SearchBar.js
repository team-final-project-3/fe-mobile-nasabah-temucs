import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function SearchBar({ searchText, onSearchTextChange, placeholder = "Cari cabang ....", containerStyle, inputStyle }) {
  return (
    <View style={[styles.container, containerStyle]}>
      
      <TextInput
       
        style={[styles.input, inputStyle]} 
        placeholder={placeholder}
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholderTextColor="gray"
      />
      <MaterialIcons name="search" size={20} color="gray" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});