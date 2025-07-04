import 'dotenv/config';

export default {
  expo: {
    name: 'TemuCS',
    slug: 'temucs',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/Logofix-2.png',
    splash: {
      image: './assets/Logofix.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    android: {
      package: 'com.irene07.temucs',
      googleServicesFile: './google-services.json',
      permissions: ['POST_NOTIFICATIONS'],
    },
    ios: {
      bundleIdentifier: 'com.irene07.temucs',
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      eas: {
        projectId: '0510c1fd-9904-41ab-a297-1684055df897'
      },
    },
    plugins: ['expo-notifications'],
  }
};
