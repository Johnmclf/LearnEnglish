// base/base.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Mot = {
  id: string;
  mot: string;
  traductions: string[];
  categorie: string;
  echouer: number;
  favoris: boolean;
};

let mots: Mot[] = [];
const STORAGE_KEY = "MES_MOTS";

// --- Sauvegarde ---
async function saveMots() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mots));
  } catch (e) {
    console.error("Erreur sauvegarde mots:", e);
  }
}

// --- Chargement ---
export async function loadMots() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      mots = JSON.parse(data);
    }
  } catch (e) {
    console.error("Erreur chargement mots:", e);
  }
}

// Récupérer
export function getMots(): Mot[] {
  return mots;
}

// Ajouter
export async function ajouterMot(nouveau: Mot) {
  mots.push(nouveau);
  await saveMots();
}

// Modifier
export async function modifierMot(modifie: Mot) {
  const index = mots.findIndex((m) => m.id === modifie.id);
  if (index !== -1) {
    mots[index] = modifie;
    await saveMots();
  }
}

// Supprimer
export async function supprimerMot(id: string) {
  mots = mots.filter((m) => m.id !== id);
  await saveMots();
}

// Favoris
export async function toggleFavoris(id: string) {
  const mot = mots.find((m) => m.id === id);
  if (mot) {
    mot.favoris = !mot.favoris;
    await saveMots();
  }
}

// Échec
export async function incrementerEchec(id: string) {
  const mot = mots.find((m) => m.id === id);
  if (mot) {
    mot.echouer += 1;
    await saveMots();
  }
}

// Reset
export async function resetMots() {
  mots = [];
  await saveMots();
}
