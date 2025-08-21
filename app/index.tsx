import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { initMots } from "../base/initMots";
import { useState, useEffect } from "react";

export default function Index() {

  /*useEffect(() => {
    async function init() {
      await initMots();  // ajoute les 60 mots
    }
    init();
  }, []);*/

  return (

    <ImageBackground
      source={require("../assets/images/fondEnglish.jpg")} // Mets ton image ici dans assets
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Learn English</Text>

        <Link href="/ajouter" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Manage words</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/liste" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View words</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/test" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Test yourself</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 20,
    backgroundColor: "transparent", // <-- change ici
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#0f1b63ff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    width: 220,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
