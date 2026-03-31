import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const API = "https://backend-gardes-production.up.railway.app";

export default function App() {
  const [gardes, setGardes] = useState([]);

  const fetchGardes = async () => {
    const res = await fetch(API + "/en-garde");
    const data = await res.json();
    setGardes(data);
  };

  useEffect(() => {
    fetchGardes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚔 Garde App</Text>

      <TouchableOpacity style={styles.btn} onPress={fetchGardes}>
        <Text style={styles.btnText}>🔄 Rafraîchir</Text>
      </TouchableOpacity>

      <FlatList
        data={gardes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nom}</Text>
          </View>
        )}
      />
    </View>
  );
}

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
  btn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 18,
  },
});
