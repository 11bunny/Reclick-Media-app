// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
}

// ---------------------------------------------------------
// Contact / booking form submission
//
// >>> CHANGE THIS <<<
// Point API_BASE_URL at your deployed backend (see backend/server.js).
// Locally that's usually http://localhost:4000
// In production, put your real API domain here, e.g.
//   const API_BASE_URL = "https://api.reclickmedia.com";
// ---------------------------------------------------------
const API_BASE_URL = "https://reclick-media-app-backend.onrender.com";

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = "Sending...";
    status.className = "form-status";

    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      city: form.city.value,
      contentType: form.contentType.value,
      date: form.date.value,
      message: form.message.value,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      status.textContent = "Thanks! A coordinator will reach out shortly.";
      status.className = "form-status ok";
      form.reset();
    } catch (err) {
      status.textContent = "Something went wrong. Please try again or email hello@reclickmedia.com.";
      status.className = "form-status err";
    }
  });
}
