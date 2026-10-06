"use client";
import { useEffect, useState } from "react";

export default function PortfolioPage() {
    const [about, setAbout] = useState<any>(null);
    const [skills, setSkills] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [experience, setExperience] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/about`)
            .then((res) => res.json())
            .then((data) => {
                // Fix: Handle case if backend returns an array instead of single object
                if (Array.isArray(data)) {
                    setAbout(data[0] || null);
                } else {
                    setAbout(data);
                }
            })
            .catch((err) => console.error("Error fetching about:", err));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`)
            .then((res) => res.json())
            .then((data) => setSkills(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching skills:", err));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching projects:", err));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`)
            .then((res) => res.json())
            .then((data) => setTestimonials(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching testimonials:", err));

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/experience`)
            .then((res) => res.json())
            .then((data) => setExperience(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching experience:", err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">
             {about && (
                <section>
                    <h2 className="text-2xl font-bold">{about.title}</h2>
                    <p className="text-gray-600">{about.description}</p>
                    <p>{about.years_experience} years experience</p>
                    {about?.image && (
                        <img src={about.image} alt={about.title} className="w-48 rounded-md" />
                    )}
                </section>
            )}

            {/* Skills section */}
            <section>
                <h2 className="text-2xl font-bold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(skills) && skills.map((s) => (
                        <span key={s.id || s.name} className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                            {s.name} ({s.category})
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-3">Projects</h2>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(projects) && projects.map((p) => (
                        <span key={p.id || p.title} className="bg-green-200 px-6 py-5 rounded-full text-sm">
                            {p.title} ({p.category}) <br></br>{p.description}<br></br> {p.live_url} <br></br>{p.github_url}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-3">Testimonials</h2>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(testimonials) && testimonials.map((t) => (
                        <span key={t.id || t.name} className="bg-yellow-200 px-6 py-5 rounded-full text-sm">
                            {t.name} ({t.position}, {t.company}) <br></br>{t.content}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-3">Experience</h2>
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(experience) && experience.map((e) => (
                        <span key={e.id || e.company} className="bg-purple-200 px-6 py-5 rounded-full text-sm">
                            {e.company} ({e.position}) <br></br>{e.description} <br></br> {e.start_date} to {e.end_date}
                        </span>
                    ))}
                </div>
            </section>
        </div>
    );
}