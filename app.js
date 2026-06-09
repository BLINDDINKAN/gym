const starterData = {
  days: [
    {
      id: "push", name: "Push Day", short: "Push", focus: "Chest, shoulders & triceps",
      exercises: [
        { id: "bench", name: "Barbell Bench Press", muscle: "Chest", sets: 4, reps: "6–10", purpose: "A compound press that trains the chest, front shoulders, and triceps.", tips: "Keep shoulder blades pulled back, feet planted, and lower the bar with control to the lower chest.", media: "" },
        { id: "ohp", name: "Overhead Press", muscle: "Shoulders", sets: 3, reps: "6–10", purpose: "Builds overhead strength through the shoulders and triceps.", tips: "Brace your core, keep ribs down, and press in a straight path without leaning far back.", media: "" },
        { id: "incline", name: "Incline Dumbbell Press", muscle: "Upper chest", sets: 3, reps: "8–12", purpose: "Emphasizes the upper chest while also training shoulders and triceps.", tips: "Use a moderate bench angle, keep wrists stacked, and do not bounce at the bottom.", media: "" },
        { id: "lateral", name: "Dumbbell Lateral Raise", muscle: "Side delts", sets: 3, reps: "12–20", purpose: "Isolates the side delts to build shoulder width.", tips: "Use light weight, lead with your elbows, and stop around shoulder height.", media: "" }
      ]
    },
    {
      id: "pull", name: "Pull Day", short: "Pull", focus: "Back, rear shoulders & biceps",
      exercises: [
        { id: "pulldown", name: "Lat Pulldown", muscle: "Lats", sets: 4, reps: "8–12", purpose: "Trains the lats and upper back through a vertical pulling movement.", tips: "Keep your chest tall and pull elbows toward your hips without swinging.", media: "" },
        { id: "row", name: "Chest-Supported Row", muscle: "Upper back", sets: 4, reps: "8–12", purpose: "Builds the upper and mid-back while the bench supports your torso.", tips: "Pull shoulder blades together, pause briefly, and avoid shrugging.", media: "" },
        { id: "curl", name: "Dumbbell Curl", muscle: "Biceps", sets: 3, reps: "10–15", purpose: "Directly trains the biceps and elbow flexors.", tips: "Keep elbows near your sides and lower each rep fully under control.", media: "" }
      ]
    },
    {
      id: "legs", name: "Leg Day", short: "Legs", focus: "Quads, glutes, hamstrings & calves",
      exercises: [
        { id: "squat", name: "Back Squat", muscle: "Quads & glutes", sets: 4, reps: "5–8", purpose: "A compound lower-body movement for quads, glutes, and trunk strength.", tips: "Brace before descending, keep your whole foot planted, and use a depth you can control.", media: "" },
        { id: "rdl", name: "Romanian Deadlift", muscle: "Hamstrings", sets: 3, reps: "8–12", purpose: "Trains the hamstrings and glutes through a controlled hip hinge.", tips: "Push hips backward, keep the weight close, and stop before your back rounds.", media: "" },
        { id: "split", name: "Bulgarian Split Squat", muscle: "Quads & glutes", sets: 3, reps: "8–12 / leg", purpose: "Builds single-leg strength and challenges the quads and glutes.", tips: "Use a stable stance, descend under control, and drive through your front foot.", media: "" }
      ]
    },
    { id: "upper", name: "Upper Body", short: "Upper", focus: "Chest, back, shoulders & arms", exercises: [] },
    { id: "lower", name: "Lower Body", short: "Lower", focus: "Leg strength & posterior chain", exercises: [] },
    { id: "rest1", name: "Recovery Day", short: "Rest", focus: "Walking, mobility & recovery", exercises: [] },
    { id: "rest2", name: "Recovery Day", short: "Rest", focus: "Rest and prepare for next week", exercises: [] }
  ],
  supplements: [
    { id: "creatine", name: "Creatine Monohydrate", seller: "Choose a certified seller", price: "Check current price", evidence: "Strong evidence", purpose: "Can improve repeated high-intensity exercise performance and support strength gains.", url: "https://www.nsf.org/consumer-resources/health-beauty/nutrition-wellness/supplements-vitamins/certified-for-sport", tested: true },
    { id: "protein", name: "Protein Powder", seller: "Choose a certified seller", price: "Compare price per serving", evidence: "Useful in some cases", purpose: "A convenient way to meet daily protein needs when whole-food meals are not practical.", url: "https://choice.wetestyoutrust.com/", tested: true },
    { id: "caffeine", name: "Caffeine", seller: "Compare reputable sellers", price: "Check current price", evidence: "Strong evidence", purpose: "May improve alertness and exercise performance, but can affect sleep and is not right for everyone.", url: "https://www.usp.org/verification-services/verified-mark", tested: false }
  ],
  completed: {}
};

const storageKey = "lift-log-plan-v1";
let data = loadData();
let selectedDayId = data.days[0].id;

