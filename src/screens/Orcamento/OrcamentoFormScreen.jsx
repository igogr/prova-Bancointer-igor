import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Button, Text, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../../theme/theme";
import OrcamentoService from "../../services/OrcamentoService";

const CATEGORIAS = [
  { label: "Mercado", value: "Mercado" },
  { label: "Shopping", value: "Shopping" },
  { label: "Médico", value: "Médico" },
  { label: "Mecânico", value: "Mecânico" },
];

const TIPOS = [
  { label: "Pessoal", value: "Pessoal" },
  { label: "Familiar", value: "Familiar" },
  { label: "Compartilhado", value: "Compartilhado" },
  { label: "Empresarial", value: "Empresarial" },
];

export default function OrcamentoForm({ orcamentoAntigo = {}, onFechar }) {
  const [nome, setNome] = useState("");
  const [valorLimite, setValorLimite] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    setNome(orcamentoAntigo.nome || "");
    setValorLimite(orcamentoAntigo.valorLimite || "");
    setCategoria(orcamentoAntigo.categoria || "");
    setDataInicio(orcamentoAntigo.dataInicio || "");
    setDataFim(orcamentoAntigo.dataFim || "");
    setTipo(orcamentoAntigo.tipo || "");
    setDescricao(orcamentoAntigo.descricao || "");
  }, [orcamentoAntigo]);

  async function salvar() {
    if (
      !nome ||
      !valorLimite ||
      !categoria ||
      !dataInicio ||
      !dataFim ||
      !tipo ||
      !descricao
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const orcamento = {
      id: orcamentoAntigo.id || new Date().getTime(),
      nome,
      valorLimite,
      categoria,
      dataInicio,
      dataFim,
      tipo,
      descricao,
    };

    if (orcamentoAntigo.id) {
      await OrcamentoService.atualizar(orcamento);
      alert("Orçamento atualizado com sucesso!");
    } else {
      await OrcamentoService.salvar(orcamento);
      alert("Orçamento cadastrado com sucesso!");
    }

    onFechar(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {orcamentoAntigo.id
          ? `Editando ID: ${orcamentoAntigo.id}`
          : "Novo Orçamento"}
      </Text>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Nome do orçamento"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Valor limite"
        value={valorLimite}
        onChangeText={setValorLimite}
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

      <View style={styles.dateRow}>
        <View style={styles.dateColumn}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Data Início"
            value={dataInicio}
            onChangeText={setDataInicio}
            keyboardType="numeric"
            render={(props) => (
              <TextInputMask
                {...props}
                type={"datetime"}
                options={{ format: "DD/MM/YYYY" }}
              />
            )}
          />
        </View>
        <View style={styles.dateColumn}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Data Fim"
            value={dataFim}
            onChangeText={setDataFim}
            keyboardType="numeric"
            render={(props) => (
              <TextInputMask
                {...props}
                type={"datetime"}
                options={{ format: "DD/MM/YYYY" }}
              />
            )}
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tipo" value="" enabled={false} />
          {TIPOS.map((t) => (
            <Picker.Item key={t.value} label={t.label} value={t.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Categoria" value="" enabled={false} />
          {CATEGORIAS.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.footerButtonLeft}
          mode="contained"
          onPress={salvar}
        >
          Salvar
        </Button>
        <Button
          style={styles.footerButtonRight}
          mode="contained"
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
    height: 56,
    width: "100%",
    paddingHorizontal: 8,
    fontSize: 16,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateColumn: {
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
