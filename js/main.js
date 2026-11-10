document.documentElement.classList.remove("no-js");

/* ---------- Mobile navigation ---------- */
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    setMenu(!nav.classList.contains("open"));
  });

  // Close the menu after choosing a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      menuButton.focus();
    }
  });
}

/* ---------- Header shadow once the page scrolls ---------- */
const header = document.querySelector(".site-header");

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ---------- Footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Reveal elements as they enter the viewport ---------- */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

/* ---------- Projects page: filter by category ---------- */
const filterButtons = document.querySelectorAll("[data-filter]");
const projects = Array.from(document.querySelectorAll(".project[data-category]"));
const filterCount = document.getElementById("filterCount");

function filterProjects(category) {
  let shown = 0;

  projects.forEach((project) => {
    const categories = project.dataset.category.split(" ");
    const match = category === "all" || categories.includes(category);
    project.hidden = !match;
    if (match) {
      shown += 1;
      project.classList.add("visible");
    }
  });

  if (filterCount) {
    filterCount.textContent = `Showing ${shown} of ${projects.length} projects`;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    filterProjects(button.dataset.filter);
  });
});

if (projects.length) filterProjects("all");

/* ---------- Placeholder links ("coming soon") do nothing ---------- */
document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});
