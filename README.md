# 🚀 SkillForge AI

A career-readiness dashboard for developers — analyze your resume, track your GitHub stats, log coding practice, and follow a structured learning roadmap. Built as a fully static, front-end-only web app (HTML, CSS, vanilla JS).

**Live demo:** _add your deployed Amplify/Netlify/GitHub Pages link here_

---

## ✨ Features

| Page | What it does |
|---|---|
| 🏠 **Dashboard** | At-a-glance summary of your resume score, coding stats, GitHub score, and roadmap progress, pulled live from the other pages. |
| 📄 **Resume Analyzer** | Upload a `.pdf` or `.txt` resume (parsed entirely in-browser with pdf.js — nothing is uploaded anywhere). Scored out of 100 across 6 transparent categories: contact info, core sections, action verbs, quantified impact, relevant keywords, and length. Includes a breakdown and a list of specific improvement tips. |
| 💻 **GitHub Analytics** | Enter any GitHub username to pull public profile data via the GitHub REST API — no login or token needed. Shows followers, public repos, total stars, top languages, and top repositories. |
| 📚 **Coding Tracker** | Log problems you solve (title, platform, difficulty, topic). Tracks total solved, problems solved this week, current daily streak, and a difficulty breakdown. |
| 🎯 **Roadmap** | A 5-stage Full-Stack Developer checklist (Foundations → Frontend → Backend → Tools & Deployment → Career Readiness). Checking off items updates an overall progress bar that also feeds the dashboard. |
| ⚙ **Settings** | Set a display name, avatar, and bio (shown across the app), plus a one-click reset for all locally stored data. |

All user data (resume score, GitHub username, coding log, roadmap progress, profile) is stored in the browser's `localStorage`. Nothing is sent to or stored on a server.

---

## 🛠 Tech Stack

- HTML5, CSS3, vanilla JavaScript (no frameworks, no build step)
- [pdf.js](https://mozilla.github.io/pdf.js/) (via CDN) for client-side PDF text extraction
- [GitHub REST API](https://docs.github.com/en/rest) for public profile data
- `localStorage` for persistence — fully static, deployable anywhere

---

## 📁 Project Structure

```
├── index.html          # Landing page
├── login.html           # Login page
├── signup.html          # Signup page
├── dashboard.html        # Main dashboard
├── resume.html            # Resume analyzer
├── github.html             # GitHub analytics
├── coding.html              # Coding practice tracker
├── roadmap.html              # Learning roadmap
├── settings.html               # Profile & data settings
├── css/
│   ├── style.css          # Landing page styles
│   ├── login.css           # Login page styles
│   ├── signup.css           # Signup page styles
│   ├── dashboard.css         # Shared dashboard layout (sidebar, topbar, cards)
│   ├── pages.css               # Shared component styles (panels, forms, buttons, tables)
│   ├── resume.css                # Resume analyzer specific styles
│   ├── github.css                 # GitHub analytics specific styles
│   ├── coding.css                  # Coding tracker specific styles
│   └── roadmap.css                  # Roadmap specific styles
├── js/
│   ├── app.js              # Landing page interactions
│   ├── login.js              # Login form logic
│   ├── signup.js               # Signup form logic
│   ├── dashboard.js              # Sidebar, topbar, and live dashboard stats
│   ├── resume.js                   # Resume upload, parsing & scoring engine
│   ├── github.js                     # GitHub API integration
│   ├── coding.js                       # Coding log CRUD & streak logic
│   ├── roadmap.js                        # Roadmap checklist & progress tracking
│   └── settings.js                         # Profile settings & data reset
└── assets/
    └── image.png
```

---

## 🚦 Getting Started

No build tools or dependencies required.

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

Then just open `index.html` in a browser, or serve it locally:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Visit `http://localhost:8000`.

---

## ☁️ Deployment

This is a static site, so it works with any static host:

- **AWS Amplify Hosting** — drag-and-drop deploy, or connect this repo directly (no build command needed).
- **GitHub Pages** — enable Pages on this repo, set the source to the root branch.
- **Netlify / Vercel** — connect the repo, no build command required.

> Note: `index.html` must stay at the repo root for routing to work correctly on most static hosts.

---

## 📊 How Resume Scoring Works

The resume analyzer uses a rules-based rubric (not a black-box model), so the score is fully explainable:

- **Contact Info (10 pts)** — email and phone found
- **Core Sections (30 pts)** — Education, Experience, Skills, Projects headings present
- **Action Verbs (15 pts)** — use of words like "built", "led", "designed", "improved"
- **Quantified Impact (15 pts)** — numbers/percentages showing measurable results
- **Relevant Keywords (20 pts)** — tech skills/tools matched against a common tech-role keyword list
- **Length (10 pts)** — ideally 300–900 words

---

## 🗺 Roadmap (project)

- [ ] Add a real backend for login/signup (currently front-end only)
- [ ] Persist user data to a database instead of localStorage
- [ ] Add resume export/download of feedback report
- [ ] Add GitHub contribution graph (requires GraphQL + auth)
- [ ] Dark mode toggle

---

## 📄 License

Add your license of choice here (e.g. MIT).

---

## 🙋 Author

Built by **Lavanya Murthy** — [GitHub](https://github.com/LavanyaMurthy08)
