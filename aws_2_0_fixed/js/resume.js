// =======================================
// Resume Analyzer
// Rules-based, fully client-side. Nothing is uploaded anywhere.
// =======================================

if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
}

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileNameEl = document.getElementById("fileName");
const changeFileBtn = document.getElementById("changeFileBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusText = document.getElementById("statusText");
const resultsPanel = document.getElementById("resultsPanel");
const tipsPanel = document.getElementById("tipsPanel");
const scoreRing = document.getElementById("scoreRing");
const scoreNumber = document.getElementById("scoreNumber");
const scoreBreakdown = document.getElementById("scoreBreakdown");
const tipsList = document.getElementById("tipsList");

let selectedFile = null;

// ---- Upload UI wiring ----

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
});

changeFileBtn.addEventListener("click", () => {
    selectedFile = null;
    fileInput.value = "";
    fileInfo.style.display = "none";
    dropzone.style.display = "block";
    analyzeBtn.disabled = true;
});

function handleFile(file) {
    const validTypes = [".pdf", ".txt"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!validTypes.includes(ext)) {
        showToast("Please upload a .pdf or .txt file");
        return;
    }
    selectedFile = file;
    fileNameEl.textContent = `📄 ${file.name}`;
    fileInfo.style.display = "flex";
    dropzone.style.display = "none";
    analyzeBtn.disabled = false;
    statusText.textContent = "";
}

analyzeBtn.addEventListener("click", async () => {
    if (!selectedFile) return;
    analyzeBtn.disabled = true;
    statusText.textContent = "Reading and analyzing your resume...";

    try {
        const text = await extractText(selectedFile);
        if (!text || text.trim().length < 30) {
            statusText.textContent = "Couldn't extract enough text — try a text-based PDF (not a scanned image) or a .txt file.";
            analyzeBtn.disabled = false;
            return;
        }
        const result = analyzeResume(text);
        renderResults(result);
        localStorage.setItem("resumeScore", String(result.total));
        statusText.textContent = "Analysis complete.";
    } catch (err) {
        console.error(err);
        statusText.textContent = "Something went wrong reading that file. Try a different file.";
    } finally {
        analyzeBtn.disabled = false;
    }
});

async function extractText(file) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (ext === ".txt") {
        return await file.text();
    }
    if (ext === ".pdf") {
        if (!window.pdfjsLib) throw new Error("PDF engine failed to load");
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((it) => it.str).join(" ") + "\n";
        }
        return text;
    }
    return "";
}

// ---- Scoring engine ----

const ACTION_VERBS = [
    "built", "led", "designed", "developed", "created", "implemented",
    "improved", "optimized", "managed", "launched", "architected",
    "automated", "reduced", "increased", "delivered", "achieved",
    "collaborated", "mentored", "deployed", "engineered", "streamlined"
];

const TECH_KEYWORDS = [
    "javascript", "python", "java", "c++", "html", "css", "react", "vue",
    "angular", "node", "express", "sql", "mongodb", "postgresql", "git",
    "github", "aws", "azure", "gcp", "docker", "kubernetes", "api", "rest",
    "graphql", "typescript", "flutter", "django", "flask", "linux",
    "figma", "agile", "ci/cd", "testing", "machine learning", "data"
];

const SECTIONS = ["education", "experience", "skills", "projects"];

