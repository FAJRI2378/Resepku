import React, { useContext, useEffect, useState } from "react";
import { API_MENU_URL } from "../../config/config";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const UserHome = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [menuTerbaru, setMenuTerbaru] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigation.replace("Login");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch(API_MENU_URL, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        console.log("📦 Data menu dari backend:", data.map(item => ({
          nama: item.nama,
          kategori: item.kategori,
        })));

        setMenuList(data);
        const terbaru = data.slice(-3).reverse();
        setMenuTerbaru(terbaru);
      } catch (error) {
        console.error("❌ Gagal mengambil data menu:", error);
        setError("Gagal mengambil data menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const results = menuList.filter((item) =>
        item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery, menuList]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = menuList.filter((item) => {
        const kategoriItem = item.kategori?.toLowerCase().trim();
        const kategoriSelected = selectedCategory.toLowerCase().trim();
        return kategoriItem === kategoriSelected;
      });

      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [selectedCategory, menuList]);

  const filteredByCategory = selectedCategory
    ? menuList.filter((item) => item.kategori === selectedCategory)
    : menuTerbaru;

  const infoItems = [
    {
      id: 1,
      title: "Beberapa tips dalam memasak agar lebih memudahkan",
      image: require("../../../assets/tips.jpg"),
      type: "Tips",
    },
    {
      id: 2,
      title: "Rekomendasi makanan diet",
      image: require("../../../assets/diet.jpg"),
      type: "diet",
    },
    {
      id: 3,
      title: "Rekomendasi makanan yang mudah untuk dibuat",
      image: require("../../../assets/mudah.jpg"),
      type: "mudah",
    },
  ];

  return (
    <ImageBackground
      source={require("../../../assets/image.png")}
      style={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require("../../../assets/nasi_goreng.jpg")}
            style={styles.headerImage}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            placeholder="Mau masak apa hari ini?"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Search Results */}
        {filteredItems.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.searchResults}
          >
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  navigation.navigate("MenuDetail", {
                    menuId: item._id,
                    nama: item.nama,
                    deskripsi: item.deskripsi,
                    image: item.image,
                    videoUrl: item.videoUrl,
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.recommendationImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Categories */}
        <View style={styles.categoryContainer}>
          {["Sarapan", "Utama", "Dessert", "Snacks"].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && { backgroundColor: "#7AC74F" },
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === category ? null : category)
              }
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Terbaru / Filtered */}
        <View style={styles.menuHeaderRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `Menu ${selectedCategory}` : "Menu Terbaru"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("MenuList")}>
            <Text style={styles.moreButton}>Lebih banyak</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#7AC74F" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendationContainer}
          >
            {filteredByCategory.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.menuCard}
                onPress={() =>
                  navigation.navigate("MenuDetail", {
                    menuId: item._id,
                    nama: item.nama,
                    deskripsi: item.deskripsi,
                    image: item.image,
                    videoUrl: item.videoUrl,
                  })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuImage}
                  resizeMode="cover"
                />
                <Text style={styles.menuTitle}>{item.nama}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Informasi Lain */}
        <Text style={styles.sectionTitle}>Informasi Lain</Text>
        <View style={styles.infoContainer}>
          {infoItems.map((item) => (
            <TouchableOpacity
              key={item.id} /* ✅ fixed: was item._id */
              style={styles.infoCard}
              onPress={() => {
                if (item.type === "Tips") {
                  navigation.navigate("Tips");
                } else if (item.type === "diet") {
                  navigation.navigate("Diet");
                } else if (item.type === "mudah") {
                  navigation.navigate("Mudah");
                }
              }}
            >
              <Image source={item.image} style={styles.infoImage} />
              <Text style={styles.infoText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D9F99D" },
  backgroundImage: { flex: 1, resizeMode: "cover" },
  headerContainer: { position: "relative" },
  headerImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#7AC74F",
    padding: 8,
    borderRadius: 5,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 10,
    margin: 15,
    padding: 10,
    alignItems: "center",
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  searchResults: { flexDirection: "row", margin: 10 },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#A7D397",
    padding: 10,
    borderRadius: 10,
  },
  categoryText: { fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 15,
  },
  moreButton: {
    fontSize: 14,
    color: "#7AC74F",
    fontWeight: "bold",
  },
  recommendationContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  recommendationImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    padding: 18,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoImage: {
    width: 150,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  arrowIcon: { marginLeft: 10 },
  menuCard: {
    marginRight: 10,
    alignItems: "center",
    width: 150,
  },
  menuImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  menuTitle: {
    marginTop: 5,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});

export default UserHome;
