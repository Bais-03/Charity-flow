document.addEventListener('DOMContentLoaded', () => {
    // === Show logged-in user info ===
    const userName = localStorage.getItem('userName') || 'Guest';
    const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
    const nameEl = document.querySelector(".user-name");
    const emailEl = document.querySelector(".user-email");
    if (nameEl) nameEl.textContent = userName;
    if (emailEl) emailEl.textContent = userEmail;

    const greetingEl = document.querySelector("#dashboard .dashboard-title");
    if (greetingEl) greetingEl.textContent = `Hello there, ${userName}!`;

    // === Fetch and Render Donations ===
    async function fetchAndRenderDonations() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please login to view your donations");
            window.location.href = "login.html";
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/api/donations/user/${userId}`);
            const donations = await res.json();

            if (!res.ok) throw new Error("Failed to load your donations");

            donations.forEach(d => {
                if (d.photo) {
                    d.photoUrl = `http://localhost:5001/${d.photo}`;
                }
            });

            renderDonations(donations);
        } catch (err) {
            alert("Error loading donations: " + err.message);
        }
    }

    function renderDonations(donations) {
        const donationsList = document.getElementById('donations-list');
        donationsList.innerHTML = '';

        donations.forEach(donation => {
            let statusBadgeClass = '';
            let statusIcon = '';
            switch (donation.status) {
                case 'Pending':
                    statusBadgeClass = 'status-pending';
                    statusIcon = 'fas fa-clock';
                    break;
                case 'Picked Up':
                    statusBadgeClass = 'status-picked-up';
                    statusIcon = 'fas fa-check-circle';
                    break;
                case 'Cancelled':
                    statusBadgeClass = 'status-cancelled';
                    statusIcon = 'fas fa-times-circle';
                    break;
            }

            const card = document.createElement('div');
            card.classList.add('donation-card');
            card.innerHTML = `
                <img src="${donation.photoUrl}" alt="Photo of ${donation.itemName}" class="donation-card-image">
                <div class="donation-card-content">
                    <h3 class="donation-card-title">${donation.itemName}</h3>
                    <div class="donation-card-meta">
                        <i class="fas fa-tag"></i><span>${donation.itemType}</span>
                    </div>
                    <div class="donation-card-meta">
                        <i class="fas fa-cubes"></i><span>Quantity: ${donation.quantity}</span>
                    </div>
                    <div class="donation-card-meta">
                        <i class="fas fa-map-marker-alt"></i><span>${donation.pickupLocation}</span>
                    </div>
                    <div class="donation-card-status">
                        <span class="status-badge ${statusBadgeClass}">
                            <i class="${statusIcon}"></i> ${donation.status}
                        </span>
                    </div>
                </div>
            `;
            donationsList.appendChild(card);
        });
    }

    fetchAndRenderDonations();

    // === Image Preview and Donation Submission ===
    const form = document.getElementById('donationForm');
    const fileInput = document.getElementById('photo');
    const filePreview = document.getElementById('filePreview');

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                filePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("Please login to make a donation");
            window.location.href = "login.html";
            return;
        }

        const formData = new FormData(form);
        formData.append('userId', userId);

        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            const res = await fetch('http://localhost:5001/api/donations', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.background = 'linear-gradient(90deg, var(--success), #81C784)';

                setTimeout(() => {
                    alert("Donation submitted successfully!");
                    form.reset();
                    filePreview.style.display = 'none';
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Donation';
                    submitBtn.style.background = 'linear-gradient(90deg, var(--primary), var(--accent))';
                    submitBtn.disabled = false;

                    fetchAndRenderDonations();
                }, 1000);
            } else {
                throw new Error(data.message || "Failed to submit donation");
            }
        } catch (err) {
            alert("Error: " + err.message);
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Donation';
        }
    });

    // === Logout Function ===
    function logout() {
        localStorage.clear();
        window.location.href = "login.html";
    }

    // Optional: expose logout for button click
    window.logout = logout;
});
