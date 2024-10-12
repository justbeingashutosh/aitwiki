// Switch between tabs and change content accordingly
document.getElementById('what-is-this-tab').addEventListener('click', function() {
    setActiveTab('what-is-this-tab');
    document.getElementById('content').innerHTML = '<p>This section explains what AIT Wiki is all about.</p>';
});

document.getElementById('contributors-tab').addEventListener('click', function() {
    setActiveTab('contributors-tab');
    document.getElementById('content').innerHTML = '<p>This section shows the list of contributors to AIT Wiki.</p>';
});

function setActiveTab(tabId) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to the clicked tab
    document.getElementById(tabId).classList.add('active');
}
loginButton = document.querySelector('.sign-up-btn')
document.querySelector('.sign-up-btn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

  // sgnup functionality ------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Add form submit event listener
    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission behavior

            // Get form data
            const userData = {
                name: document.getElementById('name').value,
                regno: document.getElementById('regnp').value,
                branch: document.querySelector('select[name="dropdown_name"]').value,
                number: document.getElementById('number').value,
                email: document.getElementById('email').value,
                password: document.getElementById('description').value,
                rememberMe: document.getElementById('remember').checked
            };

            // Save user data in localStorage or sessionStorage
            if (userData.rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }

            alert('Registration successful! You will be redirected to the login page.');
            window.location.href = 'login.html'; // Redirect to login page
        });
    } else {
        console.error("Form with id 'regForm' not found.");
    }

    // Check if the user is already logged in (based on "Remember me")
    function checkIfLoggedIn() {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            alert(`Welcome back, ${user.name}! You are already logged in.`);
            
            // Replace the login button with user's profile picture
            const navBar = document.querySelector('.navbar');
            // const loginButton = document.querySelector('.login-btn');
            if (loginButton) {
                loginButton.remove(); // Remove the login button
            }
            // Create a new profile picture element in the nav bar
            const profilePic = document.createElement('img');
            profilePic.src = 'dp.png'; // Path to the user's profile picture
            profilePic.alt = 'Profile Picture';
            profilePic.classList.add('profile-pic'); // Add styling if necessary
            navBar.appendChild(profilePic); // Add the profile picture to the nav bar
        }
        window.location.href = 'chat.html';
    }

    // Call checkIfLoggedIn on page load to handle "Remember me"
    checkIfLoggedIn();
});

//-------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Add form submit event listener for login form
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the form from submitting

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Retrieve stored user data from localStorage
            const storedUserData = JSON.parse(localStorage.getItem('userData'));

            if (storedUserData) {
                // Check if the entered email and password match the stored data
                if (email === storedUserData.email && password === storedUserData.password) {
                    alert(`Welcome back, ${storedUserData.name}!`);
                    window.location.href = 'chat.html'; // Redirect to chat.html instead of index.html
                    checkIfLoggedIn();
                } else {
                    alert('Invalid email or password.');
                }
            } else {
                alert('No user data found. Please register first.');
            }
        });
    }});




// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
    
//     if (loginForm) {
//         loginForm.addEventListener('submit', function (e) {
//             e.preventDefault(); // Prevent the form from submitting

//             const email = document.getElementById('loginEmail').value;
//             const password = document.getElementById('loginPassword').value;

//             // Retrieve stored user data
//             const storedUserData = JSON.parse(localStorage.getItem('userData'));

//             if (storedUserData) {
//                 // Check if the entered email and password match the stored data
//                 if (email === storedUserData.email && password === storedUserData.password) {
//                     alert(`Welcome back, ${storedUserData.name}!`);
//                     window.location.href = 'index.html'; // Redirect to homepage
//                 } else {
//                     alert('Invalid email or password.');
//                 }
//             } else {
//                 alert('No user data found. Please register first.');
//             }
//         });
//     }

//     // Check if the user is already logged in and show their profile picture
//     function checkIfLoggedIn() {
//         const storedUserData = localStorage.getItem('userData');
//         if (storedUserData) {
//             const user = JSON.parse(storedUserData);
//             alert(`Welcome back, ${user.name}! You are already logged in.`);

//             // Replace the login button with user's profile picture
//             const navBar = document.querySelector('.navbar');
//             const loginButton = document.querySelector('.login-btn');
//             if (loginButton) {
//                 loginButton.remove(); // Remove the login button
//             }
//             const profilePic = document.createElement('img');
//             profilePic.src = 'dp.png'; // Path to the user's profile picture
//             profilePic.alt = 'Profile Picture';
//             profilePic.classList.add('profile-pic');
//             navBar.appendChild(profilePic); // Add the profile picture to the nav bar
//         }
//     }

//     checkIfLoggedIn();
// });


