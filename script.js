document.getElementById("year").textContent = new Date().getFullYear();
const nav = document.getElementById("nav");
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 400);
});

/* Menu mobile */
const navToggle = document.getElementById("navToggle");
const navLinksWrap = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    const isOpen = navLinksWrap.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navLinksWrap.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});


const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const spyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => spyObserver.observe(section));


const form = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccess");

function setError(fieldId, errorId, message) {
    document.getElementById(fieldId).classList.toggle("invalid", Boolean(message));
    document.getElementById(errorId).textContent = message || "";
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (!nom) {
        setError("nom", "nomError", "Merci d'indiquer votre nom.");
        isValid = false;
    } else {
        setError("nom", "nomError", "");
    }

    if (!email) {
        setError("email", "emailError", "Merci d'indiquer votre email.");
        isValid = false;
    } else if (!emailPattern.test(email)) {
        setError("email", "emailError", "Cet email ne semble pas valide.");
        isValid = false;
    } else {
        setError("email", "emailError", "");
    }

    if (!message) {
        setError("message", "messageError", "Merci d'écrire un message.");
        isValid = false;
    } else {
        setError("message", "messageError", "");
    }

    if (!isValid) return;

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";

    
    const EMAILJS_PUBLIC_KEY = "7VkmtrkpdnxurTR3S";
    const EMAILJS_SERVICE_ID = "service_u0tg8f9";
    const EMAILJS_TEMPLATE_ID = "template_htwr10h";

    emailjs
        .send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            { name: nom, email, message, title: "Nouveau message depuis ton portfolio" },
            EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            successMessage.hidden = false;
            successMessage.classList.remove("form-error");
            successMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> Merci, votre message a bien été envoyé.`;
            form.reset();
        })
        .catch(() => {
            successMessage.hidden = false;
            successMessage.classList.add("form-error");
            successMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> L'envoi a échoué. Réessaie plus tard.`;
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = "Envoyer";
        });
});
