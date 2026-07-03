// =======================================
// Get HTML Elements
// =======================================

const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// =======================================
// Password Strength Meter
// =======================================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    let strength = 0;

    if (password.length >= 8)
        strength++;

    if (/[A-Z]/.test(password))
        strength++;

    if (/[0-9]/.test(password))
        strength++;

    if (/[^A-Za-z0-9]/.test(password))
        strength++;

    switch (strength) {

        case 1:
            strengthFill.style.width = "25%";
            strengthFill.style.background = "red";
            strengthText.innerText = "Weak Password";
            break;

        case 2:
            strengthFill.style.width = "50%";
            strengthFill.style.background = "orange";
            strengthText.innerText = "Medium Password";
            break;

        case 3:
            strengthFill.style.width = "75%";
            strengthFill.style.background = "#2563eb";
            strengthText.innerText = "Good Password";
            break;

        case 4:
            strengthFill.style.width = "100%";
            strengthFill.style.background = "green";
            strengthText.innerText = "Strong Password";
            break;

        default:
            strengthFill.style.width = "0%";
            strengthText.innerText = "Password Strength";
    }

});

// =======================================
// Form Validation
// =======================================

signupForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmPassword.value;

    if (name === "" ||
        email === "" ||
        password === "" ||
        confirm === "") {

        alert("Please fill all fields.");

        return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailPattern.test(email)) {

        alert("Invalid Email");

        return;
    }

    if (password.length < 8) {

        alert("Password should contain at least 8 characters.");

        return;
    }

    if (password !== confirm) {

        alert("Passwords do not match.");

        return;
    }

    if (!terms.checked) {

        alert("Please accept Terms & Conditions.");

        return;
    }

    alert("Account Created Successfully!");

    // Redirect to Login Page

    window.location.href = "login.html";

});