// =======================================
// Learning Roadmap
// Progress is stored locally and feeds the dashboard's "Learning Progress" card
// =======================================

const ROADMAP = [
    {
        title: "1. Foundations",
        items: ["HTML & CSS Basics", "JavaScript Fundamentals", "Git & GitHub", "Command Line Basics", "Responsive Design"]
    },
    {
        title: "2. Frontend Development",
        items: ["DOM Manipulation", "CSS Frameworks (Tailwind/Bootstrap)", "React or Vue", "State Management", "API Integration (fetch/axios)"]
    },
    {
        title: "3. Backend Development",
        items: ["Node.js & Express", "REST API Design", "Databases (SQL)", "Databases (NoSQL)", "Authentication & Authorization"]
    },
    {
        title: "4. Tools & Deployment",
        items: ["Testing (unit/integration)", "Docker Basics", "CI/CD Pipelines", "Cloud Hosting (AWS/Vercel/Netlify)", "Monitoring & Debugging"]
    },
    {
        title: "5. Career Readiness",
        items: ["Build 3+ Portfolio Projects", "Polish Resume", "Contribute to Open Source", "Mock Interviews", "Networking / LinkedIn Presence"]
    }
];

const STORAGE_KEY = "roadmapProgress";

function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function render() {
    const progress = getProgress();
    const container = document.getElementById("stagesContainer");
    container.innerHTML = "";

    let totalItems = 0;
    let totalChecked = 0;

    ROADMAP.forEach((stage, stageIdx) => {
        const stageDone = stage.items.filter((_, i) => progress[`${stageIdx}-${i}`]).length;
        totalItems += stage.items.length;
        totalChecked += stageDone;

        const panel = document.createElement("div");
        panel.className = "stage-panel";

        const listItems = stage.items.map((item, itemIdx) => {
            const key = `${stageIdx}-${itemIdx}`;
            const checked = !!progress[key];
            return `
                <li class="${checked ? "checked" : ""}" data-key="${key}">
                    <input type="checkbox" ${checked ? "checked" : ""} data-key="${key}">
                    <span>${item}</span>
                </li>
            `;
        }).join("");

        panel.innerHTML = `
            <div class="stage-title-row">
                <h3>${stage.title}</h3>
                <span class="stage-badge">${stageDone}/${stage.items.length}</span>
            </div>
            <ul class="checklist">${listItems}</ul>
        `;

        container.appendChild(panel);
    });

    container.querySelectorAll('input[type="checkbox"]').forEach((box) => {
        box.addEventListener("change", () => {
            const progress = getProgress();
            progress[box.dataset.key] = box.checked;
            saveProgress(progress);
            render();
        });
    });

    const pct = totalItems ? Math.round((totalChecked / totalItems) * 100) : 0;
    document.getElementById("overallPct").textContent = `${pct}%`;
    document.getElementById("overallBarFill").style.width = `${pct}%`;
    localStorage.setItem("roadmapProgressPercent", String(pct));
}

render();
