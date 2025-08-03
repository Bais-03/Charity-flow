const fileInput = document.getElementById("itemPhoto");
const preview = document.getElementById("preview");
const form = document.getElementById("donationForm");
const msg = document.getElementById("msg");

// Show image preview when user selects a photo
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }
});

// Handle donation form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const res = await fetch("http://localhost:5001/api/donations", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      msg.textContent = "🎉 Donation submitted successfully!";
      msg.style.color = "green";
      form.reset();
      preview.style.display = "none";
    } else {
      msg.textContent = "❌ " + (data.message || "Something went wrong.");
      msg.style.color = "red";
    }
  } catch (err) {
    msg.textContent = "🚨 Server error. Please try again later.";
    msg.style.color = "red";
  }
});
