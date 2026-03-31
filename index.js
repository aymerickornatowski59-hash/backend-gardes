const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connexion Mongo
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo connecté"))
  .catch(err => console.log("Erreur Mongo :", err));

// 📦 Model
const Garde = mongoose.model("Garde", {
  nom: String,
});

// 📥 GET (liste)
app.get("/en-garde", async (req, res) => {
  const gardes = await Garde.find();
  res.json(gardes);
});

// ➕ POST (ajout)
app.post("/webhook", async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ error: "Nom requis" });
    }

    const garde = new Garde({ nom });
    await garde.save();

    res.json({ message: "Ajouté", garde });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🚀 Start serveur
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("API READY");
});
