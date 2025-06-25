// app/components/ErrorBoundary.js
import React from 'react';
import { View, Text } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error, info) {
    // Log error jika perlu
    // console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
            Terjadi kesalahan:
          </Text>
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>
            {this.state.errorMsg}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;