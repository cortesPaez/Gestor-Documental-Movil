import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { loadMetadata } from "../utils/storage";

export default function DocumentListScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const isFocused = useIsFocused();

  const fetchDocuments = async () => {
    const data = await loadMetadata();
    setDocuments(data);
  };

  useEffect(() => {
    if (isFocused) {
      fetchDocuments();
    }
  }, [isFocused]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.nombre
      .toLowerCase()
      .includes(searchText.toLowerCase());
    console.log(doc.tipo === "PDF");

    const matchesFilter =
      filterType === "Todos" || doc.tipo.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => navigation.navigate("DocumentDetail", { document: item })}
    >
      <Text style={styles.documentName}>📁 {item.nombre}</Text>
      <Text>Categoría: {item.categoria}</Text>
      <Text>Tipo: {item.tipo}</Text>
      <Text>
        Fecha de carga: {new Date(item.fechaCarga).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Agregar Nuevo Documento"
        onPress={() => navigation.navigate("AddDocument")}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por nombre..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "Todos" && styles.activeFilter,
          ]}
          onPress={() => setFilterType("Todos")}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "PDF" && styles.activeFilter,
          ]}
          onPress={() => setFilterType("PDF")}
        >
          <Text style={styles.filterText}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "Imagen" && styles.activeFilter,
          ]}
          onPress={() => setFilterType("Imagen")}
        >
          <Text style={styles.filterText}>Imagen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.listHeader}>
        Archivos Cargados ({filteredDocuments.length}):
      </Text>
      <FlatList
        data={filteredDocuments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay documentos que coincidan con la búsqueda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterText: {
    color: "#333",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
  },
  documentItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  documentName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});
