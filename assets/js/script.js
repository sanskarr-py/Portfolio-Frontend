emailjs.init({
    publicKey: "YnscrFGsyRxuA5cFX"
});

const form = document.getElementById("contact-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const button = form.querySelector("button");
    button.disabled = true;
    button.innerHTML = "Sending...";

    emailjs.sendForm(
        "service_7kjrl6g",
        "template_p4gc9n6",
        form
    )
    .then(function () {
        alert("Thanks for contacting us! We’ll get back to you soon.");
        form.reset();
    })
    .catch(function (error) {
        console.error("EmailJS Error:", error);
        alert("Failed to send message. Please try again.");
    })
    .finally(function () {
        button.disabled = false;
        button.innerHTML =
            'Send Message <i class="fa-solid fa-paper-plane"></i>';
    });
});