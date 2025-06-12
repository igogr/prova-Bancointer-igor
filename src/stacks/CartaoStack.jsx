import { createStackNavigator } from "@react-navigation/stack";

import CartaoListScreen from "../screens/Cartao/CartaoListScreen";
import CartaoFormScreen from "../screens/Cartao/CartaoFormScreen";

const Stack = createStackNavigator();

export default function CartaoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartaoListScreen"
        component={CartaoListScreen}
        options={{
          title: "Meus Cartões",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="CartaoFormScreen"
        component={CartaoFormScreen}
        options={{
          title: "Cadastro de Cartão",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
