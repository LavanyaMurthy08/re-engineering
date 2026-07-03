// =======================================
// Settings — profile + local data management
// =======================================

const PROFILE_KEY = "userProfile";

const setName = document.getElementById("setName");
const setEmail = document.getElementById("setEmail");
const setAvatar = document.getElementById("setAvatar");
const setBio = document.getElementById("setBio");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const clearDataBtn = document.getElementById("clearDataBtn");

function loadProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
        setName.value = profile.name || "";
        setEmail.value = profile.email || "";
        setAvatar.value = profile.avatar || "";
        setBio.value = profile.bio || "";
    } catch {
        // ignore corrupted data
    }
}

saveProfileBtn.addEventListener("click", () => {
    const profile = {
        name: setName.value.trim(),
        email: setEmail.value.trim(),
        avatar: setAvatar.value.trim(),
        bio: setBio.value.trim()
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    showToast("Profile saved ✅");
});

clearDataBtn.addEventListener("click", () => {
    const confirmed = confirm("This will permanently clear all locally stored data (resume score, GitHub connection, coding log, roadmap progress, profile). Continue?");
    if (!confirmed) return;
    localStorage.clear();
    loadProfile();
    showToast("All local data cleared");
});

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

loadProfile();
