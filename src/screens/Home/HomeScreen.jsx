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

// 1. PALETA DE CORES OFICIAL DO BANCO INTER
const COLORS = {
  primary: '#FF7A00',      // Laranja Inter
  darkGray: '#3C3C3C',     // Textos de maior importância
  mediumGray: '#5E5E5E',   // Textos secundários (substitui o antigo 'text')
  lightGray: '#F3F3F3',    // Fundo da tela (substitui o antigo 'background')
  white: '#FFFFFF',        // Fundo de cards (substitui o antigo 'surface')
  muted: '#8C8C8C',        // Textos com menos destaque
  green: '#00A96E',        // Valores positivos, sucesso
  red: '#E74C3C',          // Erros, alertas
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
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setSaldoVisivel(!saldoVisivel)}>
              <Avatar.Icon size={40} icon={saldoVisivel ? "eye-outline" : "eye-off-outline"} style={styles.headerAvatarIcon} color={COLORS.mediumGray} />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} >
              <Avatar.Icon size={40} icon="logout" style={styles.headerAvatarIcon} color={COLORS.mediumGray} />
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

// 2. ESTILOS ATUALIZADOS PARA USAR AS NOVAS CORES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray, // Fundo da tela
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white, // Fundo do cabeçalho
  },
  avatar: {
    backgroundColor: 'transparent',
  },
  headerTextContainer: {
     marginLeft: 8,
     justifyContent: 'center',
     flex: 1,
  },
  helloText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray, // Texto principal
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatarIcon: {
      backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: COLORS.white, // Fundo do card
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.muted, // Texto com menos destaque
    marginBottom: 8,
  },
  saldoValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.darkGray, // Texto do saldo
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 14,
  },
  moedaLabel: {
    fontSize: 16,
    color: COLORS.mediumGray, // Texto secundário
    flexShrink: 1,
    paddingRight: 8,
  },
  moedaValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.green, // Cor de valorização
  },
  innerDivider: {
    backgroundColor: COLORS.lightGray, // Cor do divisor igual ao fundo
    height: 1,
  },
});

export default HomeScreen;