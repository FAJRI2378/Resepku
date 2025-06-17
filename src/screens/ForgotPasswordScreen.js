import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { API_SEND_CODE_URL } from "../config/config";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Email harus diisi!");
      return;
    }

    try {
      const res = await axios.post(API_SEND_CODE_URL, { email });
      Alert.alert("Sukses", res.data.msg);
      navigation.navigate("VerifyCode", { email });
    } catch (err) {
      Alert.alert("Gagal", err.response?.data?.msg || "Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email untuk reset password:</Text>
      <TextInput
        placeholder="Masukkan email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Button title="Kirim Kode" onPress={handleSendCode} />
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
