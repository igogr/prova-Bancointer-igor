import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Text,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { COLORS } from "../../theme/theme";
import OrcamentoService from "../../services/OrcamentoService";
import OrcamentoForm from "./OrcamentoFormScreen";

export default function OrcamentoListScreen() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [orcamentoParaEditar, setOrcamentoParaEditar] = useState(null);

  useEffect(() => {
    buscarOrcamentos();
  }, []);

  async function buscarOrcamentos() {
    const lista = await OrcamentoService.listar();
    setOrcamentos(lista);
  }

  async function removerOrcamento(id) {
    await OrcamentoService.remover(id);
    alert("Orçamento excluído com sucesso!");
    buscarOrcamentos();
  }

  function abrirModal() {
    setOrcamentoParaEditar(null);
    setModalVisible(true);
  }

  function editarOrcamento(orcamento) {
    setOrcamentoParaEditar(orcamento);
    setModalVisible(true);
  }

  function fecharModal(atualizou) {
    setModalVisible(false);
    if (atualizou) buscarOrcamentos();
  }

  function formatarValor(valor) {
    if (!valor) return "0.00";
    const numero = parseFloat(
      valor.replace("R$", "").replace(/\s/g, "").replace(",", ".")
    );
    return isNaN(numero) ? "0.00" : numero.toFixed(2);
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Button
          style={styles.saveButton}
          icon="plus"
          mode="contained"
          onPress={abrirModal}
        >
          Cadastrar orçamento
        </Button>
        <FlatList
          data={orcamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardContent}>
                  <View style={styles.infoSection}>
                    <Text style={styles.labelStrong}>Nome: {item.nome}</Text>
                    <Text style={styles.labelValue}>
                      Valor limite: R$ {formatarValor(item.valorLimite)}
                    </Text>
                    <Text style={styles.labelMuted}>
                      Categoria: {item.categoria}
                    </Text>
                    <Text style={styles.labelMuted}>
                      Período: {item.dataInicio} até {item.dataFim}
                    </Text>
                    <Text style={styles.labelMuted}>Tipo: {item.tipo}</Text>
                    <Text style={styles.labelMuted}>
                      Descrição: {item.descricao}
                    </Text>
                  </View>
                  <View style={styles.iconSection}>
                    <Text style={styles.emoji}>📊</Text>
                  </View>
                </View>
              </Card.Content>

              <View style={styles.cardFooter}>
                <Button
                  icon="pencil"
                  mode="contained"
                  onPress={() => editarOrcamento(item)}
                  style={styles.footerButtonLeft}
                  labelStyle={{ color: "#fff" }}
                >
                  Editar
                </Button>
                <Button
                  icon="delete"
                  mode="contained"
                  onPress={() => removerOrcamento(item.id)}
                  style={styles.footerButtonRight}
                  labelStyle={{ color: "#fff" }}
                >
                  Deletar
                </Button>
              </View>
            </Card>
          )}
        />

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => fecharModal(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <OrcamentoForm
              orcamentoAntigo={orcamentoParaEditar || {}}
              onFechar={fecharModal}
            />
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: COLORS.primary,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoSection: {
    flex: 1,
  },
  iconSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 8,
  },
  emoji: {
    fontSize: 36,
  },
  labelStrong: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  labelValue: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  labelMuted: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  footerButtonLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
    marginRight: 6,
    borderRadius: 8,
  },
  footerButtonRight: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    marginLeft: 6,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
});
