document.addEventListener('DOMContentLoaded', function() {
    // Select all sidebar navigation items and content sections
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    const contentSections = document.querySelectorAll('.admin-section');
    const dashboardSection = document.getElementById('dashboard');

    // Make sure the Dashboard is active by default
    if (dashboardSection) {
        dashboardSection.classList.add('active');
    }

    // Add a click event listener to each navigation item
    navItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Prevent the default anchor link behavior
            event.preventDefault();

            // Remove 'active' class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add 'active' class to the clicked nav item
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            dashboardSection.classList.remove('active');

            // Get the target section's ID from the href attribute
            const targetId = this.querySelector('a').getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Show the target section by adding the 'active' class
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Dummy data for demonstration
    const stats = {
        pending: 12,
        matched: 45,
        delivered: 8,
        activeUsers: 256
    };

    const pendingDonations = [
        { item: 'Clothes', category: 'Apparel', quantity: 50, donor: 'Jane Doe', location: 'Mumbai', date: '2023-10-25' },
        { item: 'Canned Food', category: 'Food', quantity: 150, donor: 'John Smith', location: 'Pune', date: '2023-10-24' },
        { item: 'Textbooks', category: 'Education', quantity: 20, donor: 'Ananya Sharma', location: 'Delhi', date: '2023-10-23' }
    ];

    const recentActivity = [
        { icon: '<i class="fas fa-check-circle"></i>', message: 'John Smith\'s food donation was approved.', time: '10 mins ago' },
        { icon: '<i class="fas fa-handshake"></i>', message: 'Clothes donation matched with "Hope Foundation".', time: '1 hour ago' },
        { icon: '<i class="fas fa-user-plus"></i>', message: 'New user registered: Priya Singh.', time: '3 hours ago' },
        { icon: '<i class="fas fa-truck"></i>', message: 'Pickup for books donation has been scheduled.', time: '1 day ago' }
    ];

    // Function to update the dashboard statistics
    function updateStats() {
        document.getElementById('pending-count').textContent = stats.pending;
        document.getElementById('matched-count').textContent = stats.matched;
        document.getElementById('delivered-count').textContent = stats.delivered;
        document.getElementById('active-users').textContent = stats.activeUsers;
    }

    // Function to populate the pending donations table
    function populatePendingTable() {
        const tableBody = document.getElementById('pending-donations-table').querySelector('tbody');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        pendingDonations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.item}</td>
                <td>${donation.category}</td>
                <td>${donation.quantity}</td>
                <td>${donation.donor}</td>
                <td>${donation.location}</td>
                <td>${donation.date}</td>
                <td>
                    <button class="action-btn approve-btn"><i class="fas fa-check"></i> Approve</button>
                    <button class="action-btn reject-btn"><i class="fas fa-times"></i> Reject</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to populate recent activity
    function populateRecentActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;
        activityList.innerHTML = '';
        recentActivity.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <p class="activity-text">${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            activityList.appendChild(item);
        });
    }

    // Initial calls to populate data
    updateStats();
    populatePendingTable();
    populateRecentActivity();

    // Logout functionality (optional)
    window.logout = function() {
        alert('You have been logged out!');
        // Redirect to a login page or perform other logout actions here.
    };
});