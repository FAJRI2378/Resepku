import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { API_RESET_PASSWORD_URL } from "../config/config";

export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert("Error", "Kode verifikasi dan password baru harus diisi!");
      return;
    }

    try {
      const res = await axios.put(API_RESET_PASSWORD_URL, {
        email,
        code,
        newPassword,
      });
      Alert.alert("Sukses", res.data.msg);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Gagal", err.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email: {email}</Text>
      <TextInput
        placeholder="Masukkan kode verifikasi"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Password baru"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
