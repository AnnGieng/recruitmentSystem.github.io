import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};

initializeApp(firebaseConfig);
const db = getDatabase();

// Function to load external script
function loadScript(url, callback) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Function to generate report
function generateReport() {
    onValue(ref(db, 'applications'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Name,Email,Role,Status\n";
            for (let key in data) {
                let application = data[key];
                csvContent += `${application.userName},${application.email},${application.roleName},${application.applicationStatus}\n`;
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            // Use FileSaver to save the file
            window.saveAs(blob, 'applications_report.csv');
        } else {
            console.error("No data available for report");
        }
    });
}

// Function to populate role filter options
function populateRoleFilter() {
    const roleFilter = document.getElementById('RoleApplied-filter');
    onValue(ref(db, 'jobs'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const roles = new Set();
            for (let key in data) {
                roles.add(data[key].jobTitle);
            }
            roles.forEach(role => {
                let option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                roleFilter.appendChild(option);
            });
        }
    });
}

// Function to update applications table
function updateApplicationsTable(filterRole) {
    onValue(ref(db, 'applications'), (snapshot) => {
        const data = snapshot.val();
        const dataTableBody = document.getElementById('applications-table').getElementsByTagName('tbody')[0];
        dataTableBody.innerHTML = ''; // Clear existing content

        if (data) {
            let filteredData = data;
            if (filterRole && filterRole !== 'all') {
                filteredData = {};
                for (let key in data) {
                    if (data[key].roleName === filterRole) {
                        filteredData[key] = data[key];
                    }
                }
            }

            let index = 1;
            for (let key in filteredData) {
                let row = dataTableBody.insertRow();
                let cellIndex = row.insertCell(0);
                let cellInfo = row.insertCell(1);
                let cellRole = row.insertCell(2);
                let cellAge = row.insertCell(3);
                let cellGender = row.insertCell(4);
                let cellDiploma = row.insertCell(5);
                let cellDegree = row.insertCell(6);
                let cellSkills = row.insertCell(7);
                let cellExperience = row.insertCell(8);
                let cellStatus = row.insertCell(9);
                let cellAction = row.insertCell(10);

                // Create an anchor element for the "View" link
                let applyLink = document.createElement('a');
                applyLink.textContent = 'View';
                applyLink.href = `viewApplication.html?applicationId=${encodeURIComponent(key)}`;
                applyLink.target = '_blank';

                cellAction.appendChild(applyLink);

                // Set content for each cell using data[key] properties
                cellIndex.textContent = index++;
                cellInfo.textContent = filteredData[key].userName;
                cellRole.textContent = filteredData[key].roleName;
                cellAge.textContent = filteredData[key].age;
                cellGender.textContent = filteredData[key].gender;
                cellDiploma.textContent = filteredData[key].gradDiploma;
                cellDegree.textContent = filteredData[key].gradDegree;
                cellSkills.textContent = filteredData[key].description;
                cellExperience.textContent = filteredData[key].totalYears;
                cellStatus.textContent = filteredData[key].applicationStatus;
            }

            // Update the application count
            document.querySelector('.application-header h2').textContent = `Application List (${index - 1})`;
        } else {
            console.error("No data available");
        }
    });
}

// Function to render applications
function renderApplications(applications) {
    const applicationsTable = document.getElementById("applications-table").getElementsByTagName('tbody')[0];
    applicationsTable.innerHTML = "";

    applications.forEach((app, index) => {
        const row = applicationsTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${app.userName}</td>
            <td>${app.roleName}</td>
            <td>${app.age}</td>
            <td>${app.gender}</td>
            <td>${app.gradDiploma}</td>
            <td>${app.gradDegree}</td>
            <td>${app.description}</td>
            <td>${app.totalYears}</td>
            <td>${app.applicationStatus}</td>
            <td><a href="viewApplication.html?applicationId=${encodeURIComponent(app.id)}" target="_blank">View</a></td>
        `;
    });
}

// Function to apply filters
function applyFilters(applications) {
    const filters = {
        role: document.getElementById("RoleApplied-filter").value,
        age: document.getElementById("Age-filter").value,
        gender: document.getElementById("Gender-filter").value,
        gradDiploma: document.getElementById("Diploma-filter").value,
        gradDegree: document.getElementById("Degree-filter").value,
        skills: document.getElementById("Skills-filter").value,
        experience: document.getElementById("Experience-filter").value,
        status: document.getElementById("Status-filter").value
    };

    const filteredApps = applications.filter(app => {
        return (filters.role === "all" || app.roleName === filters.role) &&
               (filters.age === "" || app.age == filters.age) &&
               (filters.gender === "all" || app.gender === filters.gender) &&
               (filters.gradDiploma === "" || app.gradDiploma.toLowerCase().includes(filters.gradDiploma.toLowerCase())) &&
               (filters.gradDegree === "" || app.gradDegree.toLowerCase().includes(filters.gradDegree.toLowerCase())) &&
               (filters.skills === "" || app.description.toLowerCase().includes(filters.skills.toLowerCase())) &&
               (filters.experience === "" || app.totalYears == filters.experience) &&
               (filters.status === "all" || app.applicationStatus === filters.status);
    });

    renderApplications(filteredApps);
}

// Event listener for apply filters button
document.getElementById('apply-filters').addEventListener('click', () => {
    onValue(ref(db, 'applications'), (snapshot) => {
        const data = snapshot.val();
        const applications = Object.keys(data).map(key => data[key]);
        applyFilters(applications);
    });
});

// Event listener for generate report button
document.getElementById('generate-report').addEventListener('click', generateReport);

// Event listener for role filter change
document.getElementById('RoleApplied-filter').addEventListener('change', (event) => {
    const selectedRole = event.target.value;
    updateApplicationsTable(selectedRole);
});

// Initial population of the role filter and applications table
populateRoleFilter();
updateApplicationsTable('all');

// Load FileSaver script dynamically
loadScript('https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js', () => {
    console.log('FileSaver script loaded successfully.');
});
