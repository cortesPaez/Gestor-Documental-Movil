import * as FileSystem from "expo-file-system";

const METADATA_FILE_URI =
  FileSystem.documentDirectory + "documentMetadata.json";

export const loadMetadata = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(METADATA_FILE_URI);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(METADATA_FILE_URI);
      return JSON.parse(content);
    }
    return [];
  } catch (error) {
    console.error("Error al cargar metadatos:", error);
    return [];
  }
};

export const saveMetadata = async (metadataList) => {
  try {
    await FileSystem.writeAsStringAsync(
      METADATA_FILE_URI,
      JSON.stringify(metadataList, null, 2)
    );
  } catch (error) {
    console.error("Error al guardar metadatos:", error);
    throw new Error("No se pudieron guardar los metadatos.");
  }
};
