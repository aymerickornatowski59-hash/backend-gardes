const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API OK");
});

// Mongo
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Mongo connecté"))
  .catch((err) => console.log("❌ Mongo erreur:", err));

// Model
const Garde = mongoose.model("Garde", {
  nom: String,
});

// GET
app.get("/en-garde", async (req, res) => {
  try {
    const gardes = await Garde.find();
    res.json(gardes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GET error" });
  }
});

// POST
app.post("/webhook", async (req, res) => {
  try {
    if (!req.body.nom) {
      return res.status(400).json({ error: "Nom requis" });
    }

    const garde = new Garde({ nom: req.body.nom });
    await garde.save();

    res.json(garde);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "POST error" });
  }
});

// DELETE
app.delete("/depart/:id", async (req, res) => {
  try {
    await Garde.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "DELETE error" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 API READY sur port", PORT);
});
