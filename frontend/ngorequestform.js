document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('requestForm');
    const itemTypeSelect = document.getElementById('itemType');
    const itemNameSelect = document.getElementById('itemName');
    const customNameDiv = document.getElementById('customItemNameContainer');
    const customNameInput = document.getElementById('customItemName');

    const itemNamesByType = {
        Clothes: ["Shirt", "Jacket", "Pants", "Blanket", "Others"],
        Plastic: ["Bottles", "Containers", "Bags", "Others"],
        Wood: ["Chair", "Table", "Shelf", "Others"],
        Electronics: ["Phone", "Laptop", "Charger", "Others"],
        Others: ["Others"] // Explicitly include "Others" for this category
    };

    // Populate item names on item type change
    itemTypeSelect.addEventListener('change', function () {
        const selectedType = this.value;
        itemNameSelect.innerHTML = '<option value="">Select Item</option>'; // Reset item name dropdown

        customNameDiv.style.display = 'none';
        customNameInput.required = false;
        customNameInput.value = '';

        if (itemNamesByType[selectedType]) {
            itemNamesByType[selectedType].forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                itemNameSelect.appendChild(option);
            });
        }
        // If "Others" is selected as item type, automatically select "Others" in item name
        if (selectedType === "Others") {
            itemNameSelect.value = "Others";
            customNameDiv.style.display = 'block';
            customNameInput.required = true;
        }
    });

    // Handle selection of "Others" from item name (for categories that have "Others" as an option)
    itemNameSelect.addEventListener('change', function () {
        if (this.value === "Others") {
            customNameDiv.style.display = 'block';
            customNameInput.required = true;
        } else {
            customNameDiv.style.display = 'none';
            customNameInput.required = false;
            customNameInput.value = '';
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ngoId = localStorage.getItem('ngoId'); // Assuming ngoId is stored in localStorage
        if (!ngoId) {
            showCustomMessage("NGO not logged in! Please log in to submit a request.");
            return;
        }

        const itemType = itemTypeSelect.value;
        let itemName = itemNameSelect.value;
        const quantity = parseInt(document.getElementById('quantity').value);

        if (!itemType || !itemName || !quantity) {
            showCustomMessage("Please fill out all required fields.");
            return;
        }

        // Handle custom item name if "Others" was selected for item type or item name
        if (itemName === "Others" || itemType === "Others") {
            itemName = customNameInput.value.trim();
            if (!itemName) {
                showCustomMessage("Please enter a custom item name for 'Others' category.");
                return;
            }
        }

        try {
            // Implement exponential backoff for API calls
            let retries = 0;
            const maxRetries = 5;
            let delay = 1000; // 1 second

            while (retries < maxRetries) {
                try {
                    const payload = { ngoId, itemType, itemName, quantity };
                    const apiKey = ""; // Canvas will automatically provide the API key
                    const apiUrl = `http://localhost:5001/api/ngos/request`; // Assuming your backend endpoint

                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json();
                    if (res.ok) {
                        showCustomMessage("Request submitted successfully.", () => {
                            form.reset();
                            itemNameSelect.innerHTML = '<option value="">Select Item</option>';
                            customNameDiv.style.display = 'none';
                            // Trigger a reload of requests in ngo-requests-display.js if it's loaded
                            if (typeof fetchRequests === 'function') {
                                fetchRequests(); // Call the function from ngo-requests-display.js
                            }
                        });
                        return; // Exit loop on success
                    } else {
                        showCustomMessage(data.message || data.error || "Request failed");
                        return; // Exit loop on specific error
                    }
                } catch (err) {
                    retries++;
                    if (retries < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                        delay *= 2; // Exponential backoff
                    } else {
                        showCustomMessage("Server error. Please try again later.");
                        console.error(err);
                    }
                }
            }
        } catch (err) {
            console.error("An unexpected error occurred during form submission setup:", err);
        }
    });
});
