// =======================================
// Coding Practice Tracker
// Stored locally in the browser (localStorage) — private to this device
// =======================================

const STORAGE_KEY = "codingLog";

const probTitle = document.getElementById("probTitle");
const probPlatform = document.getElementById("probPlatform");
const probDifficulty = document.getElementById("probDifficulty");
const probTopic = document.getElementById("probTopic");
const addProblemBtn = document.getElementById("addProblemBtn");
const logBody = document.getElementById("logBody");
const emptyState = document.getElementById("emptyState");

function getLog() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveLog(log) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

addProblemBtn.addEventListener("click", () => {
    const title = probTitle.value.trim();
    if (!title) {
        showToast("Enter a problem title first.");
        return;
    }

    const entry = {
        id: Date.now(),
        title,
        platform: probPlatform.value,
        difficulty: probDifficulty.value,
        topic: probTopic.value.trim() || "General",
        date: new Date().toISOString().slice(0, 10)
    };

    const log = getLog();
    log.unshift(entry);
    saveLog(log);

    probTitle.value = "";
    probTopic.value = "";

    render();
    showToast("Problem added ✅");
});

function deleteEntry(id) {
    const log = getLog().filter((e) => e.id !== id);
    saveLog(log);
    render();
}

function render() {
    const log = getLog();

    document.getElementById("statTotal").textContent = log.length;
    localStorage.setItem("codingCount", String(log.length));

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const thisWeek = log.filter((e) => new Date(e.date) >= weekAgo).length;
    document.getElementById("statWeek").textContent = thisWeek;

    document.getElementById("statStreak").textContent = `${calcStreak(log)} 🔥`;

    const order = { hard: 3, medium: 2, easy: 1 };
    const hardest = log.reduce((acc, e) => (order[e.difficulty] > order[acc?.difficulty || ""] ? e : acc), null);
    document.getElementById("statHardest").textContent = hardest ? hardest.title : "—";

    renderDifficultyBars(log);
    renderTable(log);
}

function calcStreak(log) {
    if (!log.length) return 0;
    const days = new Set(log.map((e) => e.date));
    let streak = 0;
    let cursor = new Date();

    // if nothing logged today, start checking from yesterday
    if (!days.has(cursor.toISOString().slice(0, 10))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (days.has(cursor.toISOString().slice(0, 10))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function renderDifficultyBars(log) {
    const counts = { easy: 0, medium: 0, hard: 0 };
    log.forEach((e) => counts[e.difficulty]++);
    const max = Math.max(1, counts.easy, counts.medium, counts.hard);

    const container = document.getElementById("difficultyBars");
    container.innerHTML = "";

    ["easy", "medium", "hard"].forEach((diff) => {
        const pct = Math.round((counts[diff] / max) * 100);
        const row = document.createElement("div");
        row.className = `diff-row ${diff}`;
        row.innerHTML = `
            <div class="label">${capitalize(diff)}</div>
            <div class="bar"><div class="bar-fill" style="width:${pct}%;"></div></div>
            <div class="count">${counts[diff]}</div>
        `;
        container.appendChild(row);
    });
}

function renderTable(log) {
    logBody.innerHTML = "";
    emptyState.style.display = log.length ? "none" : "block";
    document.getElementById("logTableWrap").style.display = log.length ? "block" : "none";

    log.forEach((entry) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${escapeHtml(entry.title)}</td>
            <td>${entry.platform}</td>
            <td><span class="tag ${entry.difficulty}">${capitalize(entry.difficulty)}</span></td>
            <td>${escapeHtml(entry.topic)}</td>
            <td>${entry.date}</td>
            <td><button class="icon-btn" data-id="${entry.id}" title="Delete">🗑</button></td>
        `;
        logBody.appendChild(tr);
    });

    logBody.querySelectorAll(".icon-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteEntry(Number(btn.dataset.id)));
    });
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

render();
