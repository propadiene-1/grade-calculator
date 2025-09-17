from fastapi import FastAPI
from pydantic import BaseModel
from calculator import Course

app = FastAPI()
courses = {}

#course class with Pydantic
class CourseIn(BaseModel):
    name: str
    weights: dict
    assessments: list = []

### --- COURSE CLASS ---

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

### --- CATEGORIES ---

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

### --- ASSESSMENTS ---

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