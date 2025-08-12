import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

export default function DocumentDetailScreen({ route }) {
  const { document } = route.params;
  const [pdfSource, setPdfSource] = useState(null);

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

  return (
    <View style={styles.container}>
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
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageViewer: {
    flex: 1,
    width: "100%",
  },
  pdfContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pdfViewer: {
    flex: 1,
    width: "100%",
  },
});
