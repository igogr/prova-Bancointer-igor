import { createStackNavigator } from "@react-navigation/stack";

import TransacaoFormScreen from "../screens/Transacao/TransacaoFormScreen";
import TransacaoListScreen from "../screens/Transacao/TransacaoListScreen";

const Stack = createStackNavigator();

export default function TransacaoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TransacaoListScreen"
        component={TransacaoListScreen}
        options={{
          title: "Lista de Transações",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="TransacaoFormScreen"
        component={TransacaoFormScreen}
        options={{
          title: "Formulário de Transação",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
