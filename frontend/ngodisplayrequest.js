// This function will be called from ngo-dashboard.js and directly on ngo-requests.html
async function fetchRequests() {
    const ngoId = localStorage.getItem('ngoId');
    const recentRequestsList = document.getElementById('requests-list'); // For dashboard recent list
    const allRequestsList = document.getElementById('all-requests-list'); // For full list on the same page

    if (!ngoId) {
        showCustomMessage("NGO not logged in! Please log in to view requests.");
        // Clear any loading messages if not logged in
        if (recentRequestsList) recentRequestsList.innerHTML = "<p class='message'>Please log in to view recent requests.</p>";
        if (allRequestsList) allRequestsList.innerHTML = "<p class='message'>Please log in to view your requests.</p>";
        return;
    }

    // Set loading messages
    if (recentRequestsList) recentRequestsList.innerHTML = "<p class='message'>Loading recent requests...</p>";
    if (allRequestsList) allRequestsList.innerHTML = "<p class='message'>Loading all requests...</p>";

    try {
        let retries = 0;
        const maxRetries = 5;
        let delay = 1000;

        while (retries < maxRetries) {
            try {
                const apiKey = ""; // Canvas will automatically provide the API key
                const apiUrl = `http://localhost:5001/api/ngos/${ngoId}/requests`; // Assuming your backend endpoint

                const res = await fetch(apiUrl);
                const requests = await res.json();

                if (!Array.isArray(requests)) throw new Error("Invalid response format.");

                // Clear loading messages before rendering
                if (recentRequestsList) recentRequestsList.innerHTML = "";
                if (allRequestsList) allRequestsList.innerHTML = "";

                if (requests.length === 0) {
                    if (recentRequestsList) recentRequestsList.innerHTML = "<p class='message'>No recent requests found.</p>";
                    if (allRequestsList) allRequestsList.innerHTML = "<p class='message'>No requests found.</p>";
                } else {
                    // Display recent requests on the dashboard section
                    if (recentRequestsList) {
                        const recent = requests.slice(0, 3); // Show top 3 recent requests
                        recent.forEach(req => {
                            const div = document.createElement('div');
                            div.className = "request-card";
                            div.innerHTML = `
                                <p><span>Category:</span> ${req.itemType}</p>
                                <p><span>Item:</span> ${req.itemName || 'N/A'}</p>
                                <p><span>Quantity:</span> ${req.quantity}</p>
                                <p><span>Status:</span> <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span></p>
                            `;
                            recentRequestsList.appendChild(div);
                        });
                    }

                    // Display all requests on the dedicated "My Previous Requests" section
                    if (allRequestsList) {
                        requests.forEach(req => {
                            const div = document.createElement('div');
                            div.className = "request-card";
                            div.innerHTML = `
                                <p><span>Category:</span> ${req.itemType}</p>
                                <p><span>Item:</span> ${req.itemName || 'N/A'}</p>
                                <p><span>Quantity:</span> ${req.quantity}</p>
                                <p><span>Status:</span> <span class="status-badge status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span></p>
                                <p><span>Requested On:</span> ${new Date(req.timestamp).toLocaleDateString()}</p>
                            `;
                            allRequestsList.appendChild(div);
                        });
                    }
                }
                return; // Exit loop on success
            } catch (error) {
                retries++;
                if (retries < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    const errorMessage = "<p class='message'>Failed to load requests. Please try again later.</p>";
                    if (recentRequestsList) recentRequestsList.innerHTML = errorMessage;
                    if (allRequestsList) allRequestsList.innerHTML = errorMessage;
                    console.error("Error fetching requests:", error);
                }
            }
        }
    } catch (error) {
        console.error("An unexpected error occurred during request fetch setup:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch of requests when the page loads
    fetchRequests();

    // Set up user info and sidebar active state
    const ngoId = localStorage.getItem('ngoId');
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');

    if (ngoId) {
        userNameElement.textContent = "NGO Partner";
        userEmailElement.textContent = "partner@goodsforgood.org";
    } else {
        // If not logged in, show a message and redirect
        showCustomMessage("NGO not logged in!", () => {
            window.location.href = "login.html";
        });
        return;
    }

    // --- Sidebar Active Link Logic ---
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-item a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Remove 'active' from all links
            sidebarLinks.forEach(item => item.parentElement.classList.remove('active'));
            // Add 'active' to the clicked link's parent
            this.parentElement.classList.add('active');
        });
    });

    // Set initial active state based on URL hash
    const currentHash = window.location.hash || '#dashboard-overview';
    const activeLink = document.querySelector(`.sidebar-nav-item a[href="${currentHash}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
});