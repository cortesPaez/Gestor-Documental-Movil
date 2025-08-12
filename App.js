import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import DocumentListScreen from "./screens/DocumentListScreen";
import AddDocumentScreen from "./screens/AddDocumentScreen";
import DocumentDetailScreen from "./screens/DocumentDetailScreen"; // <-- 1. Asegúrate de que esté importada

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DocumentList">
        <Stack.Screen
          name="DocumentList"
          component={DocumentListScreen}
          options={{ title: "Mis Documentos" }}
        />
        <Stack.Screen
          name="AddDocument"
          component={AddDocumentScreen}
          options={{ title: "Agregar Nuevo" }}
        />
        <Stack.Screen // <-- 2. Debe estar declarada aquí
          name="DocumentDetail"
          component={DocumentDetailScreen}
          options={({ route }) => ({ title: route.params.document.nombre })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
