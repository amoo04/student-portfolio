# Amoo Oluwasegun: Student Portfolio & Academic Manager

COS 106 – Introduction to Web Technologies · Practical Term Project
MIVA Open University · B.Sc. Software Engineering (100 Level)

A responsive, multi-page portfolio and academic management website built with plain HTML, CSS and JavaScript (no frameworks, no build step). It introduces me, shows real projects I have built, and includes a working academic task planner.

**Live site:** https://amoo04.github.io/student-portfolio/
**Repository:** https://github.com/amoo04/student-portfolio

## Pages

| File | Page | What it contains |
|---|---|---|
| `index.html` | Home | Name, photograph, welcome message, brief biography, what I bring, featured project (AvelloMart) |
| `about.html` | About Me | Education table, career aspirations, technical skills with skill meters, hobbies and interests |
| `projects.html` | Projects | 4 live projects with screenshots, descriptions and links, category filter, summary table |
| `planner.html` | Academic Planner | Add tasks, mark tasks as completed, delete tasks, filters, progress tracking |
| `contact.html` | Contact | Email, phone, location, GitHub link and a message form with JavaScript validation |

## Featured projects

| Project | Type | Live link |
|---|---|---|
| Mending Lives | Online therapy platform | https://www.mendinglives.ng |
| Vektar Perfumes | E-commerce store | https://www.vektarperfumes.com |
| Shea Shine | E-commerce store | https://www.sheashine.com |
| AvelloMart | Store-builder platform | https://avellomart.com |

## Folder structure

```
student-portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── style.css            ← single external stylesheet
├── js/
│   ├── main.js          ← navigation, scroll animations, project filter
│   ├── planner.js       ← task manager (add / complete / delete)
│   └── contact.js       ← form validation
└── images/              ← profile photo, project screenshots, favicon
```

## How the requirements are met

**HTML:** semantic elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`), forms (planner and contact), tables (education and project summary), images with descriptive alt text, hyperlinks, and ordered, unordered and description lists.

**CSS:** one external stylesheet; responsive layout with breakpoints at 960px and 650px; CSS Grid and Flexbox throughout; styled navigation with an active-page underline and a mobile hamburger menu; transitions and keyframe animations (scroll reveals, rotating orbits, skill meters, task animations); a consistent charcoal, paper and gold colour scheme defined as CSS variables; reduced motion for users who prefer it.

**JavaScript:** event handling (clicks, submit, input, blur, keyboard), DOM manipulation (tasks are built with `createElement`), form validation (empty fields, email format, digits-only phone), dynamic updates (stats, progress bar, filters, character counter), arrays and functions (`tasks` array with `map`, `filter`, `sort`, `find`), and a full interactive task management system saved with `localStorage`.

## Run locally

Double-click `index.html` to open it in a browser, or use the VS Code **Live Server** extension.

## Host on GitHub Pages

1. Create a new public repository on GitHub named `student-portfolio`.
2. Upload every file and folder in this project.
3. Go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://amoo04.github.io/student-portfolio/`. Submit this link together with the repository link.

## Contact

- Email: isegunamoo@gmail.com
- Phone: +234 701 949 1689
- GitHub: [amoo04](https://github.com/amoo04)
- Location: Ibadan, Nigeria

## Credits

- Fonts: Playfair Display and DM Sans (Google Fonts)
- Design, content and code: Amoo Oluwasegun
