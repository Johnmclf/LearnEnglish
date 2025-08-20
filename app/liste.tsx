import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { getMots, loadMots, toggleFavoris, Mot } from "../base/base";

export default function Liste() {
  const [mots, setMots] = useState<Mot[]>([]);
  const [search, setSearch] = useState("");
  const [showFavoris, setShowFavoris] = useState(false); // 👈 état pour filtre favoris

  // Charger les mots au montage
  useEffect(() => {
    async function fetchMots() {
      await loadMots();
      setMots(getMots());
    }
    fetchMots();
  }, []);

  // Toggle favoris
  async function handleToggleFavoris(id: string) {
    await toggleFavoris(id);
    setMots([...getMots()]); // rechargement local
  }

  // Filtrage par recherche + favoris
  const motsFiltres = mots.filter((m) => {
    const matchSearch =
      m.mot.toLowerCase().includes(search.toLowerCase()) ||
      m.traductions.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      );

    const matchFavoris = showFavoris ? m.favoris : true;

    return matchSearch && matchFavoris;
  });

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un mot ou une traduction"
        placeholderTextColor="#000"
        value={search}
        onChangeText={setSearch}
      />

      {/* Bouton filtre favoris */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          showFavoris && styles.filterButtonActive,
        ]}
        onPress={() => setShowFavoris(!showFavoris)}
      >
        <Text style={styles.filterButtonText}>
          {showFavoris ? "Afficher tous" : "Favoris"}
        </Text>
      </TouchableOpacity>

      {/* Liste des mots */}
      <FlatList
        data={motsFiltres}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.mot}>{item.mot}</Text>
              <Text style={styles.traduction}>
                {item.traductions.join(", ")}
              </Text>
              <Text style={styles.categorie}>📂 {item.categorie}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleToggleFavoris(item.id)}
              style={styles.starButton}
            >
              <Text style={{ fontSize: 26 }}>
                {item.favoris ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
            Aucun mot trouvé
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7979792f",
    alignItems: "center",
    marginBottom: 12,
  },
  filterButtonActive: {
    backgroundColor: "#ffffffff",
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000e5",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  mot: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  traduction: {
    fontSize: 15,
    color: "#666",
    marginTop: 2,
  },
  categorie: {
    fontSize: 13,
    color: "#007AFF",
    marginTop: 4,
  },
  starButton: {
    marginLeft: 10,
  },
});
