document.addEventListener('DOMContentLoaded', () => {
    // This line is commented out to prevent the automatic redirect
    // checkAdminAuth();

    // Set up navigation
    setupAdminNavigation();

    // Initialize sections (loads dashboard data by default)
    initAdminSections();

    // Attach event listener for the logout button
    document.querySelector('.logout-btn').addEventListener('click', logout);
});

// Helper function to show a temporary alert message
function showAlert(type, message) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `admin-alert admin-alert-${type}`;
    alertContainer.innerHTML = `
        <span class="alert-message">${message}</span>
        <button class="close-alert">&times;</button>
    `;
    document.body.appendChild(alertContainer);

    // Fade out and remove the alert after 5 seconds
    setTimeout(() => {
        alertContainer.classList.add('fade-out');
        setTimeout(() => alertContainer.remove(), 500);
    }, 5000);

    alertContainer.querySelector('.close-alert').addEventListener('click', () => {
        alertContainer.remove();
    });
}

// Helper function to get the authentication token
function getToken() {
    return localStorage.getItem('adminToken');
}

// Authentication check: Redirects to login if no token is found
function checkAdminAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'adminlogin.html';
    }
}

// Logout function: Clears the token and redirects to the login page
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'adminlogin.html';
}

// Load dashboard summary data from the API
async function loadDashboardData() {
    try {
        const response = await fetch('http://localhost:5001/api/admin/dashboard', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (!response.ok) {
            // If the server returns a 401 Unauthorized, the token is invalid
            if (response.status === 401) {
                showAlert('error', 'Session expired. Please log in again.');
                logout();
            }
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update stats
        document.getElementById('pending-count').textContent = data.pendingDonations || 0;
        document.getElementById('matched-count').textContent = data.matchedDonations || 0;
        document.getElementById('delivered-count').textContent = data.deliveredToday || 0;
        document.getElementById('active-users').textContent = data.activeUsers || 0;
        
        // Update recent activity
        const activityList = document.getElementById('activity-list');
        if (activityList) {
            activityList.innerHTML = data.recentActivity.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.description}</p>
                        <div class="activity-time">${new Date(activity.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('error', 'Failed to load dashboard data. Check the server connection.');
    }
}

// Get appropriate icon for activity type
function getActivityIcon(type) {
    const icons = {
        'donation': 'fa-gift',
        'user': 'fa-user',
        'ngo': 'fa-hands-helping',
        'system': 'fa-cog',
        'delivery': 'fa-truck'
    };
    return icons[type] || 'fa-info-circle';
}

// Set up admin navigation: Handles switching between sections
function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    const sections = document.querySelectorAll('.admin-section, .dashboard-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.querySelector('a').getAttribute('href').substring(1);
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';

            // Load data for the newly active section
            loadSectionData(targetId);
        });
    });
}

// Initialize admin sections
function initAdminSections() {
    // Hide all sections initially, then show the dashboard
    document.querySelectorAll('.admin-section, .dashboard-content').forEach(section => {
        section.style.display = 'none';
    });
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
    }
    document.querySelector('.sidebar-nav-item.active')?.classList.remove('active');
    document.querySelector('a[href="#dashboard"]').parentElement.classList.add('active');

    // Load initial data
    loadDashboardData();
    
    // Set up event listeners for action buttons
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.approve-btn')) {
            const donationId = e.target.closest('.approve-btn').dataset.id;
            await handleDonationAction(donationId, 'approve');
        } else if (e.target.closest('.reject-btn')) {
            const donationId = e.target.closest('.reject-btn').dataset.id;
            await handleDonationAction(donationId, 'reject');
        } else if (e.target.closest('.match-btn')) {
            const donationId = e.target.closest('.match-btn').dataset.id;
            await handleDonationMatch(donationId);
        } else if (e.target.closest('#apply-filters')) {
            e.preventDefault();
            const filters = {
                status: document.getElementById('status-filter').value,
                dateFrom: document.getElementById('date-from').value,
                dateTo: document.getElementById('date-to').value
            };
            await loadTrackingData(filters);
        }
    });
}

