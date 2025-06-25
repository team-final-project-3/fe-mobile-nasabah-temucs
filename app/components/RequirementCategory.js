import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RequirementCategory = React.memo(({ category }) => {
  if (!category || !Array.isArray(category.requirements)) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.instruction}>
          Mohon untuk mempersiapkan dokumen-dokumen berikut ini:
        </Text>
        {category.requirements.map((doc) => (
          <View key={doc.id} style={styles.documentBox}>
            <Text style={styles.documentText}>{doc.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  instruction: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
  },
  documentBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  documentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
  },
});

export default RequirementCategory;
