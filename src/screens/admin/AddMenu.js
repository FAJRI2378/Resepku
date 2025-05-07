import React, { useState } from "react";
import { API_MENU_URL, API_URL } from "../../config/config";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const AddMenu = ({ navigation }) => {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [kategori, setKategori] = useState("Sarapan"); // default kategori

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission diperlukan", "Akses ke galeri diperlukan.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    if (!nama || !harga || !deskripsi || !videoUrl || !image || !kategori) {
      Alert.alert("Error", "Semua data harus diisi!");
      return;
    }

    try {
      const response = await fetch(API_MENU_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, harga, deskripsi, videoUrl, image, kategori }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sukses", "Menu berhasil ditambahkan");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", data.msg || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Gagal menghubungi server");
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/image.png")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <Text style={styles.title}>ADD MENU</Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Masakan"
            value={nama}
            onChangeText={setNama}
          />
          <TextInput
            style={styles.input}
            placeholder="Deskripsi Tutorial"
            value={deskripsi}
            onChangeText={setDeskripsi}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Link Youtube Tutorial"
            value={videoUrl}
            onChangeText={setVideoUrl}
          />
          <TextInput
            style={styles.input}
            placeholder="Total Harga"
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
          />

          {/* Picker Kategori */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={kategori}
              onValueChange={(itemValue) => setKategori(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sarapan" value="Sarapan" />
              <Picker.Item label="Utama" value="Utama" />
              <Picker.Item label="Dessert" value="Dessert" />
              <Picker.Item label="Snacks" value="Snacks" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Pilih Gambar
            </Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.btnText}>ADD</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007f00",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#00aa00",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#00aa00",
    borderRadius: 5,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickBtn: {
    backgroundColor: "#00aa00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: "#00aa00",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  backBtn: {
    backgroundColor: "#00aa00",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default AddMenu;
