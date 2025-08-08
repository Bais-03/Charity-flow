// sign.js
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('http://localhost:5001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      document.getElementById('msg').style.color = 'green';
      document.getElementById('msg').innerText = 'Registration successful!';
      setTimeout(() => {
      window.location.href = "login.html";
      }, 1500); // Redirect after 1.5 seconds
  // this.reset(); // Optional: remove or keep if you want to clear the form before redirect
    } else {
      document.getElementById('msg').innerText = data.message || 'Error occurred';
    }
  } catch (error) {
    document.getElementById('msg').innerText = 'Server error. Try again later.';
  }
});