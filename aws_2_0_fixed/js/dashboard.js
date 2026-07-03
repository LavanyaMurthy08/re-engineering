// =======================================
// Dashboard: sidebar, topbar, and live stats pulled from localStorage
// =======================================

// ---- Sidebar active state (in case a page forgets to set it) ----
const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
document.querySelectorAll(".sidebar li").forEach((li) => {
    const link = li.querySelector("a");
    if (link && link.getAttribute("href") === currentPage) {
        li.classList.add("active");
    }
});

// ---- Notification bell (present on every dashboard page) ----
const notification = document.querySelector(".notification");
const badge = document.querySelector(".badge");
if (notification && badge) {
    notification.addEventListener("click", function () {
        badge.style.display = badge.style.display === "none" ? "block" : "none";
    });
}

// ---- Search box (present on every dashboard page) ----
const searchInput = document.querySelector(".search-box input");
if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && searchInput.value.trim() !== "") {
            alert(`Searching for "${searchInput.value.trim()}"...`);
        }
    });
}

// ---- Profile name / avatar from Settings, shown on every dashboard page ----
(function applyProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
        const nameEl = document.getElementById("profileName");
        const imgEl = document.getElementById("profileImg");
        const welcomeEl = document.getElementById("welcomeHeading");

        if (profile.name) {
            if (nameEl) nameEl.textContent = profile.name;
            if (welcomeEl) welcomeEl.textContent = `Welcome back, ${profile.name.split(" ")[0]} 👋`;
        }
        if (profile.avatar && imgEl) imgEl.src = profile.avatar;
    } catch {
        // ignore corrupted profile data
    }
})();

// ---- Dashboard summary cards (only present on dashboard.html) ----
(function applyStats() {
    const cardResume = document.getElementById("cardResume");
    const cardCoding = document.getElementById("cardCoding");
    const cardGithub = document.getElementById("cardGithub");
    const cardRoadmap = document.getElementById("cardRoadmap");

    if (cardResume) {
        const val = localStorage.getItem("resumeScore");
        cardResume.textContent = val ? `${val}/100` : "—";
    }
    if (cardCoding) {
        cardCoding.textContent = localStorage.getItem("codingCount") || "0";
    }
    if (cardGithub) {
        const val = localStorage.getItem("githubScore");
        cardGithub.textContent = val ? `${val}%` : "—";
    }
    if (cardRoadmap) {
        const val = localStorage.getItem("roadmapProgressPercent");
        cardRoadmap.textContent = `${val || 0}%`;
    }
})();
