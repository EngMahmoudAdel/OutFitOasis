document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    document
      .querySelectorAll(".error-msg")
      .forEach((span) => (span.textContent = ""));

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    let valid = true;

    // Name validation
    if (!name) {
      document.getElementById("error-name").textContent =
        "Please enter your name.";
      valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      document.getElementById("error-email").textContent =
        "Please enter your email.";
      valid = false;
    } else if (!emailPattern.test(email)) {
      document.getElementById("error-email").textContent =
        "Please enter a valid email address.";
      valid = false;
    }

    // Subject validation
    if (!subject) {
      document.getElementById("error-subject").textContent =
        "Please enter a subject.";
      valid = false;
    }

    // Message validation
    if (!message) {
      document.getElementById("error-message").textContent =
        "Please enter your message.";
      valid = false;
    }

    // If validation passes, show modal
    if (valid) {
      const messageModal = new bootstrap.Modal(
        document.getElementById("messageModal")
      );
      messageModal.show();
      form.reset();
    }
  });
});
