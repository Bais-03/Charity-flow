const form = document.getElementById('adminLoginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('adminToken', data.token);
      window.location.href = '../admindashboard.html'; // Redirect to admin page
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
});
