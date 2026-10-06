import os
import uuid
import uvicorn
from fastapi import FastAPI, Depends, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime, timezone
from pydantic import BaseModel
from datetime import date

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", 
                   "http://localhost:3002",
                   "https://cms-backend-qfji.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = "https://nvklieapqftbutptmzqa.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52a2xpZWFwcWZ0YnV0cHRtenFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDUyMTg3NCwiZXhwIjoyMTA2MDk3ODc0fQ.95493tutNJeWoMRfW0t5_X9OCMjf1oGDASVRJPm68t4"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) #type:ignore

class AboutUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    years_of_experience: int | None = None
class TextEntry(BaseModel):
    content: str


class AboutCreate(BaseModel):
    title: str
    description: str
    image: str | None = None
    resume: str | None = None
    years_experience: int | None = None
    featured: bool = False

class SkillCreate(BaseModel):
    name: str
    category:str
    proficiency: int
    description: str 

class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    live_url: str | None = None
    github_url: str | None = None

class TestimonialCreate(BaseModel):
    name: str
    position: str
    company: str
    content: str
    featured: bool = False


class ExperienceCreate(BaseModel):
    company: str
    position: str
    description: str
    start_date: date
    end_date: date | None =None

def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
        user = supabase.auth.get_user(token) #type:ignore
        return user.user  #type:ignore
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.post("/about")
def create_about(payload: AboutCreate):
    response = supabase.table("about").insert({
        "title": payload.title,
        "description": payload.description,
        "image": payload.image,
        "resume": payload.resume,
        "years_experience": payload.years_experience,
        "featured": payload.featured,
    }).execute()
    return response.data

@app.get("/about")
def get_about():
    response = supabase.table("about").select("*").order("created_at", desc=True).limit(1).execute()
    return response.data[0] if response.data else {}

@app.put("/about/{about_id}")
def update_about(about_id: str, payload: AboutUpdate):
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    response = supabase.table("about").update(update_data).eq("id", about_id).execute()
    return response.data


@app.get("/skills")
def get_skills():
    response = supabase.table("skills").select("*").execute()
    return response.data

@app.post("/skills")
def create_skills(payload: SkillCreate):
    response = supabase.table("skills").insert({
        "name": payload.name,
        "category": payload.category,
        "proficiency": payload.proficiency,
        "description": payload.description,
    }).execute()
    return response.data

     

@app.get("/projects")
def get_projects():
    response = supabase.table("projects").select("*").execute()
    return response.data

@app.post("/projects")
def create_project(payload: ProjectCreate):
    response = supabase.table("projects").insert({
        "title": payload.title,
        "description": payload.description,
        "category": payload.category,
        "live_url": payload.live_url,
        "github_url": payload.github_url
    }).execute()
    return response.data


@app.put("/skills")
def update_skill(skill_data: dict, user = Depends(get_current_user)):
    response = supabase.table("skills").update(skill_data).eq("id", user.id).execute() #type:ignore
    return response.data

@app.delete("/skills")
def delete_skill(skill_data: dict, user = Depends(get_current_user)):
    response = supabase.table("skills").delete().eq("id", user.id).execute() #type:ignore
    return response.data

      
@app.put("/projects")
def update_project(project_data: dict, user = Depends(get_current_user)):
    response = supabase.table("projects").update(project_data).eq("id", user.id).execute() #type:ignore
    return response.data
@app.delete("/projects")
def delete_project(project_data: dict, user = Depends(get_current_user)):
    response = supabase.table("projects").delete().eq("id", user.id).execute() #type:ignore
    return response.data

@app.post("/testimonials")
def create_testimonial(payload: TestimonialCreate):
    response = supabase.table("testimonials").insert({
        "name": payload.name,
        "position": payload.position,
        "company": payload.company,
        "content": payload.content,
        "featured": payload.featured,
    }).execute()
    return response.data

@app.get("/testimonials")
def get_testimonials():
    response = supabase.table("testimonials").select("*").execute()
    return response.data       


@app.post("/experience")
def create_experience(payload: ExperienceCreate):
    response = supabase.table("experience").insert({
    "company": payload.company,
    "position": payload.position,
    "description": payload.description,
    "start_date": payload.start_date.isoformat(),
    "end_date": payload.end_date.isoformat() if payload.end_date else None,
}).execute() #type:ignore
    return response.data

@app.get("/experience")
def get_experience():
    response = supabase.table("experience").select("*").execute()
    return response.data    


@app.get("/blogs")
def blogs(user = Depends(get_current_user)):
    response = supabase.table("blogs").select("*").eq("id", user.id).execute() #type:ignore
    return response.data

@app.post("/blogs")
def add_blog(blog_data: dict, user = Depends(get_current_user)):
    response = supabase.table("blogs").insert(blog_data).eq("id", user.id).execute() #type:ignore
    return response.data

@app.put("/blogs")
def update_blog(blog_data: dict, user = Depends(get_current_user)):
    response = supabase.table("blogs").update(blog_data).eq("id", user.id).execute() #type:ignore
    return response.data

@app.delete("/blogs")
def delete_blog(blog_data: dict, user = Depends(get_current_user)):
    response = supabase.table("blogs").delete().eq("id", user.id).execute() #type:ignore
    return response.data


if __name__ == "__main__":
  uvicorn.run(
      "main:app",  # Pass as string "module:instance" for reload to work
      host="127.0.0.1",
      port=8000,
      reload=True,
      log_level="debug",
  )