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
let uid;
let jobsData = {};

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    uid = urlParams.get('uid');

    if (uid) {
        // Initialization code if needed
    }

    onValue(ref(db, 'jobs'), (snapshot) => {
        if (snapshot.exists()) {
            jobsData = snapshot.val();
            displayJobs(jobsData);
        }
    });

    const applicationElement = document.getElementById('application');

    if (applicationElement) {
        applicationElement.addEventListener('click', (e) => {
            e.preventDefault();
            applicationElement.setAttribute('href', `Clientapplications.html?userId=${uid}`);
            applicationElement.click();
        });
    } else {
        console.error("Element with id 'application' not found.");
    }
});

function displayJobs(jobs) {
    const dataTableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    dataTableBody.innerHTML = ''; // Clear existing content

    for (let key in jobs) {
        let row = dataTableBody.insertRow();
        let cellTitle = row.insertCell(0);
        let cellLevel = row.insertCell(1);
        let cellMandatory = row.insertCell(2);
        let cellApply = row.insertCell(3);

        let applyLink = document.createElement('a');
        applyLink.textContent = 'Apply';
        applyLink.href = `apply.html?jobTitle=${encodeURIComponent(jobs[key].jobTitle)}&&id=${encodeURIComponent(jobs[key].id)}&&userId=${uid}`;

        cellApply.appendChild(applyLink);
        cellTitle.textContent = jobs[key].jobTitle;
        cellMandatory.textContent = jobs[key].mandatorySkill;
        cellLevel.textContent = jobs[key].experienceLevel;
    }
}

function filterJobs() {
    const searchJob = document.getElementById('searchJob').value.toLowerCase();
    const experienceLevel = document.getElementById('experienceLevel').value;
    const mandatorySkill = document.getElementById('mandatorySkill').value.toLowerCase();

    const filteredJobs = {};

    for (let key in jobsData) {
        const jobTitleMatches = jobsData[key].jobTitle.toLowerCase().includes(searchJob);
        const experienceLevelMatches = experienceLevel === "" || jobsData[key].experienceLevel === experienceLevel;
        const mandatorySkillMatches = mandatorySkill === "" || jobsData[key].mandatorySkill.toLowerCase().includes(mandatorySkill);

        if (jobTitleMatches && experienceLevelMatches && mandatorySkillMatches) {
            filteredJobs[key] = jobsData[key];
        }
    }

    displayJobs(filteredJobs);

    // Display a message if no jobs match the search criteria
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (Object.keys(filteredJobs).length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}

// Attach the filterJobs function to the window object to make it globally accessible
window.filterJobs = filterJobs;