// Load data for the current section
async function loadSectionData(section = 'dashboard') {
    switch (section) {
        case 'pending':
            await loadPendingDonations();
            break;
        case 'matching':
            await loadMatchingData();
            break;
        case 'tracking':
            await loadTrackingData();
            break;
        case 'dashboard':
        default:
            await loadDashboardData();
            break;
    }
}

// Load pending donations
async function loadPendingDonations() {
    try {
        const response = await fetch('http://localhost:5001/api/admin/pending-donations', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load pending donations');
        }
        
        const data = await response.json();
        const tableBody = document.querySelector('#pending-donations-table tbody');
        tableBody.innerHTML = data.map(donation => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${donation.photoUrl || 'placeholder.jpg'}" alt="${donation.itemName}" class="item-thumbnail">
                        <span>${donation.itemName}</span>
                    </div>
                </td>
                <td>${donation.itemType || 'N/A'}</td>
                <td>${donation.quantity || 1}</td>
                <td>${donation.donorName || 'Unknown Donor'}</td>
                <td>${donation.pickupLocation || 'N/A'}</td>
                <td>${new Date(donation.date).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn approve-btn" data-id="${donation.id}">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn reject-btn" data-id="${donation.id}">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading pending donations:', error);
        showAlert('error', 'Failed to load pending donations.');
    }
}

// Handle donation approval/rejection
async function handleDonationAction(donationId, action) {
    try {
        const response = await fetch(`http://localhost:5001/api/admin/donations/${donationId}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to ${action} donation`);
        }
        
        showAlert('success', `Donation ${action}ed successfully.`);
        await loadPendingDonations(); // Refresh the table
        await loadDashboardData(); // Refresh stats
    } catch (error) {
        console.error(`Error ${action}ing donation:`, error);
        showAlert('error', `Failed to ${action} donation.`);
    }
}

// Load data for the matching section
async function loadMatchingData() {
    // This is a placeholder as the HTML for this section is more of a visual representation
    // You'd typically need to fetch data for both available donations and NGO requests
    const donationsList = document.getElementById('available-donations');
    const ngoList = document.getElementById('ngo-requests');
    if (donationsList) {
        donationsList.innerHTML = `<div class="info-message">Matching functionality requires a backend API to provide data for donations and NGO requests.</div>`;
    }
    if (ngoList) {
        ngoList.innerHTML = `<div class="info-message">Matching functionality requires a backend API to provide data for donations and NGO requests.</div>`;
    }
    showAlert('info', 'Matching data is a placeholder. You need to connect it to your backend API.');
}

// Load tracking data with optional filters
async function loadTrackingData(filters = {}) {
    try {
        let url = 'http://localhost:5001/api/admin/tracking';
        const params = new URLSearchParams(filters);
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load tracking data');
        }
        
        const data = await response.json();
        const tableBody = document.querySelector('#tracking-table tbody');
        tableBody.innerHTML = data.map(item => `
            <tr>
                <td>${item.donationName || 'N/A'}</td>
                <td>${item.ngoName || 'N/A'}</td>
                <td>${new Date(item.pickupDate).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${getStatusClass(item.status)}">
                        ${item.status}
                    </span>
                </td>
                <td>${item.driver || 'Not assigned'}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Update
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading tracking data:', error);
        showAlert('error', 'Failed to load tracking data.');
    }
}

// Get CSS class for status badge
function getStatusClass(status) {
    const statusClasses = {
        'scheduled': 'status-pending',
        'in-transit': 'status-pending',
        'delivered': 'status-picked-up',
        'cancelled': 'status-cancelled'
    };
    // Use .toLowerCase() for consistency
    return statusClasses[status.toLowerCase()] || '';
}

// Styles for alert messages (add this to your CSS file)
/*
.admin-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.5s ease;
}
.admin-alert.fade-out {
    opacity: 0;
    transform: translateY(-20px);
}
.admin-alert-success { background-color: var(--success); }
.admin-alert-error { background-color: var(--secondary); }
.admin-alert-info { background-color: var(--primary); }
.admin-alert .close-alert {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    line-height: 1;
}
*/
