import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av'; // menggunakan expo-av untuk video
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import {
  API_ADD_FAVORITE_URL,
  API_REMOVE_FAVORITE_URL,
  API_GET_FAVORITES_URL,
} from '../../config/config';

const convertYoutubeUrlToEmbed = (url) => {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const MenuDetail = ({ route }) => {
  const { userInfo } = useContext(AuthContext); // Menggunakan userInfo dari AuthContext
  const userId = userInfo?.id; // Mendapatkan userId dari userInfo
  const navigation = useNavigation();

  const {
    menuId,
    nama = 'Nama tidak tersedia',
    deskripsi = 'Deskripsi tidak tersedia',
    image,
    videoUrl,
  } = route.params || {};

  const isYoutubeLink =
    videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
  const [isFavorite, setIsFavorite] = useState(false);

  // Cek jika userInfo atau userId tidak tersedia
  useEffect(() => {
    if (!userId || !menuId) {
      console.log('UserInfo atau UserId tidak tersedia.');
      return;
    }

    // Jika userInfo sudah ada, lakukan fetch untuk favorit
    console.log('UserInfo:', userInfo);
    console.log('MenuId:', menuId);
    fetch(API_GET_FAVORITES_URL(userId))
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((m) => m._id === menuId);
        setIsFavorite(!!found);
      })
      .catch((err) => console.error('Fetch favorites error:', err));
  }, [userId, menuId]);

  const toggleFavorite = () => {
    if (!userId || !menuId) {
      Alert.alert('Error', 'User atau menu tidak valid');
      return;
    }

    const url = API_REMOVE_FAVORITE_URL;
    const method = isFavorite ? 'DELETE' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, menuId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request gagal');
        return res.json();
      })
      .then(() => setIsFavorite(!isFavorite))
      .catch((err) => {
        console.error('Toggle favorite error:', err);
        Alert.alert('Error', 'Gagal mengupdate favorit');
      });
  };

  const goToFavorites = () => {
    navigation.navigate('FavoriteMenu');
  };

  // Menunggu userInfo tersedia
  if (!userInfo) {
    return <Text>Loading...</Text>; // Menunggu data userInfo tersedia
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{nama}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color='red'
          />
        </TouchableOpacity>
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>Gambar tidak tersedia</Text>
      )}

      <Text style={styles.description}>{deskripsi}</Text>

      {videoUrl ? (
        isYoutubeLink ? (
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: convertYoutubeUrlToEmbed(videoUrl) }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <Video
            source={{ uri: videoUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode='cover'
            shouldPlay={false}
            useNativeControls
            style={styles.video}
          />
        )
      ) : (
        <Text style={styles.placeholder}>Video tidak tersedia</Text>
      )}

      <TouchableOpacity
        onPress={goToFavorites}
        style={styles.goToFavoritesButton}>
        <Text style={styles.goToFavoritesText}>Lihat Menu Favorit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, paddingTop: 50, backgroundColor: '#FFF' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', flex: 1 },
  iconButton: { marginLeft: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 15, color: '#555' },
  placeholder: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
    marginBottom: 10,
  },
  videoContainer: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  webview: { flex: 1 },
  video: { width: '100%', height: 200, borderRadius: 10, paddingBottom: 10 },
  goToFavoritesButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  goToFavoritesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuDetail;
