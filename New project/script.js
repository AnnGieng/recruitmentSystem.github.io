document.addEventListener('DOMContentLoaded', (event) => {
    const occupationInput = document.getElementById('occupation');
    const radioButtons = document.querySelectorAll('input[name="radioGroup"]');
    
    radioButtons.forEach(radio => {
      radio.addEventListener('change', () => {
        if (document.getElementById('option2').checked) {
          occupationInput.style.display = 'none';
        } else {
          occupationInput.style.display = 'block';
        }
      });
    });

    // Initialize the occupation field visibility
    if (document.getElementById('option2').checked) {
      occupationInput.style.display = 'none';
    }
  });

  function handleSignUp() {
    // const name = document.getElementById('name').value;
    // const occupation = document.getElementById('occupation').value;
    // const email = document.getElementById('rEmail').value;
    // const password = document.getElementById('rPassword').value;
    // const selectedOption = document.querySelector('input[name="radioGroup"]:checked').value;

    const signInForm = document.getElementById('signinForm');
    const signUpForm = document.getElementById('signupForm');

    signInForm.style.display = 'none';
    signUpForm.style.display = 'flex';

    // console.log('Sign Up:', { name, occupation, email, password, selectedOption });

  }

  function handleLogin() {
    const signInForm = document.getElementById('signinForm');
    const signUpForm = document.getElementById('signupForm');

    signInForm.style.display = 'flex';
    signUpForm.style.display = 'none';
  }
  const menuToggle = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu-visible');
});

// Optional: Close the menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu-visible');
    });
});
document.getElementById('application-form').addEventListener('submit', function(event) {
  event.preventDefault();
  alert('Application submitted!');
});


