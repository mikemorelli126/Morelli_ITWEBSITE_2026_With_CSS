/* Milestone 3 JavaScript interactions */
document.addEventListener("DOMContentLoaded", () => {
    // DOM interaction: responsive mobile navigation uses querySelector and addEventListener.
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector("#primary-navigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const expanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!expanded));
            navigation.classList.toggle("is-open", !expanded);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
                menuButton.focus();
            }
        });
    }

    // Accessible required-field validation. Errors clear when the user corrects a field.
    const form = document.querySelector("#contact-form");
    if (form) {
        const fieldNames = ["name", "email", "message"];
        const validate = (field) => {
            let errorText = "";
            const value = field.value.trim();
            if (!value) {
                errorText = "This field is required.";
            } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorText = "Enter a valid email address.";
            }
            document.querySelector("#" + field.id + "-error").textContent = errorText;
            field.setAttribute("aria-invalid", errorText ? "true" : "false");
            return errorText === "";
        };

        fieldNames.forEach((fieldName) => {
            const field = form.elements.namedItem(fieldName);
            field.addEventListener("blur", () => validate(field));
            field.addEventListener("input", () => {
                if (field.getAttribute("aria-invalid") === "true" || field.value.trim() !== "") {
                    validate(field);
                }
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const valid = fieldNames.map((fieldName) => validate(form.elements.namedItem(fieldName))).every(Boolean);
            const status = document.querySelector("#form-status");
            if (!valid) {
                status.textContent = "Please correct the highlighted fields before submitting.";
                form.querySelector('[aria-invalid="true"]').focus();
                return;
            }
            status.textContent = "All fields are valid. This demonstration form does not send messages yet; please use the email or phone number above.";
        });
    }

    // Bonus API: load public GitHub profile data and handle network/API failures.
    const profileCard = document.querySelector("#github-profile");
    if (profileCard) {
        const status = document.querySelector("#github-status");
        const details = document.querySelector("#github-details");

        fetch("https://api.github.com/users/mikemorelli126", {
            headers: { Accept: "application/vnd.github+json" }
        })
            .then((response) => {
                if (!response.ok) throw new Error("GitHub API request failed: " + response.status);
                return response.json();
            })
            .then((profile) => {
                const heading = document.createElement("h3");
                heading.textContent = profile.name || profile.login;
                const bio = document.createElement("p");
                bio.textContent = profile.bio || "Public GitHub profile.";
                const stats = document.createElement("p");
                stats.textContent = profile.public_repos + " public repositories · " + profile.followers + " followers";
                const link = document.createElement("a");
                link.href = profile.html_url;
                link.textContent = "View GitHub profile";
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                details.replaceChildren(heading, bio, stats, link);
                status.textContent = "Live GitHub profile loaded.";
            })
            .catch(() => {
                status.textContent = "GitHub profile could not be loaded right now. Please try again later.";
            });
    }
});
