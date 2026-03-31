const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 API READY sur port", PORT);
});
const app = express();

// ✅ CORS simple (IMPORTANT)
app.use(cors());
app.use(express.json());

// 🔗 Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Mongo connecté"))
  .catch((err) => console.log("❌ Erreur Mongo :", err));

// 📦 Model
const Garde = mongoose.model("Garde", {
  nom: String,
});

// 🧪 ROUTE TEST (TRÈS IMPORTANT)
app.get("/", (req, res) => {
  res.send("API OK");
});

// 📥 GET → récupérer les gardes
app.get("/en-garde", async (req, res) => {
  try {
    const gardes = await Garde.find();
    res.json(gardes);
  } catch (err) {
    console.error("❌ GET ERROR:", err);
    res.status(500).json({ error: "Erreur serveur GET" });
  }
});

// 🟢 POST → ajouter une garde
app.post("/webhook", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    if (!req.body || !req.body.nom) {
      return res.status(400).json({ error: "Nom requis" });
    }

    const garde = new Garde({
      nom: req.body.nom,
    });

    await garde.save();

    res.json({ message: "Ajouté", garde });
  } catch (err) {
    console.error("❌ POST ERROR:", err);
    res.status(500).json({ error: "Erreur serveur POST" });
  }
});

// 🔴 DELETE → supprimer une garde
app.delete("/depart/:id", async (req, res) => {
  try {
    await Garde.findByIdAndDelete(req.params.id);
    res.json({ message: "Supprimé" });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 API READY sur port", PORT);
});
