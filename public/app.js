const form = document.getElementById("patientForm");
const rows = document.getElementById("patientRows");
const message = document.getElementById("message");
const count = document.getElementById("patientCount");
const search = document.getElementById("search");
const priorityFilter = document.getElementById("priorityFilter");

let patients = [];

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message show " + type;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (c) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[c];
    });
}

function renderPatients() {
    const q = search.value.trim().toLowerCase();
    const p = priorityFilter.value;

    const filtered = patients.filter(function (x) {
        const name = `${x.firstName || x.first_name || ""} ${x.lastName || x.last_name || ""}`;
        const department = x.department || "";

        return (
            name.toLowerCase().includes(q) ||
            department.toLowerCase().includes(q)
        ) && (!p || x.priority === p);
    });

    count.textContent = patients.length;

    if (!filtered.length) {
        rows.innerHTML = `<tr><td colspan="4" class="empty">${
            patients.length
                ? "No patients match your filters."
                : "No patients registered yet. Add the first patient using the form."
        }</td></tr>`;
        return;
    }

    rows.innerHTML = filtered.map(function (x) {
        const first = x.firstName || x.first_name || "";
        const last = x.lastName || x.last_name || "";

        return `
            <tr>
                <td>${escapeHTML(first)} ${escapeHTML(last)}<br>
                    <small>#${escapeHTML(x.id)}</small>
                </td>
                <td>${escapeHTML(x.department)}</td>
                <td><span class="priority">${escapeHTML(x.priority)}</span></td>
                <td><span class="status">${escapeHTML(x.status || "Registered")}</span></td>
            </tr>
        `;
    }).join("");
}

async function loadPatients() {
    rows.innerHTML = '<tr><td colspan="4" class="empty">Loading patient records...</td></tr>';

    try {
        const response = await fetch("/api/patients");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load records.");
        }

        patients = data;
        renderPatients();
    } catch (error) {
        rows.innerHTML = '<tr><td colspan="4" class="empty">Could not load records.</td></tr>';
        console.error("Loading patients failed:", error);
        showMessage(error.message, "error");
    }
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const values = new FormData(form);

    // Read the actual form fields and convert them to the names expected by the server.
const data = {
    firstName: form.querySelector('[name="first_name"]')?.value
        || form.querySelector('[name="firstName"]')?.value || "",
    lastName: form.querySelector('[name="last_name"]')?.value
        || form.querySelector('[name="lastName"]')?.value || "",
    dob: form.querySelector('[name="dob"]')?.value
        || form.querySelector('[name="dateOfBirth"]')?.value || "",
    gender: form.querySelector('[name="gender"]')?.value || "Not specified",
    contact: form.querySelector('[name="contact"]')?.value || "",
    department: form.querySelector('[name="department"]')?.value || "",
    priority: form.querySelector('[name="priority"]')?.value || "",
    symptoms: form.querySelector('[name="symptoms"]')?.value || ""
};

    console.log("Submitting patient data:", data);

    try {
        const response = await fetch("/api/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Registration failed.");
        }

        showMessage(
            "Patient registered successfully. Patient ID: " + result.patient.id,
            "ok"
        );

        form.reset();
        await loadPatients();
    } catch (error) {
        console.error("Registration error:", error);
        showMessage(error.message, "error");
    }
});

search.addEventListener("input", renderPatients);
priorityFilter.addEventListener("change", renderPatients);

document.getElementById("refreshBtn").addEventListener("click", loadPatients);

loadPatients();