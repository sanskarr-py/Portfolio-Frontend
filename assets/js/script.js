// Initialize EmailJS
emailjs.init("YnscrFGsyRxuA5cFX");

document.getElementById("contact-form").addEventListener("submit", function (event) {
  event.preventDefault();

  emailjs.sendForm(
    "service_7kjrl6g",
    "template_p4gc9n6",
    this
  )
  .then(() => {
    alert("Thanks for contacting us! We’ll get back to you soon.");
    this.reset();
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    alert("Sorry, your message could not be sent. Please try again.");
  });
});

