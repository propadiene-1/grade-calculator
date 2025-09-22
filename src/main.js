import { Course } from "./lib/course.js";

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

const asmName = document.getElementById("asmName");
const asmCat = document.getElementById("asmCat");
const asmEarned = document.getElementById("asmEarned");
const asmPossible = document.getElementById("asmPossible");
const addAsm = document.getElementById("addAsm");

const saveGrades = document.getElementById('saveGrades');

function renderSelect() {
  courseSelect.innerHTML = ""; //clear each time
  // NO COURSES
  if (!courses.length) {
    const opt = document.createElement("option");
    opt.value = "-1"; opt.textContent = "No courses";
    courseSelect.appendChild(opt); idx = -1;
  } 
  // SHOW/rebuild ALL OPTIONS
  else {
    courses.forEach((c, i) => {
      const opt = document.createElement("option");
      opt.value = String(i); opt.textContent = c.name;
      courseSelect.appendChild(opt); //build option per course
    });
    if (idx < 0 || idx >= courses.length) idx = 0; //default to first course
    courseSelect.value = String(idx); //set value to index
  }
  renderCourse();
}

//display selected course (from dropdown)
courseSelect.onchange = () => { idx = Number(courseSelect.value); renderCourse(); };

function renderCourse() {
  console.log('idx:', idx, 'keys:', courses[idx] && Object.keys(courses[idx].weights || {}));
  const curr = courses[idx]; // get current course
  const courseTableBody = document.getElementById("courseTableBody");
  if (!courseTableBody) return;
  courseTableBody.textContent = ""; // clear each time
  if (idx < 0 || !courses[idx]) return;

  //NO COURSES
  if (Object.keys(curr.weights || {}).length === 0) {
    const row = document.createElement('tr'); //construct category row

    const nameCell = document.createElement('td');
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "categoryName";
    nameInput.id = "nameInput";
    nameInput.placeholder = "Category Name";
    // const nameText = document.createTextNode("Enter Category"); //i = name
    // name.appendChild(nameText);
    nameCell.appendChild(nameInput);
    row.appendChild(nameCell);

    const weightCell = document.createElement('td'); 
    //display weight as percentage
    var weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.name = "categoryWeight";
    weightInput.id = "weightInput";
    weightInput.placeholder = "Category Weight";
    weightCell.appendChild(weightInput); // add something to convert to % later
    row.appendChild(weightCell);

    //inputs from user

    const earnedCell = document.createElement('td');
    var earnedInput = document.createElement("input");
    earnedInput.type = "number";
    earnedInput.name = "pointsEarned";
    earnedInput.id = "earnedInput";
    earnedInput.placeholder = "Points Earned";
    earnedCell.appendChild(earnedInput);
    row.appendChild(earnedCell);

    const possibleCell = document.createElement('td');
    var possibleInput = document.createElement("input");
    possibleInput.type = "number";
    possibleInput.name = "pointsPossible";
    possibleInput.id = "possibleInput";
    possibleInput.placeholder = "Points Possible";
    possibleCell.appendChild(possibleInput);
    row.appendChild(possibleCell);

    //total percentage
    const catPercentageCell = document.createElement('td');
    var catPercentageText = document.createElement("text");
    catPercentageText.textcontent = courses[idx].categoryPercentage(catName); //based on inputted category name
    catPercentageCell.appendChild(catPercentageText);
    row.appendChild(catPercentageCell);

    courseTableBody.appendChild(row); //add to table body
    return;
  }
  
  //DISPLAY ALL COURSES
  for (const i in curr.weights) {
    const row = document.createElement('tr'); //construct category row

    const name = document.createElement('td');
    const nameText = document.createTextNode(i); //i = name
    name.appendChild(nameText);
    row.appendChild(name);

    const weight = document.createElement('td'); 
    //display weight as percentage
    const weightText = document.createTextNode((curr.weights[i] * 100).toFixed(2) + "%");
    weight.appendChild(weightText);
    row.appendChild(weight);

    //inputs from user

    const earned = document.createElement('td');
    const earnedText = document.createTextNode("");
    earned.appendChild(earnedText);
    row.appendChild(earned);

    const possible = document.createElement('td');
    const possibleText = document.createTextNode("");
    possible.appendChild(possibleText);
    row.appendChild(possible);

    //total percentage
    const catPercentage = document.createElement('td');
    const catPercentageText = document.createTextNode(curr.categoryPercentage(i));
    catPercentage.appendChild(catPercentageText);
    row.appendChild(catPercentage);

    courseTableBody.appendChild(row); //add to table body
  }
}


//   if (idx < 0) {
//     weightsView.textContent = "";
//     asmView.textContent = "";
//     gradeView.textContent = "";
//     return;
//   }
//   const c = courses[idx];
//   const linesW = Object.entries(c.weights).map(([k, v]) => {
//     const pct = c.categoryPercentage(k);
//     return `${k}: weight=${v}  category%=${pct == null ? "n/a" : pct.toFixed(2) + "%"}`;
//   });
//   weightsView.textContent = linesW.join("\n") || "(no categories)";

//   const linesA = c.assessments.map(a => `${a[0]} | ${a[1].category} | ${a[1].earned}/${a[1].possible}`);
//   asmView.textContent = linesA.join("\n") || "(no assessments)";

//   const total = c.totalGrade();
//   gradeView.textContent = total == null ? "(no total yet)" : `${total.toFixed(2)}%`;

// events

saveGrades.addEventListener('click',()=> {
    const catValue = catName.value;
    const newSpan = document.createElement('span');
    newSpan.textContent = catValue;
    category.replaceChild(newSpan, catValue);
});

//create: store in course list
createCourse.onclick = () => { 
  const name = (courseName.value || "").trim(); // "" if null/no name
  if (!name) return;
  courses.push(new Course(name, {}, [])); //new empty course
  courseName.value = ""; //clear input
  idx = courses.length - 1;
  renderSelect();
};

//delete: remove from course list
deleteCourse.onclick = () => {
  if (idx < 0) return;
  courses.splice(idx, 1);
  idx = courses.length ? 0 : -1;
  renderSelect();
};

// addCategory.onclick = () => {
//   if (idx < 0) return;
//   const name = (catName.value || "").trim();
//   const w = Number(catWeight.value);
//   if (!name || !Number.isFinite(w)) return;
//   courses[idx].addCategory(name, w);
//   catName.value = ""; catWeight.value = "";
//   renderCourse();
// };

// delCategory.onclick = () => {
//   if (idx < 0) return;
//   const name = (delCatName.value || "").trim();
//   if (!name) return;
//   courses[idx].delCategory(name);
//   delCatName.value = "";
//   renderCourse();
// };

// addAsm.onclick = () => {
//   if (idx < 0) return;
//   const n = (asmName.value || "").trim();
//   const c = (asmCat.value || "").trim();
//   const e = Number(asmEarned.value);
//   const p = Number(asmPossible.value);
//   if (!n || !c || !Number.isFinite(e) || !Number.isFinite(p) || p <= 0 || e < 0 || e > p) return;
//   if (!(c in courses[idx].weights)) return;
//   courses[idx].addAssessment(n, c, e, p);
//   asmName.value = ""; asmCat.value = ""; asmEarned.value = ""; asmPossible.value = "";
//   renderCourse();
// };

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