import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Text, TextInput, Button, SegmentedButtons } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../theme/theme";
import CartaoService from "../../services/CartaoService";

const BANDEIRAS = [
  {
    label: "Visa",
    value: "visa",
    icon: require("../../assets/icons/icons8-visa-48.png"),
  },
  {
    label: "Mastercard",
    value: "mastercard",
    icon: require("../../assets/icons/icons8-mastercard-48.png"),
  },
  {
    label: "Elo",
    value: "elo",
    icon: require("../../assets/icons/elo-icon-512x512-mdisd91g.png"),
  },
  {
    label: "Hipercard",
    value: "hipercard",
    icon: require("../../assets/icons/hipercard_logo-180x78.png"),
  },
  {
    label: "Amex",
    value: "amex",
    icon: require("../../assets/icons/icons8-amex-48.png"),
  },
  {
    label: "Discover",
    value: "discover",
    icon: require("../../assets/icons/icons8-descobrir-48.png"),
  },
];

const BANCOS = [
  "Nubank",
  "Banco do Brasil",
  "Caixa",
  "Bradesco",
  "Itaú",
  "Santander",
  "Inter",
  "Neon",
  "C6 Bank",
];

export default function CartaoForm({ cartaoAntigo = {}, onFechar }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("credito");
  const [bandeira, setBandeira] = useState("");
  const [titular, setTitular] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [banco, setBanco] = useState("");
  const [numero, setNumero] = useState("");

  useEffect(() => {
    setNome(cartaoAntigo.nome || "");
    setTipo(cartaoAntigo.tipo || "credito");
    setBandeira(cartaoAntigo.bandeira || "");
    setTitular(cartaoAntigo.titular || "");
    setValidade(cartaoAntigo.validade || "");
    setCvv(cartaoAntigo.cvv || "");
    setBanco(cartaoAntigo.banco || "");
    setNumero(cartaoAntigo.numero || "");
  }, [cartaoAntigo]);

  async function salvar() {
    if (
      !nome ||
      !tipo ||
      !bandeira ||
      !titular ||
      !validade ||
      !cvv ||
      !banco
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const cartao = {
      id: cartaoAntigo.id || new Date().getTime(),
      nome,
      numero,
      tipo,
      bandeira,
      titular,
      validade,
      cvv,
      banco,
    };

    if (cartaoAntigo.id) {
      await CartaoService.atualizar(cartao);
      alert("Cartão atualizado com sucesso!");
    } else {
      await CartaoService.salvar(cartao);
      alert("Cartão cadastrado com sucesso!");
    }

    onFechar(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {cartaoAntigo.id ? "Editando Cartão" : "Novo Cartão"}
      </Text>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Nome do cartão"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Número do cartão"
        value={numero}
        onChangeText={setNumero}
        keyboardType="numeric"
        render={(props) => <TextInputMask {...props} type={"credit-card"} />}
      />

      <SegmentedButtons
        value={tipo}
        onValueChange={setTipo}
        style={styles.segment}
        buttons={[
          { value: "credito", label: "Crédito" },
          { value: "debito", label: "Débito" },
          { value: "ambos", label: "Ambos" },
        ]}
        theme={{
          colors: {
            secondaryContainer: COLORS.primaryLight,
            onSecondaryContainer: COLORS.primary,
            outline: COLORS.primary,
          },
        }}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={banco}
          onValueChange={setBanco}
          style={styles.picker}
        >
          <Picker.Item label="Banco" value="" enabled={false} />
          {BANCOS.map((b) => (
            <Picker.Item key={b} label={b} value={b} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Nome do titular"
        value={titular}
        onChangeText={setTitular}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flex1]}
          mode="outlined"
          label="Validade"
          value={validade}
          onChangeText={setValidade}
          keyboardType="numeric"
          render={(props) => (
            <TextInputMask
              {...props}
              type={"custom"}
              options={{ mask: "99/9999" }}
            />
          )}
        />
        <TextInput
          style={[styles.input, styles.flex1]}
          mode="outlined"
          label="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      <View style={styles.bandeiraContainer}>
        {BANDEIRAS.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => setBandeira(item.value)}
            style={[
              styles.bandeiraIcon,
              bandeira === item.value && styles.bandeiraSelecionada,
            ]}
          >
            <Image source={item.icon} style={styles.bandeiraImagem} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.footerButtonLeft}
          onPress={salvar}
        >
          Salvar
        </Button>
        <Button
          mode="contained"
          style={styles.footerButtonRight}
          onPress={() => onFechar(false)}
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: 12,
    borderRadius: 10,
  },
  label: {
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 6,
    textAlign: "center",
  },
  segment: {
    marginBottom: 12,
  },
  bandeiraContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  bandeiraIcon: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    padding: 6,
    backgroundColor: COLORS.primaryLight,
  },
  bandeiraSelecionada: {
    borderColor: COLORS.primary,
    backgroundColor: "#fff",
  },
  bandeiraImagem: {
    width: 73,
    height: 30,
    resizeMode: "contain",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 56,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  footerButtonLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  footerButtonRight: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 10,
  },
});
