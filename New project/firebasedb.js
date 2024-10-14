import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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




const app = initializeApp(firebaseConfig);
const submit = document.getElementById('submit');
const db = getDatabase();


submit.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Submit clicked');

    const jobTitle = document.getElementById('jobTitle').value;
    const experienceLevel = document.getElementById('experienceLevel').value;
    const mandatorySkill = document.getElementById('mandatoryskill').value;
    const jobId = generateRandomString();

    const jobInformation = {
        jobTitle: jobTitle,
        experienceLevel: experienceLevel,
        mandatorySkill:mandatorySkill,
        id: jobId
    }
    set(ref(db, 'jobs/' + jobId), jobInformation)
        .then(() => {
            alert('Job posted successful !!')
        })
        .catch((error) => {
            alert('Could not save the job!!')
        });
})


function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
