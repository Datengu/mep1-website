// js/script.js

(function () {
    "use strict";

    window.addEventListener("DOMContentLoaded", function () {
        // Replace feather icons
        if (window.feather && typeof window.feather.replace === "function") {
            window.feather.replace();
        }

        // Hero fade-in animation
        var hero = document.getElementById("hero-content");
        if (hero) {
            requestAnimationFrame(function () {
                hero.classList.remove("opacity-0", "translate-y-4");
                hero.classList.add("opacity-100", "translate-y-0");
            });
        }

        // Mobile nav toggle
        var navToggle = document.getElementById("nav-toggle");
        var mobileMenu = document.getElementById("mobile-menu");
        var labelOpen = document.getElementById("nav-toggle-open");
        var labelClose = document.getElementById("nav-toggle-close");

        function closeMobileMenu() {
            if (!mobileMenu) return;

            mobileMenu.classList.add("hidden");
            if (navToggle) navToggle.setAttribute("aria-expanded", "false");
            if (labelOpen) labelOpen.classList.remove("hidden");
            if (labelClose) labelClose.classList.add("hidden");
        }

        function toggleMobileMenu() {
            if (!mobileMenu) return;

            var isHidden = mobileMenu.classList.contains("hidden");
            if (isHidden) {
                mobileMenu.classList.remove("hidden");
                if (navToggle) navToggle.setAttribute("aria-expanded", "true");
                if (labelOpen) labelOpen.classList.add("hidden");
                if (labelClose) labelClose.classList.remove("hidden");
            } else {
                closeMobileMenu();
            }
        }

        if (navToggle && mobileMenu) {
            navToggle.addEventListener("click", toggleMobileMenu);

            // Close menu when a link is tapped
            mobileMenu.querySelectorAll("a[href^='#']").forEach(function (a) {
                a.addEventListener("click", closeMobileMenu);
            });

            // Close menu if resized up to desktop
            window.addEventListener("resize", function () {
                if (window.innerWidth >= 768) {
                    closeMobileMenu();
                }
            });
        }

        // Contact form (AJAX, no redirect)
        var contactForm = document.getElementById("contact-form");
        var contactStatus = document.getElementById("contact-status");

        function setContactStatus(message, isSuccess) {
            if (!contactStatus) return;
            contactStatus.textContent = message;
            contactStatus.classList.remove("hidden");
            contactStatus.classList.toggle("text-green-700", !!isSuccess);
            contactStatus.classList.toggle("text-red-700", !isSuccess);
        }

        if (contactForm && contactForm.getAttribute("data-ajax") === "true") {
            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();

                setContactStatus("Sending...", true);

                var action = contactForm.getAttribute("action");
                var fd = new FormData(contactForm);

                // IMPORTANT: build plain object and JSON-encode it
                var data = {};
                fd.forEach(function (value, key) {
                    // ignore unchecked honeypot checkbox if present
                    if (key === "_gotcha") return;
                    data[key] = value;
                });

                fetch(action, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(function (response) {
                    if (!response.ok) throw new Error("Non-OK response: " + response.status);
                    return response.json().catch(function () { return {}; });
                })
                .then(function () {
                    contactForm.reset();
                    setContactStatus("Thanks! Message sent. We will get back to you shortly.", true);
                })
                .catch(function (err) {
                    console.error("Formspark submit failed:", err);
                    setContactStatus("Sorry — something went wrong. Please try again.", false);
                });
            });
        }


    });
})();