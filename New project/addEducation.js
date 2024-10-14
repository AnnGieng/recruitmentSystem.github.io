import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const auth = getAuth();
const db = getDatabase();

let currentUserId;

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid; // Set the current user's ID
        } else {
            alert('You must be logged in to add education details.');
            window.location.href = 'login.html'; // Redirect to login page if not logged in
        }
    });

    const saveButton = document.getElementById('save-education');
    const returnButton = document.getElementById('return-to-main');

    if (saveButton) {
        saveButton.addEventListener('click', function () {
            const degree = document.getElementById('degree').value;
            const course = document.getElementById('course').value;
            const institution = document.getElementById('institution').value;
            const graduationDate = document.getElementById('graduation-date').value;

            if (degree && course && institution && graduationDate) {
                const newEducationDetail = {
                    degree,
                    course,
                    institution,
                    graduationDate
                };

                let applicationData = JSON.parse(localStorage.getItem('applicationData')) || {};
                if (!applicationData.educationDetails) {
                    applicationData.educationDetails = [];
                }
                applicationData.educationDetails.push(newEducationDetail);
                localStorage.setItem('applicationData', JSON.stringify(applicationData));

                // Update Firebase with new education details
                const applicationRef = ref(db, `applications/${applicationData.jobId}_${currentUserId}`);
                update(applicationRef, {
                    educationDetails: applicationData.educationDetails
                }).then(() => {
                    alert('Education details saved successfully!');
                    var jobTitle = urlParams.get('jobTitle');
                    var jobId = urlParams.get('id');
                    window.location.href = `apply.html?jobTitle=${jobTitle}&&id=${jobId}`; // Redirect to apply.html
                }).catch((error) => {
                    console.error('Error saving education details:', error);
                    alert('Failed to save education details. Please try again.');
                });

            } else {
                alert('Please fill all fields.');
            }
        });
    } else {
        console.error('Save button not found.');
    }

    if (returnButton) {
        returnButton.addEventListener('click', function () {
           var jobTitle = urlParams.get('jobTitle');
           var jobId = urlParams.get('id');
            window.location.href = `apply.html?jobTitle=${jobTitle}&&id=${jobId}`;
        });
    } else {
        console.error('Return button not found.');
    }
});
