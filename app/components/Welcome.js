import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function Welcome({ name }) {
  const [greeting, setGreeting] = useState('Selamat Datang');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 11) return 'Selamat Pagi';
      if (hour >= 11 && hour < 15) return 'Selamat Siang';
      if (hour >= 15 && hour < 18) return 'Selamat Sore';
      return 'Selamat Malam';
    };

    setGreeting(getGreeting());

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000); 
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={{ backgroundColor: 'transparent', padding: 14 }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
      {`${greeting}, ${name ? name.split(' ')[0] + (name.split(' ')[1] ? ' ' + name.split(' ')[1] : '') : '-'}`}
    </Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{today}</Text>
    </View>
  );
}
