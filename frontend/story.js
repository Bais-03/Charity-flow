document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('storyForm');
    const responseMessage = document.getElementById('responseMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the default form submission

        // You would typically collect form data here and send it to a server
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form data submitted:', data);

        // Hide the form and show the thank you message
        form.style.display = 'none';
        responseMessage.style.display = 'block';

        // Add a class to trigger the CSS transition
        setTimeout(() => {
            responseMessage.classList.add('show');
        }, 10);
    });
});