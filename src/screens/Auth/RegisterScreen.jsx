import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import AuthService from "../../services/AuthService";
import { COLORS } from "../../theme/theme";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    try {
      if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
      }

      await AuthService.registrar({ nome, email, senha });
      alert("Cadastro realizado com sucesso!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        outlineColor={COLORS.primary}
        activeOutlineColor={COLORS.primary}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Cadastrar
      </Button>

      <Button
        onPress={() => navigation.navigate("LoginScreen")}
        style={styles.link}
        labelStyle={{ color: COLORS.primary }}
      >
        Já tem uma conta? Fazer login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  link: {
    marginTop: 12,
  },
});
