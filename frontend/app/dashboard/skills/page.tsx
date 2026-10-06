'use client'
import { createClient } from '@/lib/supabase/client'
import { title } from 'process'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [skills, setSkills] = useState<any>(null)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [proficiency, setProficiency] = useState("")  
  const [description, setDescription] =useState("")
  const [message, setMessage] = useState("")

  const supabase = createClient();

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          proficiency: parseInt(proficiency),
          description,
        }),
      });

        if (!res.ok) throw new Error("Failed to save");

      setMessage("Skill Information Saved successfully!");
      setName("");
      setCategory("");
      setProficiency("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Error saving data");
    }
  }; 

  useEffect(() => {
    const fetchSkills = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('http://localhost:8000/experience/', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      setSkills(data)
    }
    fetchSkills()
  }, [])

  return (
    <div className="p-4">
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

      <label>Name:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write name"
      />
      <label>Category:</label>
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder=" category: frontend, backend, database, other"
      />
      <label>Proficiency:</label>
      <input
        value={proficiency}
        onChange={(e) => setProficiency(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="proficiency(1-100)"
      />
      <label>Description:</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write description"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
      >  Save
      </button>
    </div>
  );
}