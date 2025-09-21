import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Fetch contacts
  const fetchContacts = async (p = 1) => {
    const res = await axios.get(`http://localhost:5000/contacts?page=${p}&limit=5`);
    setContacts(res.data.contacts);
    setPages(res.data.pages);
    setPage(res.data.page);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add contact
  const addContact = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Invalid email format");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone must be exactly 10 digits");
      return;
    }
    await axios.post("http://localhost:5000/contacts", form);
    setForm({ name: "", email: "", phone: "" });
    fetchContacts(page);
  };

  // Delete contact
  const deleteContact = async (id) => {
    await axios.delete(`http://localhost:5000/contacts/${id}`);
    fetchContacts(page);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ backgroundColor: "aqua" }}>
      <h1 className="text-3xl font-bold mb-4">📒 Contact Book</h1>

      {/* Form */}
      <form onSubmit={addContact} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full p-2 mb-2 border rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <button
          className="text-white px-4 py-2 rounded w-full"
          style={{ backgroundColor: "aqua" }}
        >
          Add Contact
        </button>
      </form>

      {/* Contact List */}
      <div className="mt-6 w-full max-w-md">
        {contacts.map((c) => (
          <div
            key={c._id}
            className="flex justify-between items-center bg-white p-3 rounded shadow mb-2"
          >
            <div>
              <p className="font-bold">{c.name}</p>
              <p>{c.email}</p>
              <p>{c.phone}</p>
            </div>
            <button
              onClick={() => deleteContact(c._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchContacts(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-700 text-white" : "bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
