import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt0Yfl1gTu2lMtFFKyWtaWDc8y1NqDimw",
    authDomain: "recruitmentmanagement-15313.firebaseapp.com",
    projectId: "recruitmentmanagement-15313",
    storageBucket: "recruitmentmanagement-15313.appspot.com",
    messagingSenderId: "330771658770",
    appId: "1:330771658770:web:c589141d0df9aa14ab40cb",
    databaseURL: "https://recruitmentmanagement-15313-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');
    if (applicationId) {
        console.log('Application Id is ' + applicationId);
        getApplicationDetails(applicationId);
    } else {
        console.log('Application Id is null');
    }
});

function getApplicationDetails(id) {
    const applicationRef = ref(db, "applications/" + id); // Correct the path if necessary
    onValue(applicationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(`Date is ${data.interviewDate}`);
            document.getElementById('time').textContent = "Time: " + data.interviewTime;
            document.getElementById('date').textContent = "Date: " + data.interviewDate;
            document.getElementById('interviewType').textContent = "Interview type: " + data.interviewType;
            if (data.interviewType === 'online') {
                document.getElementById('meetingLink').textContent = "Google meet link: " + data.interviewLink;
            } else {
                document.getElementById('meetingLink').textContent = "Google Map link: " + data.interviewLink;
            }
        } else {
            console.log(`Data is null for application ID: ${id}`);
        }
    }, (error) => {
        console.error("Error fetching data: ", error);
    });
}
