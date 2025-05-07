import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Pastikan `expo/vector-icons` sudah diinstal

const TipsScreen = () => {
  const navigation = useNavigation();

  const tips = [
    { emoji: '🧑‍🍳', text: 'Persiapkan bahan terlebih dahulu (mise en place)' },
    { emoji: '🔪', text: 'Gunakan pisau yang tajam' },
    { emoji: '👅', text: 'Cicipi masakan saat memasak' },
    { emoji: '🔥', text: 'Masak dengan api yang sesuai' },
    { emoji: '🧽', text: 'Bersihkan sambil masak' },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#1b5e20" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tips Memasak yang Efisien</Text>
      <Text style={styles.subtitle}>Membantu kamu jadi chef rumahan yang handal ✅</Text>

      {tips.map((tip, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>
            {tip.emoji}  {tip.text}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#8fbc8f',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    color: '#1b5e20',
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1b5e20',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#388e3c',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#2e7d32',
  },
});

export default TipsScreen;
