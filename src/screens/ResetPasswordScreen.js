import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_RESET_PASSWORD_URL } from "../config/config";

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!email || !newPassword) {
      Alert.alert("Error", "Email dan password baru harus diisi!");
      return;
    }

    try {
      const response = await axios.put(API_RESET_PASSWORD_URL, { email, newPassword });

      if (response.data.msg === "Password berhasil direset") {
        Alert.alert("Berhasil", "Password telah direset.");
        navigation.goBack();
      } else {
        Alert.alert("Gagal", "Terjadi kesalahan saat mengirim link reset.");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat mengirim link reset.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan email Anda"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Masukkan password baru"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Kirim Link Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#F4C2C2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