const $ = (selector) => document.querySelector(selector);
const els = {
  dayTabs: $("#dayTabs"), grid: $("#exerciseGrid"), empty: $("#exerciseEmpty"),
  selectedTitle: $("#selectedDayTitle"), selectedFocus: $("#selectedDayFocus"), search: $("#exerciseSearch"),
  todayTitle: $("#todayTitle"), todayNumber: $("#todayNumber"), todayExercises: $("#todayExercises"),
  todaySets: $("#todaySets"), todayMinutes: $("#todayMinutes"), todayProgress: $("#todayProgress"),
  todayProgressText: $("#todayProgressText"), supplementGrid: $("#supplementGrid"), toast: $("#toast")
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return saved?.days?.length ? saved : structuredClone(starterData);
  } catch {
    return structuredClone(starterData);
  }
}

function saveData(message) {
  localStorage.setItem(storageKey, JSON.stringify(data));
  if (message) showToast(message);
}

function currentDay() {
  return data.days.find(day => day.id === selectedDayId) || data.days[0];
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function renderAll() {
  renderTabs();
  renderExercises();
  renderToday();
  renderSupplements();
}

function renderTabs() {
  els.dayTabs.innerHTML = data.days.map((day, index) => `
    <button class="day-tab ${day.id === selectedDayId ? "active" : ""} ${day.exercises.length ? "" : "rest"}" role="tab" aria-selected="${day.id === selectedDayId}" data-day="${day.id}">
      <span>${index + 1}. ${escapeHtml(day.short || day.name)}</span>
    </button>`).join("");
}

function renderExercises() {
  const day = currentDay();
  const query = els.search.value.trim().toLowerCase();
  const exercises = day.exercises.filter(ex => [ex.name, ex.muscle, ex.purpose].join(" ").toLowerCase().includes(query));
  els.selectedTitle.textContent = day.name;
  els.selectedFocus.textContent = day.focus;
  els.grid.innerHTML = exercises.map(exerciseCard).join("");
  els.empty.classList.toggle("hidden", exercises.length > 0 || Boolean(query));
}

function exerciseCard(ex) {
  const complete = Boolean(data.completed[`${selectedDayId}:${ex.id}`]);
  const media = ex.media
    ? `<img src="${escapeHtml(ex.media)}" alt="${escapeHtml(ex.name)} demonstration" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;media-placeholder&quot;><strong>GIF</strong><span>Media could not load.<br>Edit to replace the URL.</span></div>'">`
    : `<div class="media-placeholder"><strong>GIF</strong><span>Add a demonstration<br>in the exercise editor</span></div>`;
  return `<article class="exercise-card">
    <div class="exercise-media">
      <input class="exercise-complete" type="checkbox" aria-label="Mark ${escapeHtml(ex.name)} complete" data-complete="${ex.id}" ${complete ? "checked" : ""}>
      ${media}
    </div>
    <div class="exercise-body">
      <div class="exercise-top"><span class="muscle-tag">${escapeHtml(ex.muscle)}</span><button class="edit-exercise" data-edit="${ex.id}" aria-label="Edit ${escapeHtml(ex.name)}">•••</button></div>
      <h3>${escapeHtml(ex.name)}</h3>
      <p class="set-line">${escapeHtml(ex.sets)} sets × ${escapeHtml(ex.reps)} reps</p>
      <p class="exercise-description">${escapeHtml(ex.purpose)}</p>
      <p class="form-tip"><strong>Form cue</strong>${escapeHtml(ex.tips)}</p>
    </div>
  </article>`;
}

function renderToday() {
  const day = currentDay();
  const totalSets = day.exercises.reduce((sum, ex) => sum + Number(ex.sets || 0), 0);
  const done = day.exercises.filter(ex => data.completed[`${day.id}:${ex.id}`]).length;
  const percent = day.exercises.length ? Math.round((done / day.exercises.length) * 100) : 0;
  els.todayTitle.textContent = day.name;
  els.todayNumber.textContent = String(data.days.findIndex(item => item.id === day.id) + 1).padStart(2, "0");
  els.todayExercises.textContent = day.exercises.length;
  els.todaySets.textContent = totalSets;
  els.todayMinutes.textContent = Math.max(0, Math.round(totalSets * 2.5));
  els.todayProgress.style.width = `${percent}%`;
  els.todayProgressText.textContent = day.exercises.length ? `${done} of ${day.exercises.length} exercises complete.` : "Recovery is part of training.";
}

function renderSupplements() {
  els.supplementGrid.innerHTML = data.supplements.map(item => `
    <article class="supplement-card">
      <div class="supplement-meta"><span class="evidence">${escapeHtml(item.evidence)}</span><span class="tested">${item.tested ? "Testing noted" : "Verify testing"}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.purpose)}</p>
      <div class="seller-row"><div><span>${escapeHtml(item.seller)}</span><strong>${escapeHtml(item.price)}</strong></div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Check offer ↗</a></div>
    </article>`).join("");
}

function openExerciseDialog(exerciseId = "") {
  const ex = currentDay().exercises.find(item => item.id === exerciseId);
  $("#exerciseDialogTitle").textContent = ex ? "Edit exercise" : "Add exercise";
  $("#exerciseId").value = ex?.id || "";
  $("#exerciseName").value = ex?.name || "";
  $("#exerciseMuscle").value = ex?.muscle || "";
  $("#exerciseSets").value = ex?.sets || 3;
  $("#exerciseReps").value = ex?.reps || "8–12";
  $("#exercisePurpose").value = ex?.purpose || "";
  $("#exerciseFormTips").value = ex?.tips || "";
  $("#exerciseMedia").value = ex?.media || "";
  $("#deleteExerciseButton").classList.toggle("hidden", !ex);
  $("#exerciseDialog").showModal();
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

$("#exerciseForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = $("#exerciseId").value;
  const exercise = {
    id: id || makeId("exercise"), name: $("#exerciseName").value.trim(), muscle: $("#exerciseMuscle").value.trim(),
    sets: Number($("#exerciseSets").value), reps: $("#exerciseReps").value.trim(), purpose: $("#exercisePurpose").value.trim(),
    tips: $("#exerciseFormTips").value.trim(), media: $("#exerciseMedia").value.trim()
  };
  const day = currentDay();
  const index = day.exercises.findIndex(item => item.id === id);
  if (index >= 0) day.exercises[index] = exercise; else day.exercises.push(exercise);
  saveData(id ? "Exercise updated" : "Exercise added");
  $("#exerciseDialog").close();
  renderAll();
});

$("#deleteExerciseButton").addEventListener("click", () => {
  const id = $("#exerciseId").value;
  if (!id || !confirm("Delete this exercise?")) return;
  currentDay().exercises = currentDay().exercises.filter(item => item.id !== id);
  delete data.completed[`${selectedDayId}:${id}`];
  saveData("Exercise deleted");
  $("#exerciseDialog").close();
  renderAll();
});

els.dayTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  selectedDayId = button.dataset.day;
  els.search.value = "";
  renderAll();
});