function analyzeResume(rawText) {
    const text = rawText.toLowerCase();
    const words = rawText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Contact info (10 pts)
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText);
    const hasPhone = /(\+?\d[\d\s\-()]{8,}\d)/.test(rawText);
    const contactScore = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);

    // 2. Core sections (30 pts, 7.5 each)
    const sectionsFound = SECTIONS.filter((s) => text.includes(s));
    const sectionScore = Math.round((sectionsFound.length / SECTIONS.length) * 30);

    // 3. Action verbs (15 pts)
    const verbHits = ACTION_VERBS.filter((v) => text.includes(v));
    const verbScore = Math.min(15, verbHits.length * 2);

    // 4. Quantified impact (15 pts)
    const numberMatches = rawText.match(/\b\d+(\.\d+)?%?\b/g) || [];
    const impactScore = Math.min(15, numberMatches.length * 1.5);

    // 5. Keyword match (20 pts)
    const keywordHits = TECH_KEYWORDS.filter((k) => text.includes(k));
    const keywordScore = Math.min(20, keywordHits.length * 1.5);

    // 6. Length (10 pts) — ideal 300-900 words
    let lengthScore;
    if (wordCount >= 300 && wordCount <= 900) lengthScore = 10;
    else if (wordCount >= 200 && wordCount < 300) lengthScore = 7;
    else if (wordCount > 900 && wordCount <= 1200) lengthScore = 7;
    else if (wordCount >= 100) lengthScore = 4;
    else lengthScore = 1;

    const total = Math.round(
        contactScore + sectionScore + verbScore + impactScore + keywordScore + lengthScore
    );

    const tips = [];

    if (!hasEmail) tips.push({ text: "Add an email address so recruiters can reach you.", good: false });
    if (!hasPhone) tips.push({ text: "Add a phone number in your contact details.", good: false });

    SECTIONS.forEach((s) => {
        if (!sectionsFound.includes(s)) {
            tips.push({ text: `Add a clearly labeled "${capitalize(s)}" section.`, good: false });
        }
    });

    if (verbHits.length < 5) {
        tips.push({ text: "Use more strong action verbs (built, led, improved, launched) at the start of bullet points.", good: false });
    } else {
        tips.push({ text: "Good use of action verbs throughout your resume.", good: true });
    }

    if (numberMatches.length < 4) {
        tips.push({ text: "Add measurable results — e.g. \"improved load time by 40%\" or \"managed a team of 5\".", good: false });
    } else {
        tips.push({ text: "Nice — you've quantified your impact with real numbers.", good: true });
    }

    if (keywordHits.length < 5) {
        tips.push({ text: "List more relevant technical skills/tools to pass keyword screening.", good: false });
    } else {
        tips.push({ text: `Strong keyword coverage (${keywordHits.length} relevant tech terms found).`, good: true });
    }

    if (wordCount < 200) {
        tips.push({ text: "Your resume looks quite short — aim for 300–900 words with more detail.", good: false });
    } else if (wordCount > 1200) {
        tips.push({ text: "Your resume is fairly long — try trimming to the most relevant 1-2 pages.", good: false });
    }

    return {
        total,
        wordCount,
        breakdown: [
            { label: "Contact Info", score: contactScore, max: 10 },
            { label: "Core Sections", score: sectionScore, max: 30 },
            { label: "Action Verbs", score: verbScore, max: 15 },
            { label: "Quantified Impact", score: Math.round(impactScore), max: 15 },
            { label: "Relevant Keywords", score: Math.round(keywordScore), max: 20 },
            { label: "Length", score: lengthScore, max: 10 }
        ],
        tips
    };
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderResults(result) {
    resultsPanel.style.display = "block";
    tipsPanel.style.display = "block";

    scoreNumber.textContent = result.total;
    const deg = (result.total / 100) * 360;
    const color = result.total >= 75 ? "#16a34a" : result.total >= 50 ? "#f59e0b" : "#dc2626";
    scoreRing.style.background = `conic-gradient(${color} ${deg}deg, #e2e8f0 0deg)`;

    scoreBreakdown.innerHTML = "";
    result.breakdown.forEach((row) => {
        const pct = Math.round((row.score / row.max) * 100);
        const div = document.createElement("div");
        div.className = "breakdown-row";
        div.innerHTML = `
            <div class="label">${row.label}</div>
            <div class="bar"><div class="bar-fill" style="width:${pct}%;"></div></div>
            <div class="value">${row.score}/${row.max}</div>
        `;
        scoreBreakdown.appendChild(div);
    });

    tipsList.innerHTML = "";
    result.tips.forEach((tip) => {
        const li = document.createElement("li");
        li.textContent = tip.text;
        if (tip.good) li.classList.add("good");
        tipsList.appendChild(li);
    });

    resultsPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}
