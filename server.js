const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "patients.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readPatients() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function savePatients(patients) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(patients, null, 2), "utf8");
}

const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Oncology",
    "Emergency"
];

const priorities = ["Emergency", "Urgent", "Routine"];

app.get("/api/patients", (req, res) => {
    try {
        const patients = readPatients();

        const priorityOrder = {
            Emergency: 1,
            Urgent: 2,
            Routine: 3
        };

        patients.sort((a, b) =>
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Could not load patients." });
    }
});

app.post("/api/patients", (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dob,
            gender,
            contact,
            department,
            priority,
            symptoms
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !dob ||
            !gender ||
            !contact ||
            !department ||
            !priority
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        if (!/^\d{10}$/.test(String(contact))) {
            return res.status(400).json({
                message: "Contact number must contain exactly 10 digits."
            });
        }

        if (!departments.includes(department)) {
            return res.status(400).json({
                message: "Please select a valid department."
            });
        }

        if (!priorities.includes(priority)) {
            return res.status(400).json({
                message: "Please select a valid priority."
            });
        }

        const birthDate = new Date(dob);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
            return res.status(400).json({
                message: "Date of birth cannot be in the future."
            });
        }

        const patients = readPatients();

        const patient = {
            id: Date.now().toString(),
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            dob,
            gender,
            contact: String(contact),
            department,
            priority,
            symptoms: symptoms || "",
            registeredAt: new Date().toISOString()
        };

        patients.push(patient);
        savePatients(patients);

        res.status(201).json({
            message: "Patient registered successfully.",
            patient
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Could not register patient."
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "HRAMS server is running."
    });
});

app.listen(PORT, () => {
    console.log(`HRAMS is running at http://localhost:${PORT}`);
});