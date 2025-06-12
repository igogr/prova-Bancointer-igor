import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await login(email, senha);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Acesse sua conta</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          outlineColor="#FF6600"
          activeOutlineColor="#FF6600"
        />

        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          mode="outlined"
          style={styles.input}
          outlineColor="#FF6600"
          activeOutlineColor="#FF6600"
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Entrar
        </Button>

        <Button
          onPress={() => navigation.navigate("RegisterScreen")}
          style={styles.link}
          labelStyle={{ color: "#FF6600" }}
        >
          Criar conta
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 24,
    color: "#333333",
    fontWeight: "600",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF6600",
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
  },
  link: {
    marginTop: 16,
    alignSelf: "center",
  },
});
