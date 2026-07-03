// =======================================
// GitHub Analytics
// Uses GitHub's public REST API (no auth required for public data)
// =======================================

const ghUsernameInput = document.getElementById("ghUsername");
const connectBtn = document.getElementById("connectBtn");
const ghStatus = document.getElementById("ghStatus");
const ghResults = document.getElementById("ghResults");

connectBtn.addEventListener("click", () => connect());
ghUsernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") connect();
});

// Auto-load previously connected username
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("githubUsername");
    if (saved) {
        ghUsernameInput.value = saved;
        connect();
    }
});

async function connect() {
    const username = ghUsernameInput.value.trim();
    if (!username) {
        ghStatus.textContent = "Enter a GitHub username first.";
        return;
    }

    connectBtn.disabled = true;
    ghStatus.textContent = "Fetching public profile...";
    ghResults.style.display = "none";

    try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        if (userRes.status === 404) {
            ghStatus.textContent = `No GitHub user found for "${username}".`;
            connectBtn.disabled = false;
            return;
        }
        if (!userRes.ok) {
            ghStatus.textContent = "GitHub API rate limit reached — try again in a few minutes.";
            connectBtn.disabled = false;
            return;
        }
        const user = await userRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
        const repos = reposRes.ok ? await reposRes.json() : [];

        renderProfile(user, repos);
        localStorage.setItem("githubUsername", username);
        ghStatus.textContent = "Connected.";
    } catch (err) {
        console.error(err);
        ghStatus.textContent = "Couldn't reach GitHub — check your connection and try again.";
    } finally {
        connectBtn.disabled = false;
    }
}

function renderProfile(user, repos) {
    ghResults.style.display = "block";

    document.getElementById("ghAvatar").src = user.avatar_url;
    document.getElementById("ghName").textContent = user.name || user.login;
    document.getElementById("ghLogin").textContent = `@${user.login}${user.location ? " · " + user.location : ""}`;
    document.getElementById("ghBio").textContent = user.bio || "";
    document.getElementById("ghProfileLink").href = user.html_url;

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    document.getElementById("statRepos").textContent = user.public_repos ?? repos.length;
    document.getElementById("statFollowers").textContent = user.followers ?? 0;
    document.getElementById("statStars").textContent = totalStars;

    // Simple transparent "engagement score" out of 100
    const score = Math.min(
        100,
        Math.round((user.followers || 0) * 1.5 + totalStars * 1.2 + (user.public_repos || 0) * 0.8)
    );
    document.getElementById("statScore").textContent = `${score}%`;
    localStorage.setItem("githubScore", String(score));

    renderLanguages(repos);
    renderTopRepos(repos);
}

function renderLanguages(repos) {
    const counts = {};
    repos.forEach((r) => {
        if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const container = document.getElementById("langBars");
    container.innerHTML = "";

    if (!sorted.length) {
        container.innerHTML = '<p class="hint">No language data found on public repos yet.</p>';
        return;
    }

    const colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

    sorted.forEach(([lang, count], i) => {
        const pct = Math.round((count / total) * 100);
        const row = document.createElement("div");
        row.className = "lang-row";
        row.innerHTML = `
            <div class="lang-name">${lang}</div>
            <div class="bar"><div class="bar-fill" style="width:${pct}%; background:${colors[i % colors.length]};"></div></div>
            <div class="pct">${pct}%</div>
        `;
        container.appendChild(row);
    });
}

function renderTopRepos(repos) {
    const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
    const container = document.getElementById("topRepos");
    container.innerHTML = "";

    if (!sorted.length) {
        container.innerHTML = '<div class="empty-state">No public repositories found.</div>';
        return;
    }

    sorted.forEach((repo) => {
        const div = document.createElement("div");
        div.className = "repo-card";
        div.innerHTML = `
            <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
            <p>${repo.description ? escapeHtml(repo.description) : "No description"}</p>
            <div class="repo-meta">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>${repo.language || "—"}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
