    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
    import { getDatabase,ref,set,child,get } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
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
    const signUpSubmit = document.getElementById('submitSignUp');
    const signInSubmit = document.getElementById('submitSignIn');
    const auth = getAuth();
    const db = getDatabase();


    // log in
    signInSubmit.addEventListener('click',(e)=>{

      console.log('Log in clicked');
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      signInWithEmailAndPassword(auth,email,password)
      .then((userCredential)=>{
        alert('Login successful')
        const user = userCredential.user;
        const userId = user.uid;
        console.log('UserId: ' + userId);
        const dbRef = ref(db, 'users/'+ userId);
        get(dbRef).then((snapshot)=>{
          if(snapshot.exists()){
            const data = snapshot.val();
            const role = data.role;
            console.log('Role ' + role);
            localStorage.setItem('auth-token', userId);
            if(role == 'Admin'){
              window.location.href = `adminDashboard.html?uid=${encodeURIComponent(userId)}`;
            }else{
              window.location.href = `dashboard.html?uid=${encodeURIComponent(userId)}`;
            }
          }else{
            console.log('Data not found')
          }
        })
        .catch((err)=>{
          console.log('Error Data not found')
        });
        
      })
      .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            alert('Incorrect Email or Password');
        }
        else{
            alert('Account does not Exist');
        }

        
      })

    })


    // create an account
    signUpSubmit.addEventListener('click',(e) =>{

      console.log('Sign up clicked');

      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const occupation = document.getElementById('occupation').value;
      const email = document.getElementById('rEmail').value;
      const password = document.getElementById('rPassword').value;
      const selectedOption = document.querySelector('input[name="radioGroup"]:checked').value;

      createUserWithEmailAndPassword(auth,email,password)
      .then( (userCredential) =>{
        alert('Account created successful')
        const user = userCredential.user;
        const userId = user.uid;

        const userInformation = {
          userId:userId,
          userName:name,
          occupation:occupation,
          role:selectedOption,
          email:email
        }
        set(ref(db,'users/'+ userId),userInformation)
        .then(()=>{
          localStorage.setItem('auth-token', userId);
          if(selectedOption == 'Admin'){
            window.location.href = `adminDashboard.html?uid=${encodeURIComponent(userId)}`;
          }else{
            window.location.href = `dashboard.html?uid=${encodeURIComponent(userId)}`;
          }
        })
        .catch((error)=>{
          alert('Could not save your information!!')
        });
      })
      .catch((e)=>{
        alert('Error occurred ' + e)
      })
    })

    
    
   
