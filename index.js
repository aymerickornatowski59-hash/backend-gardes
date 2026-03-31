const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.options("*", cors()); // 👈 FIX

app.use(express.json());

// 🔗 Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo connecté"))
  .catch((err) => console.log("Erreur Mongo :", err));

// 📦 Model
const Garde = mongoose.model("Garde", {
  nom: String,
});

// 📥 GET → récupérer les gardes
app.get("/en-garde", async (req, res) => {
  const gardes = await Garde.find();
  res.json(gardes);
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
    console.error("ERREUR WEBHOOK:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔴 DELETE → supprimer une garde
app.delete("/depart/:id", async (req, res) => {
  try {
    await Garde.findByIdAndDelete(req.params.id);
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression" });
  }
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("API READY");
});
