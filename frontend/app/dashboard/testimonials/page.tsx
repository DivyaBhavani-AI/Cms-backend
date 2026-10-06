'use client'
import { createClient } from '@/lib/supabase/client'
import { title } from 'process'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [testimonials, setTestimonials] = useState<any>(null)
  const [name, setName] = useState("")
  const [position, setPosition] =useState("")
  const [company, setCompany] = useState("")
  const [content, setContent] = useState("")  
  const [featured, setFeatured] =useState("")
  const [message, setMessage] = useState("")

   const supabase = createClient();

   const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          position,
          company,
          content,
          featured :featured == "true" ? true: false
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Testimonial Information Saved successfully!");
      setName("");
      setPosition("");
      setCompany("");
      setContent("");
      setFeatured("");
    } catch (err) {
      console.error(err);
      setMessage("Error saving data");
    }
  }; 

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('http://localhost:8000/testimonials', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      setTestimonials(data)
    }
    fetchTestimonials()
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

    <label>Position:</label>
      <input
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder=" category: frontend, backend, database, other"
      />
      <label>Company:</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write company"
      />
      <label>Content:</label>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write content"
      />
        <label>Featured:</label>
      <input
        value={featured}
        onChange={(e) => setFeatured(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write featured"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
      >  Save
      </button>
    </div>
  );
}