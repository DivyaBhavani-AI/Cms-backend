'use client'
import { createClient } from '@/lib/supabase/client'
import { title } from 'process'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [project, setProjects] = useState<any>(null)
  const [Title, setTitle] = useState("")
  const [description, setDescription] =useState("")
  const [category, setCategory] = useState("")
  const [liveurl, setLiveUrl] = useState("")  
  const [githuburl, setGithubUrl] = useState("") 
  const [message, setMessage] = useState("")

  const supabase = createClient();


const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title ,
          description,
          category,
          live_url: liveurl,
          github_url: githuburl
        }),
      });
 if (!res.ok) throw new Error("Failed to save");

      setMessage("Project Information Saved successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setLiveUrl("");
      setGithubUrl("");
    } catch (err) {
      console.error(err);
      setMessage("Error saving data");
    }
  }; 
     
   useEffect(() => {
    const fetchProjects = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('http://localhost:8000/projects', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      setProjects(data)
    }
    fetchProjects()
  }, [])

   return (
    <div className="p-4">
      {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}
      
      <br></br>
      <h1><b>Project Details</b></h1> <br></br>
      <label>Name:</label>
      <input
        value={Title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write name"
      />
      <label>Description:</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write description"
      />
      <label>Category:</label>
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write category"
      />
      <label>Live URL:</label>
      <input
        value={liveurl}
        onChange={(e) => setLiveUrl(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write live URL"
      />
      <label>GitHub URL:</label>
      <input
        value={githuburl}
        onChange={(e) => setGithubUrl(e.target.value)}
        className="border rounded-md px-3 py-2 w-full mb-2"
        placeholder="write GitHub URL"
      />
       <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
      >  Save
      </button>
    </div>

      );
    }