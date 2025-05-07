import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { API_MENU_URL } from "../../config/config";
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMenuList = async () => {
      try {
        const response = await fetch(API_MENU_URL);
        const data = await response.json();
    
        if (response.ok && Array.isArray(data.menus)) {
          setMenus(data.menus);
          setFilteredMenus(data.menus);
        } else {
          alert("Data menu tidak valid!");
        }
      } catch (error) {
        alert("Error while loading the menu");
      } finally {
        setLoading(false);
      }
    };
    

    fetchMenuList();
  }, []);

  useEffect(() => {
    let result = menus;

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.nama?.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by price range
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
    result = result.filter(item => item.harga >= min && item.harga <= max);

    setFilteredMenus(result);
  }, [searchTerm, minPrice, maxPrice, menus]);

  const handleSort = () => {
    const sorted = [...filteredMenus].sort((a, b) =>
      sortAsc ? a.harga - b.harga : b.harga - a.harga
    );
    setFilteredMenus(sorted);
    setSortAsc(!sortAsc);
  };

  const handleMenuPress = (menuId) => {
    const menu = menus.find(item => item._id === menuId);
    if (menu) {
      navigation.navigate('MenuDetail', {
        menuId: menu._id,
        nama: menu.nama,
        deskripsi: menu.deskripsi,
        image: menu.image,
        videoUrl: menu.videoUrl,
      });
    } else {
      console.error('Menu tidak ditemukan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu List</Text>

      <TextInput
        placeholder="Cari menu..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <View style={styles.priceFilterContainer}>
        <TextInput
          placeholder="Min Harga"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
          style={styles.priceInput}
        />
        <Text style={{ marginHorizontal: 5 }}>-</Text>
        <TextInput
          placeholder="Max Harga"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={styles.priceInput}
        />
      </View>

      <TouchableOpacity onPress={handleSort} style={styles.sortButton}>
        <Text style={styles.sortButtonText}>
          Urutkan Harga: {sortAsc ? 'Termurah' : 'Termahal'}
        </Text>
      </TouchableOpacity>

      {filteredMenus.length === 0 ? (
        <Text style={styles.noDataText}>Menu tidak ditemukan.</Text>
      ) : (
        <FlatList
          data={filteredMenus}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress(item._id)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.menuImage}
              />
              <View style={styles.menuDetails}>
                <Text style={styles.menuName}>{item.nama}</Text>
                <Text style={styles.menuPrice}>Rp {item.harga}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#8fbc8f',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  priceFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 3,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuDetails: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuPrice: {
    fontSize: 16,
    color: '#888',
  },
});

export default MenuList;