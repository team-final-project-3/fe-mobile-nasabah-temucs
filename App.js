import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
// import ErrorBoundary from './app/components/ErrorBoundary';

export default function App() {
  return (
    // <ErrorBoundary>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    // </ErrorBoundary>
    
  );
}
