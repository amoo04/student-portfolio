(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successPanel = document.getElementById("formSuccess");
  const successName = document.getElementById("successName");
  const mailLink = document.getElementById("mailLink");
  const resetButton = document.getElementById("sendAnother");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  const CONTACT_EMAIL = "isegunamoo@gmail.com";
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const DIGITS_ONLY = /^\d+$/;

  // One validation function per field
  const validators = {
    name(value) {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Your name should be at least 2 characters.";
      return "";
    },
    email(value) {
      if (!value) return "Please enter your email address.";
      if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address, e.g. name@example.com.";
      return "";
    },
    phone(value) {
      if (!value) return "Please enter your phone number.";
      if (!DIGITS_ONLY.test(value)) return "Phone number must contain digits only (0–9), with no spaces, letters or symbols.";
      if (value.length < 7 || value.length > 15) return "Phone number should be between 7 and 15 digits.";
      return "";
    },
    message(value) {
      if (!value) return "Please enter a message.";
      if (value.length < 10) return "Your message should be at least 10 characters.";
      return "";
    }
  };

  const fieldNames = Object.keys(validators);
  let submitted = false;

  function validateField(name) {
    const input = form.elements[name];
    const field = input.closest(".field");
    const errorEl = document.getElementById(`${name}Error`);
    const error = validators[name](input.value.trim());

    errorEl.textContent = error;
    field.classList.toggle("has-error", Boolean(error));
    field.classList.toggle("is-valid", !error);
    if (error) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");

    return !error;
  }

  // Live feedback: validate on blur, and while typing after the first submit attempt
  fieldNames.forEach((name) => {
    const input = form.elements[name];
    input.addEventListener("blur", () => {
      if (input.value.trim() || submitted) validateField(name);
    });
    input.addEventListener("input", () => {
      if (submitted || input.closest(".field").classList.contains("has-error")) {
        validateField(name);
      }
    });
  });

  // Character counter for the message
  function updateCount() {
    const length = messageInput.value.length;
    charCount.textContent = `${length} / ${messageInput.maxLength}`;
  }
  messageInput.addEventListener("input", updateCount);
  updateCount();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;

    const results = fieldNames.map(validateField);
    const firstInvalid = fieldNames.find((name, i) => !results[i]);

    if (firstInvalid) {
      form.elements[firstInvalid].focus();
      form.classList.remove("shake");
      void form.offsetWidth; // restart the animation
      form.classList.add("shake");
      return;
    }

    // All fields valid: build a ready-to-send email and show a success message
    const data = {};
    fieldNames.forEach((name) => (data[name] = form.elements[name].value.trim()));

    const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.message}`
    );
    mailLink.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    successName.textContent = data.name.split(" ")[0];

    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    submitted = false;
    fieldNames.forEach((name) => {
      const field = form.elements[name].closest(".field");
      field.classList.remove("has-error", "is-valid");
      document.getElementById(`${name}Error`).textContent = "";
    });
    updateCount();
    successPanel.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
})();
