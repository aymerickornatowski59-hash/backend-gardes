import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

const API = "https://backend-gardes-production.up.railway.app";

type Garde = {
  _id: string;
  nom: string;
};

export default function HomeScreen() {
  const [gardes, setGardes] = useState<Garde[]>([]);
  const [nom, setNom] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Récupérer les gardes
  const fetchGardes = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetch gardes...");

      const res = await fetch(API + "/en-garde");

      if (!res.ok) {
        throw new Error("Erreur API: " + res.status);
      }

      const data = await res.json();
      console.log("✅ Données reçues:", data);

      setGardes(data);
    } catch (error) {
      console.log("❌ Erreur fetch:", error);
      Alert.alert("Erreur", "Impossible de récupérer les données");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Ajouter une garde
  const addGarde = async () => {
    if (!nom.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un nom");
      return;
    }

    try {
      console.log("➕ Ajout garde:", nom);

      const res = await fetch(API + "/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom }),
      });

      if (!res.ok) {
        throw new Error("Erreur POST: " + res.status);
      }

      const data = await res.json();
      console.log("✅ Ajout réussi:", data);

      setNom("");
      fetchGardes();
    } catch (error) {
      console.log("❌ Erreur ajout:", error);
      Alert.alert("Erreur", "Impossible d'ajouter la garde");
    }
  };

  // 🔴 Supprimer une garde
  const deleteGarde = async (id: string) => {
    try {
      console.log("🗑 Suppression:", id);

      const res = await fetch(API + "/depart/" + id, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur DELETE: " + res.status);
      }

      console.log("✅ Supprimé");

      fetchGardes();
    } catch (error) {
      console.log("❌ Erreur suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer");
    }
  };

  // 🔄 Chargement initial
  useEffect(() => {
    fetchGardes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚔 Garde App</Text>

      {/* INPUT */}
      <TextInput
        placeholder="Nom..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={nom}
        onChangeText={setNom}
      />

      {/* 🟢 ARRIVÉE */}
      <TouchableOpacity style={styles.btn} onPress={addGarde}>
        <Text style={styles.btnText}>🟢 Arrivée</Text>
      </TouchableOpacity>

      {/* 🔄 RAFRAÎCHIR */}
      <TouchableOpacity style={styles.btn} onPress={fetchGardes}>
        <Text style={styles.btnText}>
          {loading ? "⏳ Chargement..." : "🔄 Rafraîchir"}
        </Text>
      </TouchableOpacity>

      {/* LISTE */}
      <FlatList
        data={gardes}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
            Aucun garde
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nom}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteGarde(item._id)}
            >
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "white",
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
