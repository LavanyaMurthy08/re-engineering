// ================================
// Get Form Elements
// ================================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

// ================================
// Form Submit
// ================================

loginForm.addEventListener("submit", function (event) {

    // Stop page refresh
    event.preventDefault();

    // Remove extra spaces
    const userEmail = email.value.trim();
    const userPassword = password.value.trim();

    // ================================
    // Validation
    // ================================

    if (userEmail === "" || userPassword === "") {

        alert("Please fill in all fields.");

        return;

    }

    // Email Validation

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailPattern.test(userEmail)) {

        alert("Please enter a valid email address.");

        return;

    }

    // Password Length

    if (userPassword.length < 8) {

        alert("Password must contain at least 8 characters.");

        return;

    }

    // Success Message

    alert("Login Successful!");

    // Temporary Redirect
    // Dashboard page will be created later

    window.location.href = "dashboard.html";

});