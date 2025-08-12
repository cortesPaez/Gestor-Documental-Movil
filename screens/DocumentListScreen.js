import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
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

    const matchesFilter =
      filterType === "Todos" ||
      doc.tipo.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }) => {
    const icon = item.tipo.toLowerCase() === "pdf" ? "📄" : "🖼️";
    return (
      <TouchableOpacity
        style={styles.documentItem}
        onPress={() =>
          navigation.navigate("DocumentDetail", { document: item })
        }
      >
        <Text style={styles.documentName}>
          {icon} {item.nombre}
        </Text>
        <Text>Categoría: {item.categoria}</Text>
        <Text>Tipo: {item.tipo}</Text>
        <Text>
          Fecha de carga: {new Date(item.fechaCarga).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddDocument")}
        >
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#f3f6fb",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#e3e8ee",
    marginHorizontal: 2,
    borderWidth: 0,
  },
  activeFilter: {
    backgroundColor: "#2563eb",
  },
  filterText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 15,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#2563eb",
    letterSpacing: 0.5,
  },
  documentItem: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  documentName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#94a3b8",
  },
  button: {
    padding: 12,
    backgroundColor: "#2563eb",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 44,
    height: 44,
  },
  text: {
    color: "#fff",
  },
});
