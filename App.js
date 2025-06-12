import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabRoutes from "./src/routes/BottomTabRoutes";
import AuthRoutes from "./src/routes/AuthRoutes";
import { AuthProvider, AuthContext } from "./src/contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ usuario, carregando }) =>
          carregando ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <NavigationContainer>
              {usuario ? <BottomTabRoutes /> : <AuthRoutes />}
            </NavigationContainer>
          )
        }
      </AuthContext.Consumer>
    </AuthProvider>
  );
}
