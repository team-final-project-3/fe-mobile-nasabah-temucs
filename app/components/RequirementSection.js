import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RequirementSection = React.memo(({ sectionData }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{sectionData.section}</Text>
    {sectionData.items.map((item, index) => (
      <Text key={index} style={styles.sectionItem}>
        {item}
      </Text>
    ))}
  </View>
));

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  sectionItem: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    lineHeight: 20,
  },
});

export default RequirementSection;