'use client'
import { createClient } from '@/lib/supabase/client'
import { title } from 'process'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [experience, setExperience] = useState<any>(null)
  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [description, setDescription] =useState("")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("")  
  const [message, setMessage] = useState("")

  const supabase = createClient();

   const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company,
          position: position,
          description: description,
          start_date: startDate,
          end_date: endDate || null,
        }),
      });

       if (!res.ok) throw new Error("Failed to save");

      setMessage("Experience Information Saved successfully!");
      setCompany("");
      setPosition("");
      setDescription("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error(err);
      setMessage("Error saving data");
    }
  }; 

  useEffect(() => {
      const fetchExperience = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
  
        const res = await fetch('http://localhost:8000/experience', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        setExperience(data)
      }
      fetchExperience()
    }, [])

    return (
    <div className="p-4">
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

      <label>Company:</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write company"
      />
      <label>Position:</label>
      <input
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write position"
      />
      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write description"
      />
      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
      />
      <label>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
      >  Save
      </button>

      </div>
  );
}