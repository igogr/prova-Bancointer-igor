import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  ActivityIndicator,
  Divider,
  Avatar,
} from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

// DEFININDO AS CORES DO BANCO INTER
const COLORS = {
  primary: "#FF7A00", // Laranja Inter
  background: "#F3F3F3", // Fundo cinza claro
  surface: "#FFFFFF", // Fundo dos cards
  text: "#5E5E5E", // Texto principal
  muted: "#8C8C8C", // Texto secundário
  green: "#00A96E", // Cor para valores positivos/cotações
};

const HomeScreen = () => {
  const [cotacoes, setCotacoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const moedas = ["USD-BRL", "EUR-BRL", "BTC-BRL"];
  const { logout, usuario } = useContext(AuthContext);

  useEffect(() => {
    const fetchCotacoes = async () => {
      try {
        const response = await axios.get(
          `https://economia.awesomeapi.com.br/last/${moedas.join(",")}`
        );
        setCotacoes(response.data);
      } catch (error) {
        console.error("Erro ao buscar cotações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCotacoes();
  }, []);

  // Menu de atalhos com ícones do MaterialCommunityIcons (padrão do react-native-paper)
  const atalhos = [
    { icon: "swap-horizontal", label: "Área Pix" },
    { icon: "credit-card-outline", label: "Cartões" },
    { icon: "chart-line", label: "Investir" },
    { icon: "barcode-scan", label: "Pagar" },
    { icon: "arrow-up-bold-box-outline", label: "Depósito" },
    { icon: "cellphone", label: "Recarga" },
  ];

  const getIcon = (code) => {
    switch (code) {
      case "USD": return "💵";
      case "EUR": return "💶";
      case "BTC": return "🪙";
      default: return "💰";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Avatar.Icon size={48} icon="account-circle-outline" style={styles.avatar} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.helloText}>Olá, {usuario?.nome || "Usuário"}</Text>
          <Text style={styles.agencyAccountText}>Ag: 0001 | Conta: 1234567-8</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setSaldoVisivel(!saldoVisivel)}>
             <Avatar.Icon size={40} icon={saldoVisivel ? "eye-outline" : "eye-off-outline"} style={styles.headerAvatarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} >
             <Avatar.Icon size={40} icon="logout" style={styles.headerAvatarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CARD DE SALDO */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Saldo em conta</Text>
          <Text style={styles.saldoValue}>
            {saldoVisivel ? "R$ 1.000.000.000,00" : "••••••••"}
          </Text>
        </Card.Content>
      </Card>

      {/* MENU DE ATALHOS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.atalhosContainer}>
        {atalhos.map((item, index) => (
           <TouchableOpacity key={index} style={styles.atalhoButton}>
             <Avatar.Icon size={52} icon={item.icon} style={styles.atalhoIcon} color={COLORS.primary} />
             <Text style={styles.atalhoLabel}>{item.label}</Text>
           </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CARD DE COTAÇÕES */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Câmbio</Text>
          {loading ? (
            <ActivityIndicator style={{marginTop: 20}} animating={true} size="large" color={COLORS.primary} />
          ) : (
            moedas.map((codigo, index) => {
              const info = cotacoes[codigo.replace("-", "")];
              if (!info) return null;
              return (
                <View key={codigo}>
                  {index > 0 && <Divider style={styles.innerDivider} />}
                  <View style={styles.infoRow}>
                    <Text style={styles.moedaLabel}>{getIcon(info.code)} {info.name}</Text>
                    <Text style={styles.moedaValor}>R$ {parseFloat(info.bid).toFixed(2)}</Text>
                  </View>
                </View>
              );
            })
          )}
        </Card.Content>
      </Card>
      <View style={{height: 40}} />
    </ScrollView>
  );
};

// --- NOVOS ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    backgroundColor: 'transparent',
    borderColor: COLORS.background,
  },
  headerTextContainer: {
     marginLeft: 8,
  },
  helloText: {
    fontSize: 16,
    color: COLORS.text,
  },
  agencyAccountText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  headerAvatarIcon: {
      backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 8,
  },
  saldoValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
  },
  atalhosContainer: {
    paddingVertical: 20,
    paddingLeft: 16,
  },
  atalhoButton: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  atalhoIcon: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  atalhoLabel: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    color: COLORS.text,
    height: 35, // Garante que textos com 2 linhas tenham o mesmo espaço
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 14,
  },
  moedaLabel: {
    fontSize: 16,
    color: COLORS.text,
    flexShrink: 1, // Permite que o texto quebre a linha se necessário
    paddingRight: 8,
  },
  moedaValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.green,
  },
  innerDivider: {
    backgroundColor: COLORS.background,
    height: 1,
  },
});

export default HomeScreen;