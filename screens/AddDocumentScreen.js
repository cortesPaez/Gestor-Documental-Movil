import { Button, View, Text, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { loadMetadata, saveMetadata } from "../utils/storage";

export default function AddDocumentScreen({ navigation }) {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const file = result.assets[0];

        const newMetadata = {
          id: Date.now().toString(),
          nombre: file.name,
          categoria: "Sin categorizar",
          fechaCarga: new Date().toISOString(),
          tipo: file.mimeType.startsWith("image") ? "imagen" : "PDF",
          uri: file.uri,
        };

        const existingDocuments = await loadMetadata();
        const updatedDocuments = [...existingDocuments, newMetadata];
        await saveMetadata(updatedDocuments);

        Alert.alert("Éxito", `Archivo "${file.name}" agregado.`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error("Error al seleccionar documento:", err);
      Alert.alert("Error", "Hubo un problema al seleccionar el documento.");
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ marginBottom: 20, fontSize: 32 }}>
        Seleccione un archivo.
      </Text>
      <View style={{ gap: 2 }}>
        <Button title="Seleccionar PDF o Imagen" onPress={handlePickDocument} style={{padding: "20px"}}/>
        <Text style={{ marginBottom: 20, fontSize: 14 }}>
          Permitido solo PDF o imagenes.
        </Text>
      </View>
    </View>
  );
}
