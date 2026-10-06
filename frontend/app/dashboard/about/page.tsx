'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [about, setAbout] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [resume, setResume] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [message, setMessage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient()

  const handleSubmit = async () => {
  try {
    let imageUrl = image;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error } = await supabase.storage.from("images").upload(fileName, imageFile);
      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      title,
      description,
      image: imageUrl,
      resume,
      years_experience: Number(yearsExperience),
      featured: false,
    };

    const res = about?.id
      ? await fetch(`http://localhost:8000/about/${about.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("http://localhost:8000/about", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (!res.ok) throw new Error("Failed to save");

    setMessage("About Information Saved successfully!");
    setImageFile(null);
  } catch (err) {
    console.error(err);
    setMessage("Error saving data");
  }
};
  useEffect(() => {
  const fetchAbout = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const res = await fetch('http://localhost:8000/about', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const data = await res.json()
    setAbout(data)

    // 👇 pre-fill form fields with existing data
    setTitle(data.title || "")
    setDescription(data.description || "")
    setImage(data.image || "")
    setResume(data.resume || "")
    setYearsExperience(data.years_experience?.toString() || "")
  }
  fetchAbout()
}, [])

  return (
    <div className="p-4">
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write title"
      />

      <label>Description:</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write description"
      />

      <label>Image URL:</label>
      <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      <br></br>
      <br></br>
      <label>Resume URL:</label>
      <input
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="resume URL"
      />

      <label>Years of Experience:</label>
      <input
        value={yearsExperience}
        onChange={(e) => setYearsExperience(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="years"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2" 
      >
        Save
      </button>
    </div>
  );
}