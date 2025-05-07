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
import {
  API_GET_FAVORITES_URL,
  API_REMOVE_FAVORITE_URL,
} from '../../config/config';

const FavoriteMenu = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?.id;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(API_GET_FAVORITES_URL(userId))
      .then((res) => res.json())
      .then((data) => {
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
  }, [userId]);

  const handleRemoveFavorite = (menuId) => {
    fetch(API_REMOVE_FAVORITE_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, menuId }),
    })
      .then((res) => res.json())
      .then(() => {
        // Reload favorites
        fetch(API_GET_FAVORITES_URL(userId))
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setFavorites(data);
            } else {
              setError('Data favorit tidak valid.');
            }
          })
          .catch((err) => {
            console.error('Error fetching updated favorites:', err);
            setError('Gagal memuat data favorit.');
          });
      })
      .catch((err) => {
        console.error('Error removing favorite:', err);
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.heartIconContainer}>
        <Text style={styles.heartIcon}>❤️</Text>
      </View>
      <View style={styles.menuInfo}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
  navigation.navigate('MenuDetail', {
    menuId: item._id,
    nama: item.name,
    deskripsi: item.description,
    image: item.image,
    videoUrl: item.videoUrl,
  })
}

          >
            <Text style={styles.detailButtonText}>Detail ⟳</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFavorite(item._id)}
      >
        <Text style={styles.deleteButtonText}>Hapus 🗑</Text>
      </TouchableOpacity>
    </View>
  );

  if (!userInfo) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Belum ada menu favorit.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('UserHome')}
        >
          <Text style={styles.backButtonText}>Kembali ke Menu Awal</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        onPress={() => navigation.navigate('UserHome')}
      >
        <Text style={styles.backBtnText}>⬅</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#8fbc8f' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: 'gray', fontSize: 16 },
  card: {
    backgroundColor: '#A8F0A5',
    borderRadius: 20,
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heartIconContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    zIndex: 1,
  },
  heartIcon: {
    fontSize: 24,
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  detailButton: {
    backgroundColor: '#DFFFD6',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    color: '#008000',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F08080',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: '#A8F0A5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  backBtnText: {
    fontSize: 24,
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
