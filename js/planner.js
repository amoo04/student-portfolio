(function () {
  const STORAGE_KEY = "eon-academic-planner";

  const form = document.getElementById("taskForm");
  if (!form) return;

  const titleInput = document.getElementById("taskTitle");
  const courseInput = document.getElementById("taskCourse");
  const dueInput = document.getElementById("taskDue");
  const priorityInput = document.getElementById("taskPriority");
  const titleError = document.getElementById("taskTitleError");

  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const emptyText = document.getElementById("emptyText");
  const filterButtons = document.querySelectorAll("[data-task-filter]");
  const clearButton = document.getElementById("clearCompleted");
  const footerCount = document.getElementById("footerCount");
  const statusRegion = document.getElementById("plannerStatus");

  const totalEl = document.getElementById("statTotal");
  const doneEl = document.getElementById("statDone");
  const leftEl = document.getElementById("statLeft");
  const percentEl = document.getElementById("progressPercent");
  const fillEl = document.getElementById("progressFill");
  const messageEl = document.getElementById("progressMessage");

  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

  let tasks = loadTasks();
  let currentFilter = "all";

  /* ---------- Data helpers ---------- */

  function todayISO(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  }

  function sampleTasks() {
    return [
      { id: makeId(), title: "Submit COS 106 term project", course: "COS 106", due: todayISO(5), priority: "high", completed: false },
      { id: makeId(), title: "Read chapter 4: CSS Flexbox and Grid", course: "COS 106", due: todayISO(2), priority: "medium", completed: false },
      { id: makeId(), title: "Revise calculus lecture notes", course: "MTH 101", due: todayISO(1), priority: "medium", completed: false },
      { id: makeId(), title: "Set up GitHub repository", course: "COS 106", due: todayISO(-1), priority: "low", completed: true }
    ];
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      /* Storage unavailable (private mode etc.) — fall back to samples */
    }
    return sampleTasks();
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      /* Ignore — the planner still works for this visit */
    }
  }

  function announce(message) {
    statusRegion.textContent = message;
  }

  /* ---------- Core actions ---------- */

  function addTask(title, course, due, priority) {
    const task = { id: makeId(), title, course, due, priority, completed: false };
    tasks.unshift(task);
    saveTasks();
    render();
    announce(`Task added: ${title}`);
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    render();
    const task = tasks.find((t) => t.id === id);
    if (task) announce(`${task.title} marked as ${task.completed ? "completed" : "not completed"}`);
  }

  function deleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
    if (task) announce(`Task deleted: ${task.title}`);
  }

  function clearCompleted() {
    const count = tasks.filter((t) => t.completed).length;
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    render();
    announce(`${count} completed ${count === 1 ? "task" : "tasks"} cleared`);
  }

  function getVisibleTasks() {
    const filtered = tasks.filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });

    // Open tasks first, then by due date, then by priority
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dueA = a.due || "9999-12-31";
      const dueB = b.due || "9999-12-31";
      if (dueA !== dueB) return dueA < dueB ? -1 : 1;
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    });
  }

  /* ---------- Rendering (DOM manipulation) ---------- */

  function describeDue(due, completed) {
    if (!due) return { text: "No due date", className: "" };

    const date = new Date(`${due}T00:00:00`);
    const label = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    const today = todayISO();

    if (completed) return { text: `Due ${label}`, className: "" };
    if (due < today) return { text: `Overdue · ${label}`, className: "overdue" };
    if (due === today) return { text: "Due today", className: "due-soon" };
    if (due === todayISO(1)) return { text: "Due tomorrow", className: "due-soon" };
    return { text: `Due ${label}`, className: "" };
  }

  function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task" + (task.completed ? " completed" : "");
    item.dataset.id = task.id;

    // Checkbox — mark as completed
    const check = document.createElement("label");
    check.className = "task-check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.title}" as completed`);
    checkbox.dataset.action = "toggle";
    const box = document.createElement("span");
    box.setAttribute("aria-hidden", "true");
    check.append(checkbox, box);

    // Body — title and meta information
    const body = document.createElement("div");
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const priority = document.createElement("span");
    priority.className = `priority priority-${task.priority}`;
    priority.textContent = task.priority;
    meta.appendChild(priority);

    if (task.course) {
      const course = document.createElement("span");
      course.textContent = task.course;
      meta.appendChild(course);
    }

    const dueInfo = describeDue(task.due, task.completed);
    const due = document.createElement("span");
    due.textContent = dueInfo.text;
    if (dueInfo.className) due.className = dueInfo.className;
    meta.appendChild(due);

    body.append(title, meta);

    // Delete button
    const del = document.createElement("button");
    del.type = "button";
    del.className = "task-delete";
    del.dataset.action = "delete";
    del.setAttribute("aria-label", `Delete "${task.title}"`);
    del.title = "Delete task";
    del.textContent = "×";

    item.append(check, body, del);
    return item;
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const left = total - done;
    const percent = total ? Math.round((done / total) * 100) : 0;

    totalEl.textContent = total;
    doneEl.textContent = done;
    leftEl.textContent = left;
    percentEl.textContent = `${percent}%`;
    fillEl.style.width = `${percent}%`;
    fillEl.parentElement.setAttribute("aria-valuenow", String(percent));

    let message;
    if (total === 0) message = "A blank page. Plan something great.";
    else if (percent === 100) message = "Everything done. Great work!";
    else if (percent >= 50) message = "Over halfway there. Keep the standard.";
    else if (done > 0) message = "Good start. One task at a time.";
    else message = "Every great term starts with a first tick.";
    messageEl.textContent = message;

    footerCount.textContent = `${left} ${left === 1 ? "task" : "tasks"} remaining`;
    clearButton.disabled = done === 0;
  }

  function render() {
    const visible = getVisibleTasks();
    list.innerHTML = "";
    visible.forEach((task) => list.appendChild(createTaskElement(task)));

    const isEmpty = visible.length === 0;
    emptyState.hidden = !isEmpty;
    if (isEmpty) {
      const messages = {
        all: "No tasks yet. Add your first one to get started.",
        active: "Nothing pending. You're all caught up.",
        completed: "No completed tasks yet. You've got this."
      };
      emptyText.textContent = messages[currentFilter];
    }

    updateStats();
  }

  /* ---------- Event handling ---------- */

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();

    if (!title) {
      titleError.textContent = "Please enter a task before adding it.";
      titleInput.closest(".field").classList.add("has-error");
      titleInput.setAttribute("aria-invalid", "true");
      titleInput.focus();
      return;
    }

    addTask(title, courseInput.value.trim(), dueInput.value, priorityInput.value);
    form.reset();
    priorityInput.value = "medium";
    titleInput.focus();
  });

  titleInput.addEventListener("input", () => {
    if (titleInput.value.trim()) {
      titleError.textContent = "";
      titleInput.closest(".field").classList.remove("has-error");
      titleInput.removeAttribute("aria-invalid");
    }
  });

  // One listener on the list handles every task (event delegation)
  list.addEventListener("change", (event) => {
    if (event.target.dataset.action === "toggle") {
      toggleTask(event.target.closest(".task").dataset.id);
    }
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="delete"]');
    if (!button) return;
    const item = button.closest(".task");
    item.classList.add("removing");
    setTimeout(() => deleteTask(item.dataset.id), 280);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.taskFilter;
      filterButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      render();
    });
  });

  clearButton.addEventListener("click", clearCompleted);

  render();
})();
