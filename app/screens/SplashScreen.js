import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Image,
  SafeAreaView,
  Dimensions,
  Easing,
  Text,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('LoginScreen');
        });
      }, 1000);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F27F0C" />
            
      <View style={styles.logoWrapper}>
        <Animated.View
          style={[
            styles.centerContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Image
            source={require('../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Animated.Text style={[styles.footerText, { color: '#fff', opacity: opacityAnim }]}>
         <Text style={{color:'#fff'}}>©️</Text>  {new Date().getFullYear()} - All rights reserved by Team 3 -{' '}
          <Text style={styles.bold}>Continental</Text>
        </Animated.Text>
      </View>

    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F27F0C',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8,
    height: height * 0.28,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#F27F0C',
  },
  footerText: {
    fontSize: width < 400 ? 12 : 14,
    color: '#ffff',
    textAlign: 'center',
    marginBottom: '50'
  },
  bold: {
    fontWeight: 'bold',
  },
});
