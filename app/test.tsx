import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { getMots, loadMots, modifierMot, Mot } from "../base/base";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Test() {
  const [mots, setMots] = useState<Mot[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>("");
  const [testType, setTestType] = useState<"court" | "infini" | null>(null);
  const [testMots, setTestMots] = useState<Mot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reponse, setReponse] = useState("");
  const [score, setScore] = useState(0);

  // --- Chargement fiable depuis la BDD (AsyncStorage via base.ts) ---
  useEffect(() => {
    (async () => {
      await loadMots();                 // <-- IMPORTANT
      const data = getMots();
      setMots(data);
      const cats = Array.from(new Set(data.map((m) => m.categorie)));
      setCategories(cats);
      if (!categorieSelectionnee && cats.length > 0) {
        setCategorieSelectionnee(cats[0]);
      }
    })();
  }, []);

  // --- Démarrer test court (sur 20) ---
  function demarrerTestCourt() {
    if (!categorieSelectionnee) {
      Alert.alert("Erreur", "Sélectionnez une catégorie");
      return;
    }
    const motsFiltres = mots.filter((m) => m.categorie === categorieSelectionnee);
    if (motsFiltres.length === 0) {
      Alert.alert("Erreur", "Pas de mots dans cette catégorie");
      return;
    }

    const tirage: Mot[] = [];
    const max = Math.min(20, motsFiltres.length);
    const copy = [...motsFiltres];
    for (let i = 0; i < max; i++) {
      const idx = getRandomInt(copy.length);
      tirage.push(copy[idx]);
      copy.splice(idx, 1);
    }

    setTestMots(tirage);
    setCurrentIndex(0);
    setScore(0);
    setTestType("court");
    setReponse("");
  }

  // --- Démarrer test infini (mots en échec) ---
  function demarrerTestInfini() {
    const motsEchec = mots.filter((m) => m.echouer === 1);
    if (motsEchec.length === 0) {
      Alert.alert("Info", "Pas de mots en échec");
      return;
    }
    setTestMots([motsEchec[getRandomInt(motsEchec.length)]]);
    setCurrentIndex(0);
    setTestType("infini");
    setReponse("");
  }

  // --- Vérifier une réponse (ordre d'alertes corrigé) ---
  async function verifierReponse() {
    const mot = testMots[currentIndex];
    const reponseTrim = reponse.trim().toLowerCase();
    const motCorrect = mot.mot.toLowerCase();
    const traductionsCorrectes = mot.traductions.map((t) => t.toLowerCase());
    const correct =
      reponseTrim === motCorrect || traductionsCorrectes.includes(reponseTrim);

    // préparer copie + mise à jour de l'état echouer
    const motsCopy = [...mots];
    const idx = motsCopy.findIndex((m) => m.id === mot.id);

    if (idx === -1) {
      // sécurité (ne devrait pas arriver)
      Alert.alert("Erreur", "Mot introuvable");
      return;
    }

    if (!correct) {
      motsCopy[idx] = { ...motsCopy[idx], echouer: 1 };
    } else {
      if (testType === "infini") {
        motsCopy[idx] = { ...motsCopy[idx], echouer: 0 };
      }
    }

    // Sauvegarde BDD + état
    await modifierMot(motsCopy[idx]);
    setMots(motsCopy);
    if (testType === "court" && correct) setScore((s) => s + 1);

    // message principal d'abord...
    const titre = correct ? "✅ Correct" : "❌ Incorrect";
    const msg = correct
      ? "Bien joué !"
      : `Réponse correcte : ${mot.mot} (${mot.traductions.join(", ")})`;

    const allerEtapeSuivante = () => {
      setReponse("");

      if (testType === "court") {
        // Dernière question ?
        if (currentIndex + 1 >= testMots.length) {
          // ... puis "Test terminé" après avoir appuyé sur OK
          Alert.alert(
            "🎉 Test terminé",
            `Score final : ${score + (correct ? 1 : 0)} / ${testMots.length}`,
            [{ text: "OK", onPress: () => setTestType(null) }]
          );
        } else {
          setCurrentIndex((i) => i + 1);
        }
      } else {
        // test infini
        const restants = motsCopy.filter((m) => m.echouer === 1);
        if (restants.length === 0) {
          Alert.alert("🎉 Tous les mots corrigés !", "", [
            { text: "OK", onPress: () => setTestType(null) },
          ]);
        } else {
          setTestMots([restants[getRandomInt(restants.length)]]); // prochain mot aléatoire restant
          setCurrentIndex(0);
        }
      }
    };

    Alert.alert(titre, msg, [{ text: "OK", onPress: allerEtapeSuivante }], {
      cancelable: false,
    });
  }

  function quitterTest() {
    if (testType === "court") {
      Alert.alert(
        "Quit test",
        "The test will be lost and restarted from scratch. Do you want to continue ?",
        [
          { text: "Cancel" },
          { text: "Quit", onPress: () => setTestType(null) },
        ]
      );
    } else {
      setTestType(null);
    }
  }

  // --- MENU (pas de test en cours) ---
  if (!testType) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Choose test type :</Text>

        {/* Catégories (utiles pour le test sur 20) */}
        <View style={styles.categoryContainer}>
          <Text style={styles.subtitle}>Category :</Text>
          {categories.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.categoryButton,
                { backgroundColor: categorieSelectionnee === c ? "#34C759" : "#eee" }, // vert au lieu de bleu
              ]}
              onPress={() => setCategorieSelectionnee(c)}
            >
              <Text
                style={{
                  color: categorieSelectionnee === c ? "#fff" : "#000",
                  fontWeight: "bold",
                }}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Boutons tests */}
        <TouchableOpacity style={styles.button} onPress={demarrerTestCourt}>
          <Text style={styles.buttonText}>20-word test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={demarrerTestInfini}>
          <Text style={styles.buttonText}>Retry failed words</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }


  // --- ÉCRAN DU TEST ---
  const motActuel = testMots[currentIndex];
  const totalQuestions =
    testType === "court"
      ? testMots.length
      : mots.filter((m) => m.echouer === 1).length;
  const questionNum = currentIndex + 1;
  const motsRestants = testType === "infini" ? totalQuestions : undefined;

  return (
    <View style={styles.container}>
      <View className="card" style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.questionText}>
            {testType === "court"
              ? `Question ° ${questionNum} / ${totalQuestions}`
              : `Words remaining : ${motsRestants}`}
          </Text>
          {testType === "court" && <Text style={styles.scoreText}>Score : {score}</Text>}
        </View>

        <Text style={styles.mot}>{motActuel.mot}</Text>

        <TextInput
          style={styles.input}
          placeholder="Your answer"
          value={reponse}
          onChangeText={setReponse}
        />

        <TouchableOpacity style={styles.button} onPress={verifierReponse}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#FF3B30", marginTop: 20 }]}
          onPress={quitterTest}
        >
          <Text style={styles.buttonText}>Quit test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f2f2f2" },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 12, textAlign: "center" },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 20,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  mot: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginVertical: 12, color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    margin: 12,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryContainer: {
  marginVertical: 20,
  padding: 12,
  borderRadius: 12,
  backgroundColor: "#f9f9f9",
  marginHorizontal: 20,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  questionText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  scoreText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});
