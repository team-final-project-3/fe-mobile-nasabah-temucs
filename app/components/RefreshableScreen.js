import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';

export default function RefreshableScreen({
  children,
  onRefresh,
  scrollable = true,
  ScrollComponent = null,
  scrollProps = {},
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const Component = ScrollComponent || ScrollView;

  return (
    <Component
      nestedScrollEnabled={true}
      style={{ flex: 1 }}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh && scrollable ? (
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        ) : null
      }
      {...scrollProps}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
