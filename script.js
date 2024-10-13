document.addEventListener('DOMContentLoaded', () => {
    // Handle Navigation and Tabs (Common to all pages)
    const whatIsThisTab = document.getElementById('what-is-this-tab');
    const contributorsTab = document.getElementById('contributors-tab');

    if (whatIsThisTab && contributorsTab) {
        // Switch between tabs if the elements exist on the current page
        whatIsThisTab.addEventListener('click', function() {
            setActiveTab('what-is-this-tab');
            document.getElementById('content').innerHTML = '<p>This section explains what AIT Wiki is all about.</p>';
        });

        contributorsTab.addEventListener('click', function() {
            setActiveTab('contributors-tab');
            document.getElementById('content').innerHTML = '<p>This section shows the list of contributors to AIT Wiki.</p>';
        });
    }

    // Function to set active tab
    function setActiveTab(tabId) {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    }

    // Handle Login Button (Only on pages where it exists, like index.html)
    const loginButton = document.querySelector('.sign-up-btn');
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // Signup Form Handling (Only on signup.html)
    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission behavior

            // Collect the form data
            const userData = {
                name: document.getElementById('name').value,
                regno: document.getElementById('regnp').value,
                branch: document.querySelector('select[name="dropdown_name"]').value,
                number: document.getElementById('number').value,
                email: document.getElementById('email').value,
                password: document.getElementById('description').value,
                rememberMe: document.getElementById('remember').checked
            };

            // Check if all required fields are filled
            if (!userData.name || !userData.regno || !userData.email || !userData.password) {
                alert('Please fill in all required fields.');
                return; // Stop the process if fields are missing
            }

            // Store the data in localStorage or sessionStorage as needed
            if (userData.rememberMe) {
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('loggedIn', 'true');
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
                sessionStorage.setItem('loggedIn', 'true');
            }

            alert('Registration successful! You will be redirected to the login page.');

            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Login Form Handling (Only on login.html)
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

                    // Check if "Remember Me" was selected
                    if (storedUserData.rememberMe) {
                        localStorage.setItem('loggedIn', 'true'); // Remember logged in state
                    } else {
                        sessionStorage.setItem('loggedIn', 'true'); // Session-based login
                    }

                    window.location.href = 'chat.html'; // Redirect to chat.html
                } else {
                    alert('Invalid email or password.');
                }
            } else {
                alert('No user data found. Please register first.');
            }
        });
    }

    // -------------------------------------------------------------------

    const submitButton = document.getElementById('submit-query');
    const chatbox = document.getElementById('chatbox');
    // const responseDiv = document.getElementById('response');
    const chatHistory = document.getElementById('chat-history');
    const newChatButton = document.getElementById('new-chat');

    // Function to load a JSON dataset (for clubs, timetable, holidays)
    async function loadDataset(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const data = await response.json();
            console.log(`Loaded ${filename}:`, data); // Debugging: log loaded data
            return data;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    function appendMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender); // 'message' class for common styling, 'user' or 'bot' class for distinction
        messageDiv.innerText = message;

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the latest message
    }



    // if (loginButton) {
    //     loginButton.addEventListener('click', () => {
    //         window.location.href = 'login.html';
    //     });
    // }


    if (newChatButton) {
    newChatButton.addEventListener('click', () => {
        chatHistory.innerHTML = ''; // Clear all chat history
    }); }
    // Function to find the matching club by name or alias
    function findClubByName(userQuery, clubs) {
        const queryLower = userQuery.toLowerCase(); // Normalize user query to lowercase

        // Iterate over each club in the clubs object
        for (const [clubName, clubData] of Object.entries(clubs)) {
            // Check if the main club name matches the query
            if (queryLower.includes(clubName.toLowerCase())) {
                return clubName;
            }

            // Check if any of the club's aliases match the query
            if (clubData.aliases) {
                for (const alias of clubData.aliases) {
                    if (queryLower.includes(alias.toLowerCase())) {
                        return clubName; // Return the main club name if an alias matches
                    }
                }
            }
        }

        return null; // No matching club found
    }

    // Get the current day, time, and date
    function getCurrentDateTime() {
        const now = new Date();
        const day = now.toLocaleString('en-US', { weekday: 'long' });
        const time = now.toTimeString().split(' ')[0].substring(0, 5); // Get time in HH:MM format
        const date = now.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        return { day, time, date };
    }

    // Check if today is a holiday (Saturday, Sunday, or national holiday)
    function isHoliday(holidays, date) {
        const { day } = getCurrentDateTime();
        return day === "Saturday" || day === "Sunday" || holidays.includes(date);
    }

    // Find the current class for the user based on timetable
    function getCurrentClass(timetable, branch, day, time, queryType) {
        const todayClasses = timetable[branch][day];
        if (!todayClasses || todayClasses.length === 0) {
            return "You have no classes today.";
        }

        switch (queryType) {
            case 'next':
                // Find the next class after the current time
                for (const cls of todayClasses) {
                    if (time < cls.startTime) {
                        return `Your next class is ${cls.subject} (${cls.startTime} - ${cls.endTime}).`;
                    }
                }
                return "You have no more classes today.";
                
            case 'first':
                // Find the first class of the day
                const firstClass = todayClasses[0];
                return `Your first class today was ${firstClass.subject} (${firstClass.startTime} - ${firstClass.endTime}).`;
                
            case 'last':
                // Find the last class of the day
                const lastClass = todayClasses[todayClasses.length - 1];
                return `Your last class today is ${lastClass.subject} (${lastClass.startTime} - ${lastClass.endTime}).`;
                
            case 'previous':
                // Find the previous class before the current time
                let previousClass = null;
                for (const cls of todayClasses) {
                    if (time > cls.endTime) {
                        previousClass = cls;
                    } else {
                        break;
                    }
                }
                return previousClass
                    ? `Your previous class was ${previousClass.subject} (${previousClass.startTime} - ${previousClass.endTime}).`
                    : "You haven't had any classes yet today.";
                
            default:
                return "Sorry, I don't understand your query.";
        }
    }

    // Handle user query submission
    if (submitButton){
    submitButton.addEventListener('click', async () => {
        console.log("Submit button clicked"); // Debugging: Check if event listener works

        const userQuery = chatbox.value.trim(); // Convert to lowercase for easier matching
        console.log("User Query:", userQuery); // Debugging: Log the user query
        if (!userQuery) return;
        
        appendMessage(userQuery, 'user'); // Display the user's message
        chatbox.value = '';

        const { day, time, date } = getCurrentDateTime();

        // Load external datasets
        const clubs = await loadDataset('clubs.json'); // Load clubs data
        const timetable = await loadDataset('timetable.json'); // Load timetable data
        const holidays = await loadDataset('holidays.json'); // Load holidays data

        // Check for errors in loading datasets
        if (!clubs || !timetable || !holidays) {
            appendMessage("Error loading required data. Please try again later.", 'AIT-wiki');
            return;
        }
        const lowerCaseQuery = userQuery.toLowerCase()

        // Club-related query handling
        const clubMatch = lowerCaseQuery.match(/who (is|are|who's) the (\w+) of (.+) club\?/i); // Updated regex to capture everything after "of"
        if (clubMatch) {
            const position = clubMatch[2].toLowerCase(); // Normalize position (e.g., secretary)
            const userClubQuery = clubMatch[3].toLowerCase().trim(); // Extract the part after "of"

            // Use the function to find the club name (main or alias)
            const matchedClub = findClubByName(userClubQuery, clubs);
            if (matchedClub && clubs[matchedClub][position]) {
                const people = clubs[matchedClub][position].join(', ');
                appendMessage(`The ${position} of ${matchedClub} is/are: ${people}.`, 'AIT-wiki');
            } else {
                appendMessage(`Sorry, I don't have information about the ${position} of ${userClubQuery}.`, 'AIT-wiki');
            }
            return;
        }

        // Check for current class query
        if (lowerCaseQuery.includes("current class") || lowerCaseQuery.includes("my current class")) {
            const userBranch = JSON.parse(localStorage.getItem('userData')).branch; // Get user's branch from stored data
            console.log("User Branch:", userBranch); // Debugging: Log the user's branch

            // Check if it's a holiday
            if (isHoliday(holidays.holidays, date)) {
                appendMessage("Today is a holiday. No classes.");
            } else {
                // Get the current class for the user's branch
                const currentClass = getCurrentClass(timetable, userBranch, day, time);
                appendMessage(currentClass);
            }
            return;
        }

        appendMessage("Sorry, I don't understand your query.");
    }); 
    }
    // -------------------------------------------
    const passwordField = document.getElementById('description');
    const rePasswordField = document.getElementById('re-password');
    const passwordMatchMessage = document.getElementById('password-match-message');
    const lengthCriteria = document.getElementById('length-criteria');
    const uppercaseCriteria = document.getElementById('uppercase-criteria');
    const lowercaseCriteria = document.getElementById('lowercase-criteria');
    const numberCriteria = document.getElementById('number-criteria');
    const specialCriteria = document.getElementById('special-criteria');
    const passwordCriteriaList = document.getElementById('password-criteria'); // Criteria container

    // Hide criteria on page load
    passwordCriteriaList.style.display = 'none';
    passwordMatchMessage.style.display = 'none';

    // Listen for input in the password field
    passwordField.addEventListener('input', () => {
        // Show the criteria list only when the user starts typing
        passwordCriteriaList.style.display = 'block';

        const password = passwordField.value;

        // Check length
        if (password.length >= 8) {
            lengthCriteria.style.display = 'none'; // Hide when satisfied
        } else {
            lengthCriteria.style.display = 'list-item'; // Show if unsatisfied
        }

        // Check for uppercase letter
        if (/[A-Z]/.test(password)) {
            uppercaseCriteria.style.display = 'none'; // Hide when satisfied
        } else {
            uppercaseCriteria.style.display = 'list-item'; // Show if unsatisfied
        }

        // Check for lowercase letter
        if (/[a-z]/.test(password)) {
            lowercaseCriteria.style.display = 'none'; // Hide when satisfied
        } else {
            lowercaseCriteria.style.display = 'list-item'; // Show if unsatisfied
        }

        // Check for number
        if (/[0-9]/.test(password)) {
            numberCriteria.style.display = 'none'; // Hide when satisfied
        } else {
            numberCriteria.style.display = 'list-item'; // Show if unsatisfied
        }

        // Check for special character
        if (/[@#$%^&*(),.?":{}|<>]/.test(password)) {
            specialCriteria.style.display = 'none'; // Hide when satisfied
        } else {
            specialCriteria.style.display = 'list-item'; // Show if unsatisfied
        }

        rePasswordField.addEventListener('input', () => {
            const password = passwordField.value;
            const rePassword = rePasswordField.value;
    
            // Show message if passwords don't match, hide if they do
            if (password !== rePassword) {
                passwordMatchMessage.style.display = 'block'; // Show message
            } else {
                passwordMatchMessage.style.display = 'none'; // Hide message
            }
        })
    })
});