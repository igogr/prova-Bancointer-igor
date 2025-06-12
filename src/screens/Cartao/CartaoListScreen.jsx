import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Image } from "react-native";
import {
  Button,
  Card,
  Text,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { COLORS } from "../../theme/theme";
import CartaoForm from "./CartaoFormScreen";
import CartaoService from "../../services/CartaoService";

const BANDEIRAS_ICONS = {
  visa: require("../../assets/icons/icons8-visa-48.png"),
  mastercard: require("../../assets/icons/icons8-mastercard-48.png"),
  elo: require("../../assets/icons/elo-icon-512x512-mdisd91g.png"),
  hipercard: require("../../assets/icons/hipercard_logo-180x78.png"),
  amex: require("../../assets/icons/icons8-amex-48.png"),
  discover: require("../../assets/icons/icons8-descobrir-48.png"),
};

export default function CartaoListScreen() {
  const [cartoes, setCartoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartaoParaEditar, setCartaoParaEditar] = useState(null);

  useEffect(() => {
    buscarCartoes();
  }, []);

  async function buscarCartoes() {
    const lista = await CartaoService.listar();
    setCartoes(lista);
  }

  async function removerCartao(id) {
    await CartaoService.remover(id);
    alert("Cartão excluído com sucesso!");
    buscarCartoes();
  }

  function abrirModal() {
    setCartaoParaEditar(null);
    setModalVisible(true);
  }

  function editarCartao(cartao) {
    setCartaoParaEditar(cartao);
    setModalVisible(true);
  }

  function fecharModal(atualizou) {
    setModalVisible(false);
    if (atualizou) buscarCartoes();
  }

  function mascararNumero(numero = "") {
    const limpo = numero.replace(/\s/g, "");
    if (limpo.length < 4) return "****";
    return "**** **** **** " + limpo.slice(-4);
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
          Cadastrar cartão
        </Button>

        <FlatList
          data={cartoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.banco}>{item.banco}</Text>
              </View>

              <View style={styles.cardMiddle}>
                <Text style={styles.numeroCartao}>
                  {mascararNumero(item.numero)}
                </Text>
                <Text style={styles.nomeTitular}>{item.titular}</Text>

                <View style={styles.linhaInfo}>
                  <Text style={styles.label}>Validade: {item.validade}</Text>
                  <Text style={styles.label}>CVV: {item.cvv}</Text>
                </View>
              </View>

              <View style={styles.cardBottom}>
                {BANDEIRAS_ICONS[item.bandeira] && (
                  <Image
                    source={BANDEIRAS_ICONS[item.bandeira]}
                    style={styles.bandeira}
                  />
                )}
              </View>

              <View style={styles.cardFooter}>
                <Button
                  icon="pencil"
                  mode="contained"
                  onPress={() => editarCartao(item)}
                  style={styles.footerButtonLeft}
                  labelStyle={{ color: "#fff" }}
                >
                  Editar
                </Button>
                <Button
                  icon="delete"
                  mode="contained"
                  onPress={() => removerCartao(item.id)}
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
            <CartaoForm
              cartaoAntigo={cartaoParaEditar || {}}
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
  },
  card: {
    backgroundColor: "#1E1E2D",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTop: {
    marginBottom: 8,
  },
  banco: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cardMiddle: {
    marginBottom: 8,
  },
  numeroCartao: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 4,
  },
  nomeTitular: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
  },
  linhaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#aaa",
    fontSize: 12,
  },
  cardBottom: {
    alignItems: "flex-end",
  },
  bandeira: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  cardFooter: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  footerButtonLeft: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  footerButtonRight: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
  },
});
