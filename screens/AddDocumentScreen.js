import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Agregar documento</Text>
        <Text style={styles.subtitle}>
          Selecciona un archivo PDF o imagen para cargarlo.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlePickDocument}>
          <Text style={styles.buttonText}>Seleccionar PDF o Imagen</Text>
        </TouchableOpacity>
        <Text style={styles.info}>
          Solo se permiten archivos PDF o imágenes.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f6fb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#222",
    marginBottom: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 18,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  info: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },
});
