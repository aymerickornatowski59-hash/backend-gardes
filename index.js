const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

app.post("/arrivee", async (req, res) => {
  const { nom } = req.body;

  const garde = new Garde({
    nom: nom || "Sans nom",
  });

  await garde.save();
  res.json(garde);
});
const app = express();
app.use(express.json());
app.use(cors());
app.post("/arrivee", async (req, res) => {
  const garde = new Garde({ nom: "Nouvelle garde" });
  await garde.save();
  res.json(garde);
});
const PORT = process.env.PORT || 3000;

// ✅ connexion propre Mongo
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB connecté");

  app.listen(PORT, () => {
    console.log("API READY on " + PORT);
  });

})
.catch(err => {
  console.log("Erreur MongoDB :", err);
});
// ===== MODELS =====

const User = mongoose.model("User", {
  nom: String
});

const Garde = mongoose.model("Garde", {
  userId: String,
  nom: String,
  arrivee: Date,
  depart: Date
});

// ===== ROUTES =====

app.post("/register", async (req, res) => {
  const user = await User.create({ nom: req.body.nom });
  res.json(user);
});

app.post("/arrivee", async (req, res) => {
  const user = await User.findById(req.body.userId);

  const garde = await Garde.create({
    userId: user._id,
    nom: user.nom,
    arrivee: new Date()
  });

  res.json(garde);
});

app.post("/depart", async (req, res) => {
  const garde = await Garde.findOne({
    userId: req.body.userId,
    depart: null
  });

  garde.depart = new Date();
  await garde.save();

  res.json(garde);
});

app.get("/en-garde", async (req, res) => {
  const gardes = await Garde.find({ depart: null });
  res.json(gardes);
});

app.listen(3000, () => console.log("API READY"));
