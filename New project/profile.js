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

initializeApp(firebaseConfig);
const db = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    const uid = localStorage.getItem('auth-token');

    if (uid) {
        const applicationsRef = ref(db, 'applications');
        onValue(applicationsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                console.log('No applications found.');
                return;
            }

            let profileData = null;
            for (let key in data) {
                if (data[key].userId === uid) {
                    profileData = data[key];
                    break;
                }
            }

            if (profileData) {
                const profileFields = [
                    { id: 'profile-name', value: profileData.userName },
                    { id: 'profile-age', value: profileData.age },
                    { id: 'profile-address', value: profileData.address },
                    { id: 'profile-phone', value: profileData.phone },
                    { id: 'profile-gender', value: profileData.gender },
                    { id: 'profile-email', value: profileData.email },
                    { id: 'profile-grad-degree', value: profileData.gradDegree },
                    { id: 'profile-grad-percentage', value: profileData.gradPercentage },
                    { id: 'profile-grad-diploma', value: profileData.gradDiploma },
                    { id: 'profile-college-percentage', value: profileData.collegePercentage },
                    { id: 'profile-designation', value: profileData.designation },
                    { id: 'profile-total-years-of-experience', value: profileData.totalYears },
                    { id: 'profile-skills', value: profileData.description },
                    { id: 'profile-cv', value: 'Uploaded' }
                ];

                profileFields.forEach(field => {
                    const element = document.getElementById(field.id);
                    if (element) {
                        element.textContent = field.value || 'N/A';
                    } else {
                        console.error(`Element with ID ${field.id} not found.`);
                    }
                });

                // Edit button event listener
                const editButton = document.getElementById('edit-button');
                if (editButton) {
                    editButton.addEventListener('click', () => {
                        window.location.href = `apply.html?edit=true&jobTitle=${encodeURIComponent(profileData.roleName)}&id=${profileData.roleId}`;
                    });
                } else {
                    console.error('Edit button not found.');
                }
            } else {
                console.log('No profile data found for this user.');
            }
        }, {
            onlyOnce: true
        });
    } else {
        console.log('User ID not found in localStorage.');
    }
});
