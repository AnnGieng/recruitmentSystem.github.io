import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", function() {
    const db = getDatabase();
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');

    if (applicationId) {
        get(ref(db, `applications/${applicationId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById('interview-date').value = data.interviewDate || '';
                document.getElementById('interview-time').value = data.interviewTime || '';
                if (data.interviewType === 'online') {
                    document.getElementById('online-interview').checked = true;
                    document.getElementById('google-meet-link').value = data.interviewLink || '';
                    document.getElementById('online-link').style.display = 'block';
                } else if (data.interviewType === 'physical') {
                    document.getElementById('physical-interview').checked = true;
                    document.getElementById('google-map-link').value = data.interviewLink || '';
                    document.getElementById('physical-link').style.display = 'block';
                }

                document.querySelectorAll('input[name="interview-type"]').forEach((radio) => {
                    radio.addEventListener('change', (event) => {
                        const interviewType = event.target.value;
                        document.getElementById('online-link').style.display = interviewType === 'online' ? 'block' : 'none';
                        document.getElementById('physical-link').style.display = interviewType === 'physical' ? 'block' : 'none';
                    });
                });

                document.getElementById('edit-interview-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    const interviewDate = document.getElementById('interview-date').value;
                    const interviewTime = document.getElementById('interview-time').value;
                    const interviewType = document.querySelector('input[name="interview-type"]:checked').value;
                    const interviewLink = interviewType === 'online'
                        ? document.getElementById('google-meet-link').value
                        : document.getElementById('google-map-link').value;

                    if (interviewDate && interviewTime) {
                        update(ref(db, `applications/${applicationId}`), {
                            interviewDate: interviewDate,
                            interviewTime: interviewTime,
                            interviewType: interviewType,
                            interviewLink: interviewLink,
                            applicationStatus: 'Interview Scheduled'
                        }).then(() => {
                            alert('Interview details updated successfully.');
                            window.location.href = '/interviews.html';
                        }).catch((error) => {
                            console.error("Error updating interview details: ", error);
                        });
                    } else {
                        alert('Please select both date and time.');
                    }
                });
            } else {
                console.log("No data available for the application ID.");
            }
        }).catch((error) => {
            console.error("Error fetching applicant data: ", error);
        });
    } else {
        console.error("No application ID found in the URL.");
    }
});
