const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

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
