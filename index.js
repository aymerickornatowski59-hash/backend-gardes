const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Connexion MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo connecté"))
  .catch(err => console.log("Erreur Mongo:", err));

// 📦 Modèle
const Garde = mongoose.model("Garde", {
  nom: String,
});

// 🟢 GET (liste)
app.get("/en-garde", async (req, res) => {
  const gardes = await Garde.find();
  res.json(gardes);
});

// 🟢 POST (ajouter)
app.post("/arrivee", async (req, res) => {
  const { nom } = req.body;

  const garde = new Garde({
    nom: nom || "Sans nom",
  });

  await garde.save();
  res.json(garde);
});

// 🔴 DELETE (supprimer)
app.delete("/depart/:id", async (req, res) => {
  await Garde.findByIdAndDelete(req.params.id);
  res.json({ message: "Supprimé" });
});

// 🚀 Lancer serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API READY"));
