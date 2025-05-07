import React, { useState } from "react";
import { API_MENU_URL, API_URL } from "../../config/config";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const EditMenu = ({ route, navigation }) => {
  const { menu } = route.params;

  const [nama, setNama] = useState(menu.nama);
  const [harga, setHarga] = useState(String(menu.harga));
  const [deskripsi, setDeskripsi] = useState(menu.deskripsi || "");
  const [videoUrl, setVideoUrl] = useState(menu.videoUrl || "");
  const [image, setImage] = useState(menu.image || "");
  const [kategori, setKategori] = useState(menu.kategori || "Sarapan");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Izin ditolak", "Izin akses galeri diperlukan.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const source = "data:image/jpeg;base64," + result.assets[0].base64;
      setImage(source);
    }
  };

  const handleUpdate = async () => {
    if (!nama || !harga || !deskripsi || !videoUrl || !image || !kategori) {
      return Alert.alert("Peringatan", "Semua field harus diisi");
    }

    const hargaNumber = parseInt(harga);
    if (isNaN(hargaNumber) || hargaNumber <= 0) {
      return Alert.alert("Peringatan", "Harga harus berupa angka positif");
    }

    try {
      const response = await fetch(`${API_MENU_URL}/${menu._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          harga: hargaNumber,
          deskripsi,
          videoUrl,
          image,
          kategori,
        }),
      });

      if (response.ok) {
        Alert.alert("Sukses", "Menu berhasil diperbarui");
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert("Gagal", errorData.msg || "Terjadi kesalahan saat memperbarui");
      }
    } catch (error) {
      console.error("❌ Gagal edit menu:", error);
      Alert.alert("Error", "Terjadi kesalahan pada server");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Menu</Text>

      <TextInput
        placeholder="Nama Menu"
        value={nama}
        onChangeText={setNama}
        style={styles.input}
      />
      <TextInput
        placeholder="Harga"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Deskripsi"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
      />
      <TextInput
        placeholder="URL Video (YouTube, dll)"
        value={videoUrl}
        onChangeText={setVideoUrl}
        style={styles.input}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={kategori}
          onValueChange={(itemValue) => setKategori(itemValue)}
        >
          <Picker.Item label="Sarapan" value="Sarapan" />
          <Picker.Item label="Utama" value="Utama" />
          <Picker.Item label="Dessert" value="Dessert" />
          <Picker.Item label="Snacks" value="Snacks" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: "#888" }}>Pilih Gambar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditMenu;
