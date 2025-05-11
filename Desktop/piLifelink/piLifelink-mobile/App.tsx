import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleEmergency = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to send emergency.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Send location to your backend
      await fetch('http://192.168.43.190:3001/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Emergency',
          lat: latitude,
          lng: longitude,
        }),
      });

      Alert.alert('Emergency Sent', `Your location has been sent!\nLat: ${latitude}\nLng: ${longitude}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Hospital Emergency</Text>
      <Text style={styles.subtitle}>Press the button if you need urgent help!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e63946" style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="EMERGENCY 🚨" color="#e63946" onPress={handleEmergency} />
        </View>
      )}
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3557',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1faee',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#f1faee',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
});
