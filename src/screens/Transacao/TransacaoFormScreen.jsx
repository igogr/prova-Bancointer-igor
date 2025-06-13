import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import { Button, Text, SegmentedButtons, Menu, Divider, useTheme, TextInput } from "react-native-paper";
import TransacaoService from "../../services/TransacaoService";

const CATEGORIAS = [
  "Alimentação", "Moradia", "Transporte", "Saúde", "Lazer", 
  "Educação", "Vestuário", "Serviços", "Pets", "Outros"
];

export default function TransacaoForm({ transacaoAntiga = {}, onFechar }) {
  const theme = useTheme();

  // Estados do formulário
  const [tipo, setTipo] = useState("despesa");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState(""); // Data volta a ser string
  
  const [menuVisivel, setMenuVisivel] = useState(false);

  useEffect(() => {
    if (transacaoAntiga.id) {
      setTipo(transacaoAntiga.tipo || "despesa");
      setValor(transacaoAntiga.valor?.toString() || "");
      setDescricao(transacaoAntiga.descricao || "");
      setCategoria(transacaoAntiga.categoria || "");
      setData(transacaoAntiga.data || ""); // Data como string
    }
  }, [transacaoAntiga]);


  async function salvar() {
    const valorNumerico = parseFloat(valor.replace("R$", "").replace(".", "").replace(",", ".").trim());

    if (!descricao || valorNumerico <= 0 || !data || !categoria) {
      alert("Preencha todos os campos corretamente!");
      return;
    }
    // Validação simples do formato da data
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        alert("Por favor, insira a data no formato DD/MM/AAAA.");
        return;
    }

    const transacao = {
      id: transacaoAntiga.id || new Date().getTime(),
      descricao,
      valor: valorNumerico,
      data,
      tipo,
      categoria,
    };

    try {
      if (transacaoAntiga.id) {
        await TransacaoService.atualizar(transacao);
        alert("Transação alterada com sucesso!");
      } else {
        await TransacaoService.salvar(transacao);
        alert("Transação cadastrada com sucesso!");
      }
      onFechar(true);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Ocorreu um erro ao salvar a transação.");
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text variant="titleLarge" style={styles.title}>
        {transacaoAntiga.id ? "Editar Transação" : "Nova Transação"}
      </Text>

      <Text style={styles.label}>Tipo de Transação</Text>
      <SegmentedButtons
        value={tipo}
        onValueChange={setTipo}
        style={styles.segment}
        buttons={[
          { value: "despesa", label: "Despesa", icon: "arrow-down-circle" },
          { value: "receita", label: "Receita", icon: "arrow-up-circle" },
        ]}
      />

      <TextInput
        style={styles.input}
        mode="outlined"
        label="Descrição"
        placeholder="Ex: Almoço no shopping"
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
        render={(props) => <TextInputMask {...props} type={"money"} />}
      />

      {/* CAMPO DE DATA REVERTIDO PARA O MODO ANTIGO */}
       <TextInput
        style={styles.input}
        mode="outlined"
        label="Data (DD/MM/AAAA)"
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
      
      {/* SELETOR DE CATEGORIA COM MENU */}
      <Menu
        visible={menuVisivel}
        onDismiss={() => setMenuVisivel(false)}
        anchor={
          <TouchableOpacity onPress={() => setMenuVisivel(true)}>
            <TextInput
              style={styles.input}
              mode="outlined"
              label="Categoria"
              value={categoria}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          </TouchableOpacity>
        }
      >
        {CATEGORIAS.map((cat) => (
          <Menu.Item
            key={cat}
            onPress={() => {
              setCategoria(cat);
              setMenuVisivel(false);
            }}
            title={cat}
          />
        ))}
      </Menu>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="outlined"
          onPress={() => onFechar(false)}
        >
          Cancelar
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={salvar}
          icon="check"
        >
          Salvar
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      textAlign: "center",
      marginBottom: 24,
      fontWeight: 'bold',
    },
    label: {
      marginBottom: 8,
      fontSize: 14,
      color: '#5E5E5E',
    },
    input: {
      marginBottom: 16,
    },
    segment: {
      marginBottom: 24,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 24,
      marginBottom: 16
    },
    button: {
      flex: 1,
    },
  });