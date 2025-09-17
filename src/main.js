// main.js
import { Course } from "./lib/course.js";
// import { saveAll, loadAll, exportCourses, importCoursesFromFile } from "./lib/storage.local.js";

// state
//let courses = loadAll().map(o => new Course(o.name, o.weights || {}, o.assessments || []));
//let idx = courses.length ? 0 : -1;
let courses = [];
let idx = courses.length ? 0 : -1;

// dom refs
const courseName = document.getElementById("courseName");
const createCourse = document.getElementById("createCourse");
const courseSelect = document.getElementById("courseSelect");
const deleteCourse = document.getElementById("deleteCourse");

const catName = document.getElementById("catName");
const catWeight = document.getElementById("catWeight");
const addCategory = document.getElementById("addCategory");
const delCatName = document.getElementById("delCatName");
const delCategory = document.getElementById("delCategory");
const weightsView = document.getElementById("weightsView");

const asmName = document.getElementById("asmName");
const asmCat = document.getElementById("asmCat");
const asmEarned = document.getElementById("asmEarned");
const asmPossible = document.getElementById("asmPossible");
const addAsm = document.getElementById("addAsm");
const asmView = document.getElementById("asmView");

const gradeView = document.getElementById("gradeView");

/*
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
*/

// helpers

/*
function persist() {
  const plain = courses.map(c => ({ name: c.name, weights: c.weights, assessments: c.assessments }));
  saveAll(plain);
}
*/

function renderSelect() {
  courseSelect.innerHTML = "";
  if (!courses.length) {
    const opt = document.createElement("option");
    opt.value = "-1"; opt.textContent = "No courses";
    courseSelect.appendChild(opt); idx = -1;
  } else {
    courses.forEach((c, i) => {
      const opt = document.createElement("option");
      opt.value = String(i); opt.textContent = c.name;
      courseSelect.appendChild(opt);
    });
    if (idx < 0 || idx >= courses.length) idx = 0;
    courseSelect.value = String(idx);
  }
  renderCourse();
}

function renderCourse() {
  if (idx < 0) {
    weightsView.textContent = "";
    asmView.textContent = "";
    gradeView.textContent = "";
    return;
  }
  const c = courses[idx];
  const linesW = Object.entries(c.weights).map(([k, v]) => {
    const pct = c.categoryPercentage(k);
    return `${k}: weight=${v}  category%=${pct == null ? "n/a" : pct.toFixed(2) + "%"}`;
  });
  weightsView.textContent = linesW.join("\n") || "(no categories)";

  const linesA = c.assessments.map(a => `${a[0]} | ${a[1].category} | ${a[1].earned}/${a[1].possible}`);
  asmView.textContent = linesA.join("\n") || "(no assessments)";

  const total = c.totalGrade();
  gradeView.textContent = total == null ? "(no total yet)" : `${total.toFixed(2)}%`;
}

// events
createCourse.onclick = () => { 
  const name = (courseName.value || "").trim();
  if (!name) return;
  courses.push(new Course(name, {}, []));
  courseName.value = "";
  idx = courses.length - 1;
  //persist(); 
  renderSelect();
};

courseSelect.onchange = () => { idx = Number(courseSelect.value); renderCourse(); };

deleteCourse.onclick = () => {
  if (idx < 0) return;
  courses.splice(idx, 1);
  idx = courses.length ? 0 : -1;
  //persist(); 
  renderSelect();
};

addCategory.onclick = () => {
  if (idx < 0) return;
  const name = (catName.value || "").trim();
  const w = Number(catWeight.value);
  if (!name || !Number.isFinite(w)) return;
  courses[idx].addCategory(name, w);
  catName.value = ""; catWeight.value = "";
  //persist(); 
  renderCourse();
};

delCategory.onclick = () => {
  if (idx < 0) return;
  const name = (delCatName.value || "").trim();
  if (!name) return;
  courses[idx].delCategory(name);
  delCatName.value = "";
  //persist(); 
  renderCourse();
};

addAsm.onclick = () => {
  if (idx < 0) return;
  const n = (asmName.value || "").trim();
  const c = (asmCat.value || "").trim();
  const e = Number(asmEarned.value);
  const p = Number(asmPossible.value);
  if (!n || !c || !Number.isFinite(e) || !Number.isFinite(p) || p <= 0 || e < 0 || e > p) return;
  if (!(c in courses[idx].weights)) return;
  courses[idx].addAssessment(n, c, e, p);
  asmName.value = ""; asmCat.value = ""; asmEarned.value = ""; asmPossible.value = "";
  //persist(); 
  renderCourse();
};

/*
exportBtn.onclick = () => {
  const plain = courses.map(c => ({ name: c.name, weights: c.weights, assessments: c.assessments }));
  exportCourses(plain);
};
*/

/* importFile.onchange = async (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  try {
    const arr = await importCoursesFromFile(f);
    courses = arr.map(o => new Course(o.name, o.weights || {}, o.assessments || []));
    idx = courses.length ? 0 : -1;
    persist(); renderSelect();
  } catch {
    alert("Import failed");
  } finally {
    importFile.value = "";
  }
};
*/

// init
renderSelect();