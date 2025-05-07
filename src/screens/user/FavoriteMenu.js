import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { API_GET_FAVORITES_URL } from "../../config/config"; // Pastikan API URL benar

const FavoriteMenu = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext); // Akses userInfo
  const userId = userInfo?._id; // Akses _id dari userInfo

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    console.log("Fetching favorites for userId:", userId); // Log userId yang digunakan untuk API
    setLoading(true);
    fetch(API_GET_FAVORITES_URL(userId))
      .then((res) => {
        console.log("Response status:", res.status); // Log status code response
        return res.json();
      })
      .then((data) => {
        console.log("Fetched favorites data:", data); // Log data yang diterima
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          setError("Data favorit tidak valid.");
        }
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError("Gagal memuat data favorit.");
      })
      .finally(() => setLoading(false));
  }, [userId]); // Dependensi hanya userId, jadi hanya fetch ketika userId berubah

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
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} /> {/* Ganti imageUrl dengan field yang sesuai */}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.name}</Text> {/* Ganti name dengan field yang sesuai */}
        <Text>{item.description}</Text> {/* Ganti description dengan field yang sesuai */}
      </View>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => handleRemoveFavorite(item._id)}
      >
        <Text style={styles.removeButtonText}>Hapus Favorit</Text>
      </TouchableOpacity>
    </View>
  );

  const handleRemoveFavorite = (menuId) => {
    console.log("Removing favorite for menuId:", menuId); // Log menuId yang akan dihapus
    fetch(API_GET_FAVORITES_URL(userId), { // Ganti dengan URL API yang sesuai untuk menghapus favorit
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, menuId })
    })
      .then((res) => {
        console.log("Delete response status:", res.status); // Log status code respons
        return res.json();
      })
      .then((data) => {
        console.log("Removed favorite:", data);
        setFavorites(favorites.filter((item) => item._id !== menuId)); // Menghapus item dari state
      })
      .catch((err) => {
        console.error("Error removing favorite:", err);
        setError("Gagal menghapus favorit.");
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16 },
  emptyText: { color: "gray", fontSize: 16 },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  image: { width: 50, height: 50, borderRadius: 25 },
  itemContent: { flex: 1, marginLeft: 10 },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  removeButton: { backgroundColor: "#f00", padding: 8, borderRadius: 5 },
  removeButtonText: { color: "#fff" },
});

export default FavoriteMenu;
