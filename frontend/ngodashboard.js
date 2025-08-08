// Function to show a custom message box instead of alert()
function showCustomMessage(message, callback) {
    const messageBox = document.getElementById('custom-message-box');
    const messageText = document.getElementById('custom-message-text');
    const closeButton = messageBox.querySelector('.close-button');
    const okButton = messageBox.querySelector('.custom-message-ok-btn');

    messageText.textContent = message;
    messageBox.style.display = 'flex'; // Use flex to center it

    const closeHandler = () => {
        messageBox.style.display = 'none';
        closeButton.removeEventListener('click', closeHandler);
        okButton.removeEventListener('click', closeHandler);
        if (callback) callback();
    };

    closeButton.addEventListener('click', closeHandler);
    okButton.addEventListener('click', closeHandler);
}

// Logout function
function logout() {
    localStorage.removeItem('ngoId');
    showCustomMessage("You have been logged out.", () => {
        window.location.href = "login.html";
    });
}
