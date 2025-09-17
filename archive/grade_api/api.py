from fastapi import FastAPI, HTTPException, status, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from uuid import uuid4, UUID
from itertools import count
from calculator import Course

### ----- APP + CORS -----
app = FastAPI(title="Grade Calculator API", version="0.2")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### ----- STORING COURSES -----
courses: Dict[int, "CourseState"] = {}
next_id = count(start=1)

### ----- CLASSES -----
class CourseIn(BaseModel):
    name: str
    weights: Dict[str, float] = Field(default_factory=dict)
    assessments: List[AssessmentIn] = Field(default_factory=list)

class CourseOut(BaseModel):
    id: int
    name: str
    weights: Dict[str, float]
    assessments: List[Assessment]

class AssessmentIn(BaseModel):
    name: str
    category: str
    earned: float = Field(ge=0)
    possible: float = Field(ge=0)

class Assessment(AssessmentIn):
    id: UUID = Field(default_factory=uuid4)

class GradeOut(BaseModel):
    total_grade: Optional[float]  # None if no weighted data

class CategoryPctOut(BaseModel):
    category: str
    percentage: Optional[float]

### ----- COURSE CLASS -----

@app.post("/courses/{cid}")
def add_course(item: CourseIn):
    #basic unique id per course
    global next_id
    course = Course(item.name, item.weights, item.assessments)
    courses[next_id] = course
    cid = next_id
    next_id += 1
    return {
        "message": f"Course added. Course: {course.name}, ID: {cid}", 
        "current": course,
        "id": cid,
        "name": courses[cid].name, 
        "weights": courses[cid].weights, 
        "assessments": courses[cid].assessments       
    }
@app.get("/courses/{cid}")
def get_course(cid: int):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    return {
        "id": {cid},  
        "course": courses[cid], 
    }
@app.get("/courses/{cid}/grade")
def get_total_grade(cid: int):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    return {"total_grade": courses[cid].total_grade()}

@app.delete("/courses/{cid}")
def delete_course(cid: int):
    if cid not in courses:
        raise HTTPException(status_code=404, detail="Course not found.")
    del courses[cid]
    return {"message": f"Course {cid} deleted successfully."}

### ----- CATEGORIES -----

@app.post("/courses/{cid}/category/{cat}")
def add_category(cid: int, cat: str, w: int):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    courses[cid].add_category(cat, w)
    return {
        "message": f"Category {cat} added to {courses[cid].name}.", 
        "category": cat, 
        "weight": w
    }
@app.get("/courses/{cid}/category/{cat}")
def get_category(cid: int, cat: str):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    return {
        "category": cat, 
        "percentage": courses[cid].category_percentage(cat)
    }
@app.delete("/courses/{cid}/category/{cat}")
def delete_cat(cid: int, cat: str):
    if cid not in courses:
        raise HTTPException(status_code=404, detail="Course not found.")
    if cat not in courses[cid].weights:
        raise HTTPException(status_cod=404, detail="Category not found.")
    for i in courses[cid].assessments:
        if i[1]["category"] == cat:
            del i
    del courses[cid].weights[cat]
    return {"message": f"Category {cat} deleted from {courses[cid].name}."}

### ----- ASSESSMENTS -----

@app.post("/courses/{cid}/assessment")
def add_assessment(cid: int, item: dict):
    #safeguard
    if cid not in courses:
        raise HTTPException(status_code=404, detail="Course not found.")
    courses[cid].add_assessment(item["name"], item["category"], item["earned"], item["possible"])
    #mesage and update
    return {
        "message": f"Assessment added to {courses[cid].name}.", 
        "name": item["name"],
        "assessment": item,
        "assessments": courses[cid].assessments
    }

@app.get("/courses/{cid}/assessment/")
def get_assessment(cid: int, name: str):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    for i in courses[cid].assessments():
        if i[0] == name:
            return("assessment": i[1], "name": i[0])
    raise HTTPException(status_code=404, detail="Assessment not found.")

@app.delete("/courses/{cid}/assessment")
def delete_assessment(cid: int, name: str):
    if cid not in courses:
        raise HTTPException(status_cod=404, detail="Course not found.")
    for i in courses[cid].assessments:
        if i[0] == name:
            del i
            return {"message": f"Assessment {name} deleted from {courses[cid].name}."}
    raise HTTPException(status_code=404, detail="Assessment not found.")