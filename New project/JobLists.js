import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

function loadJobs() {
    const jobTableBody = document.querySelector('#jobTable tbody');
    const jobsRef = ref(db, 'jobs/');

    onValue(jobsRef, (snapshot) => {
        jobTableBody.innerHTML = '';
        let index = 1;
        snapshot.forEach((childSnapshot) => {
            const job = childSnapshot.val();
            const jobId = childSnapshot.key;
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index++}</td>
                <td>${job.jobTitle}</td>
                <td>${job.experienceLevel}</td>
                <td>${job.mandatorySkill}</td>
                <td class="actions">
                    <button class="edit" onclick="editJob('${jobId}')">✏️</button>
                </td>
                <td class="actions">
                    <button class="delete" onclick="deleteJob('${jobId}')">❌</button>
                </td>
            `;
            jobTableBody.appendChild(row);
        });
    });
}

function editJob(jobId) {
    window.location.href = `adminDashboard.html?edit=true&jobId=${jobId}`;
}

function deleteJob(jobId) {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
        const jobRef = ref(db, 'jobs/' + jobId);
        remove(jobRef)
            .then(() => {
                alert('Job deleted successfully');
                loadJobs();
            })
            .catch((error) => {
                console.error('Error deleting job:', error);
            });
    }
}

// Make the functions globally accessible
window.editJob = editJob;
window.deleteJob = deleteJob;

document.addEventListener('DOMContentLoaded', loadJobs);
