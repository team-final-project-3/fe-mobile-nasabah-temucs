import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getBranchById } from '../api/api';

export default function BranchLoader({ branchId, onLoadSuccess, onError }) {
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await getBranchById(branchId);

        const branch = res.branch || res; 
        onLoadSuccess(branch);
        console.log(branch);
        
      } catch (error) {
        console.error('Gagal memuat cabang:', error.message);
        onError('Gagal memuat data cabang.');
      }
    };

    if (branchId) {
      fetchBranch();
    } else {
      onError('ID cabang tidak tersedia.');
    }

  }, [branchId]);

  return (
    <View style={{ height: 0, width: 0 }}>
      <ActivityIndicator size="small" color="#1E4064" />
    </View>
  );
}
