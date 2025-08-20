import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ajouterMot, getMots, loadMots, modifierMot as modifierMotBase, supprimerMot as supprimerMotBase, Mot } from "../base/base";

function getId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function Ajouter() {
  const [mots, setMots] = useState<Mot[]>([]);

  // --- Ajout ---
  const [mot, setMot] = useState("");
  const [categorie, setCategorie] = useState("");
  const [traduction, setTraduction] = useState("");
  const [traductions, setTraductions] = useState<string[]>([]);

  // --- Modification ---
  const [motModif, setMotModif] = useState<Mot | null>(null);
  const [recherche, setRecherche] = useState("");

  // --- Suppression ---
  const [rechercheSupp, setRechercheSupp] = useState("");

  // Charger les mots au montage
  useEffect(() => {
  async function init() {
    await loadMots();       // on charge depuis AsyncStorage
    setMots(getMots());     // on met à jour le state avec les mots sauvegardés
  }
  init();
}, []);

  // Ajout
  function ajouterTraduction() {
    if (traduction.trim() === "") return;
    setTraductions([...traductions, traduction.trim()]);
    setTraduction("");
  }

  function supprimerTraduction(index: number) {
    setTraductions(traductions.filter((_, i) => i !== index));
  }

  async function enregistrerMot() {
    if (!mot || traductions.length === 0 || !categorie) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const nouveau: Mot = {
      id: getId(),
      mot,
      traductions,
      categorie,
      echouer: 0,
      favoris: false,
    };
    await ajouterMot(nouveau);
    setMots(await getMots());
    setMot("");
    setCategorie("");
    setTraductions([]);
    Alert.alert("Success", "word added !");
  }

  // Modification
  function chargerMot(m: Mot) {
    if (motModif && motModif.id === m.id) {
      setMotModif(null); // fermer si déjà ouvert
    } else {
      setMotModif({ ...m });
    }
  }

  async function modifierMot() {
    if (!motModif) return;
    await modifierMotBase(motModif);
    setMots(await getMots());
    setMotModif(null);
    Alert.alert("Success", "word updated !");
  }

  // Suppression
  async function supprimerMot(id: string) {
    await supprimerMotBase(id);
    setMots(await getMots());
    Alert.alert("Info", "word deleted !");
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          {/* --- AJOUTER --- */}
          <View style={styles.card}>
            <Text style={styles.title}>➕ Add word</Text>
            <TextInput
              style={styles.input}
              placeholder="word"
              placeholderTextColor="#000"
              value={mot}
              onChangeText={setMot}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              placeholderTextColor="#000"
              value={categorie}
              onChangeText={setCategorie}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Translation"
                placeholderTextColor="#000"
                value={traduction}
                onChangeText={setTraduction}
              />
              <TouchableOpacity style={styles.iconButton} onPress={ajouterTraduction}>
                <Text style={styles.iconText}>＋</Text>
              </TouchableOpacity>
            </View>
            {traductions.map((t, i) => (
              <View key={i} style={styles.traductionRow}>
                <Text>{t}</Text>
                <TouchableOpacity style={styles.iconButton} onPress={() => supprimerTraduction(i)}>
                  <Text style={[styles.iconText, { color: "red" }]}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={enregistrerMot}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* --- MODIFIER --- */}
          <View style={styles.card}>
            <Text style={styles.title}>Update word</Text>
            <TextInput
              style={styles.input}
              placeholder="Search word..."
              placeholderTextColor="#000"
              value={recherche}
              onChangeText={setRecherche}
            />

            <FlatList
              data={mots.filter((m) =>
                m.mot.toLowerCase().includes(recherche.toLowerCase())
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.motItem} onPress={() => chargerMot(item)}>
                  <Text>{item.mot} ({item.categorie})</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 250 }}
            />

            {motModif && (
              <View style={styles.formModif}>
                <TextInput
                  style={styles.input}
                  placeholder="Word"
                  placeholderTextColor="#000"
                  value={motModif.mot}
                  onChangeText={(t) => setMotModif({ ...motModif, mot: t })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category"
                  placeholderTextColor="#000"
                  value={motModif.categorie}
                  onChangeText={(t) => setMotModif({ ...motModif, categorie: t })}
                />

                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Translations :</Text>
                {motModif.traductions.map((t, i) => (
                  <View key={i} style={styles.traductionRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={t}
                      onChangeText={(nv) => {
                        const updated = [...motModif.traductions];
                        updated[i] = nv;
                        setMotModif({ ...motModif, traductions: updated });
                      }}
                    />
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => {
                        const updated = motModif.traductions.filter((_, idx) => idx !== i);
                        setMotModif({ ...motModif, traductions: updated });
                      }}
                    >
                      <Text style={[styles.iconText, { color: "red" }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#34C759" }]}
                  onPress={() =>
                    setMotModif({
                      ...motModif,
                      traductions: [...motModif.traductions, ""],
                    })
                  }
                >
                  <Text style={styles.buttonText}>+ Add translation</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={modifierMot}>
                  <Text style={styles.buttonText}> Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#aaa" }]}
                  onPress={() => setMotModif(null)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* --- SUPPRIMER --- */}
          <View style={styles.card}>
            <Text style={styles.title}>Delete word</Text>
            <TextInput
              style={styles.input}
              placeholder="Search word..."
              placeholderTextColor="#000"
              value={rechercheSupp}
              onChangeText={setRechercheSupp}
            />

            <FlatList
              data={mots.filter((m) =>
                m.mot.toLowerCase().includes(rechercheSupp.toLowerCase())
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.motRow}>
                  <Text>{item.mot} ({item.categorie})</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => supprimerMot(item.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
              style={{ maxHeight: 250 }}
            />
          </View>
        </View>
      }
      data={[]} // rien en data, tout est dans ListHeader
      renderItem={null}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f5f5f5" },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
    color: "#000",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  traductionRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  iconButton: {
    width: 32,
    height: 32,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  iconText: { fontSize: 18, fontWeight: "bold" },
  motItem: { padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
  formModif: { marginTop: 12 },
  motRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: { color: "white", fontWeight: "bold" },
});
