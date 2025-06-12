import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

// Importe suas telas
import HomeScreen from "../screens/Home/HomeScreen";
import TransacaoListScreen from "../screens/Transacao/TransacaoListScreen";
import CartaoListScreen from "../screens/Cartao/CartaoListScreen";
import OrcamentoListScreen from "../screens/Orcamento/OrcamentoListScreen";

const Tab = createBottomTabNavigator();

// Paleta de cores inspirada no Banco Inter
const COLORS = {
  primary: "#FF7A00", // Laranja Inter
  inactive: "#8C8C8C", // Cinza para ícones inativos
  background: "#FFFFFF", // Fundo branco
  text: "#333333", // Texto escuro para títulos
  border: "#E0E0E0", // Cor da borda sutil
};

export default function BottomTabRoutes({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        // --- ESTILOS DO HEADER (TOPO) ---
        headerShown: true, // Garante que o header esteja sempre visível
        headerStyle: {
          backgroundColor: COLORS.background, // Fundo branco
          elevation: 1, // Sombra sutil no Android
          shadowOpacity: 0.1, // Sombra sutil no iOS
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
          borderBottomWidth: 1, // Borda inferior no header
          borderBottomColor: COLORS.border,
        },
        headerTitleAlign: "center", // Título no centro
        headerTitleStyle: {
          color: COLORS.text, // Cor do texto escura
          fontWeight: "bold",
          fontSize: 18,
        },
        // Remove o título do header da tela Home para não duplicar com o conteúdo da tela
        ...(route.name === "Home" && { headerTitle: "" }),

        // --- ESTILOS DA BARRA DE ABAS (EMBAIXO) ---
        tabBarActiveTintColor: COLORS.primary, // Cor do ícone/texto ativo
        tabBarInactiveTintColor: COLORS.inactive, // Cor do ícone/texto inativo
        tabBarStyle: {
          backgroundColor: COLORS.background, // Fundo branco
          borderTopWidth: 1, // Borda na parte de cima
          borderTopColor: COLORS.border,
          borderBottomWidth: 1, // Borda na parte de baixo
          borderBottomColor: COLORS.border,
          paddingBottom: 5, // Espaçamento interno
          paddingTop: 5,
          height: 60, // Altura da barra
        },

        // --- LÓGICA DOS ÍCONES ---
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Transações") {
            iconName = "swap-horizontal-outline";
          } else if (route.name === "Cartões") {
            iconName = "card-outline";
          } else if (route.name === "Orçamentos") {
            iconName = "cash-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* --- DEFINIÇÃO DAS TELAS --- */}
      <Tab.Screen name="Home" options={{ title: "Minha Conta" }}>
        {() => <HomeScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Transações" component={TransacaoListScreen} />
      <Tab.Screen name="Cartões" component={CartaoListScreen} />
      <Tab.Screen name="Orçamentos" component={OrcamentoListScreen} />
    </Tab.Navigator>
  );
}