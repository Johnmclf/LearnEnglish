// initMots.ts
import { ajouterMot, Mot } from "./base";


function getId() {
  return Math.random().toString(36).substring(2, 9);
}

// Liste des mots (30 noms, 30 verbes)
const motsInit: Mot[] = [
  // Catégorie: Nom
  { id: getId(), mot: "apple", traductions: ["pomme"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "book", traductions: ["livre"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "car", traductions: ["voiture"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "house", traductions: ["maison"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "dog", traductions: ["chien"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "cat", traductions: ["chat"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "table", traductions: ["table"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "chair", traductions: ["chaise"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "water", traductions: ["eau"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "food", traductions: ["nourriture"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "school", traductions: ["école"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "city", traductions: ["ville"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "phone", traductions: ["téléphone"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "computer", traductions: ["ordinateur"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "music", traductions: ["musique"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "movie", traductions: ["film"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "friend", traductions: ["ami"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "family", traductions: ["famille"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "sun", traductions: ["soleil"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "moon", traductions: ["lune"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "tree", traductions: ["arbre"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "flower", traductions: ["fleur"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "river", traductions: ["rivière"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "mountain", traductions: ["montagne"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "road", traductions: ["route"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "train", traductions: ["train"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "plane", traductions: ["avion"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "bed", traductions: ["lit"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "window", traductions: ["fenêtre"], categorie: "nom", echouer: 0, favoris: false },
  { id: getId(), mot: "door", traductions: ["porte"], categorie: "nom", echouer: 0, favoris: false },

  // Catégorie: Verbe
  { id: getId(), mot: "to eat", traductions: ["manger"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to drink", traductions: ["boire"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to go", traductions: ["aller"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to come", traductions: ["venir"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to see", traductions: ["voir"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to hear", traductions: ["entendre"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to speak", traductions: ["parler"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to read", traductions: ["lire"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to write", traductions: ["écrire"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to sleep", traductions: ["dormir"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to run", traductions: ["courir"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to walk", traductions: ["marcher"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to play", traductions: ["jouer"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to work", traductions: ["travailler"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to study", traductions: ["étudier"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to teach", traductions: ["enseigner"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to buy", traductions: ["acheter"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to sell", traductions: ["vendre"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to drive", traductions: ["conduire"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to fly", traductions: ["voler (avion)"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to swim", traductions: ["nager"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to cook", traductions: ["cuisiner"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to clean", traductions: ["nettoyer"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to open", traductions: ["ouvrir"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to close", traductions: ["fermer"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to love", traductions: ["aimer"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to like", traductions: ["aimer bien"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to hate", traductions: ["détester"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to think", traductions: ["penser"], categorie: "verbe", echouer: 0, favoris: false },
  { id: getId(), mot: "to know", traductions: ["savoir", "connaître"], categorie: "verbe", echouer: 0, favoris: false },
];

// Fonction d’initialisation
export async function initMots() {
  for (const mot of motsInit) {
    await ajouterMot(mot);
  }
  console.log("✅ Base initialisée avec 60 mots !");
}
