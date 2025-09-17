// storage.js
const KEY = "grade-calculator:courses:v1";

export function saveAll(plainCoursesArray) {
  localStorage.setItem(KEY, JSON.stringify(plainCoursesArray));
}

export function loadAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function exportCourses(plainCoursesArray) {
  const blob = new Blob([JSON.stringify(plainCoursesArray, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "courses.json"; a.click();
  URL.revokeObjectURL(url);
}

export async function importCoursesFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("Invalid file");
  return parsed;
}