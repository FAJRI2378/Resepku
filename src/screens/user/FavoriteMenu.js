import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { API_GET_FAVORITES_URL } from '../../config/config'; // Pastikan API URL benar
import { API_REMOVE_FAVORITE_URL } from '../../config/config';

const FavoriteMenu = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext); // Akses userInfo
  const userId = userInfo?.id; // Akses _id dari userInfo

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    console.log('Fetching favorites for userId:', userId); // Log userId yang digunakan untuk API
    setLoading(true);
    fetch(API_GET_FAVORITES_URL(userId))
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched favorites data:', data); // Log data yang diterima
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          setError('Data favorit tidak valid.');
        }
      })
      .catch((err) => {
        console.error('Error fetching favorites:', err);
        setError('Gagal memuat data favorit.');
      })
      .finally(() => setLoading(false));
  }, [userId]); // Dependensi hanya userId, jadi hanya fetch ketika userId berubah

  // Menangani loading dan error
  if (!userInfo) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Belum ada menu favorit.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('UserHome')}>
          <Text style={styles.backButtonText}>Kembali ke Menu Awal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render setiap item favorit
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemTitle}>{item.nama}</Text>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text>{item.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item._id)}>
        <Text style={styles.removeButtonText}>Hapus Favorit</Text>
      </TouchableOpacity>
    </View>
  );

  // Menghapus favorit
  const handleRemoveFavorite = (menuId) => {
    // Panggil API untuk menghapus favorit
    console.log('Removing favorite for menuId:', menuId);
    fetch(API_REMOVE_FAVORITE_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, menuId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Removed favorite:', data);
        setFavorites(favorites.filter((item) => item._id !== menuId)); // Menghapus item dari state
      })
      .catch((err) => {
        console.error('Error removing favorite:', err);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('UserHome')}>
        <Text style={styles.backBtnText}>Kembali ke Menu Awal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  emptyText: { color: 'gray', fontSize: 16 },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  image: { width: 50, height: 50, borderRadius: 25 },
  itemContent: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 18, fontWeight: 'bold' },
  removeButton: { backgroundColor: '#f00', padding: 8, borderRadius: 5 },
  removeButtonText: { color: '#fff' },
  backBtn: {
    backgroundColor: '#007f00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007f00',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FavoriteMenu;
