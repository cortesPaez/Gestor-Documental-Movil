import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { loadMetadata, saveMetadata } from "../utils/storage";
import { WebView } from "react-native-webview";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

export default function DocumentDetailScreen({ route }) {
  const { document } = route.params;
  const [pdfSource, setPdfSource] = useState(null);
  const [nombre, setNombre] = useState(document.nombre);
  const [categoria, setCategoria] = useState(document.categoria);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (document.tipo === "PDF") {
      const loadPdf = async () => {
        try {
          const base64 = await FileSystem.readAsStringAsync(document.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setPdfSource({ uri: `data:application/pdf;base64,${base64}` });
        } catch (error) {
          console.error("Error al cargar el PDF:", error);
        }
      };
      loadPdf();
    }
  }, [document.uri, document.tipo]);

  const guardarCambios = async () => {
    try {
      const documentos = await loadMetadata();
      const actualizados = documentos.map((doc) =>
        doc.id === document.id ? { ...doc, nombre, categoria } : doc
      );
      await saveMetadata(actualizados);
      Alert.alert("Guardado", "Los cambios se han guardado correctamente.");
      setEditando(false);
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar el documento.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.metaContainer}>
        {editando ? (
          <>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
            <Text style={styles.label}>Categoría:</Text>
            <TextInput
              value={categoria}
              onChangeText={setCategoria}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={guardarCambios}
            >
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditando(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>{nombre}</Text>
            <Text style={styles.category}>
              Categoría: <Text style={styles.categoryValue}>{categoria}</Text>
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditando(true)}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {document.tipo === "imagen" ? (
        <Image
          source={{ uri: document.uri }}
          style={styles.imageViewer}
          contentFit="contain"
        />
      ) : (
        <View style={styles.pdfContainer}>
          {pdfSource ? (
            <WebView
              style={styles.pdfViewer}
              originWhitelist={["*"]}
              source={pdfSource}
              allowFileAccess={true}
            />
          ) : (
            <ActivityIndicator size="large" color="#2563eb" />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f6fb",
    padding: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  metaContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#222",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2563eb",
  },
  category: {
    fontSize: 15,
    marginBottom: 2,
  },
  categoryValue: {
    color: "#2563eb",
  },
  editButton: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  imageViewer: {
    width: "100%",
    height: 420,
    borderRadius: 18,
    backgroundColor: "#fff",
    shadowColor: "#000",
    marginVertical: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  pdfContainer: {
    width: "100%",
    height: 420,
    backgroundColor: "#fff",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    overflow: "hidden",
  },
  pdfViewer: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    backgroundColor: "#fff",
  },
  loader: {
    marginTop: 40,
  },
});
