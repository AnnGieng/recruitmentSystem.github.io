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

const uid = localStorage.getItem('auth-token');

if (uid) {
    console.log(`Uid is ${uid}`);
} else {
    console.log(`Uid is null`);
}

const notificationsRef = ref(db, `notifications/${uid}`);
onValue(notificationsRef, (snapshot) => {
    const data = snapshot.val();
    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.innerHTML = '';

    if (!data) {
        console.log('No notifications found.');
        notificationsContainer.innerHTML = '<p>No notifications found, or kindly wait as we process your application.</p>';
        return;
    }

    Object.values(data).forEach(notification => {
        let notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        notificationElement.innerHTML = `<p>${notification.message}</p>${notification.link ? `<a href="${notification.link}">View Details</a>` : ''}`;
        notificationsContainer.appendChild(notificationElement);
    });
});
