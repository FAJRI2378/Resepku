import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);
    const { handleLogin } = useContext(AuthContext);

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const onLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email dan Password harus diisi!");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Error", "Format email tidak valid!");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password minimal 6 karakter");
            return;
        }

        setLoading(true);

        try {
            const role = await handleLogin(email, password);

            if (role === "admin") {
                console.log("🔀 Navigasi ke AdminDashboard...");
                navigation.replace("AdminDashboard");
            } else if (role === "user") {
                console.log("🔀 Navigasi ke UserHome...");
                navigation.replace("UserHome");
            } else {
                Alert.alert("Login Gagal", "Role tidak dikenali.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Login Gagal", error?.response?.data?.message || "Terjadi kesalahan saat login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={require("../../assets/image.png")} style={styles.background}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.centerContainer}>
                    <View style={styles.container}>
                        <Text style={styles.title}>LOGIN</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="EMAIL"
                            placeholderTextColor="#333"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoFocus
                            keyboardType="email-address"
                        />

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="PASSWORD"
                                placeholderTextColor="#333"
                                secureTextEntry={secureText}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                <Text style={styles.togglePassword}>{secureText ? "👁️" : "🙈"}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text style={styles.buttonText}>LOGIN</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.linkText}>
                            Don’t have an account?{" "}
                            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                                Register
                            </Text>
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#C4E7B6",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        width: "85%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#000",
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 10,
        height: 50,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
    },
    togglePassword: {
        fontSize: 18,
        color: "#333",
    },
    button: {
        backgroundColor: "#F4C2C2",
        paddingVertical: 12,
        width: "100%",
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
    linkText: {
        fontSize: 14,
        color: "#333",
    },
    link: {
        fontWeight: "bold",
        color: "#000",
    },
});

export default LoginScreen;
