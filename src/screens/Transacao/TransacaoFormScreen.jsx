import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import {
  Button,
  Text,
  TextInput,
  SegmentedButtons,
  Menu,
} from "react-native-paper";
import TransacaoService from "../../services/TransacaoService";
import { COLORS } from "../../theme/theme";
import { Picker } from "@react-native-picker/picker";

const CATEGORIAS = [
  { label: "Mercado", value: "Mercado" },
  { label: "Shopping", value: "Shopping" },
  { label: "Médico", value: "Médico" },
  { label: "Mecânico", value: "Mecânico" },
  { label: "Transporte", value: "Transporte" },
  { label: "Educação", value: "Educação" },
  { label: "Lazer", value: "Lazer" },
  { label: "Restaurante", value: "Restaurante" },
  { label: "Farmácia", value: "Farmácia" },
  { label: "Pets", value: "Pets" },
  { label: "Casa", value: "Casa" },
  { label: "Eletrônicos", value: "Eletrônicos" },
  { label: "Vestuário", value: "Vestuário" },
  { label: "Viagem", value: "Viagem" },
  { label: "Serviços", value: "Serviços" },
  { label: "Beleza", value: "Beleza" },
  { label: "Doações", value: "Doações" },
  { label: "Investimentos", value: "Investimentos" },
  { label: "Outros", value: "Outros" }
];

export default function TransacaoForm({ transacaoAntiga = {}, onFechar }) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    setDescricao(transacaoAntiga.descricao || "");
    setValor(transacaoAntiga.valor || "");
    setData(transacaoAntiga.data || "");
    setTipo(transacaoAntiga.tipo || "despesa");
    setCategoria(transacaoAntiga.categoria || "");
  }, [transacaoAntiga]);

  async function salvar() {
    if (!descricao || !valor || !data || !tipo || !categoria) {
      alert("Preencha todos os campos!");
      return;
    }

    const transacao = {
      id: transacaoAntiga.id || new Date().getTime(),
      descricao,
      valor,
      data,
      tipo,
      categoria,
    };

    if (transacaoAntiga.id) {
      await TransacaoService.atualizar(transacao);
      alert("Transação alterada com sucesso!");
    } else {
      await TransacaoService.salvar(transacao);
      alert("Transação cadastrada com sucesso!");
    }

    onFechar(true);
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {transacaoAntiga.id
          ? `Editando ID: ${transacaoAntiga.id}`
          : "Nova Transação"}
      </Text>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        render={(props) => (
          <TextInputMask
            {...props}
            type={"money"}
            options={{
              precision: 2,
              separator: ",",
              delimiter: ".",
              unit: "R$ ",
              suffixUnit: "",
            }}
          />
        )}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Data"
        value={data}
        onChangeText={setData}
        keyboardType="numeric"
        render={(props) => (
          <TextInputMask
            {...props}
            type={"datetime"}
            options={{ format: "DD/MM/YYYY" }}
          />
        )}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Categoria" value="" enabled={false}/>
          {CATEGORIAS.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      <SegmentedButtons
        value={tipo}
        onValueChange={setTipo}
        style={styles.segment}
        buttons={[
          { value: "Despesa", label: "Despesa" },
          { value: "Receita", label: "Receita" },
        ]}
        theme={{
          colors: {
            secondaryContainer: COLORS.primaryLight,
            onSecondaryContainer: COLORS.primary,
            outline: COLORS.primary,
          },
        }}
      />

      <View style={styles.buttonContainer}>
        <Button
          style={styles.footerButtonLeft}
          mode="contained"
          onPress={salvar}
          labelStyle={{ color: "#fff" }}
        >
          Salvar
        </Button>
        <Button
          style={styles.footerButtonRight}
          mode="contained"
          onPress={() => onFechar(false)}
          labelStyle={{ color: "#fff" }}
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
  segment: {
    marginBottom: 12,
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
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    color: COLORS.text,
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
    height: 52,
    width: "100%",
  },
});
