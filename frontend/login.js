  // Tab switching functionality
        const tabs = document.querySelectorAll('.login-tab');
        const userForm = document.getElementById('userLoginForm');
        const ngoForm = document.getElementById('ngoLoginForm');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                if (tab.dataset.tab === 'user') {
                    userForm.style.display = 'block';
                    ngoForm.style.display = 'none';
                } else {
                    userForm.style.display = 'none';
                    ngoForm.style.display = 'block';
                }
            });
        });

        // Password toggle functionality
        const togglePassword = document.getElementById('togglePassword');
        const password = document.getElementById('userPassword');
        
        const toggleNgoPassword = document.getElementById('toggleNgoPassword');
        const ngoPassword = document.getElementById('ngoPassword');
        
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        }
        
        if (toggleNgoPassword) {
            toggleNgoPassword.addEventListener('click', function() {
                const type = ngoPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                ngoPassword.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        }

        // Forgot Password Modal functionality
        const modal = document.getElementById('forgotPasswordModal');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const forgotNgoPasswordLink = document.getElementById('forgotNgoPasswordLink');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.querySelector('.btn-cancel');

        // Open modal when Forgot Password link is clicked
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'block';
            });
        }

        if (forgotNgoPasswordLink) {
            forgotNgoPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                modal.style.display = 'block';
            });
        }

        // Close modal when X is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        // Close modal when Cancel button is clicked
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside the modal content
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

// User Login
const userLoginForm = document.getElementById('userLoginForm');
if (userLoginForm) {
    userLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('userEmail').value.trim();
        const password = document.getElementById('userPassword').value;
        try {
            const res = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log("Login Response:", data); // 🐞 Add this line to inspect response

            // User Login
            if (res.ok) {
                // userLoginForm.reset(); // Reset the form fields
                // alert('User login successful!');
                // Optionally redirect or update UI here
             localStorage.setItem('userId', data.userId); // ✅ STORE the userId here!
             window.location.href = "userdashboard.html";
            } else {
    alert(data.message || 'User login failed');
}
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });
}

// NGO Login
const ngoLoginForm = document.getElementById('ngoLoginForm');
if (ngoLoginForm) {
    ngoLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('ngoEmail').value.trim();
        const password = document.getElementById('ngoPassword').value;
        try {
            const res = await fetch('http://localhost:5001/api/ngos/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // alert('NGO login successful!');
                // Optionally redirect or update UI here
                localStorage.setItem('ngoId', data.ngoId); // ✅ Store if needed for NGO
                window.location.href = "ngodashboard.html";
            } else {
                alert(data.message || 'NGO login failed');
            }
        } catch (error) {
            alert('Server error. Try again later.');
        }
    });
}