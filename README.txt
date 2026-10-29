HRAMS — SOFTWARE ENGINEERING PBL

Selected modules:
1. Patient Registration and Priority Assignment
2. Registered Patient List and Priority Display

REQUIREMENTS
- Node.js (LTS)
- Internet connection for the first installation of dependencies

RUN ON WINDOWS
1. Extract HRAMS_Project.zip to a folder.
2. Open the extracted HRAMS_Project folder.
3. Click the File Explorer address bar, type cmd, and press Enter.
4. Run: npm install
5. Run: npm start
6. Open http://localhost:3000 in your browser.
7. Register a test patient and verify it appears in the list.
8. Stop the server with Ctrl+C in the terminal.

DATA
SQLite database file hospital.db is created automatically on first run.
Keep hospital.db to retain your test records. Delete it only if you want a fresh demo database.

TEST IDEAS
- Valid patient data is saved and appears in the list.
- Blank first name or last name is rejected.
- Contact number with fewer than 10 digits is rejected.
- Letters in contact number are rejected.
- Future date of birth is rejected.
- Invalid priority is rejected by the backend.
- Empty patient list shows a helpful message.
- Search by patient name/department works.
- Priority filter works.
- Emergency patients appear before Urgent and Routine patients.

NOTE
Use fictional sample patient details only. Screenshots and JIRA evidence should come from your actual run. This is a student demonstration project, not a production medical system.
