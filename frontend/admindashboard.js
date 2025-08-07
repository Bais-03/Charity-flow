document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-item a');
    const sections = document.querySelectorAll('.dashboard-main section');

    // Find the initial active link and display its corresponding section
    const initialActiveLink = document.querySelector('.sidebar-nav-item.active a');
    if (initialActiveLink) {
        const targetId = initialActiveLink.getAttribute('href');
        document.querySelector(targetId).style.display = 'block';
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and add to the clicked one
            sidebarLinks.forEach(item => item.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');

            // Get the target section's ID from the href
            const targetId = link.getAttribute('href');

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Show the target section
            document.querySelector(targetId).style.display = 'block';
        });
    });

    // Handle card clicks
    const cardLinks = document.querySelectorAll('.card a');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');

            // Find the corresponding sidebar link and simulate a click
            const sidebarLink = document.querySelector(`.sidebar-nav-item a[href="${targetId}"]`);
            if (sidebarLink) {
                sidebarLink.click();
            }
        });
    });
});
