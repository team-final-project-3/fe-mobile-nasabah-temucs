import React from 'react';
import { FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import RequirementCategory from './RequirementCategory';
import NoRequirementsMessage from './NoRequirementsMessage';

export default function RequirementListSection({ persyaratan, loading, onRefresh, headerTitle = "Dokumen Persyaratan" }) {
  if (persyaratan.length === 0) {
    return <NoRequirementsMessage message="Belum ada dokumen persyaratan untuk layanan ini." />;
  }

  return (
    <FlatList
      data={persyaratan}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={({ item }) => <RequirementCategory category={item} />}
      contentContainerStyle={styles.listContentContainer}
      ListHeaderComponent={<Text style={styles.mainTitle}>{headerTitle}</Text>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});