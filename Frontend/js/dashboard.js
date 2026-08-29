document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo();
    applyRolePermissions();
    loadDashboardStats();
    loadRecentStudents();
});


/* =========================================
   USER INFORMATION
========================================= */

function loadUserInfo() {
    const userData = localStorage.getItem("user");

    if (!userData) {
        redirectToLogin();
        return;
    }

    try {
        const user = JSON.parse(userData);

        const userName = document.getElementById("userName");
        const userRole = document.getElementById("userRole");

        if (userName && user.full_name) {
            userName.textContent = user.full_name;
        }

        if (userRole && user.role) {
            userRole.textContent = formatRole(user.role);
        }

    } catch (error) {
        console.error("Unable to load user information:", error);
        redirectToLogin();
    }
}


/* =========================================
   ROLE FORMATTING
========================================= */

function formatRole(role) {
    return role
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}


/* =========================================
   ROLE-BASED PERMISSIONS
========================================= */

function applyRolePermissions() {
    const userData = localStorage.getItem("user");

    if (!userData) {
        redirectToLogin();
        return;
    }

    try {
        const user = JSON.parse(userData);

        const role = String(user.role || "")
            .toLowerCase()
            .trim();

        /*
         * Super Admin
         * Full ERP access.
         */
        if (role === "superadmin" || role === "super_admin") {
            showRoleModules([
                "dashboard",
                "students",
                "faculty",
                "academics",
                "attendance",
                "examinations",
                "fees",
                "reports",
                "settings"
            ]);
            return;
        }

        /*
         * Admin
         */
        if (role === "admin") {
            showRoleModules([
                "dashboard",
                "students",
                "faculty",
                "academics",
                "attendance",
                "examinations",
                "fees",
                "reports"
            ]);
            return;
        }

        /*
         * Faculty
         */
        if (role === "faculty") {
            showRoleModules([
                "dashboard",
                "students",
                "academics",
                "attendance",
                "examinations",
                "reports"
            ]);
            return;
        }

        /*
         * Student
         */
        if (role === "student") {
            showRoleModules([
                "dashboard",
                "academics",
                "attendance",
                "examinations",
                "fees"
            ]);
            return;
        }

        /*
         * Unknown role
         */
        console.warn("Unknown user role:", role);

    } catch (error) {
        console.error("Unable to apply role permissions:", error);
    }
}


/* =========================================
   SHOW / HIDE MODULES
========================================= */

function showRoleModules(allowedModules) {

    const navItems = document.querySelectorAll("[data-module]");

    navItems.forEach(item => {

        const moduleName = item.dataset.module;

        if (allowedModules.includes(moduleName)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }

    });
}


/* =========================================
   DASHBOARD STATISTICS
========================================= */

async function loadDashboardStats() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            redirectToLogin();
            return;
        }

        const response = await fetch(
            "http://localhost:3000/api/dashboard/stats",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Dashboard API unavailable");
        }

        const data = await response.json();

        if (data.success) {

            const studentCount =
                document.getElementById("studentCount");

            const facultyCount =
                document.getElementById("facultyCount");

            const departmentCount =
                document.getElementById("departmentCount");

            const courseCount =
                document.getElementById("courseCount");


            if (studentCount) {
                studentCount.textContent =
                    data.students ?? 0;
            }

            if (facultyCount) {
                facultyCount.textContent =
                    data.faculty ?? 0;
            }

            if (departmentCount) {
                departmentCount.textContent =
                    data.departments ?? 0;
            }

            if (courseCount) {
                courseCount.textContent =
                    data.courses ?? 0;
            }
        }

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );

        setDashboardValue("studentCount", "0");
        setDashboardValue("facultyCount", "0");
        setDashboardValue("departmentCount", "0");
        setDashboardValue("courseCount", "0");
    }
}


/* =========================================
   RECENT STUDENTS
========================================= */

async function loadRecentStudents() {
    const table =
        document.getElementById("studentsTable");

    if (!table) {
        return;
    }

    try {
        const token =
            localStorage.getItem("token");

        if (!token) {
            redirectToLogin();
            return;
        }

        const response = await fetch(
            "http://localhost:3000/api/students",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                "Students API unavailable"
            );
        }

        const data = await response.json();

        const students =
            data.students ||
            data.data ||
            [];

        if (students.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }

        table.innerHTML = students
            .slice(0, 5)
            .map(student => `
                <tr>
                    <td>${escapeHTML(student.urn || "-")}</td>

                    <td>
                        ${escapeHTML(
                            student.full_name ||
                            student.name ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.department || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.year || "-"
                        )}
                    </td>
                </tr>
            `)
            .join("");

    } catch (error) {

        console.error(
            "Recent students error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load students.
                </td>
            </tr>
        `;
    }
}


/* =========================================
   HELPERS
========================================= */

function setDashboardValue(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function redirectToLogin() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    window.location.href = "login/login.html";
}