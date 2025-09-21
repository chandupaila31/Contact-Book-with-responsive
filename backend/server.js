const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/contactBook")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});
const Contact = mongoose.model("Contact", contactSchema);


app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "All fields required" });

    const contact = new Contact({ name, email, phone });
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/contacts", async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const contacts = await Contact.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.json({ contacts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/contacts/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
