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
import TransacaoService from "../../services/TransacaoService";
import TransacaoForm from "./TransacaoFormScreen";
import { COLORS } from "../../theme/theme";

export default function TransacaoListScreen() {
  const [transacoes, setTransacoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [transacaoParaEditar, setTransacaoParaEditar] = useState(null);

  useEffect(() => {
    buscarTransacoes();
  }, []);

  async function buscarTransacoes() {
    const lista = await TransacaoService.listar();
    setTransacoes(lista);
  }

  async function removerTransacao(id) {
    await TransacaoService.remover(id);
    alert("Transação excluída com sucesso!");
    buscarTransacoes();
  }

  function abrirModal() {
    setTransacaoParaEditar(null);
    setModalVisible(true);
  }

  function editarTransacao(transacao) {
    setTransacaoParaEditar(transacao);
    setModalVisible(true);
  }

  function fecharModal(atualizou) {
    setModalVisible(false);
    if (atualizou) buscarTransacoes();
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
          Cadastrar transação
        </Button>
        <FlatList
          data={transacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardContent}>
                  <View style={styles.infoSection}>
                    <Text style={styles.labelStrong}>
                      Nome: {item.descricao}
                    </Text>
                    <Text style={styles.labelValue}>
                      Valor: R$ {formatarValor(item.valor)}
                    </Text>
                    <Text style={styles.labelMuted}>Data: {item.data}</Text>
                    <Text style={styles.labelMuted}>Tipo: {item.tipo}</Text>
                    <Text style={styles.labelMuted}>
                      Categoria: {item.categoria}
                    </Text>
                    <Text />
                  </View>
                  <View style={styles.iconSection}>
                    <Text style={styles.emoji}>🛒</Text>
                  </View>
                </View>
              </Card.Content>

              <View style={styles.cardFooter}>
                <Button
                  icon="pencil"
                  mode="contained"
                  onPress={() => editarTransacao(item)}
                  style={styles.footerButtonLeft}
                  labelStyle={{ color: "#fff" }}
                >
                  Editar
                </Button>
                <Button
                  icon="delete"
                  mode="contained"
                  onPress={() => removerTransacao(item.id)}
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
            <TransacaoForm
              transacaoAntiga={transacaoParaEditar || {}}
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
