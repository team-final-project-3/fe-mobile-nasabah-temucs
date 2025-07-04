import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RequirementCategory({ category }) {
  const { requirements = [], name = '' } = category;

  if (!requirements.length) return null;

  return (
    <View style={styles.container}>
      {name && <Text style={styles.title}>{name}</Text>}
      {requirements.map((item, index) => (
        <View key={`${item.id}-${index}`} style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="check" size={16} color="#3DBE29" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            {item.quantity > 1 && (
              <Text style={styles.quantityText}>x{item.quantity}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E4064',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3DBE29',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
