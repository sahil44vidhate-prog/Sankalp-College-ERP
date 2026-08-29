const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const roleButtons = document.querySelectorAll(".role-btn");

let selectedRole = "superadmin";

// Role selection
roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        roleButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        selectedRole = button.dataset.role;
    });
});

// Login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const urn = document.getElementById("urn").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!urn || !password) {
        message.textContent = "Please enter URN and password.";
        message.style.color = "#dc2626";
        return;
    }

    message.textContent = "Logging in...";
    message.style.color = "#2563eb";

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                urn: urn,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {

            message.textContent = "Login successful!";
            message.style.color = "#16a34a";

            // Store login information
            localStorage.setItem("token", data.token || "");
            localStorage.setItem("user", JSON.stringify(data.user || {}));
            localStorage.setItem("role", selectedRole);

            // Open dashboard
            setTimeout(() => {
                window.location.href = "../dashboard.html";
            }, 500);

        } else {
            message.textContent = data.message || "Invalid URN or password.";
            message.style.color = "#dc2626";
        }

    } catch (error) {
        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to the server. Make sure the backend is running.";

        message.style.color = "#dc2626";
    }
});