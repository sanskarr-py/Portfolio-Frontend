console.log("SCRIPT.JS IS LOADED");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM LOADED");

    const form = document.getElementById("contact-form");

    if (!form) {
        console.error("ERROR: #contact-form was not found.");
        return;
    }

    console.log("CONTACT FORM FOUND");

    emailjs.init({
        publicKey: "YnscrFGsyRxuA5cFX"
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("FORM SUBMITTED");

        const button = form.querySelector("button");
        button.disabled = true;
        button.innerHTML = "Sending...";

        emailjs.send(
            "service_7kjrl6g",
            "template_p4gc9n6",
            {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            }
        )
        .then(function (response) {
            console.log("EMAIL SENT:", response);

            // alert("Message sent successfully!");

            form.reset();
        })
        .catch(function (error) {
            console.error("EMAILJS ERROR:", error);

            alert("Failed to send message. Check the browser console.");
        })
        .finally(function () {
            button.disabled = false;
            button.innerHTML =
                'Send Message <i class="fa-solid fa-paper-plane"></i>';
        });
    });
});
