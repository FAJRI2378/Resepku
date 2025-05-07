import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DietScreen = () => {
  const navigation = useNavigation();

  const items = [
    { emoji: '🥗', text: 'Salad Ayam Panggang' },
    { emoji: '🍓', text: 'Oatmeal dengan buah segar' },
    { emoji: '🥦', text: 'Tumis sayuran dan tahu/tempe' },
    { emoji: '🍲', text: 'Sup bening sayur atau ayam' },
    { emoji: '🍃', text: 'Smoothie hijau' },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Rekomendasi Makanan Diet</Text>
      <Text style={styles.subtitle}>Sehat, Lezat, dan Mudah Dibuat 🍽️</Text>

      {items.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>
            {item.emoji}  {item.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#8fbc8f",
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2c3e50',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#7f8c8d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#34495e',
  },
});

export default DietScreen;