els.grid.addEventListener("click", event => {
  const edit = event.target.closest("[data-edit]");
  if (edit) openExerciseDialog(edit.dataset.edit);
});

els.grid.addEventListener("change", event => {
  if (!event.target.matches("[data-complete]")) return;
  data.completed[`${selectedDayId}:${event.target.dataset.complete}`] = event.target.checked;
  saveData();
  renderToday();
});

["#addExerciseButton", "#addExerciseHero", "#addFirstExercise"].forEach(selector => $(selector).addEventListener("click", () => openExerciseDialog()));
els.search.addEventListener("input", renderExercises);
document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));

$("#editDayButton").addEventListener("click", () => {
  $("#dayName").value = currentDay().name;
  $("#dayFocus").value = currentDay().focus;
  $("#dayDialog").showModal();
});

$("#dayForm").addEventListener("submit", event => {
  event.preventDefault();
  currentDay().name = $("#dayName").value.trim();
  currentDay().short = currentDay().name.split(" ")[0];
  currentDay().focus = $("#dayFocus").value.trim();
  saveData("Training day updated");
  $("#dayDialog").close();
  renderAll();
});

$("#addSupplementButton").addEventListener("click", () => $("#supplementDialog").showModal());
$("#supplementForm").addEventListener("submit", event => {
  event.preventDefault();
  data.supplements.push({
    id: makeId("supplement"), name: $("#supplementName").value.trim(), seller: $("#supplementSeller").value.trim(),
    price: $("#supplementPrice").value.trim(), evidence: $("#supplementEvidence").value, purpose: $("#supplementPurpose").value.trim(),
    url: $("#supplementUrl").value.trim(), tested: $("#supplementTested").checked
  });
  saveData("Supplement listing added");
  event.target.reset();
  $("#supplementDialog").close();
  renderSupplements();
});

$("#openDataButton").addEventListener("click", () => $("#dataDialog").showModal());
$("#closeDataDialog").addEventListener("click", () => $("#dataDialog").close());
$("#exportDataButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `lift-log-plan-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("Plan exported");
});

$("#importDataInput").addEventListener("change", async event => {
  try {
    const imported = JSON.parse(await event.target.files[0].text());
    if (!Array.isArray(imported.days) || !Array.isArray(imported.supplements)) throw new Error();
    data = imported;
    selectedDayId = data.days[0].id;
    saveData("Plan imported");
    $("#dataDialog").close();
    renderAll();
  } catch {
    showToast("That file is not a valid Lift Log plan");
  }
  event.target.value = "";
});

$("#resetDataButton").addEventListener("click", () => {
  if (!confirm("Reset all edits and return to the starter plan?")) return;
  data = structuredClone(starterData);
  selectedDayId = data.days[0].id;
  saveData("Starter plan restored");
  $("#dataDialog").close();
  renderAll();
});

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

renderAll();
